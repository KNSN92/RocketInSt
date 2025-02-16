"use client";

import registerFriendAction from "@/actions/users/RegisterFriendAction";
import { PrimaryButton, SecondaryButton } from "@/components/common/Buttons";
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
        <SecondaryButton type="submit" disabled={isPending}>
          {isPending ? "解除中..." : "フレンド解除"}
        </SecondaryButton>
      ) : (
        <PrimaryButton type="submit" disabled={isPending}>
          {isPending ? "登録中..." : "フレンド登録"}
        </PrimaryButton>
      )}
    </form>
  );
}
