"use server";
import { LinkButton } from "@/components/common/Buttons";
import { DefaultRefreshButton } from "@/components/common/RefreshButton";
import { UserIcon } from "@/components/common/UserIcon";
import CampusMap from "@/components/home/CampusMap";
import { CourseFreqJA } from "@/data/courseFreqs";
import { NumToWeekDayMap } from "@/data/weekdays";
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
  combinateUserName,
  genUserTakingLessonQuery,
  getTakingLesson,
  getTakingRoom,
  getTakingRoomId,
} from "@/lib/users";
import { CourseFrequency, Role } from "@prisma/client";
import clsx from "clsx";
import { notFound, redirect } from "next/navigation";
import FriendRegisterForm from "./FriendRegisterForm";

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
  if (profileUser && profileUser.campusId === userCampusId) {
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
  courseFrequency,
  lessons,
}: {
  initialIsFriend: boolean;
  userId: string;
  profileUserId: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
  role: Role;
  courseFrequency: CourseFrequency | null;
  lessons: {
    title: string;
    rooms: { id: string; name: string }[];
    period: { name: string; innername: string }[];
  }[];
}) {
  const userCampus = await fetchUserCampus(userId);
  return (
    <div className="mx-auto py-8 flex w-screen flex-col items-center px-8 md:px-32">
      <UserIcon src={image} width={192} height={192} className="text-9xl" />
      <h1
        className={clsx(
          "py-8 text-2xl md:text-3xl font-bold",
          role === "Admin" && "text-[#ff0000]",
        )}
      >
        {role === "Admin" && "[Admin]"}
        {combinateUserName(name, nickname)}
      </h1>
      <FriendRegisterForm
        profileUserId={profileUserId}
        initialIsFriend={initialIsFriend}
      />
      <ul className="mt-4 text-2xl text-center sm:text-left">
        <li>
          <span className="font-bold sm:font-normal">コース</span>
          <span className="hidden sm:inline">：</span>
          <br className="w-0 inline sm:hidden" />
          {courseFrequency ? CourseFreqJA[courseFrequency] : "未登録"}
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
      <DefaultRefreshButton className="my-2" />
      <div className="mt-8 rounded-lg border-2 border-gray-400 bg-gray-100 p-4 w-screen lg:w-[80vw] xl:w-[50vw]">
        <div className="mb-2 flex items-center justify-center">
          <div />
          {userCampus && (
            <h2 className="h-fit w-fit text-xl font-bold">{userCampus.name}</h2>
          )}
        </div>
        <CampusMap
          mapData={(
            await fetchUserCampusRooms(userId, {
              roomPlan: true,
              id: true,
              name: true,
            })
          ).map((room) => {
            const here = room.id === getTakingRoomId(lessons);
            // const name = <>{room.name}{here && <><br/>here</>}</>;
            return {
              x: room.roomPlan?.x || 0,
              y: room.roomPlan?.y || 0,
              w: room.roomPlan?.w || 0,
              h: room.roomPlan?.h || 0,
              name: room.name,
              className: clsx(
                "border-2 rounded-lg flex flex-col items-center justify-center font-bold text-center text-xs md:text-lg sm:text-md",
                here
                  ? "bg-green-400 border-green-600"
                  : "bg-gray-400 border-gray-600",
              ),
            };
          })}
          className="w-full h-fit text-xs md:text-lg sm:text-md"
        />
      </div>
    </div>
  );
}

async function fetchProfileUser(userId: string) {
  const { weekday, minutes } = getNowJSTTimeAsMinutesWithWeekday();
  const weekdayEnum = NumToWeekDayMap[weekday] || undefined;
  return await fetchUser(userId, {
    name: true,
    nickname: true,
    image: true,
    campusId: true,
    courseFrequency: true,
    role: true,
    lessons: genUserTakingLessonQuery(minutes, weekdayEnum),
  });
}
