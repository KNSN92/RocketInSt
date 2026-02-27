"use client";

import { setNickname } from "@/src/actions/settings/Nickname";
import { Button } from "@/src/components/common/Buttons";
import { useNotification } from "@/src/lib/notification";
import { useActionState, useEffect } from "react";

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
