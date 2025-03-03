"use client";
import { useNotification } from "@/lib/notification";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";

export function AuthSuccessNotificator() {
  const callbackUrl = useSearchParams().get("callbackUrl");
  const { notify } = useNotification();
  const { replace } = useRouter();
  useLayoutEffect(() => {
    notify("認証に成功しました。:)", "success");
    if (callbackUrl) {
      replace(callbackUrl);
    } else {
      replace("/");
    }
  }, []);
  return <></>;
}
