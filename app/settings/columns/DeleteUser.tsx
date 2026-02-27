"use client";

import { deleteUser } from "@/src/actions/settings/DeleteUser";
import { Button } from "@/src/components/common/Buttons";
import { signOut } from "next-auth/react";
import { useActionState, useEffect, useLayoutEffect, useState } from "react";

export function DeleteUser() {
  const [confirmShowed, setConfirmShowed] = useState(false);
  const [state, formAction, isPending] = useActionState(deleteUser, {
    success: false,
    error: false,
  });
  useEffect(() => {
    if (state.error) console.error(state.msg);
  }, [state]);
  useLayoutEffect(() => {
    if (state.success) signOut({ callbackUrl: "/", redirect: true });
  });
  return (
    <div>
      {confirmShowed && (
        <div
          className="fixed w-screen h-screen inset-0 bg-black/20 flex items-center justify-center group group-has-[:hover]:pointer-events-none"
          onClick={(e) =>
            e.currentTarget === e.target && setConfirmShowed(false)
          }
        >
          <div className="w-fit px-8 h-48 gap-4 bg-red-400 rounded-3xl border-red-600 text-white border-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">アカウントを削除</h1>
            <p>
              本当にアカウントを削除する場合は以下のボタンを押してください。
            </p>
            <form action={formAction}>
              <Button type="submit" color="error" disabled={isPending}>
                {isPending ? "削除中..." : "本当に削除する"}
              </Button>
            </form>
          </div>
        </div>
      )}
      <Button color="error" onClick={() => setConfirmShowed(true)}>
        アカウントを削除
      </Button>
    </div>
  );
}
