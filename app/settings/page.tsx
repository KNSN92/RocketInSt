import { fetchUser, fetchUserId } from "@/src/lib/userdata";
import { redirect } from "next/navigation";
import { DeleteUser } from "./columns/DeleteUser";
import { RefreshTimeTableToken } from "./columns/RefreshTimeTableToken";
import { SetNickname } from "./columns/SetNickname";

export default async function Settings() {
  const userId = await fetchUserId();
  if (!userId) return redirect("/signin");
  return (
    <>
      <div className="mx-auto w-fit pt-8 flex flex-col gap-8 items-start">
        <div className="w-full">
          <h1 className="mx-auto w-fit text-5xl font-bold">ユーザー設定</h1>
        </div>
        <SetNickname
          initialNickName={
            (await fetchUser(userId, { nickname: true }))?.nickname || undefined
          }
        />
        <RefreshTimeTableToken />
        <DeleteUser />
      </div>
    </>
  );
}
