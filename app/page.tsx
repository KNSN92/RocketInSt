import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { SignInButton } from "@/src/components/common/AuthButtons";
import { LinkButton } from "@/src/components/common/Buttons";
import CampusRegisterRequired from "@/src/components/common/CampusRegisterRequired";
import LoginRequired from "@/src/components/common/LoginRequired";
import PaginationButtons from "@/src/components/common/PaginationButtons";
import { DefaultRefreshButton } from "@/src/components/common/RefreshButton";
import {
  RocketInStBlackTextLogo,
  RocketInStWhiteTextLogo,
} from "@/src/components/common/RocketInStLogos";
import UpdatedTime from "@/src/components/common/UpdatedTime";
import UserList from "@/src/components/common/UserList";
import CampusMap, { MapData } from "@/src/components/home/CampusMap";
import { WeekDayToCourseMap } from "@/src/data/course";
import { NumToWeekDayMap } from "@/src/data/weekdays";
import { getNowJSTTimeAsMinutesWithWeekday } from "@/src/lib/time";
import { fetchUserCampusId } from "@/src/lib/userdata";
import {
  genUserTakingLessonQuery,
  getTakingLesson,
  getTakingRoom,
  getTakingRoomId,
} from "@/src/lib/users";
import { Course } from "@prisma-gen/browser";
import clsx from "clsx";
import { getServerSession } from "next-auth";

const pageLimit = 10;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const parsedPage = parseInt(page || "1");
  const pageNum = isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
  return (
    <div className="mx-auto flex w-fit flex-col items-center justify-center text-center py-10">
      <RocketInStBlackTextLogo
        width={1532}
        height={200}
        loading="lazy"
        className="relative top-1 px-4 max-h-48 w-screen object-contain inline dark:hidden"
      />
      <RocketInStWhiteTextLogo
        width={1532}
        height={200}
        loading="lazy"
        className="relative top-1 px-4 max-h-48 w-screen object-contain hidden dark:inline"
      />
      <LoginRequired
        message={
          <>
            <div className="h-4" />
            <h2 className="text-center text-[1.2rem] font-semibold">
              N/S高 生徒のキャンパス内位置<br></br> 混雑状況 確認サイト
            </h2>
            <div className="h-10" />
            <SignInButton>
              <div className="flex h-fit w-fit items-center justify-center rounded-full bg-blue-200 px-8 py-4 text-[1.5rem] font-semibold text-blue-600 transition duration-500 hover:bg-blue-600 hover:text-blue-200">
                登録 / サインイン
              </div>
            </SignInButton>
          </>
        }
      >
        <WhenUserLoggedIn page={pageNum} />
      </LoginRequired>
    </div>
  );
}

