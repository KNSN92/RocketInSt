"use client";

import { Notification, useNotification } from "@/lib/notification";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import clsx from "clsx";
import React, { useEffect } from "react";

const NotificationColors: {
  [notificationType in Notification["type"]]: string;
} = {
  info: "bg-blue-600 border-blue-400 dark:bg-blue-700 dark:border-blue-600",
  success:
    "bg-green-600 border-green-400 dark:bg-green-700 dark:border-green-600",
  warn: "bg-yellow-600 border-yellow-400 dark:bg-yellow-700 dark:border-yellow-600",
  error: "bg-red-600 border-red-400 dark:bg-red-700 dark:border-red-600",
} as const;

export default function NotificationList({
  className,
}: {
  className?: string;
}) {
  const { notifications } = useNotification();
  return (
    <div
      className={clsx(
        "fixed z-50 -translate-x-1/2 top-[var(--header-height)] left-1/2 flex flex-col gap-1",
        className,
      )}
    >
      {notifications.map((notification, i) => (
        <NotificationElement notification={notification} key={i} />
      ))}
    </div>
  );
}

function NotificationElement({ notification }: { notification: Notification }) {
  const { remove } = useNotification();
  useEffect(() => {
    if (!notification.closeDelay) return;
    const timeoutId = setTimeout(() => {
      remove(notification);
    }, notification.closeDelay);
    return () => {
      clearTimeout(timeoutId);
    };
  });
  return (
    <div
      className={clsx(
        "w-screen sm:w-[60vw] p-4 flex items-center border-4 rounded-xl text-gray-200 text-center text-2xl opacity-90",
        NotificationColors[notification.type],
      )}
    >
      <button
        className="w-fit h-fit transition hover:bg-black/20 active:bg-black/30 rounded-full p-2"
        onClick={() => remove(notification)}
      >
        <XMarkIcon height={36} />
      </button>
      <div className="w-full">
        {notification.message.split(/\r?\n/).map((line, i, lines) => (
          <React.Fragment key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
