"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export type Notification = {
  id: string;
  message: string;
  type: "info" | "success" | "warn" | "error";
  closeDelay: number | null;
};

const NotificationContext = createContext<
  [Notification[], Dispatch<SetStateAction<Notification[]>>] | null
>(null);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    console.error(
      "Attempted to send a notification while the notification was unsupported.",
    );
    return {
      notifications: [],
      notify: () => {},
      remove: () => {},
      clear: () => {},
    };
  }
  const [notifications, setNotifications] = ctx;

  const notify = (
    message: string,
    type: Notification["type"] = "info",
    closeDelay: number | null = 3000,
  ) => {
    setNotifications([
      ...notifications,
      { id: crypto.randomUUID(), message, type, closeDelay },
    ]);
  };
  const remove = (notification: Notification) => {
    setNotifications(
      notifications.filter(
        (notification_) => notification_.id !== notification.id,
      ),
    );
  };
  const clear = () => setNotifications([]);

  return {
    notifications,
    notify,
    remove,
    clear,
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  return (
    <NotificationContext.Provider value={[notifications, setNotifications]}>
      {children}
    </NotificationContext.Provider>
  );
}
