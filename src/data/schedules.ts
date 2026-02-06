import { LessonPeriodType } from "@/src/data/periods";
import type { WeekDay } from "@prisma-gen/browser";

export type DayColumn = {
  readonly [key in LessonPeriodType]: readonly string[];
};
export type WeekTable = { readonly [key in WeekDay]: DayColumn };

const sunday = {
  FirstPeriod: [] as const,
  SecondPeriod: [] as const,
  ThirdPeriod: [] as const,
  FourthPeriod: [] as const,
  FifthPeriod: [] as const,
  SixthPeriod: [] as const,
} satisfies DayColumn;

const monday = {
  FirstPeriod: ["サークル活動", "自主学習"] as const,
  SecondPeriod: ["サークル活動", "自主学習"] as const,
  ThirdPeriod: ["進路授業1,2年次", "進路授業3年次(進学)", "進路授業3年次(就職)"] as const,
  FourthPeriod: ["ITパスポート試験対策", "中国語入門(準4級)", "中国語入門(4級)", "プロジェクトNγ", "自主学習"] as const,
  FifthPeriod: ["ITパスポート試験対策", "中国語入門(準4級)", "中国語入門(4級)", "プロジェクトNγ", "自主学習"] as const,
  SixthPeriod: ["自主学習"] as const,
} satisfies DayColumn;

const tuesday = {
  FirstPeriod: ["プログラミング基礎", "エキスパートプログラム(プロダクト開発)", "自主学習"] as const,
  SecondPeriod: ["プログラミング基礎", "エキスパートプログラム(プロダクト開発)", "自主学習"] as const,
  ThirdPeriod: ["ディベート応用", "自主学習"] as const,
  FourthPeriod: ["学問入門講座", "リベラルアーツ応用", "自主学習"] as const,
  FifthPeriod: ["タンサク", "リベラルアーツ応用", "自主学習"] as const,
  SixthPeriod: ["サイエンスラボ", "自主学習"] as const,
} satisfies DayColumn;

const wednesday = {
  FirstPeriod: ["数学基礎", "プロジェクトNβ", "自主学習"] as const,
  SecondPeriod: ["数学基礎", "プロジェクトNβ", "自主学習"] as const,
  ThirdPeriod: ["ゼミナール", "自主学習"] as const,
  FourthPeriod: ["プロジェクトNα", "書類/面接対策講座", "自主学習"] as const,
  FifthPeriod: ["プロジェクトNα", "小論文/討論対策講座", "自主学習"] as const,
  SixthPeriod: ["リベラルアーツ基礎(文科)", "ものづくり活動", "自主学習"] as const,
} satisfies DayColumn;

const thursday = {
  FirstPeriod: ["クリエイティブ基礎", "クリエイティブ応用", "自主学習"] as const,
  SecondPeriod: ["クリエイティブ基礎", "クリエイティブ応用", "自主学習"] as const,
  ThirdPeriod: ["ゼミナール", "自主学習"] as const,
  FourthPeriod: ["英語コミュニケーション", "エキスパートプログラム(英語スピーチ&エッセイ)", "エキスパートプログラム(中国語検定3級対策)", "エキスパートプログラム(中国語スピーチ対策)", "大学受験化学", "自主学習"] as const,
  FifthPeriod: ["TAサポート教養数学", "エキスパートプログラム(英語スピーチ&エッセイ)", "エキスパートプログラム(中国語検定3級対策)", "エキスパートプログラム(中国語スピーチ対策)", "大学受験化学", "自主学習"] as const,
  SixthPeriod: ["コミュニティ活動", "自主学習"] as const,
} satisfies DayColumn;

const friday = {
  FirstPeriod: ["英検準2級対策(アーカイブ)", "英検3級対策", "大学受験数学", "プロジェクトNβ", "自主学習"] as const,
  SecondPeriod: ["英検準2級対策(アーカイブ)", "英検3級対策", "大学受験数学", "プロジェクトNβ", "自主学習"] as const,
  ThirdPeriod: ["ディベート入門", "自主学習"] as const,
  FourthPeriod: ["プロジェクトNα", "英検2級対策", "自主学習"] as const,
  FifthPeriod: ["プロジェクトNα", "英検2級対策", "自主学習"] as const,
  SixthPeriod: ["リベラルアーツ基礎(理科)", "ものづくり活動", "自主学習"] as const,
} satisfies DayColumn;

const saturday = {
  FirstPeriod: [] as const,
  SecondPeriod: [] as const,
  ThirdPeriod: [] as const,
  FourthPeriod: [] as const,
  FifthPeriod: [] as const,
  SixthPeriod: [] as const,
} satisfies DayColumn;

const table = {
  Sunday: sunday,
  Monday: monday,
  Tuesday: tuesday,
  Wednesday: wednesday,
  Thursday: thursday,
  Friday: friday,
  Saturday: saturday,
} satisfies WeekTable;

export default table;
