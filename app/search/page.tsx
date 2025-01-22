import SearchField from "@/components/common/SearchField";
import { prisma } from "@/prisma";
import Image from "next/image";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { query } = await searchParams;
  const userList = (await prisma.user.findMany({
    where: {
      AND: {
        name: { not: null, contains: query },
        image: { not: null },
      },
    },
    select: { name: true, image: true },
  })) as { name: string; image: string }[];

  return (
    <div>
      <SearchField
        placeholder="名前で検索"
        className="bg-black border-[1px] border-white"
      />
      <table>
        <tbody>
          {userList.map((user, i) => (
            <tr key={i}>
              <td>
                <Image
                  alt="icon"
                  src={user.image}
                  width={32}
                  height={32}
                  className="inline-block rounded-full"
                />
                {user.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
