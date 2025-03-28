import clsx from "clsx";
import Link from "next/link";
import { UserIcon } from "./UserIcon";

export default function UserList({
  userList,
}: {
  userList: {
    id: string;
    name: string | null;
    nickname: string | null;
    image: string | null;
    lesson: {
      id?: string;
      room: string;
      lesson: string;
    };
  }[];
}) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-nowrap text-left">
        <thead>
          <tr className="w-full h-12 border-b-1 border-blue-400 font-bold">
            <td className="w-2/3 md:w-1/2 pl-8">名前</td>
            <td className="w-1/3 md:w-1/4">現在居る部屋</td>
            <td className="hidden md:table-cell">受講中</td>
          </tr>
        </thead>
        <tbody>
          <tr
            className={clsx(
              "min-w-full w-fit h-16",
              userList.length > 0 && "hidden",
            )}
          />
          {userList.map((user, i) => (
            <tr
              className="min-w-full w-fit h-16 odd:bg-light even: bg-gray-50 hover:bg-gray-100 odd:dark:bg-zinc-950 even:dark:bg-dark hover:dark:bg-zinc-900"
              key={i}
            >
              <td className="h-16 p-0 m-0">
                <Link
                  href={`/user/${user.id}`}
                  className="w-full h-full pl-8 flex flex-row items-center justify-start overflow-x-scroll"
                >
                  <UserIcon
                    src={user.image}
                    size={48}
                    status={
                      user.lesson.id !== undefined ? "active" : "inactive"
                    }
                    statusStyle="dot"
                    className="mr-4 inline-block"
                  />
                  <div className="mx-2">
                    {user.nickname && (
                      <span
                        className={clsx(
                          "block text-nowrap text-2xl",
                          user.name && "relative top-2",
                        )}
                      >
                        {user.nickname}
                      </span>
                    )}
                    {user.name && (
                      <span
                        className={clsx(
                          "block text-nowrap",
                          user.nickname
                            ? "relative left-2 text-md text-gray-600 dark:text-gray-400"
                            : "text-2xl",
                        )}
                      >
                        {user.name}
                      </span>
                    )}
                    {!user.name && !user.nickname && (
                      <span className="text-nowrap text-2xl">???</span>
                    )}
                  </div>
                </Link>
              </td>
              <td className="p-0 m-0">
                <Link
                  href={`/user/${user.id}`}
                  className="h-16 flex items-center"
                >
                  {user.lesson.room}
                </Link>
              </td>
              <td className="p-0 m-0 hidden md:table-cell">
                <Link
                  href={`/user/${user.id}`}
                  className="h-16 flex items-center"
                >
                  {user.lesson.lesson}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
