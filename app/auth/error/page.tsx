import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthErrorNotificator } from "./AuthErrorNotificator";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}): Promise<Metadata> {
  const { error } = await searchParams;
  return {
    title: `AuthError '${error}'`,
  };
}

export default async function AuthError() {
  if (await getServerSession()) {
    redirect("/");
  }
  return <AuthErrorNotificator />;
}
