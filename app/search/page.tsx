import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import authConfig from "@/auth.config";
import { getServerSession } from "next-auth";

import { NumToWeekDayMap } from "@/data/weekdays";

import { getNowJSTTimeAsMinutesWithWeekday } from "@/lib/time";
import CampusRegisterRequired from "@/components/common/CampusRegisterRequired";
import SearchField from "@/components/common/SearchField";
import { RecessPeriods } from "@/data/periods";
import { LinkButton } from "@/components/common/Buttons";
import Link from "next/link";
import { UserIcon } from "@/components/common/UserIcon";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { query } = await searchParams;

  const session = await getServerSession(authConfig);
  if (!session?.user?.id) redirect("/signin");

  return (
    <CampusRegisterRequired message={<WhenCampusUnregistered />}>
      <WhenCampusRegistered query={query} userId={session.user.id} />
    </CampusRegisterRequired>
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
      <div className="w-fit mx-auto pt-8">
        <h1 className="w-fit mx-auto text-5xl font-bold">ユーザーを検索</h1>
        <p className="mt-4 w-fit mx-auto text-xl font-bold text-center">
          登録したキャンパスのユーザーを検索出来ます。
          <br />
          ※人数の推定の仕組み上誤差が生じる場合があります。
        </p>
      </div>
      <div className="w-full 2xl:w-[60vw] p-8 h-full m-auto">
        <div className="mb-8 w-full flex flex-col items-center">
          <h2 className="w-fit mx-auto font-bold">名前/ニックネームで検索</h2>
          <SearchField
            placeholder="名前/ニックネームで検索 (むしめがねー(いつか追加するー))"
            className="w-full md:w-[60vw] xl:w-[40vw] h-12 px-4 rounded-lg bg-white border-1 border-blue-600"
          />
          <div className="mt-2">
            <h2 className="w-fit mx-auto font-bold">
              今居る部屋で検索(制作中)
            </h2>
            {rooms.map((room, i) => (
              <button
                className="w-fit px-2 py-1 bg-blue-500 border-1 border-blue-400 text-white rounded-lg mx-1"
                key={i}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>
        <div className="pl-8 flex flex-row items-center justify-start">
          {/* <RefreshButton className="w-fit h-fit mr-2 p-1 bg-blue-500 border-blue-400 border-1 rounded-lg text-white">
            再読み込み
          </RefreshButton> */}
          <div>{userList.length}人のユーザーが見つかりました。</div>
        </div>
        <div className="w-auto overflow-auto">
          <div className="px-8 w-auto min-w-96 h-12 flex flex-row items-center justify-between font-bold border-b-1 border-blue-400">
            <div className="w-1/2 min-w-[50%] flex items-center justify-start text-nowrap">
              名前
            </div>
            <div className="w-1/2 md:w-1/4 overflow-hidden flex items-center justify-start text-nowrap">
              現在居る部屋
            </div>
            <div className="w-1/4 overflow-hidden hidden items-center justify-start text-nowrap lg:flex">
              受講中
            </div>
          </div>
          {userList.map((user, i) => (
            <div
              className="px-8 w-auto min-w-96 h-20 flex flex-row items-center justify-between"
              key={i}
            >
              <Link
                href={`/user/${user.id}`}
                className="w-1/2 overflow-hidden flex flex-row items-center justify-start"
              >
                <UserIcon
                  src={user.image}
                  width={48}
                  height={48}
                  className="inline-block mr-4"
                />
                <div className="m-2 text-2xl text-nowrap">
                  {user.nickname ? (
                    <>
                      {user.nickname}
                      <span className="hidden md:inline">({user.name})</span>
                    </>
                  ) : (
                    user.name
                  )}
                </div>
              </Link>
              <div className="w-1/2 md:w-1/4 overflow-hidden flex flex-row items-center justify-start text-nowrap">
                {user.lesson
                  ? user.lesson.room
                    ? `${user.lesson.room}にいます`
                    : "???"
                  : "キャンパスに居ません"}
              </div>
              <div className="w-1/4 overflow-hidden hidden flex-row items-center justify-start text-nowrap lg:flex">
                {user.lesson
                  ? user.lesson.period
                    ? user.lesson.period
                    : user.lesson.title
                  : "キャンパスに居ません"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

async function WhenCampusUnregistered() {
  return (
    <div className="mx-auto pt-8 w-fit flex flex-col items-center justify-center">
      <div className="w-fit text-xl font-bold">
        ユーザー検索を利用するにはキャンパスを登録してください。
      </div>
      <LinkButton href="/register">登録ページへ</LinkButton>
    </div>
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
        id: true,
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
      id: user.id,
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
