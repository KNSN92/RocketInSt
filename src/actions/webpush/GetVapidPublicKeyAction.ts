"use server";

export async function getVapidPublicKey(): Promise<string | null> {
  return process.env.VAPID_PUBLIC_KEY ?? null;
}
