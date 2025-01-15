import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";

export default async function App() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  if (!userId) return <></>;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { campus: { include: { rooms: true } } },
  });
  if (!user?.campus)
    return <h1>あなたは通っているキャンパスを登録していません。</h1>;
  const campusRooms = user.campus.rooms;
  return (
    <>
      <h1>あなたが通っているキャンパスは{user.campus.name}です。</h1>
      <h1>そのキャンパスの主な部屋の一覧</h1>
      <ul>
        {campusRooms.map((room, i) => (
          <li key={i}>{room.name}</li>
        ))}
      </ul>
    </>
  );
}
