import { LessonPeriod, DayOfWeek } from "@prisma/client";
import type { LessonPeriod as LessonPeriodType, DayOfWeek as DayOfWeekType } from "@prisma/client";

export const COL: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const
export const ROW: LessonPeriod[] = ["FirstPeriod", "SecondPeriod", "ThirdPeriod", "FourthPeriod", "FifthPeriod", "SixthPeriod"] as const

export const COL_LEN = Object.keys(DayOfWeek).length
export const ROW_LEN = Object.keys(LessonPeriod).length

export const COL_JA: {[key in DayOfWeekType]: string} = {
    "Monday": "月曜日",
    "Tuesday": "火曜日",
    "Wednesday": "水曜日",
    "Thursday": "木曜日",
    "Friday": "金曜日",
} as const

export const ROW_JA: {[key in LessonPeriodType]: string} = {
    "FirstPeriod": "1限目",
    "SecondPeriod": "2限目",
    "ThirdPeriod": "3限目",
    "FourthPeriod": "4限目",
    "FifthPeriod": "5限目",
    "SixthPeriod": "6限目",
} as const;

type DayColumn = {
    readonly [key in LessonPeriodType]: readonly string[];
  };
  type WeekTable = {
    readonly [key in DayOfWeekType]: DayColumn;
  };

const monday: DayColumn = {
    "FirstPeriod": ["サークル活動", "エキスパートプログラム", "自主学習"] as const,
    "SecondPeriod": ["サークル活動", "エキスパートプログラム", "自主学習"] as const,
    "ThirdPeriod": ["進路授業1,2年次", "進路準備3年(進学)", "進路準備3年(就職)"] as const,
    "FourthPeriod": ["リベラルアーツ基礎(人文科学)", "自主学習"] as const,
    "FifthPeriod": ["実践英語", "プログラミングTA講座", "クリエイティブ検定", "自主学習"] as const,
    "SixthPeriod": ["一般教養(数学)", "自主学習"] as const,
} satisfies DayColumn;

const tuesday: DayColumn = {
    "FirstPeriod": ["リベラルアーツ応用", "自主学習"] as const,
    "SecondPeriod": ["リベラルアーツ応用", "自主学習"] as const,
    "ThirdPeriod": ["キャンパス授業"] as const,
    "FourthPeriod": ["総合型選抜対策(応用)", "自主学習"] as const,
    "FifthPeriod": ["中国語初級", "自主学習"] as const,
    "SixthPeriod": ["中国語初級", "自主学習"] as const,
} satisfies DayColumn;

const wednesday: DayColumn = {
    "FirstPeriod": ["プロジェクトNα", "プロジェクトNβ", "自主学習"] as const,
    "SecondPeriod": ["プロジェクトNα", "プロジェクトNβ", "自主学習"] as const,
    "ThirdPeriod": ["総合型選抜対策(標準)", "自主学習"] as const,
    "FourthPeriod": ["リベラルアーツ基礎(社会科学)", "自主学習"] as const,
    "FifthPeriod": ["統計検定4級対策", "中国語中級", "中国語スピーキング講座", "自主学習"] as const,
    "SixthPeriod": ["ゼミナール", "中国語中級", "中国語スピーキング講座", "自主学習"] as const,
} satisfies DayColumn;

const thursday: DayColumn = {
    "FirstPeriod": ["プロジェクトN応用", "自習"] as const,
    "SecondPeriod": ["プロジェクトN応用", "自習"] as const,
    "ThirdPeriod": ["キャンパス授業"] as const,
    "FourthPeriod": ["アート・デザイン", "自主学習"] as const,
    "FifthPeriod": ["アート・デザイン", "自主学習"] as const,
    "SixthPeriod": ["コミュニティ活動", "自主学習"] as const,
} satisfies DayColumn;

const friday = {
    "FirstPeriod": ["プロジェクトNα", "プロジェクトNβ", "自主学習"] as const,
    "SecondPeriod": ["プロジェクトNα", "プロジェクトNβ", "自主学習"] as const,
    "ThirdPeriod": ["目標設定"] as const,
    "FourthPeriod": ["リベラルアーツ基礎(自然科学)", "自主学習"] as const,
    "FifthPeriod": ["英語検定2級対策", "英語討論講座", "自主学習"] as const,
    "SixthPeriod": ["キャンパス授業"] as const,
} satisfies DayColumn;

const table = {
    "Monday": monday,
    "Tuesday": tuesday,
    "Wednesday": wednesday,
    "Thursday": thursday,
    "Friday": friday
} satisfies WeekTable;

export default table;
