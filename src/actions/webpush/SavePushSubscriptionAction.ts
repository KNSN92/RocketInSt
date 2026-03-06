"use server";

import { prisma } from "@/prisma";
import { fetchUserId } from "@/src/lib/userdata";

export async function savePushSubscription(subscription: {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
}) {
  const userId = await fetchUserId();
  if (!userId) return { error: "Unauthorized" };

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      expirationTime: subscription.expirationTime ?? null,
    },
    create: {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      expirationTime: subscription.expirationTime ?? null,
    },
  });

  return { success: true };
}
