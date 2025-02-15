import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { NumToWeekDayMap } from "@/data/weekdays";

import { LinkButton } from "@/components/common/Buttons";
import CampusRegisterRequired from "@/components/common/CampusRegisterRequired";
import SearchField from "@/components/common/SearchField";
import { getNowJSTTimeAsMinutesWithWeekday } from "@/lib/time";
import { genUserTakingLessonQuery, getTakingLesson, getTakingRoom } from "@/lib/users";
import UserList from "@/components/common/UserList";
import { fetchUserCampusId, fetchUserCampusRooms } from "@/lib/userdata";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { query } = await searchParams;

  const session = await getServerSession(authConfig);
  if (!session?.user?.id) redirect("/signin");

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
      <CampusRegisterRequired message={<WhenCampusUnregistered />}>
        <WhenCampusRegistered query={query} userId={session.user.id} />
      </CampusRegisterRequired>
    </>
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
  const rooms = await fetchUserCampusRooms(userId, { name: true });
  return (
    <>
      <div className="m-auto h-full w-screen p-8 2xl:w-[60vw]">
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

async function fetchUserList(userId: string, query?: string) {
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
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        image: true,
        lessons: genUserTakingLessonQuery(minutes, weekdayEnum),
      },
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