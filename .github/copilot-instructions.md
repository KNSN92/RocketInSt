# RocketInSt - Copilot Instructions

## プロジェクト概要

**RocketIn.st（ロケットインエスティー）** は、N/S高等学校のキャンパスに通学する生徒の位置情報・教室の混雑状況を確認できるWebアプリケーションです。
N/S高内の学内コンペティション向けに誕生し、「**便利を世界へ。**」をモットーに開発が進められています。

- **リポジトリ**: [https://github.com/KNSN92/RocketInSt](https://github.com/KNSN92/RocketInSt)
- **開発チーム**: RocketIn.St Development Team
- **ライセンス**: LICENSE ファイル参照

### 主な機能

- **Google OAuth 認証**（`@nnn.ed.jp` / `@nnn.ac.jp` ドメインのみ許可）
- **キャンパス・教室の登録と管理**（部屋の配置図 JSON、混雑状況の表示）
- **時間割の管理**（1〜6限目、休み時間、放課後などの時限区分）
- **生徒の現在位置・受講中授業の表示**（曜日・時間帯に応じたリアルタイム表示）
- **ユーザー検索**（名前・部屋でのフィルタリング、ページネーション）
- **ユーザープロフィール**（ニックネーム設定、コース表示、フレンド登録）
- **ダークモード対応**
- **通知システム**（クライアントサイド）

---

## 技術スタック

### フレームワーク・ランタイム

| 技術           | バージョン        | 用途                                  |
| -------------- | ----------------- | ------------------------------------- |
| **Next.js**    | 15.x (App Router) | フルスタック React フレームワーク     |
| **React**      | 19.x              | UI ライブラリ                         |
| **TypeScript** | 5.x               | 型安全な開発                          |
| **Turbopack**  | (Next.js 内蔵)    | 開発サーバー (`next dev --turbopack`) |

### データベース・ORM

| 技術              | 用途                                       |
| ----------------- | ------------------------------------------ |
| **PostgreSQL**    | メインデータベース                         |
| **Prisma**        | ORM（v7、`@prisma/adapter-pg` 経由で接続） |
| **Prisma Client** | 型安全なデータベースクエリ                 |

### 認証

| 技術                     | 用途                                 |
| ------------------------ | ------------------------------------ |
| **NextAuth.js (v4)**     | 認証基盤                             |
| **@auth/prisma-adapter** | Prisma 経由のセッション/ユーザー管理 |
| **Google OAuth**         | サインインプロバイダー               |

### スタイリング

| 技術             | 用途                            |
| ---------------- | ------------------------------- |
| **Tailwind CSS** | v4、ユーティリティファーストCSS |
| **PostCSS**      | CSS ビルドパイプライン          |

### バリデーション

| 技術    | 用途                                    |
| ------- | --------------------------------------- |
| **Zod** | Server Actions のフォームバリデーション |

### アニメーション・UI

| 技術                        | 用途                           |
| --------------------------- | ------------------------------ |
| **GSAP**                    | アニメーション (`@gsap/react`) |
| **react-simple-typewriter** | タイプライターエフェクト       |
| **@heroicons/react**        | アイコンセット                 |
| **clsx**                    | 条件付きクラス名結合           |

### ユーティリティ

| 技術             | 用途                 |
| ---------------- | -------------------- |
| **use-debounce** | 検索入力のデバウンス |
| **dotenv**       | 環境変数管理         |

### 開発ツール

| 技術                        | 用途                                                                |
| --------------------------- | ------------------------------------------------------------------- |
| **ESLint**                  | リンター (`next/core-web-vitals`, `prettier` 連携)                  |
| **Prettier**                | コードフォーマッター (`organize-imports`, `tailwindcss` プラグイン) |
| **bun**                     | パッケージマネージャー+ランタイム                                   |
| **prisma-erd-generator**    | ER図生成                                                            |
| **@mermaid-js/mermaid-cli** | Mermaid ダイアグラム                                                |

---

## ディレクトリ構成

```
RocketInSt/
├── app/                        # Next.js App Router ページ群
│   ├── layout.tsx              # ルートレイアウト（ヘッダー・フッター・認証プロバイダー）
│   ├── page.tsx                # ホームページ（キャンパスマップ・ユーザー一覧）
│   ├── globals.css             # グローバルCSS（Tailwind, カスタムプロパティ）
│   ├── loading.tsx             # ローディング UI
│   ├── not-found.tsx           # 404 ページ
│   ├── about/                  # About ページ
│   │   ├── page.tsx
│   │   └── extra/              # Extra About
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth API ルート
│   │   └── timetable/          # 時間割 API
│   ├── auth/
│   │   ├── error/              # 認証エラーページ
│   │   └── success/            # 認証成功ページ
│   ├── register/               # ユーザー登録（キャンパス・コース・時間割選択）
│   ├── search/                 # ユーザー検索ページ
│   ├── settings/               # ユーザー設定（ニックネーム変更・アカウント削除）
│   ├── signin/                 # サインインページ
│   └── user/[id]/              # ユーザープロフィールページ
│
├── src/
│   ├── actions/                # Server Actions
│   │   ├── register/           #   RegisterFormAction.ts（登録フォーム処理）
│   │   ├── settings/           #   SettingsActions.ts（設定変更処理）
│   │   └── users/              #   RegisterFriendAction.ts（フレンド登録）
│   ├── components/
│   │   ├── common/             # 共通コンポーネント
│   │   │   ├── AuthButtons.tsx       # SignIn/SignOut ボタン
│   │   │   ├── Buttons.tsx           # 汎用ボタン
│   │   │   ├── CampusRegisterRequired.tsx  # キャンパス未登録時の案内
│   │   │   ├── LoginRequired.tsx     # 未ログイン時の案内
│   │   │   ├── NotificationList.tsx  # 通知一覧表示
│   │   │   ├── PaginationButtons.tsx # ページネーション
│   │   │   ├── RadioButton.tsx       # ラジオボタン
│   │   │   ├── RefreshButton.tsx     # リフレッシュボタン
│   │   │   ├── RocketInStLogos.tsx   # ロゴコンポーネント
│   │   │   ├── ThemeButton.tsx       # ダーク/ライトテーマ切替
│   │   │   ├── TimeTable.tsx         # 時間割表示
│   │   │   ├── UpdatedTime.tsx       # 更新時刻表示
│   │   │   ├── UserIcon.tsx          # ユーザーアイコン
│   │   │   └── UserList.tsx          # ユーザー一覧表示
│   │   ├── home/
│   │   │   └── CampusMap.tsx         # キャンパスマップ（部屋配置図）
│   │   ├── layout/
│   │   │   └── HeaderShowHideButton.tsx  # ヘッダー表示切替
│   │   └── search/
│   │       ├── RoomSearchSelector.tsx    # 部屋フィルター
│   │       └── SearchField.tsx           # 検索フィールド
│   ├── data/                   # 定数・マッピングデータ
│   │   ├── campus.ts / campus/ #   キャンパスデータ
│   │   ├── course.ts           #   コース定義（週1/3/5日）
│   │   ├── periods.ts          #   時限定義（1〜6限、休み時間、放課後）
│   │   ├── role.ts             #   ロール定義（Admin, Mentor, Moderator, User）
│   │   ├── schedules.ts        #   スケジュールデータ
│   │   ├── timetable.ts        #   時間割データ
│   │   └── weekdays.ts         #   曜日マッピング
│   ├── lib/                    # ユーティリティ・ヘルパー
│   │   ├── notification.tsx    #   通知コンテキスト (React Context)
│   │   ├── providers.tsx       #   NextAuth SessionProvider
│   │   ├── time.ts             #   JST 時刻ユーティリティ
│   │   ├── userdata.ts         #   ユーザーデータ取得関数 (Server)
│   │   └── users.ts            #   ユーザー表示ヘルパー
│   └── types/
│       └── next-auth.d.ts      # NextAuth 型拡張
│
├── prisma/
│   ├── schema.prisma           # Prisma スキーマ定義
│   ├── prisma.config.ts        # Prisma 設定
│   ├── seed.ts                 # シードスクリプト
│   ├── generated/prisma/       # Prisma 生成コード（`@prisma-gen/*`）
│   ├── migrations/             # マイグレーション履歴
│   └── seed/                   # シードデータ
│
├── public/                     # 静的アセット
│   ├── about/                  #   About ページ用画像
│   ├── brandlogo/              #   ブランドロゴ
│   ├── extraabout/             #   Extra About 用アセット
│   └── logo/                   #   ロゴ画像
│
├── auth.config.ts              # NextAuth 設定（Google OAuth, ドメイン制限）
├── middleware.ts                # 認証ミドルウェア（保護ルート）
├── prisma.ts                   # Prisma クライアント初期化
├── prisma.config.ts            # Prisma CLI 設定
├── next.config.ts              # Next.js 設定（CSP, セキュリティヘッダー）
├── tsconfig.json               # TypeScript 設定
├── eslint.config.mjs           # ESLint 設定
├── postcss.config.mjs          # PostCSS 設定
└── package.json                # 依存関係・スクリプト定義
```

---

## データベーススキーマ (Prisma)

### 主要モデル

| モデル                 | 説明                                                                           |
| ---------------------- | ------------------------------------------------------------------------------ |
| **User**               | ユーザー（生徒・メンター・管理者）。キャンパス所属、コース、フォロー関係を持つ |
| **Campus**             | キャンパス拠点。メインルーム、memberCount を持つ                               |
| **Room**               | キャンパス内の部屋。配置図 (roomPlan: JSON)、収容人数、表示順序                |
| **Lesson**             | 授業。タイトルと複数の LessonPeriod を持つ                                     |
| **LessonPeriod**       | 時限ごとの授業割当。授業・時限・部屋・受講生徒を関連付ける多対多中間テーブル   |
| **Period**             | 時限定義。曜日、開始/終了時刻、タグ (Lesson/Meeting/Event/Recess/Other)        |
| **TimeTable**          | 日付ごとの時間割データ (rawTable: JSON)                                        |
| **TimeTableFixReport** | 時間割修正レポート                                                             |

### Enum

| Enum          | 値                                                 |
| ------------- | -------------------------------------------------- |
| **Role**      | `User`, `Admin`, `Moderator`, `Mentor`             |
| **PeriodTag** | `Lesson`, `Meeting`, `Event`, `Other`, `Recess`    |
| **WeekDay**   | `Sunday` 〜 `Saturday`                             |
| **Course**    | `OncePerWeek`, `ThricePerWeek`, `FiveTimesPerWeek` |

### 認証関連モデル

`Account`, `Session`, `VerificationToken`, `Authenticator` — NextAuth.js + Prisma Adapter 標準モデル

---

## パスエイリアス

| エイリアス      | 実パス                        |
| --------------- | ----------------------------- |
| `@/*`           | プロジェクトルート (`./`)     |
| `@prisma-gen/*` | `./prisma/generated/prisma/*` |

---

## 開発コマンド

開発にはbunを使用していますが、コマンドの簡略化のために、[ni](https://github.com/antfu-collective/ni)というプロジェクトを使用しています。

```bash
# 開発サーバー起動 (Turbopack, ポート 4000)
nr dev

# ビルド (Prisma generate + db push + Next.js build)
nr build

# リント
nr lint

# tsc
nr tsc

# prisma generate
nlx prisma generate

# prisma migrate
nlx prisma migrate dev

#prisma seed
nlx prisma db seed
```

---

## 認証フロー

1. Google OAuth でサインイン
2. メールドメインが `@nnn.ed.jp` または `@nnn.ac.jp` であることを検証
3. JWT セッション戦略を使用
4. 未認証ユーザーは `/register`, `/search`, `/user`, `/settings` へアクセス不可（middleware で保護）
5. 新規ユーザーは `/register` へリダイレクトされ、キャンパス・コース・時間割を登録

---

## セキュリティ

- **CSP (Content Security Policy)** ヘッダー設定済み
- **HSTS**, **X-Frame-Options**, **Referrer-Policy** ヘッダー設定済み
- **mixed-content のブロック** と **HTTPS アップグレード**
- Server Actions でのバリデーションに **Zod** を使用

---

## コーディング規約

- **言語**: TypeScript (strict モード)
- **パッケージマネージャー**: bun
- **フォーマッター**: Prettier（import 自動整理 + Tailwind クラスソート）
- **リンター**: ESLint (`next/core-web-vitals` + `prettier`)
- **スタイリング**: Tailwind CSS v4 ユーティリティクラス
- **Server Components** をデフォルトとし、インタラクティブな要素のみ `"use client"` を使用
- **Server Actions** (`"use server"`) で フォーム送信・データ変更を処理
- **データ取得**: サーバーコンポーネント内で直接 Prisma クエリを実行
- **フォント**: Sawarabi Gothic（Google Fonts）
- **日本語UI**: ユーザー向けメッセージ・バリデーションエラーは日本語
