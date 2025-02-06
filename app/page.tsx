import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { SignInButton } from "@/components/common/AuthButtons";
import { prisma } from "@/prisma";
import CampusMap from "@/components/home/CampusMap";
import Link from "next/link";
import { getNowJSTTimeAsMinutesWithWeekday } from "@/lib/time";
import clsx from "clsx";
import LoginRequired from "@/components/common/LoginRequired";
import CampusRegisterRequired from "@/components/common/CampusRegisterRequired";
import { CourseFrequency } from "@prisma/client";
import { NumToWeekDayMap } from "@/data/weekdays";
import { WeekDayToCourseFreqMap } from "@/data/courseFreqs";
import { RocketInStBlackTextLogo } from "@/components/common/RocketInStLogos";

export default async function Home() {
  return (
    <div className="w-fit mx-auto pt-12 flex flex-col items-center">
      <div className="h-20" />
      <RocketInStBlackTextLogo
        width={1532}
        height={200}
        loading="lazy"
        className="hidden md:inline h-48 w-fit object-contain relative top-1"
      />
      <div className="h-4" />
      <h2 className="text-[1.2rem] font-semibold text-center">
        N/S高 生徒のキャンパス内位置<br></br> 混雑状況 確認サイト
      </h2>
      <div className="h-10" />
      <LoginRequired
        message={
          <SignInButton>
            <div className="transition duration-500 bg-blue-200 text-blue-600 text-[1.5rem] font-semibold flex justify-center items-center w-fit h-fit px-8 py-4 rounded-full hover:bg-blue-600 hover:text-blue-200">
              登録 / サインイン
            </div>
          </SignInButton>
        }
      >
        <WhenUserLoggedIn />
      </LoginRequired>
    </div>
  );
}

async function WhenUserLoggedIn() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) return undefined;
  const mapData = session?.user?.id
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
            <div className="text-center">
              {`${item.name}`}
              <br />
              {`${item.students}人`}
            </div>
          ),
          className: clsx(
            "flex items-center justify-center border-2 text-lg font-bold text-gray-800 rounded-lg",
            {
              "bg-gray-400 border-gray-600": alertLevel === -1,
              "bg-blue-400 border-blue-600": alertLevel === 0,
              "bg-green-400 border-green-600": alertLevel === 1,
              "bg-yellow-400 border-yellow-600": alertLevel === 2,
              "bg-red-400 border-red-600": alertLevel === 3,
            }
          ),
        };
      })
    : [];
  const userCampus = await fetchUserCampus(session.user.id);
  
  return (
    <>
      <div className="text-2xl font-semibold mt-5">
        こんにちは {session.user?.name}
        さん
      </div>
      <h1 className="text-3xl font-bold mt-24">混雑状況マップ(工事中)</h1>
      <p className="text-xl font-bold mt-2">※人数の推定の仕組み上誤差が生じる場合があります。</p>
      <CampusRegisterRequired
        message={
          <>
            <div className="text-xl font-bold">
              混雑状況マップを利用するにはキャンパスを登録してください。
            </div>
            <Link
              href="/register"
              className="flex items-center justify-center w-36 h-12 rounded-lg text-white bg-blue-600 text-xl font-bold"
            >
              登録ページへ
            </Link>
          </>
        }
      >
        <div>
          <div className="mt-2 w-fit h-fit p-4 bg-gray-100 border-2 border-gray-400 rounded-lg">
            <div className="flex mb-2 items-center justify-between">
              {/* <RefreshButton className="w-fit h-fit p-1 bg-blue-500 border-blue-400 border-1 rounded-lg text-white disabled:bg-blue-300 disabled:border-blue-200">
                再読み込み
              </RefreshButton> */}
              <div/>
              {userCampus && <h2 className="w-fit h-fit relative -left-1/2 translate-x-1/2 font-bold text-xl">{userCampus.name}</h2>}
            </div>
            <CampusMap mapData={mapData} mapSize={768} />
          </div>
        </div>
      </CampusRegisterRequired>
    </>
  );
}

async function fetchUserCampusMap(userId: string) {
  const { weekday, minutes } = getNowJSTTimeAsMinutesWithWeekday();
  const weekdayEnum = NumToWeekDayMap[weekday] || undefined;
  const todayCourseFreqs = weekdayEnum
    ? WeekDayToCourseFreqMap[weekdayEnum]
    : [];
  const userCampus = await fetchUserCampus(userId);
  if (!userCampus) return [];
  const todayAllStudents = await fetchCampusAllCourseStudents(
    userCampus.id,
    todayCourseFreqs
  );
  const allStudents = await fetchCampusAllStudents(userCampus.id);
  const todayCourseRatio = replaceNanInf(todayAllStudents / allStudents, 0);
  const todayAllMember = Math.floor(userCampus.allMember * todayCourseRatio);

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
                  courseFrequency: {
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
      const roomPlan = room.roomPlan;
      if (!roomPlan) return null;
      const roomStudents = room.lessons.reduce(
        (sum, roomStudent) => sum + roomStudent._count.students,
        0
      );
      const students = replaceNanInf(
        Math.floor((roomStudents / todayAllStudents) * todayAllMember),
        0
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
  courseFreqs: CourseFrequency[]
) {
  return await prisma.user.count({
    where: {
      campus: {
        id: campusId,
      },
      courseFrequency: {
        in: courseFreqs,
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
              allMember: true,
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
