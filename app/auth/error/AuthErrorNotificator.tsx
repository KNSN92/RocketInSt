"use client";
import { useNotification } from "@/lib/notification";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

export function AuthErrorNotificator() {
  const error = useSearchParams().get("error");
  const { notify } = useNotification();
  const { replace } = useRouter();
  useLayoutEffect(() => {
    const message =
      error === "AccessDenied"
        ? "認証に失敗しました。:(\n@nnn.ed.jpもしくは@nnn.ac.jpのアカウントでログインしようとしているかを確認し、再度ログインを試みて下さい。"
        : `認証に失敗しました。:(\n何らかの理由でサインインに失敗しました。もう何回かサインインを試みて同じエラーが出る場合は、改善するまでしばらくお待ちください。\nエラーの種類:${error}`;
    notify(message, "error", 15000);
    replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}
