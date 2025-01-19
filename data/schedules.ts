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
} as const

type PeriodField = string[]
type DayColumn = {[key in LessonPeriodType]: PeriodField}
type WeekTable = {[key in DayOfWeekType]: DayColumn}

const monday: DayColumn = {
    "FirstPeriod": ["サークル活動", "エキスパートプログラム", "自主学習"],
    "SecondPeriod": ["サークル活動", "エキスパートプログラム", "自主学習"],
    "ThirdPeriod": ["進路授業1,2年次", "進路準備3年(進学)", "進路準備3年(就職)"],
    "FourthPeriod": ["リベラルアーツ基礎(人文科学)", "自主学習"],
    "FifthPeriod": ["実践英語", "プログラミングTA講座", "クリエイティブ検定", "自主学習"],
    "SixthPeriod": ["一般教養(数学)", "自主学習"],
} as const

const tuesday: DayColumn = {
    "FirstPeriod": ["リベラルアーツ応用", "自主学習"],
    "SecondPeriod": ["リベラルアーツ応用", "自主学習"],
    "ThirdPeriod": ["キャンパス授業"],
    "FourthPeriod": ["総合型選抜対策(応用)", "自主学習"],
    "FifthPeriod": ["中国語初級", "自主学習"],
    "SixthPeriod": ["中国語初級", "自主学習"],
} as const

const wednesday: DayColumn = {
    "FirstPeriod": ["プロジェクトNα", "プロジェクトNβ", "自主学習"],
    "SecondPeriod": ["プロジェクトNα", "プロジェクトNβ", "自主学習"],
    "ThirdPeriod": ["総合型選抜対策(標準)", "自主学習"],
    "FourthPeriod": ["リベラルアーツ基礎(社会科学)", "自主学習"],
    "FifthPeriod": ["統計検定4級対策", "中国語中級", "中国語スピーキング講座", "自主学習"],
    "SixthPeriod": ["ゼミナール", "中国語中級", "中国語スピーキング講座", "自主学習"],
} as const

const thursday: DayColumn = {
    "FirstPeriod": ["プロジェクトN応用", "自習"],
    "SecondPeriod": ["プロジェクトN応用", "自習"],
    "ThirdPeriod": ["キャンパス授業"],
    "FourthPeriod": ["アート・デザイン", "自主学習"],
    "FifthPeriod": ["アート・デザイン", "自主学習"],
    "SixthPeriod": ["コミュニティ活動", "自主学習"],
} as const

const friday: DayColumn = {
    "FirstPeriod": ["プロジェクトNα", "プロジェクトNβ", "自主学習"],
    "SecondPeriod": ["プロジェクトNα", "プロジェクトNβ", "自主学習"],
    "ThirdPeriod": ["目標設定"],
    "FourthPeriod": ["リベラルアーツ基礎(自然科学)", "自主学習"],
    "FifthPeriod": ["英語検定2級対策", "英語討論講座", "自主学習"],
    "SixthPeriod": ["キャンパス授業"],
} as const

const table: WeekTable = {
    "Monday": monday,
    "Tuesday": tuesday,
    "Wednesday": wednesday,
    "Thursday": thursday,
    "Friday": friday
} as const

export default table;
