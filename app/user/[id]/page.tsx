import { LinkButton } from "@/components/common/Buttons";
import { DefaultRefreshButton } from "@/components/common/RefreshButton";
import UpdatedTime from "@/components/common/UpdatedTime";
import { UserIcon } from "@/components/common/UserIcon";
import CampusMap from "@/components/home/CampusMap";
import { CourseJA, CourseToDaysMap, DaysToWeekDayMap } from "@/data/course";
import {
  LessonPeriods,
  LessonPeriodsJA,
  LessonPeriodType,
} from "@/data/periods";
import { RoleColors, RoleJA, shouldShowRole } from "@/data/role";
import { NumToWeekDayMap, WeekDayJA } from "@/data/weekdays";
import { getNowJSTTimeAsMinutesWithWeekday } from "@/lib/time";
import {
  fetchUser,
  fetchUserCampus,
  fetchUserCampusId,
  fetchUserCampusRooms,
  fetchUserId,
  isUserFriend,
} from "@/lib/userdata";
import {
  genUserTakingLessonQuery,
  getTakingLesson,
  getTakingRoom,
  getTakingRoomId,
} from "@/lib/users";
import { Course, Role, WeekDay } from "@prisma-gen/browser";
import clsx from "clsx";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import FriendRegisterForm from "./FriendRegisterForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: "???'s profile",
    };
  }
  const user = await fetchUser(id, { id: true, nickname: true });
  const userName = user ? user.nickname : "???";
  return {
    title: `${userName}'s profile`,
  };
}
export default async function UserInfo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await fetchUserId();
  if (!userId) return redirect("/signin");
  const userCampusId = await fetchUserCampusId(userId);
  if (!userCampusId) return <WhenUserCampusUnregistered />;

  const { id } = await params;
  const profileUser = await fetchProfileUser(id);
  if (profileUser /* && profileUser.campusId === userCampusId*/) {
    return (
      <UserProfile
        userId={userId}
        profileUserId={id}
        initialIsFriend={await isUserFriend(userId, id)}
        {...profileUser}
      />
    );
  } else {
    return notFound();
  }
}

function WhenUserCampusUnregistered() {
  return (
    <div className="mx-auto flex w-fit flex-col items-center justify-center pt-8">
      <div className="w-fit text-xl font-bold">
        ユーザーのプロフィールを閲覧するにはキャンパスを登録してください。
      </div>
      <LinkButton href="/register">登録ページへ</LinkButton>
    </div>
  );
}

async function UserProfile({
  initialIsFriend,
  userId,
  profileUserId,
  name,
  nickname,
  image,
  role,
  course,
  lessons,
}: {
  initialIsFriend: boolean;
  userId: string;
  profileUserId: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
  role: Role;
  course: Course | null;
  lessons: {
    title: string;
    rooms: { id: string; name: string }[];
    period: { name: string; innername: string }[];
  }[];
}) {
  const userCampus = await fetchUserCampus(profileUserId);
  const takingRoomId = getTakingRoomId(lessons);
  return (
    <div className="mx-auto py-8 flex w-screen flex-col items-center sm:px-8 md:px-32">
      <UserIcon
        src={image}
        size={192}
        status={takingRoomId !== undefined ? "active" : "inactive"}
        statusStyle="border"
      />
      <h1
        className={clsx(
          "pt-8 pb-4 font-bold flex flex-col justify-center items-center gap-2",
          RoleColors[role],
        )}
      >
        {shouldShowRole(role) && (
          <span className="block text-nowrap text-3xl relative top-2">
            &lt;{RoleJA[role]}&gt;
          </span>
        )}
        {nickname && (
          <span className="block text-center text-4xl">{nickname}</span>
        )}
        {name && (
          <span
            className={clsx(
              "block text-nowrap",
              nickname ? "text-xl" : "text-4xl",
            )}
          >
            {name}
          </span>
        )}
        {!name && !nickname && (
          <span className="text-nowrap text-4xl">???</span>
        )}
      </h1>
      <div
        className={clsx(
          "flex items-center gap-2",
          userId !== profileUserId && "pb-8",
        )}
      >
        <div
          className={clsx(
            "size-6 rounded-full",
            takingRoomId !== undefined ? "bg-green-400" : "bg-gray-400",
          )}
        />
        <span className="font-bold text-xl">
          {takingRoomId !== undefined ? "アクティブ" : "非アクティブ"}
        </span>
      </div>
      {userId !== profileUserId && (
        <FriendRegisterForm
          profileUserId={profileUserId}
          initialIsFriend={initialIsFriend}
        />
      )}
      <ul className="mt-4 text-2xl text-center sm:text-left">
        <li>
          <span className="font-bold sm:font-normal">コース</span>
          <span className="hidden sm:inline">：</span>
          <br className="w-0 inline sm:hidden" />
          {course ? CourseJA[course] : "未登録"}
        </li>
        <li className="mt-4 sm:mt-0">
          <span className="font-bold sm:font-normal">現在居る部屋</span>
          <span className="hidden sm:inline">：</span>
          <br className="w-0 inline sm:hidden" />
          {getTakingRoom(lessons)}
        </li>
        <li className="mt-4 sm:mt-0">
          <span className="font-bold sm:font-normal">受講中の授業</span>
          <span className="hidden sm:inline">：</span>
          <br className="w-0 inline sm:hidden" />
          {getTakingLesson(lessons)}
        </li>
      </ul>
      <div className="mt-4 flex items-center justify-center md:gap-4 flex-col md:flex-row">
        <DefaultRefreshButton className="block" />
        <div className="text-lg text-nowrap">
          更新：
          <UpdatedTime />
        </div>
      </div>
      <h2 className="mt-6 mb-2 text-3xl font-bold">どこに居るかMap</h2>
      <div className="rounded-lg border-2 border-gray-400 p-4 w-screen md:w-[60vw] xl:w-[35vw]">
        <div className="mb-2 flex items-center justify-center">
          <div />
          {userCampus && (
            <h2 className="h-fit w-fit text-xl font-bold">{userCampus.name}</h2>
          )}
        </div>
        <div className="my-4 mx-auto w-fit h-fit flex flex-row flex-wrap gap-4 text-nowrap">
          <div className="w-36 h-6 flex items-center gap-2">
            <div className="inline-block w-1/2 min-w-4 h-full bg-green-400 border-2 border-green-600  dark:bg-dark dark:border-green-400 dark:text-green-400" />
            居る
          </div>
          <div className="w-36 h-6 flex items-center gap-2">
            <div className="inline-block w-1/2 min-w-4 h-full bg-gray-400 border-2 border-gray-600 dark:bg-dark dark:border-gray-400 dark:text-gray-400" />
            居ない
          </div>
        </div>
        <CampusMap
          mapData={(
            await fetchUserCampusRooms(profileUserId, {
              roomPlan: true,
              id: true,
              name: true,
            })
          ).map((room) => {
            const here = room.id === getTakingRoomId(lessons);
            const roomPlan = room.roomPlan?.valueOf() as {
              x: number;
              y: number;
              w: number;
              h: number;
            } | null;
            return {
              x: roomPlan?.x || 0,
              y: roomPlan?.y || 0,
              w: roomPlan?.w || 0,
              h: roomPlan?.h || 0,
              name: <div className="overflow-scroll">{room.name}</div>,
              className: clsx(
                "border-2 rounded-lg flex flex-col items-center justify-center font-bold text-center text-xs md:text-lg sm:text-md",
                here
                  ? "bg-green-400 border-green-600 dark:bg-dark dark:border-green-400 dark:text-green-400"
                  : "bg-gray-400 border-gray-600 dark:bg-dark dark:border-gray-400 dark:text-gray-400",
              ),
            };
          })}
          className="w-full h-fit text-xs md:text-lg sm:text-md"
        />
      </div>
      <h2 className="mt-6 mb-2 text-3xl font-bold">授業</h2>
      <div className="overflow-auto w-screen mx-4 text-nowrap">
        <LessonsTable userId={profileUserId} courseFrequency={course} />
      </div>
    </div>
  );
}

