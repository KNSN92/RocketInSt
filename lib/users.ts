import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function fetchUserId() {
    "use server";
    return (await getServerSession(authConfig))?.user?.id || undefined;
}

export async function fetchUserCampusId(userId: string) {
    "use server";
    return (await prisma.user.findUnique({ where: { id: userId }}))?.campusId || undefined;
}

export async function isUserCampusRegistered(userId: string) {
    "use server";
    return (await fetchUserCampusId(userId)) !== undefined;
}

export async function fetchUser<T extends Prisma.UserSelect>(
    userId: string,
    select?: T | undefined
): Promise<Prisma.UserGetPayload<{ select: T }> | undefined> {
    "use server";
    if(select) return await prisma.user.findUnique({ where: { id: userId }, select: select }) || undefined;
    return undefined;
}

export function combinateUserName(name?: string | null, nickname?: string | null) {
    if(name && nickname) {
        return `${nickname}(${name})`;
    } else if(name) {
        return name;
    } else if(nickname) {
        return nickname;
    } else {
        return "???";
    }
}
