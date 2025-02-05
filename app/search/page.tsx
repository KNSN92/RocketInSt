import { prisma } from "@/prisma";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import authConfig from "@/auth.config";
import { getServerSession } from "next-auth";

import { NumToWeekDayMap } from "@/data/weekdays";

import { getNowJSTTimeAsMinutesWithWeekday } from "@/lib/time";
import CampusRegisterRequired from "@/components/common/CampusRegisterRequired";
import SearchField from "@/components/common/SearchField";
import { RecessPeriods } from "@/data/periods";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { query } = await searchParams;

  const session = await getServerSession(authConfig);
  if (!session?.user?.id) redirect("/signin");

  return (
    <div className="mx-auto w-fit mt-8">
      <CampusRegisterRequired message={<WhenCampusUnregistered />}>
        <WhenCampusRegistered query={query} userId={session.user.id} />
      </CampusRegisterRequired>
    </div>
  );
}

async function WhenCampusRegistered({
  query,
  userId,
}: {
  query: string;
  userId: string;
}) {
  const userList = await fetchUserList(userId, query);
  const rooms = await fetchUserCampusRooms(userId);
  return (
    <>
      <SearchField
        placeholder="名前で検索 (むしめがねー(いつか追加するー))"
        className="w-[60vw] min-w-[512px] h-12 px-4 rounded-lg bg-white border-[1px] border-blue-600"
      />
      <div className="h-4" />
      <div>{userList.length}人のユーザーが見つかりました。</div>
      <div className="h-2" />
      {rooms.map((room, i) => (
        <button
          className="w-fit px-2 py-1 bg-blue-600 border-1 border-blue-800 rounded-lg mx-1 mb-4"
          key={i}
        >
          {room.name}
        </button>
      ))}
      <div className="h-2" />
      <div className="w-fit">
        {userList.length === 0 && (
          <div className="h-16 flex items-center text-2xl">
            <UnknownUserIcon />
            ユーザーが見つかりませんでした。:(
          </div>
        )}
        {userList.map((user, i) => (
          <div
            className={clsx(
              "w-[60vw] min-w-[512px] h-[80px] flex flex-row items-center justify-between"
              // ,
              // i !== 0 && "border-t-[1px] border-gray-800"
            )}
            key={i}
          >
            <div className="w-fit flex flex-row items-center">
              {user.image ? (
                <Image
                  alt="icon"
                  src={user.image}
                  width={48}
                  height={48}
                  className="inline-block rounded-full mr-4"
                />
              ) : (
                <UnknownUserIcon />
              )}
              <div className="m-2 text-xl text-nowrap">
                {user.nickname ? `${user.nickname}（${user.name}）` : user.name}
              </div>
            </div>
            <div className="w-fit overflow-hidden flex flex-row items-center justify-end font-bold">
              {user.lesson
                ? user.lesson.room
                  ? `${user.lesson.room}にいます`
                  : "???"
                : "キャンパスに居ません"}
            </div>
            <div className="w-fit overflow-hidden hidden flex-row items-center justify-end xl:flex font-bold">
              {user.lesson
                ? user.lesson.period
                  ? user.lesson.period
                  : user.lesson.title
                : "キャンパスに居ません"}
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
      <div className="text-xl font-bold">
        ユーザー検索を利用するにはキャンパスを登録してください。
      </div>
      <Link
        href="/register"
        className="mx-auto flex items-center justify-center w-36 h-12 rounded-lg bg-blue-600 text-xl font-bold"
      >
        登録ページへ
      </Link>
    </>
  );
}

async function fetchUserCampusRooms(userId: string) {
  return (
    (
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          campus: {
            select: {
              rooms: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })
    )?.campus?.rooms || []
  );
}

async function fetchUserList(userId: string, query?: string) {
  const { weekday, minutes } = getNowJSTTimeAsMinutesWithWeekday();
  const weekdayEnum = NumToWeekDayMap[weekday] || undefined;
  const userCampus = await fetchUserCampus(userId);
  if (!userCampus) return [];
  return (
    await prisma.user.findMany({
      where: {
        OR: [
          {
            name: { not: null, contains: query },
          },
          {
            nickname: { not: null, contains: query },
          },
        ],
        campus: {
          id: userCampus.id,
        },
      },
      select: {
        name: true,
        nickname: true,
        image: true,
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
            title: true,
            rooms: true,
            period: {
              where: {
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
              select: {
                name: true,
                innername: true,
              },
            },
          },
        },
      },
    })
  ).map((user) => {
    const lesson = user.lessons.length > 0 ? user.lessons[0] : null;
    let period = null;
    if (
      lesson &&
      lesson.period.length > 0 &&
      (RecessPeriods as ReadonlyArray<string>).includes(
        lesson.period[0].innername
      )
    ) {
      period = lesson.period[0].name;
    }
    return {
      name: user.name,
      nickname: user.nickname,
      image: user.image,
      lesson: lesson && {
        title: lesson.title,
        period: period,
        room: lesson.rooms.length > 0 ? lesson.rooms[0].name : null,
      },
    };
  });
}

function UnknownUserIcon() {
  return (
    <div className="mr-2 w-12 h-12 flex items-center justify-center text-4xl font-bold text-black bg-gray-400 rounded-full">
      ?
    </div>
  );
}

async function fetchUserCampus(userId: string) {
  return (
    (
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          campus: true,
        },
      })
    )?.campus || null
  );
}
