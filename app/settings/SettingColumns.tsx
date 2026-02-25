"use client";

import { deleteUser } from "@/src/actions/settings/DeleteUser";
import { setNickname } from "@/src/actions/settings/Nickname";
import { Button } from "@/src/components/common/Buttons";
import { useNotification } from "@/src/lib/notification";
import { signOut } from "next-auth/react";
import { useActionState, useEffect, useLayoutEffect, useState } from "react";

export function SetNickname({
  initialNickName,
}: {
  initialNickName: string | undefined;
}) {
  const [state, formAction, isPending] = useActionState(setNickname, {
    nickname: initialNickName,
    success: false,
    error: false,
  });
  const { notify } = useNotification();
  useEffect(() => {
    if (state.error) {
      notify(state.msg || "", "error", 15000);
    }
    if (state.success) {
      notify(`ニックネームを${state.nickname}に変更しました。`, "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <div>
      <h1 className="text-2xl font-bold">ニックネームの変更</h1>
      <form action={formAction} className="flex gap-2 items-center">
        <input
          type="text"
          name="nickname"
          className="min-w-64 max-w-96 w-1/2 h-12 rounded-lg border-1 border-blue-600 px-4 dark:bg-dark"
          defaultValue={state.nickname}
          required
        />
        <Button color="primary" type="submit" disabled={isPending}>
          {isPending ? "変更中..." : "変更"}
        </Button>
      </form>
    </div>
  );
}

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
