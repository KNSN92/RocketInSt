import { prisma } from "@/prisma";
import { PeriodType } from "@/src/data/periods";
import { NumToWeekDayMap } from "@/src/data/weekdays";
import { hashToken } from "@/src/lib/hash";
import { getNowJSTTimeAsMinutesWithWeekday } from "@/src/lib/time";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_SECRET_KEY) {
  throw new Error("VAPID keys are not set in environment variables");
}

webpush.setVapidDetails(
  "https://knsn92.github.io",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_SECRET_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    // Bearer トークン認証
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    if (!token || !process.env.PUSH_CRON_TOKEN_HASH) {
      return new Response("Unauthorized", { status: 401 });
    }
    const tokenHash = await hashToken(token);
    if (tokenHash !== process.env.PUSH_CRON_TOKEN_HASH) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { minutes, weekday } = getNowJSTTimeAsMinutesWithWeekday();
    const weekdayEnum = NumToWeekDayMap[weekday];
    if (!weekdayEnum) {
      return NextResponse.json({ error: "Invalid weekday" }, { status: 400 });
    }

    // 現在時刻より後に始まる最も近い Period（Lesson タグのみ）を取得
    const nextPeriod = await prisma.period.findFirst({
      where: {
        weekday: weekdayEnum,
        tag: "Lesson",
        beginTime: { gt: minutes },
      },
      orderBy: { beginTime: "asc" },
    });

    if (!nextPeriod) {
      return NextResponse.json({
        message:
          "本日これ以降の授業はありません。本日もお疲れ様でした！(送信していません)",
        sent: 0,
        expired: 0,
        failed: 0,
      });
    }

    // その Period に紐づく LessonPeriod と受講生徒・Push購読情報を取得
    const lessonPeriods = await prisma.lessonPeriod.findMany({
      where: { periodId: nextPeriod.id },
      select: {
        lesson: { select: { title: true } },
        rooms: { select: { name: true } },
        students: {
          select: {
            id: true,
            pushSubscriptions: true,
          },
        },
      },
    });

    // ユーザーごとに通知メッセージを組み立て
    const notifications: {
      subscription: {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };
      subId: string;
      message: string;
    }[] = [];

    for (const lp of lessonPeriods) {
      const lessonTitle = lp.lesson.title;
      const roomName = lp.rooms.map((r) => r.name).join(", ") || "未定";
      let message: string;
      switch (nextPeriod.innername as PeriodType) {
        case "MorningMeeting":
          message = "おはようございます。今日も一日頑張りましょう！";
          break;
        case "ClosingMeeting":
          message =
            "終わりの会が終われば、今日の授業は全て完了です。お疲れ様でした！";
          break;
        default:
          message = `${nextPeriod.name}の授業は\n\"${lessonTitle}\"です。\n部屋:（${roomName}）`;
          break;
      }

      for (const student of lp.students) {
        for (const sub of student.pushSubscriptions) {
          notifications.push({
            subscription: {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            subId: sub.id,
            message,
          });
        }
      }
    }

    if (notifications.length === 0) {
      return NextResponse.json({
        message: `次の授業 (${nextPeriod.name}) に該当する通知対象がいません。`,
        sent: 0,
        expired: 0,
        failed: 0,
      });
    }

    // 通知送信
    const results = await Promise.allSettled(
      notifications.map(async ({ subscription, subId, message }) => {
        try {
          await webpush.sendNotification(
            subscription,
            JSON.stringify({ title: "RocketInSt", body: message }),
          );
          return { subId, status: "sent" as const };
        } catch (e) {
          if (e instanceof webpush.WebPushError && e.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: subId } });
            return { subId, status: "expired" as const };
          }
          return { subId, status: "failed" as const };
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
      message: `次の授業: ${nextPeriod.name}`,
      total: notifications.length,
      sent,
      expired,
      failed,
    });
  } catch (e) {
    console.error("Error sending next-lesson notifications:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
