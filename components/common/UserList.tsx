import Link from "next/link";
import { UserIcon } from "./UserIcon";
import { combinateUserName } from "@/lib/users";

export default function UserList({ userList }: { userList: {
	id: string;
	name: string | null;
	nickname: string | null;
	image: string | null;
	lesson: {
			room: string;
			lesson: string;
	};
}[] }) {
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
						{userList.map((user, i) => (
							<tr
								className="min-w-full w-fit h-16 odd:bg-white oven: bg-gray-50"
								key={i}
							>
								<td className="h-16 p-0 m-0">
									<Link
										href={`/user/${user.id}`}
										className="w-full h-full pl-8 flex flex-row items-center justify-start overflow-scroll hover:bg-gray-100"
									>
										<UserIcon
											src={user.image}
											width={48}
											height={48}
											className="mr-4 inline-block"
										/>
										<div className="m-2 text-nowrap text-2xl">{combinateUserName(user.name, user.nickname)}</div>
									</Link>
								</td>
								<td className="p-0 m-0">
									{user.lesson.room}
								</td>
								<td className="p-0 m-0 hidden md:table-cell">
									{user.lesson.lesson}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
    );
}