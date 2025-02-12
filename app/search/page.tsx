import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { NumToWeekDayMap } from "@/data/weekdays";

import { LinkButton } from "@/components/common/Buttons";
import CampusRegisterRequired from "@/components/common/CampusRegisterRequired";
import SearchField from "@/components/common/SearchField";
import { UserIcon } from "@/components/common/UserIcon";
import { RecessPeriods } from "@/data/periods";
import { getNowJSTTimeAsMinutesWithWeekday } from "@/lib/time";
import Link from "next/link";

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
      <div className="mx-auto w-fit pt-8">
        <h1 className="mx-auto w-fit text-5xl font-bold">ユーザーを検索</h1>
        <p className="mx-auto mt-4 w-fit text-center text-xl font-bold">
          登録したキャンパスのユーザーを検索出来ます。
          <br />
          ※人数の推定の仕組み上誤差が生じる場合があります。
        </p>
      </div>
      <div className="m-auto h-full w-full p-8 2xl:w-[60vw]">
        <div className="mb-8 flex w-full flex-col items-center">
          <h2 className="mx-auto w-fit font-bold">名前/ニックネームで検索</h2>
          <SearchField
            placeholder="名前/ニックネームで検索 (むしめがねー(いつか追加するー))"
            className="h-12 w-full rounded-lg border-1 border-blue-600 bg-white px-4 md:w-[60vw] xl:w-[40vw]"
          />
          <div className="mt-2">
            <h2 className="mx-auto w-fit font-bold">
              今居る部屋で検索(制作中)
            </h2>
            {rooms.map((room, i) => (
              <button
                className="mx-1 w-fit rounded-lg border-1 border-blue-400 bg-blue-500 px-2 py-1 text-white"
                key={i}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center justify-start pl-8">
          {/* <RefreshButton className="w-fit h-fit mr-2 p-1 bg-blue-500 border-blue-400 border-1 rounded-lg text-white">
            再読み込み
          </RefreshButton> */}
          <div>{userList.length}人のユーザーが見つかりました。</div>
        </div>
        <div className="w-auto overflow-auto">
          <div className="flex h-12 w-auto min-w-96 flex-row items-center justify-between border-b-1 border-blue-400 px-8 font-bold">
            <div className="flex w-1/2 min-w-[50%] items-center justify-start text-nowrap">
              名前
            </div>
            <div className="flex w-1/2 items-center justify-start overflow-hidden text-nowrap md:w-1/4">
              現在居る部屋
            </div>
            <div className="hidden w-1/4 items-center justify-start overflow-hidden text-nowrap lg:flex">
              受講中
            </div>
          </div>
          {userList.map((user, i) => (
            <div
              className="flex h-20 w-auto min-w-96 flex-row items-center justify-between px-8"
              key={i}
            >
              <Link
                href={`/user/${user.id}`}
                className="flex w-1/2 flex-row items-center justify-start overflow-hidden"
              >
                <UserIcon
                  src={user.image}
                  width={48}
                  height={48}
                  className="mr-4 inline-block"
                />
                <div className="m-2 text-nowrap text-2xl">
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
              <div className="flex w-1/2 flex-row items-center justify-start overflow-hidden text-nowrap md:w-1/4">
                {user.lesson
                  ? user.lesson.room
                    ? `${user.lesson.room}にいます`
                    : "???"
                  : "キャンパスに居ません"}
              </div>
              <div className="hidden w-1/4 flex-row items-center justify-start overflow-hidden text-nowrap lg:flex">
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
    <div className="mx-auto flex w-fit flex-col items-center justify-center pt-8">
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
        lesson.period[0].innername,
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
