"use client";

import { useNotification } from "@/src/lib/notification";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RefreshButton({
  className,
  defaultChildren,
  refreshingChildren,
}: {
  className?: HTMLButtonElement["className"];
  defaultChildren: React.ReactNode;
  refreshingChildren?: React.ReactNode;
}) {
  const { refresh } = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const { notify } = useNotification();
  return (
    <button
      onClick={() =>
        startRefresh(() => {
          refresh();
          notify("ページを再読み込みしました。");
        })
      }
      disabled={isRefreshing}
      className={className}
    >
      {refreshingChildren && isRefreshing
        ? refreshingChildren
        : defaultChildren}
    </button>
  );
}

export function DefaultRefreshButton({ className }: { className?: string }) {
  return (
    <RefreshButton
      className={clsx(
        className,
        "my-2 w-fit h-fit px-2 py-1 bg-blue-500 border-blue-400 border-1 rounded-lg text-nowrap text-white disabled:bg-blue-300 disabled:border-blue-200 dark:bg-transparent dark:border-blue-500 dark:text-blue-500 dark:disabled:border-blue-900 dark:disabled:text-blue-900",
      )}
      defaultChildren={"再読み込み"}
      refreshingChildren={"再読み込み中..."}
    />
  );
}
