import SearchField from "@/components/common/SearchField";
import { NumToDayOfWeekMap } from "@/data/dayOfWeek";
import { ExtraLessonPeriodJA, getExtraPeriodFromTime } from "@/data/periodTimes";
import { getNowJSTTimeWithWeekday } from "@/lib/time";
import { prisma } from "@/prisma";
import clsx from "clsx";
import Image from "next/image";
import { DayOfWeekToCourseFreqMap } from "@/data/courseFreqs";

import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { redirect } from "next/navigation";
import CampusRegisterRequired from "@/components/common/CampusRegisterRequired";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { query } = await searchParams;

  const session = await getServerSession(authConfig);
  if(!session?.user?.id) redirect("/signin");

  return (
    <div className="mx-auto w-fit mt-8">
      <CampusRegisterRequired
        message={
          <WhenCampusUnregistered />
        }
      >
        <WhenCampusRegistered query={query} userId={session.user.id} />
      </CampusRegisterRequired>
    </div>
  );
}

async function WhenCampusRegistered({query, userId}: {query: string, userId: string}) {
  const userList = await fetchUserList(userId, query);
  const rooms = await fetchUserCampusRooms(userId);
  if(!userList) return <></>;
  return (
    <>
      <SearchField
        placeholder="名前で検索 (むしめがねー(いつか追加するー))"
        className="w-[60vw] min-w-[512px] h-12 px-4 rounded-lg bg-black border-[1px] border-white"
      />
      <div className="h-4" />
      <div>{userList.length}人のユーザーが見つかりました。</div>
      <div className="h-2" />
      {
        rooms.map((room, i) => (
          <button className="w-fit px-2 py-1 bg-blue-600 border-1 border-blue-800 rounded-lg mx-1" key={i}>
            {room.name}
          </button>
        ))
      }
      <div className="h-2" />
      {!userList.length && <div className="h-16 flex items-center text-2xl">
        <div className="mr-2 w-12 h-12 flex items-center justify-center text-4xl font-bold text-black bg-gray-400 rounded-full">?</div>ユーザーが見つかりませんでした。:(
      </div>}
      <div className="w-fit">
          {userList.map((user, i) => (
            <div className={clsx("w-[60vw] min-w-[512px] h-16 flex flex-row items-center justify-between", i !== 0 && "border-t-[2px] border-gray-800")} key={i}>
              <div className="w-fit flex flex-row items-center">
                {
                  user.image ? <Image
                    alt="icon"
                    src={user.image}
                    width={48}
                    height={48}
                    className="inline-block rounded-full"
                  /> : <div className="mr-2 w-12 h-12 flex items-center justify-center text-4xl font-bold text-black bg-gray-400 rounded-full">?</div>
                }
                <div className="m-2 text-2xl text-nowrap">
                  {user.nickname ? `${user.nickname}(${user.name})` : user.name}
                </div>
              </div>
              <div className="w-fit overflow-hidden flex flex-row items-center justify-end">
                {
                  user.lesson?.room ? `${user.lesson.room}にいます` : "キャンパスに居ません"
                }
              </div>
              <div className="w-fit overflow-hidden hidden flex-row items-center justify-end xl:flex">
                {
                  user.lesson ? (
                    user.lesson.isRecess ? "休み時間中です。" : `${user.lesson.title}を受講中`
                  ) : "キャンパスに居ません"
                }
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

async function WhenCampusUnregistered() {
  return (
    <>
      <div className="text-xl font-bold">混雑状況マップを利用するにはキャンパスを登録してください。</div>
      <Link href="/register" className="flex items-center justify-center w-36 h-12 rounded-lg bg-blue-600 text-xl font-bold">登録ページへ</Link>
    </>
  );
}

async function fetchUserCampusRooms(userId: string) {
  return (await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      campus: {
        select: {
          rooms: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    }
  }))?.campus?.rooms || [];
}

async function fetchUserList(userId: string, query?: string) {
  const { weekday, hours, minutes } = getNowJSTTimeWithWeekday();
  const dayOfWeek = NumToDayOfWeekMap[weekday] || null
  const todayCourseFreqs = dayOfWeek ? DayOfWeekToCourseFreqMap[dayOfWeek] : []
  const lessonPeriod = getExtraPeriodFromTime({hours: hours, minutes: minutes})
  const userCampus = await fetchUserCampus(userId)
  if(!userCampus) return null;

  if(typeof lessonPeriod === "string") {
    const userCampusMainRoom = await fetchUserCampusMainRoom(userId);
    return (await prisma.user.findMany({
      where: {
        OR: [
          {
            name: { not: null, contains: query },
          },
          {
            nickname: { not: null, contains: query },
          }
        ],
        campus: {
          id: userCampus.id
        },
      },
      select: {
        name: true,
        nickname: true,
        image: true,
        courseFrequency: true,
        afterSchool: true,
      },
    })).map((user) => {
      if(lessonPeriod === "AfterSchool" && user.afterSchool !== "StayUntilEnd") {
        return {
          name: user.name,
          nickname: user.nickname,
          image: user.image,
          lesson: null
        }
      }
      return {
        name: user.name,
        nickname: user.nickname,
        image: user.image,
        lesson: {
          title: dayOfWeek && user.courseFrequency && todayCourseFreqs.includes(user.courseFrequency) ? ExtraLessonPeriodJA[lessonPeriod] : null,
          room: userCampusMainRoom?.name || null,
          isRecess: false
        }
      }
    })
  }else {
    return (await prisma.user.findMany({
      where: {
        OR: [
          {
            name: { not: null, contains: query },
          },
          {
            nickname: { not: null, contains: query },
          }
        ],
        campus: {
          id: userCampus.id
        }
      },
      select: {
        name: true,
        nickname: true,
        image: true,
        lesson: {
          where: dayOfWeek && lessonPeriod ? {
            day: dayOfWeek,
            period: lessonPeriod.period
          } : undefined,
          select: {
            title: true,
            rooms: {
              where: {
                campus: userCampus
              }
            }
          }
        }
      },
    })).map((user) => {
      console.log(user)
      return {
        name: user.name,
        nickname: user.nickname,
        image: user.image,
        lesson: dayOfWeek && lessonPeriod && user.lesson?.length ? {
          title: user.lesson[0].title,
          isRecess: lessonPeriod?.isRecess,
          room: user.lesson[0].rooms ? user.lesson[0].rooms[0].name : null
        } : null
      }
    })
  }
}

async function fetchUserCampus(userId: string) {
  return (await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      campus: true
    }
  }))?.campus || null
}

async function fetchUserCampusMainRoom(userId: string) {
  return (await prisma.user.findUnique({ where: { id: userId }, select: { campus: { select: { mainRoom: true } } } }))?.campus?.mainRoom || null
}
