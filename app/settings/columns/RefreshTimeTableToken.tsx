"use client";

import { getTimeTableTokenStatus } from "@/src/actions/settings/GetTimeTableToken";
import { refreshTimeTableToken } from "@/src/actions/settings/RefreshTimeTableToken";
import { Button } from "@/src/components/common/Buttons";
import { useNotification } from "@/src/lib/notification";
import {
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useActionState, useEffect, useState } from "react";

const errorMessages: Record<string, string> = {
  NoUser: "ユーザーが見つかりません",
  NoPerm: "時間割を管理する権限がありません",
  NoCampus: "操作権限のあるキャンパスに所属していません",
  NoToken: "トークンが存在しません",
  Expired: "トークンの有効期限が切れています",
};

type GetTimeTableTokenResult =
  | {
      error: "NoUser" | "NoPerm" | "NoCampus" | "NoToken" | "Expired";
    }
  | {
      expiresAt: Date;
      campusId: string;
    };

export function RefreshTimeTableToken() {
  const [state, formAction, isPending] = useActionState(
    refreshTimeTableToken,
    {} as { error?: string; success?: string },
  );
  const [tokenStatus, setTokenStatus] =
    useState<GetTimeTableTokenResult | null>(null);
  const [showToken, setShowToken] = useState(false);
  const { notify } = useNotification();

  useEffect(() => {
    getTimeTableTokenStatus().then(setTokenStatus);
  }, []);

  useEffect(() => {
    if (state.error) {
      notify(
        errorMessages[state.error] || "エラーが発生しました",
        "error",
        15000,
      );
    }
    if (state.success) {
      notify(
        "トークンを再生成しました。このトークンは一度しか表示されません。",
        "success",
        15000,
      );
      setShowToken(true);
      getTimeTableTokenStatus().then(setTokenStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!tokenStatus) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-bold">時間割アップロードトークン</h1>
        <p className="text-gray-500 dark:text-gray-400">読み込み中...</p>
      </div>
    );
  }

  if ("error" in tokenStatus) {
    // NoTokenとExpiredの場合は生成可能な状態として表示
    const canGenerate =
      tokenStatus.error === "NoToken" || tokenStatus.error === "Expired";

    if (!canGenerate) {
      return (
        <div className="w-full">
          <h1 className="text-2xl font-bold">時間割アップロードトークン</h1>
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-300">
              {(tokenStatus.error && errorMessages[tokenStatus.error]) ||
                "エラーが発生しました"}
            </p>
          </div>
        </div>
      );
    }

    // NoTokenまたはExpiredの場合は生成UIを表示
    return (
      <GenerateTokenUI
        tokenStatus={tokenStatus}
        tokenGenerateStatus={state}
        formAction={formAction}
        isPending={isPending}
        showToken={showToken}
        setShowToken={setShowToken}
      />
    );
  }

  return (
    <GenerateTokenUI
      tokenStatus={tokenStatus}
      tokenGenerateStatus={state}
      formAction={formAction}
      isPending={isPending}
      showToken={showToken}
      setShowToken={setShowToken}
    />
  );
}

function GenerateTokenUI({
  tokenStatus,
  tokenGenerateStatus,
  formAction,
  isPending,
  showToken,
  setShowToken,
}: {
  tokenStatus: GetTimeTableTokenResult;
  tokenGenerateStatus: {
    error?: string | undefined;
    success?: string | undefined;
  };
  formAction: () => void;
  isPending: boolean;
  showToken: boolean;
  setShowToken: (value: boolean) => void;
}) {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">時間割アップロードトークン</h1>
      <div className="mt-4 space-y-4">
        {!("error" in tokenStatus) && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              現在のトークン有効期限:{" "}
              {new Date(tokenStatus.expiresAt).toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}

        {"error" in tokenStatus && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              {tokenStatus.error === "NoToken"
                ? "トークンが存在しません。新規生成してください。"
                : "トークンの有効期限が切れています。再生成してください。"}
            </p>
          </div>
        )}

        {tokenGenerateStatus.success && (
          <TokenGenerated
            showToken={showToken}
            setShowToken={setShowToken}
            tokenGenerateStatus={tokenGenerateStatus}
          />
        )}

        <form action={formAction}>
          <Button type="submit" color="primary" disabled={isPending}>
            {isPending
              ? "生成中..."
              : "error" in tokenStatus && tokenStatus.error === "NoToken"
                ? "トークンを生成"
                : "トークンを再生成"}
          </Button>
        </form>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>• 時間割データをアップロードするAPIで使用します</p>
          <p>• トークンは安全に保管してください</p>
          <p>• 有効期限は生成から365日間です</p>
        </div>
      </div>
    </div>
  );
}

function TokenGenerated({
  showToken,
  setShowToken,
  tokenGenerateStatus,
}: {
  showToken: boolean;
  setShowToken: (value: boolean) => void;
  tokenGenerateStatus: {
    error?: string | undefined;
    success?: string | undefined;
  };
}) {
  const { notify } = useNotification();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify("トークンをクリップボードにコピーしました", "success");
    } catch {
      notify("コピーに失敗しました", "error");
    }
  };
  return (
    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
        新しいトークン（この画面でのみ表示されます）
      </p>
      <div className="flex gap-2 items-center">
        <div className="flex-1 font-mono text-sm bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700 break-all">
          {showToken ? tokenGenerateStatus.success : "•".repeat(64)}
        </div>
        <button
          type="button"
          onClick={() => setShowToken(!showToken)}
          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
          title={showToken ? "トークンを隠す" : "トークンを表示"}
        >
          {showToken ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
        <button
          type="button"
          onClick={() => copyToClipboard(tokenGenerateStatus.success!)}
          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
          title="トークンをコピー"
        >
          <ClipboardDocumentIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
