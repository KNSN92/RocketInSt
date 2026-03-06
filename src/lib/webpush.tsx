"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebPushContext = createContext({
  isSupported: false,
  manager: null as WebPushManager | null,
});

export function WebPushProvider({ children }: { children: ReactNode }) {
  const mgrRef = useRef<WebPushManager | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  useEffect(() => {
    const isSupported = isWebPushSupported();
    setIsSupported(isSupported);
    if (isSupported) {
      const mgr = new WebPushManager();
      mgr.registerServiceWorker().then((status) => {
        console.log("Service Worker registration status:", status);
      });
      mgrRef.current = mgr;
    }
  }, []);
  return (
    <WebPushContext.Provider
      value={{
        isSupported,
        manager: mgrRef.current,
      }}
    >
      {children}
    </WebPushContext.Provider>
  );
}

export function useWebPush() {
  return useContext(WebPushContext);
}

class WebPushManager {
  #subscription: PushSubscription | Error | null = null;

  getSubscription() {
    if (this.#subscription instanceof PushSubscription) {
      return this.#subscription;
    }
    return null;
  }

  getError() {
    if (this.#subscription instanceof Error) {
      return this.#subscription;
    }
    return null;
  }

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      this.#subscription = await registration.pushManager.getSubscription();
    } catch (e) {
      console.error(e);
      if (e instanceof Error) this.#subscription = e;
      return "Error";
    }
    return "Registered";
  }

  async subscribeToPush(pubKey: string) {
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        return "NoPerm";
      }
      const registration = await navigator.serviceWorker.ready;

      this.#subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pubKey),
      });
    } catch (e) {
      console.error(e);
      if (e instanceof Error) this.#subscription = e;
      return "Error";
    }
    return "Subscribed";
  }

  async unsubscribeFromPush() {
    try {
      if (!(this.#subscription instanceof PushSubscription)) {
        return "NoSubscription";
      }
      await this.#subscription.unsubscribe();
      this.#subscription = null;
    } catch (e) {
      console.error(e);
      if (e instanceof Error) this.#subscription = e;
      return "Error";
    }
    return "Unsubscribed";
  }

  async sendPushNotification(message: string) {
    try {
      if (!(this.#subscription instanceof PushSubscription)) {
        return "NoSubscription";
      }
      const subscription = this.#subscription;
      const response = await fetch("/api/send-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          subscription,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to send push notification:", result["error"]);
        return "FailedToSend";
      }

      return "Sent";
    } catch (e) {
      console.error(e);
      if (e instanceof Error) this.#subscription = e;
      return "Error";
    }
  }
}

function isWebPushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
