"use server";

import { prisma } from "@/prisma";
import { fetchUserId } from "@/src/lib/userdata";

export async function checkPushSubscriptionExists(
  endpoint: string,
): Promise<boolean> {
  const userId = await fetchUserId();
  if (!userId) return false;

  const count = await prisma.pushSubscription.count({
    where: { userId, endpoint },
  });

  return count > 0;
}
