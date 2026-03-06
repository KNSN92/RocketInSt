import { prisma } from "@/prisma";
import { fetchUserId } from "@/src/lib/userdata";
import { NextResponse } from "next/server";
import webpush from "web-push";

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_SECRET_KEY) {
  throw new Error("VAPID keys are not set in environment variables");
}

webpush.setVapidDetails(
  "https://knsn92.github.io",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_SECRET_KEY!,
);

export async function POST(req: Request) {
  try {
    const userId = await fetchUserId();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Admin のみ実行可能
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (user?.role !== "Admin") {
      return new Response("Forbidden", { status: 403 });
    }

    let body = {
      message: "テスト通知です。",
    };
    try {
      body = await req.json();
    } catch {}
    const message =
      typeof body.message === "string" ? body.message : "テスト通知です。";

    const subscriptions = await prisma.pushSubscription.findMany();

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
              expirationTime: sub.expirationTime ?? null,
            },
            JSON.stringify({ title: "RocketInSt", body: message }),
          );
          console.log(`Sent push notification to subscription ${sub.id}`);
          return { id: sub.id, status: "sent" as const };
        } catch (e) {
          console.error(
            `Error sending push notification to subscription ${sub.id}:`,
            e,
          );
          // 410 Gone = サブスクリプション無効 → DBから削除
          if (e instanceof webpush.WebPushError && e.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } });
            return { id: sub.id, status: "expired" as const };
          }
          return { id: sub.id, status: "failed" as const };
        }
      }),
    );

    const sent = results.filter(
      (r) => r.status === "fulfilled" && r.value.status === "sent",
    ).length;
    const expired = results.filter(
      (r) => r.status === "fulfilled" && r.value.status === "expired",
    ).length;
    const failed = results.filter(
      (r) =>
        r.status === "rejected" ||
        (r.status === "fulfilled" && r.value.status === "failed"),
    ).length;

    return NextResponse.json({
      total: subscriptions.length,
      sent,
      expired,
      failed,
    });
  } catch (e) {
    console.error("Error broadcasting push notifications:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
