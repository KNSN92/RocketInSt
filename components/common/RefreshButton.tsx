"use client";

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
  return (
    <button
      onClick={() =>
        startRefresh(async () => {
          await refresh();
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
      className={`${className} w-fit h-fit px-2 py-1 bg-blue-500 border-blue-400 border-1 rounded-lg text-white disabled:bg-blue-300 disabled:border-blue-200`}
      defaultChildren={"再読み込み"}
      refreshingChildren={"再読み込み中..."}
    />
  );
}