async function LessonsTable({
  userId,
  courseFrequency,
}: {
  userId: string;
  courseFrequency: Course | null;
}) {
  if (!courseFrequency) return undefined;
  const fetchedLessons = (
    await fetchUser(userId, {
      lessons: {
        where: {
          period: {
            some: {
              tag: "Lesson",
            },
          },
        },
        select: {
          period: {
            where: {
              tag: "Lesson",
            },
            select: {
              weekday: true,
              innername: true,
            },
          },
          title: true,
        },
      },
    })
  )?.lessons;
  if (!fetchedLessons) return undefined;
  const lessons: { [key in WeekDay]: { [key in LessonPeriodType]: string } } =
    fetchedLessons.reduce(
      (acc, fetchedLesson) => {
        if (fetchedLesson.period.length <= 0) return acc;
        const period = fetchedLesson.period[0];
        if (!acc[period.weekday])
          acc[period.weekday] = {} as (typeof lessons)[WeekDay];
        acc[period.weekday][period.innername as LessonPeriodType] =
          fetchedLesson.title;
        return acc;
      },
      {} as typeof lessons,
    );
  return (
    <table className="w-fit h-fit mx-auto rounded-lg border-1 border-gray-400 dark:border-[#b8e2e6] bg-[#ebf6f7] dark:bg-transparent dark:text-[#b8e2e6]">
      <thead>
        <tr>
          <th></th>
          {DaysToWeekDayMap[CourseToDaysMap[courseFrequency]].map(
            (weekday, i) => (
              <th
                key={i}
                className="w-40 sm:w-60 border-l-1 border-gray-400 dark:border-[#b8e2e6] text-lg"
              >
                {WeekDayJA[weekday]}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {LessonPeriods.map((period, i) => (
          <tr
            className="border-t-1 border-gray-400 dark:border-[#b8e2e6]"
            key={i}
          >
            <th className="text-lg">
              <div className="px-2 text-nowrap">{LessonPeriodsJA[period]}</div>
            </th>
            {DaysToWeekDayMap[CourseToDaysMap[courseFrequency]].map(
              (weekday, j) => (
                <td
                  className="p-2 border-l-1 border-gray-400 dark:border-[#b8e2e6] w-fit h-fit"
                  key={j}
                >
                  {lessons[weekday] && lessons[weekday][period]
                    ? lessons[weekday][period]
                    : "???"}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function fetchProfileUser(userId: string) {
  const { weekday, minutes } = getNowJSTTimeAsMinutesWithWeekday();
  const weekdayEnum = NumToWeekDayMap[weekday] || undefined;
  const userCampusId = await fetchUserCampusId(userId);
  if (!userCampusId) return undefined;
  return await fetchUser(userId, {
    name: true,
    nickname: true,
    image: true,
    campusId: true,
    course: true,
    role: true,
    lessons: genUserTakingLessonQuery(userCampusId, minutes, weekdayEnum),
  });
}
