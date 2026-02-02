"use server";
import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma-gen/browser";
import { getServerSession } from "next-auth";

export async function fetchUserId() {
  return (await getServerSession(authConfig))?.user?.id || undefined;
}

export async function fetchUserCampus(userId: string) {
  return (await prisma.user.findUnique({ where: { id: userId }, select: {campus: true} }))?.campus || undefined;
}

export async function fetchUserCampusId(userId: string) {
  return (
    (await prisma.user.findUnique({ where: { id: userId } }))?.campusId ||
    undefined
  );
}

export async function isUserCampusRegistered(userId: string) {
  return (await fetchUserCampusId(userId)) !== undefined;
}

export async function userExist(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user !== undefined && user !== null;
}

export async function fetchUser<T extends Prisma.UserSelect>(
  userId: string,
  select?: T | undefined,
): Promise<Prisma.UserGetPayload<{ select: T }> | undefined> {
  if (select)
    return (
      (await prisma.user.findUnique({
        where: { id: userId },
        select: select,
      })) || undefined
    );
  return undefined;
}

export async function isUserFriend(myUserId: string, friendUserId: string) {
  const following = (
    await prisma.user.findUnique({
      where: {
        id: myUserId,
      },
      select: {
        _count: {
          select: {
            following: {
              where: {
                id: friendUserId,
              },
            },
          },
        },
      },
    })
  )?._count.following;
  return following !== undefined && following > 0;
}

export async function fetchUserCampusRooms<T extends Prisma.RoomSelect>(userId: string, roomSelect: T): Promise<Prisma.RoomGetPayload<{
  select: T
}>[]> {
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
                select: roomSelect,
              },
            },
          },
        },
      })
    )?.campus?.rooms || []
  );
}