import SearchField from "@/components/common/SearchField";
import { prisma } from "@/prisma";
import clsx from "clsx";
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
    <div className="mx-auto w-fit mt-8">
      <SearchField
        placeholder="名前で検索 (むしめがねー(いつか追加するー))"
        className="w-[40vw] h-12 px-4 rounded-lg bg-black border-[1px] border-white"
      />
      <div className="h-4" />
      <div>{userList.length}人のユーザーがヒットしました。</div>
      <div className="h-2" />
      {!userList.length && <div className="h-16 flex items-center text-2xl">
        <div className="mr-2 w-12 h-12 flex items-center justify-center text-4xl font-bold text-black bg-gray-400 rounded-full">?</div>ユーザーが見つかりませんでした。:(
      </div>}
      <table className="w-[40vw]">
        <tbody>
          {userList.map((user, i) => (
            <tr key={i}>
              <td>
                <div className={clsx("h-16 flex flex-row items-center", i !== 0 && "border-t-[2px] border-gray-800")}>
                  <Image
                    alt="icon"
                    src={user.image}
                    width={48}
                    height={48}
                    className="inline-block rounded-full"
                  />
                  <div className="m-2 text-2xl">
                    {user.name}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
