import { prisma } from "@/prisma";
import { fetchUserId } from "@/src/lib/userdata";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function CampusRegisterRequired({
  children,
  message,
  redirectWhenNotLoggedIn = true,
}: {
  children: ReactNode;
  message: ReactNode;
  redirectWhenNotLoggedIn: boolean;
}) {
  const userId = await fetchUserId();
  if (!userId) {
    if (redirectWhenNotLoggedIn) {
      return redirect("/signin");
    } else {
      return message;
    }
  }
  const userCampus = (
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  )?.campusId;
  if (userCampus) {
    return children;
  } else {
    return message;
  }
}
