"use client";

import registerFriendAction from "@/src/actions/users/RegisterFriendAction";
import { Button } from "@/src/components/common/Buttons";
import { useNotification } from "@/src/lib/notification";
import { useActionState, useEffect } from "react";

export default function FriendRegisterForm({
  profileUserId,
  initialIsFriend,
}: {
  profileUserId: string;
  initialIsFriend: boolean;
}) {
  const [state, action, isPending] = useActionState(registerFriendAction, {
    isFriend: initialIsFriend,
    success: false,
    error: false,
    msg: "",
  });
  const { notify } = useNotification();
  useEffect(() => {
    if (state.error) console.error(state.msg);
    if (state.success) {
      if (state.isFriend) {
        notify("フレンドに登録しました。");
      } else {
        notify("フレンドを解除しました。");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <form action={action}>
      <input type="hidden" name="user" value={profileUserId} />
      {state.isFriend ? (
        <Button color="secondary" type="submit" disabled={isPending}>
          {isPending ? "解除中..." : "フレンド解除"}
        </Button>
      ) : (
        <Button color="primary" type="submit" disabled={isPending}>
          {isPending ? "登録中..." : "フレンド登録"}
        </Button>
      )}
    </form>
  );
}
