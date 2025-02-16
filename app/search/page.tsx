import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { NumToWeekDayMap } from "@/data/weekdays";

import { LinkButton } from "@/components/common/Buttons";
import CampusRegisterRequired from "@/components/common/CampusRegisterRequired";
import { DefaultRefreshButton } from "@/components/common/RefreshButton";
import UserList from "@/components/common/UserList";
import { RoomSearchSelector } from "@/components/search/RoomSearchSelector";
import { DefaultSearchField } from "@/components/search/SearchField";
import { getNowJSTTimeAsMinutesWithWeekday } from "@/lib/time";
import { fetchUserCampusId, fetchUserCampusRooms } from "@/lib/userdata";
import {
  genUserTakingLessonQuery,
  getTakingLesson,
  getTakingRoom,
} from "@/lib/users";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
    room?: string | string[];
  }>;
}) {
  const { query, room } = await searchParams;
  const rooms: string[] = room
    ? typeof room === "string"
      ? [room]
      : room
    : [];

  const session = await getServerSession(authConfig);
  if (!session?.user?.id) redirect("/signin");

  return (
    <>
      <div className="mx-auto w-fit pt-8">
        <h1 className="mx-auto w-fit text-5xl font-bold">ユーザーを検索</h1>
        <p className="mx-auto mt-4 w-fit text-center text-xl font-bold">
          登録したキャンパスのユーザーを検索出来ます。
        </p>
      </div>
      <CampusRegisterRequired message={<WhenCampusUnregistered />}>
        <WhenCampusRegistered
          query={query}
          roomQuery={rooms}
          userId={session.user.id}
        />
      </CampusRegisterRequired>
    </>
  );
}

async function WhenCampusRegistered({
  query,
  roomQuery,
  userId,
}: {
  query?: string;
  roomQuery: string[];
  userId: string;
}) {
  const userList = await fetchUserList(userId, query, roomQuery);
  const rooms = await fetchUserCampusRooms(userId, { name: true });
  return (
    <>
      <div className="m-auto h-full w-screen p-8 2xl:w-[60vw]">
        <div className="mb-8 flex w-full flex-col items-center">
          <DefaultSearchField />
          <div className="mt-2">
            <h2 className="mx-auto w-fit font-bold">
              今居る部屋で検索(恐らく機能する)
            </h2>
            <RoomSearchSelector
              rooms={rooms.map((room) => room.name)}
              className="mx-1"
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-start pl-8">
          <div>{userList.length}人のユーザーが見つかりました。</div>
          <DefaultRefreshButton className="my-2 ml-4" />
        </div>
        <UserList userList={userList} />
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

async function fetchUserList(
  userId: string,
  query?: string,
  roomQuery?: string[],
) {
  const { weekday, minutes } = getNowJSTTimeAsMinutesWithWeekday();
  const weekdayEnum = NumToWeekDayMap[weekday] || undefined;
  const userCampusId = await fetchUserCampusId(userId);
  if (!userCampusId) return [];
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
          id: userCampusId,
        },
        lessons:
          !roomQuery || roomQuery.length <= 0
            ? undefined
            : {
                some: {
                  rooms: {
                    some: {
                      campusId: userCampusId,
                      name: {
                        in: roomQuery,
                      },
                    },
                  },
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
              },
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        image: true,
        lessons: genUserTakingLessonQuery(userCampusId, minutes, weekdayEnum),
      },
      orderBy: [
        {
          nickname: "desc",
        },
        {
          name: "desc",
        },
      ],
    })
  ).map((user) => {
    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      image: user.image,
      lesson: {
        room: getTakingRoom(user.lessons),
        lesson: getTakingLesson(user.lessons),
      },
    };
  });
}
