import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { NumToWeekDayMap } from "@/data/weekdays";

import { LinkButton } from "@/components/common/Buttons";
import CampusRegisterRequired from "@/components/common/CampusRegisterRequired";
import PaginationButtons from "@/components/common/PaginationButtons";
import { DefaultRefreshButton } from "@/components/common/RefreshButton";
import UpdatedTime from "@/components/common/UpdatedTime";
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

const pageLimit = 20;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
    room?: string | string[];
  }>;
}) {
  const { query, room, page } = await searchParams;
  const rooms: string[] = room
    ? typeof room === "string"
      ? [room]
      : room
    : [];
  const parsedPage = parseInt(page || "1");
  const pageNum = isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;

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
          page={pageNum}
          query={query}
          roomQuery={rooms}
          userId={session.user.id}
        />
      </CampusRegisterRequired>
    </>
  );
}

async function WhenCampusRegistered({
  page,
  query,
  roomQuery,
  userId,
}: {
  page: number;
  query?: string;
  roomQuery: string[];
  userId: string;
}) {
  const [totalUser, userList] = await fetchUserList(
    page,
    userId,
    query,
    roomQuery,
  );
  // const totalPages = Math.ceil(totalUser / pageLimit);
  // if (totalUser > 0 && totalPages < page) {
  //   const params = new URLSearchParams();
  //   params.set("page", totalPages.toString());
  //   if (query) params.set("query", query);
  //   roomQuery.forEach((room) => params.append("room", room));
  //   redirect(`/search?${params.toString()}`);
  // }

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
            <div className="mx-1 w-screen flex justify-center gap-1 flex-nowrap overflow-auto">
              <RoomSearchSelector
                rooms={rooms.map((room) => room.name)}
                className="block text-nowrap"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8 flex-col-reverse md:flex-row">
          <div className="text-lg text-nowrap">
            {totalUser}人のユーザーが見つかりました。
          </div>
          <div className="flex items-center justify-center md:gap-4 flex-col md:flex-row">
            <DefaultRefreshButton className="block" />
            <div className="text-lg text-nowrap">
              更新：
              <UpdatedTime />
            </div>
          </div>
        </div>
        <UserList userList={userList} />
        {totalUser > pageLimit && (
          <div className="mt-4 flex justify-center">
            <PaginationButtons
              pageParam="page"
              page={page}
              limit={pageLimit}
              total={totalUser}
            />
          </div>
        )}
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
  page: number,
  userId: string,
  query?: string,
  roomQuery?: string[],
) {
  const { weekday, minutes } = getNowJSTTimeAsMinutesWithWeekday();
  const weekdayEnum = NumToWeekDayMap[weekday] || undefined;
  const userCampusId = await fetchUserCampusId(userId);
  if (!userCampusId) return [];
  const where = {
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
        skip: (page - 1) * pageLimit,
        take: pageLimit,
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
    }),
  ]);
}
