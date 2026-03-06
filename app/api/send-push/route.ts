import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import z from "zod";

webpush.setVapidDetails(
  "https://knsn92.github.io",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_SECRET_KEY!,
);

const WebPushPayloadSchema = z.object({
  message: z.string(),
  subscription: z.object({
    endpoint: z.string(),
    expirationTime: z.number().nullish().optional(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = WebPushPayloadSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Invalid request body:", parseResult.error);
      return new Response("Invalid request body", { status: 400 });
    }
    const { message, subscription } = parseResult.data;

    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title: "RocketInSt", body: message }),
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error sending push notification:", e);
    const status = e instanceof webpush.WebPushError ? e.statusCode : 500;
    return new Response("Failed to send push notification", { status });
  }
}
