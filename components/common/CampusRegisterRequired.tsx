import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function CampusRegisterRequired({
  children,
  message,
}: {
  children: ReactNode;
  message: ReactNode;
}) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return redirect("/signin");
  }
  const userCampus = (
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })
  )?.campusId;
  if (userCampus) {
    return children;
  } else {
    return message;
  }
}
