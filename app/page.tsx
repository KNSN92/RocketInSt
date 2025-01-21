import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { SignInButton } from "@/components/common/AuthButtons";
import Image from "next/image";
import { prisma } from "@/prisma";
import CampusMap from "@/components/home/CampusMap";

export default async function Home() {
  const session = await getServerSession(authConfig);

  const mapData = session?.user?.id
    ? (await fetchUserCampusMap(session.user.id)).map((item) => {
        return {
          ...item,
          className:
            "flex items-center justify-center bg-gray-400 border-2 border-gray-600 text-xl font-bold text-gray-800 rounded-lg",
        };
      })
    : [];

  return (
    <div className="w-fit mx-auto flex flex-col items-center">
      <div className="h-20" />
      <h1 className="text-6xl font-bold">RocketIn.St</h1>
      <div className="h-4" />
      <h2 className="text-2xl font-semibold">
        N/S高 生徒のキャンパス内位置 混雑状況 確認サイト
      </h2>
      <div className="h-10" />
      {session?.user ? (
        <>
          <div className="text-3xl font-semibold">
            こんにちは {session.user?.name}
            さん
          </div>
          <div className="h-4" />
          {session.user.image ? (
            <Image
              alt="icon"
              src={session.user.image}
              width={128}
              height={128}
              className="rounded-full border-[1px] border-gray-500 inline"
            />
          ) : undefined}
          {mapData.length ? (
            <CampusMap mapData={mapData} mapSize={768} />
          ) : undefined}
        </>
      ) : (
        <SignInButton>
          <div className="bg-blue-600 text-3xl font-semibold flex justify-center items-center w-64 h-20 rounded-lg border-blue-800 border-[2px] hover:bg-blue-500 hover:border-blue-700">
            登録 / サインイン
          </div>
        </SignInButton>
      )}
    </div>
  );
}

async function fetchUserCampusMap(userId: string) {
  return (
    await prisma.roomPlan.findMany({
      where: {
        room: {
          campus: {
            members: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
      include: {
        room: {
          select: {
            name: true,
          },
        },
      },
    })
  ).map((item) => {
    return {
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      name: item.room.name,
    };
  });
}
