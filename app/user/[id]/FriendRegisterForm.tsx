"use client";

import registerFriendAction from "@/actions/users/RegisterFriendAction";
import { Button } from "@/components/common/Buttons";
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
    error: false,
    msg: "",
  });
  useEffect(() => {
    if (state.error) console.error(state.msg);
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