async function WhenUserLoggedIn({ page }: { page: number }) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) return undefined;
  const mapData: MapData = session?.user?.id
    ? (await fetchUserCampusMap(session.user.id)).map((item) => {
        let alertLevel = -1;
        if (item.congestion < 0) {
          alertLevel = -1;
        } else if (item.congestion < 0.25) {
          alertLevel = 0;
        } else if (item.congestion < 0.5) {
          alertLevel = 1;
        } else if (item.congestion < 0.75) {
          alertLevel = 2;
        } else {
          alertLevel = 3;
        }
        return {
          ...item,
          name: (
            <div className="text-center overflow-visible">
              {`${item.name}`}
              <br />
              <span className="hidden sm:inline">{`${item.students}人`}</span>
            </div>
          ),
          className: clsx(
            "flex items-center justify-center border-2 font-bold rounded-lg",
            {
              "bg-gray-400 border-gray-600 dark:bg-dark dark:border-gray-600 dark:text-gray-600":
                alertLevel === -1,
              "bg-blue-400 border-blue-600 dark:bg-dark dark:border-blue-600 dark:text-blue-600":
                alertLevel === 0,
              "bg-green-400 border-green-600 dark:bg-dark dark:border-green-600 dark:text-green-600":
                alertLevel === 1,
              "bg-yellow-400 border-yellow-600 dark:bg-dark dark:border-yellow-600 dark:text-yellow-600":
                alertLevel === 2,
              "bg-red-400 border-red-600 dark:bg-dark dark:border-red-600 dark:text-red-600":
                alertLevel === 3,
            },
          ),
        };
      })
    : [];
  const userCampus = await fetchUserCampus(session.user.id);

  return (
    <div className="w-screen sm:w-fit">
      <div className="text-2xl font-semibold">
        こんにちは {session.user?.name}
        さん
      </div>
      <h1 className="mt-8 text-3xl font-bold">混雑状況マップ</h1>
      <CampusRegisterRequired
        message={
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">
              混雑状況マップを利用するにはキャンパスを登録してください。
            </div>
            <LinkButton href="/register">登録ページへ</LinkButton>
          </div>
        }
      >
        <p className="mt-2 text-xl font-bold">
          ※人数の推定の仕組み上誤差が生じる場合があります。
        </p>
        <div>
          <div className="mt-2 h-fit w-screen rounded-lg border-2 border-gray-400 p-4 lg:w-[80vw] xl:w-[50vw]">
            {userCampus && (
              <h2 className="h-fit w-full text-center text-xl font-bold">
                {userCampus.name}
              </h2>
            )}
            <div>
              <DefaultRefreshButton className="my-2" />
              <span className="ml-4 text-lg">
                更新：
                <UpdatedTime />
              </span>
            </div>
            <div className="my-4 mx-auto w-fit h-fit flex flex-row flex-wrap gap-4 text-nowrap">
              <div className="w-36 h-6 flex items-center gap-2">
                <div className="inline-block w-1/2 min-w-4 h-full bg-blue-400 border-2 border-blue-600 dark:bg-dark dark:border-blue-600 dark:text-blue-600" />
                空いている
              </div>
              <div className="w-36 h-6 flex items-center gap-2">
                <div className="inline-block w-1/2 min-w-4 h-full bg-green-400 border-2 border-green-600 dark:bg-dark dark:border-green-600 dark:text-green-600" />
                少し混雑
              </div>
              <div className="w-36 h-6 flex items-center gap-2">
                <div className="inline-block w-1/2 min-w-4 h-full bg-yellow-400 border-2 border-yellow-600 dark:bg-dark dark:border-yellow-600 dark:text-yellow-600" />
                混雑
              </div>
              <div className="w-36 h-6 flex items-center gap-2">
                <div className="inline-block w-1/2 min-w-4 h-full bg-red-400 border-2 border-red-600 dark:bg-dark dark:border-red-600 dark:text-red-600" />
                非常に混雑
              </div>
              <div className="w-36 h-6 flex items-center gap-2">
                <div className="inline-block w-1/2 min-w-4 h-full bg-gray-400 border-2 border-gray-600 dark:bg-dark dark:border-gray-600 dark:text-gray-600" />
                No Data
              </div>
            </div>
            <CampusMap
              className="h-fit w-full text-xs md:text-lg sm:text-md"
              mapData={mapData}
            />
          </div>
        </div>
        <FollowingsList userId={session.user.id} page={page} />
      </CampusRegisterRequired>
    </div>
  );
}

async function FollowingsList({
  userId,
  page,
}: {
  userId: string;
  page: number;
}) {
  const [totalUser, userList] = await fetchFollowingUserList(userId, page);
  // const totalPages = Math.ceil(totalUser / pageLimit);
  // if (totalUser > 0 && totalPages < page) {
  //   redirect(`/?page=${totalPages}`);
  // }
  if (totalUser <= 0) return undefined;
  return (
    <>
      <h1 className="mt-8 text-3xl font-bold">フレンドリスト</h1>
      <UserList userList={userList} />{" "}
      <div
        className={clsx(
          "mt-4 flex justify-center",
          totalUser <= pageLimit && "hidden",
        )}
      >
        <PaginationButtons
          pageParam="page"
          page={page}
          limit={pageLimit}
          total={totalUser}
        />
      </div>
    </>
  );
}

