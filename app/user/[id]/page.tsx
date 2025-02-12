"use server";
import { LinkButton } from "@/components/common/Buttons";
import { UserIcon } from "@/components/common/UserIcon";
import { CourseFreqJA } from "@/data/courseFreqs";
import { RecessPeriods } from "@/data/periods";
import { NumToWeekDayMap } from "@/data/weekdays";
import { getNowJSTTimeAsMinutesWithWeekday } from "@/lib/time";
import {
  fetchUser,
  fetchUserCampusId,
  fetchUserId,
  isUserFriend,
} from "@/lib/userdata";
import { CourseFrequency, Role } from "@prisma/client";
import clsx from "clsx";
import { notFound, redirect } from "next/navigation";
import FriendRegisterForm from "./FriendRegisterForm";
import { combinateUserName } from "@/lib/users";

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
    <div className="mx-auto pt-8 w-fit flex flex-col items-center justify-center">
      <div className="w-fit text-xl font-bold">
        ユーザー検索を利用するにはキャンパスを登録してください。
      </div>
      <LinkButton href="/register">登録ページへ</LinkButton>
    </div>
  );
}

function UserProfile({
  initialIsFriend,
  profileUserId,
  name,
  nickname,
  image,
  role,
  courseFrequency,
  lessons,
}: {
  initialIsFriend: boolean;
  profileUserId: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
  role: Role;
  courseFrequency: CourseFrequency | null;
  lessons: {
    title: string;
    rooms: { name: string }[];
    period: { name: string; innername: string }[];
  }[];
}) {
  console.log("friend", initialIsFriend);
  return (
    <div className="pt-32 w-fit mx-auto flex flex-col items-center">
      <UserIcon src={image} width={192} height={192} className="text-9xl" />
      <h1
        className={clsx(
          "py-8 text-3xl font-bold",
          role === "Admin" && "text-[#ff0000]"
        )}
      >
        {role === "Admin" && "[Admin]"}
        {combinateUserName(name, nickname)}
      </h1>
      <FriendRegisterForm
        profileUserId={profileUserId}
        initialIsFriend={initialIsFriend}
      />
      <ul className="mt-4 text-2xl">
        <li>
          コース：{courseFrequency ? CourseFreqJA[courseFrequency] : "未登録"}
        </li>
        <li>
          現在居る部屋：
          {lessons.length > 0
            ? lessons[0].rooms.length > 0
              ? lessons[0].rooms[0].name
              : "???"
            : "キャンパスに居ません"}
        </li>
        <li>
          受講中の授業：
          {lessons.length > 0
            ? lessons[0].period.length > 0 &&
              (RecessPeriods as ReadonlyArray<string>).includes(
                lessons[0].period[0].innername
              )
              ? lessons[0].period[0].name
              : lessons[0].title
            : "キャンパスに居ません"}
        </li>
      </ul>
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
  });
}
