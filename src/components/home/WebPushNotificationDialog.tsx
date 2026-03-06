"use client";

import { checkPushSubscriptionExists } from "@/src/actions/webpush/CheckPushSubscriptionAction";
import { getVapidPublicKey } from "@/src/actions/webpush/GetVapidPublicKeyAction";
import { savePushSubscription } from "@/src/actions/webpush/SavePushSubscriptionAction";
import { useWebPush } from "@/src/lib/webpush";
import BellAlertIcon from "@heroicons/react/24/solid/BellAlertIcon";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";

const DISMISSED_KEY = "webpush-dialog-dismissed-until";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7日間

export default function WebPushNotificationDialog() {
  const { isSupported, manager } = useWebPush();
  const [visible, setVisible] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [result, setResult] = useState<
    "idle" | "subscribed" | "denied" | "error"
  >("idle");

  useEffect(() => {
    if (!isSupported || !manager) return;

    const dismissedUntil = localStorage.getItem(DISMISSED_KEY);
    const isDismissed = dismissedUntil && Date.now() < Number(dismissedUntil);
    if (isDismissed) return;

    const browserSub = manager.getSubscription();
    if (!browserSub) {
      // ブラウザに購読がない → ダイアログ表示
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }

    // ブラウザに購読はあるが、DBに存在するか確認
    let cancelled = false;
    checkPushSubscriptionExists(browserSub.endpoint).then((exists) => {
      if (cancelled) return;
      if (!exists) {
        // DBから消えている → ダイアログ表示
        setTimeout(() => setVisible(true), 2000);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isSupported, manager]);

  const handleSubscribe = useCallback(async () => {
    if (!manager) return;
    setSubscribing(true);
    try {
      const pubKey = await getVapidPublicKey();
      if (!pubKey) {
        setResult("error");
        return;
      }
      const status = await manager.subscribeToPush(pubKey);
      if (status === "Subscribed") {
        const subscription = manager.getSubscription();
        if (subscription) {
          const json = subscription.toJSON();
          await savePushSubscription({
            endpoint: json.endpoint!,
            expirationTime: json.expirationTime ?? null,
            keys: json.keys as { p256dh: string; auth: string },
          });
        }
        setResult("subscribed");
        setTimeout(() => setVisible(false), 1500);
      } else if (status === "NoPerm") {
        setResult("denied");
      } else {
        setResult("error");
      }
    } catch {
      setResult("error");
    } finally {
      setSubscribing(false);
    }
  }, [manager]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(
      DISMISSED_KEY,
      String(Date.now() + DISMISS_DURATION_MS),
    );
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        "fixed bottom-6 right-6 z-50 w-80 rounded-xl border-2 border-blue-400 bg-white shadow-lg dark:border-blue-600 dark:bg-gray-900",
        "animate-[slideUp_0.3s_ease-out]",
      )}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between rounded-t-xl bg-blue-600 px-4 py-2.5 dark:bg-blue-800">
        <div className="flex items-center gap-2 text-white">
          <BellAlertIcon className="h-5 w-5" />
          <span className="text-sm font-bold">プッシュ通知</span>
        </div>
        <button
          onClick={handleDismiss}
          className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
          aria-label="閉じる"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        {result === "idle" && (
          <>
            <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
              通知を有効にすると、時間割の更新などをリアルタイムでお知らせします。
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleDismiss}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                後で
              </button>
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-900"
              >
                {subscribing ? "登録中..." : "通知を受け取る"}
              </button>
            </div>
          </>
        )}

        {result === "subscribed" && (
          <p className="text-center text-sm font-bold text-green-600 dark:text-green-400">
            通知を登録しました！
          </p>
        )}

        {result === "denied" && (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            通知の許可が拒否されました。
            <br />
            ブラウザの設定から許可してください。
          </p>
        )}

        {result === "error" && (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            通知の登録に失敗しました。
            <br />
            時間をおいて再度お試しください。
          </p>
        )}
      </div>
    </div>
  );
}