async function fetchFollowingUserList(userId: string, page: number) {
  const { weekday, minutes } = getNowJSTTimeAsMinutesWithWeekday();
  const weekdayEnum = NumToWeekDayMap[weekday] || undefined;
  const userCampusId = await fetchUserCampusId(userId);
  if (!userCampusId) return [];
  const where = {
    followers: {
      some: {
        id: userId,
      },
    },
  };
  return Promise.all([
    await prisma.user.count({
      where: where,
    }),
    (
      await prisma.user.findMany({
        where: where,
        select: {
          id: true,
          name: true,
          nickname: true,
          image: true,
          role: true,
          lessons: genUserTakingLessonQuery(userCampusId, minutes, weekdayEnum),
        },
        skip: (page - 1) * pageLimit,
        take: pageLimit,
      })
    ).map((user) => {
      return {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        image: user.image,
        role: user.role,
        lesson: {
          id: getTakingRoomId(user.lessons),
          room: getTakingRoom(user.lessons),
          lesson: getTakingLesson(user.lessons),
        },
      };
    }),
  ]);
}

async function fetchUserCampusMap(userId: string) {
  const { weekday, minutes } = getNowJSTTimeAsMinutesWithWeekday();
  const weekdayEnum = NumToWeekDayMap[weekday] || undefined;
  const todayCourseFreqs = weekdayEnum ? WeekDayToCourseMap[weekdayEnum] : [];
  const userCampus = await fetchUserCampus(userId);
  if (!userCampus) return [];
  const todayAllStudents = await fetchCampusAllCourseStudents(
    userCampus.id,
    todayCourseFreqs,
  );
  const allStudents = await fetchCampusAllStudents(userCampus.id);
  const todayCourseRatio = replaceNanInf(todayAllStudents / allStudents, 0);
  const todayAllMember = Math.floor(userCampus.memberCount * todayCourseRatio);

  const rooms = await prisma.room.findMany({
    where: {
      campus: {
        id: userCampus.id,
      },
    },
    select: {
      id: true,
      name: true,
      roomPlan: true,
      capacity: true,
      lessons: {
        where: {
          period: {
            some: {
              weekday: weekdayEnum,
              AND: {
                beginTime: {
                  lte: minutes,
                },
                endTime: {
                  gte: minutes,
                },
              },
            },
          },
        },
        select: {
          _count: {
            select: {
              students: {
                where: {
                  course: {
                    in: todayCourseFreqs,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return rooms
    .map((room) => {
      const roomPlan = room.roomPlan?.valueOf() as {
        x: number;
        y: number;
        w: number;
        h: number;
      } | null;
      if (!roomPlan) return null;
      const roomStudents = room.lessons.reduce(
        (sum, roomStudent) => sum + roomStudent._count.students,
        0,
      );
      const students = replaceNanInf(
        Math.floor((roomStudents / todayAllStudents) * todayAllMember),
        0,
      );
      const congestion = replaceNanInf(students / room.capacity, 0);
      return {
        x: roomPlan.x,
        y: roomPlan.y,
        w: roomPlan.w,
        h: roomPlan.h,
        name: room.name,
        congestion: congestion,
        students: students,
      };
    })
    .filter((item) => item !== null);
}

async function fetchCampusAllStudents(campusId: string) {
  return await prisma.user.count({
    where: {
      campus: {
        id: campusId,
      },
    },
  });
}

async function fetchCampusAllCourseStudents(
  campusId: string,
  courses: Course[],
) {
  return await prisma.user.count({
    where: {
      campus: {
        id: campusId,
      },
      course: {
        in: courses,
      },
    },
  });
}

async function fetchUserCampus(userId: string) {
  return (
    (
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          campus: {
            select: {
              id: true,
              name: true,
              memberCount: true,
              mainRoom: true,
            },
          },
        },
      })
    )?.campus || null
  );
}

function replaceNanInf(num: number, defaultNum: number): number {
  if (isFinite(num)) return num;
  return defaultNum;
}
