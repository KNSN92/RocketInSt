import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { prisma } from "@/prisma";

export default async function Home() {
  const session = await getServerSession(authConfig);
  if (session !== null) {
    const user = await prisma.user.findUnique({
      where: { id: session.user?.id || undefined },
    });
    const role = user?.role;
    return (
      <div>
        <div>こんにちは {session.user?.name}さん</div>
        {role === "Admin" ? <div>おっ管理人さん？どうも。</div> : undefined}
      </div>
    );
  } else {
    return <div>ログインをするのです。</div>;
  }
}
