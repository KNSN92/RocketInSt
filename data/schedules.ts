import { LessonPeriodType } from "@/data/periods";
import type { WeekDay } from "@prisma/client";

export type DayColumn = { readonly [key in LessonPeriodType]: readonly string[] };
export type WeekTable = { readonly [key in WeekDay]: DayColumn };

const sunday = {
    "FirstPeriod"  : [] as const,
    "SecondPeriod" : [] as const,
    "ThirdPeriod"  : [] as const,
    "FourthPeriod" : [] as const,
    "FifthPeriod"  : [] as const,
    "SixthPeriod"  : [] as const,
} satisfies DayColumn;

const monday = {
    "FirstPeriod"  : ["サークル活動", "エキスパートプログラム", "自主学習"] as const,
    "SecondPeriod" : ["サークル活動", "エキスパートプログラム", "自主学習"] as const,
    "ThirdPeriod"  : ["進路授業1,2年次", "進路準備3年(進学)", "進路準備3年(就職)"] as const,
    "FourthPeriod" : ["リベラルアーツ基礎(人文科学)", "自主学習"] as const,
    "FifthPeriod"  : ["実践英語", "プログラミングTA講座", "クリエイティブ検定", "自主学習"] as const,
    "SixthPeriod"  : ["一般教養(数学)", "自主学習"] as const,
} satisfies DayColumn;

const tuesday = {
    "FirstPeriod"  : ["リベラルアーツ応用", "自主学習"] as const,
    "SecondPeriod" : ["リベラルアーツ応用", "自主学習"] as const,
    "ThirdPeriod"  : ["キャンパス授業"] as const,
    "FourthPeriod" : ["総合型選抜対策(応用)", "自主学習"] as const,
    "FifthPeriod"  : ["中国語初級", "自主学習"] as const,
    "SixthPeriod"  : ["中国語初級", "自主学習"] as const,
} satisfies DayColumn;

const wednesday = {
    "FirstPeriod"  : ["プロジェクトNα", "プロジェクトNβ", "自主学習"] as const,
    "SecondPeriod" : ["プロジェクトNα", "プロジェクトNβ", "自主学習"] as const,
    "ThirdPeriod"  : ["総合型選抜対策(標準)", "自主学習"] as const,
    "FourthPeriod" : ["リベラルアーツ基礎(社会科学)", "自主学習"] as const,
    "FifthPeriod"  : ["統計検定4級対策", "中国語中級", "中国語スピーキング講座", "自主学習"] as const,
    "SixthPeriod"  : ["ゼミナール", "中国語中級", "中国語スピーキング講座", "自主学習"] as const,
} satisfies DayColumn;

const thursday = {
    "FirstPeriod"  : ["プロジェクトN応用", "自主学習"] as const,
    "SecondPeriod" : ["プロジェクトN応用", "自主学習"] as const,
    "ThirdPeriod"  : ["キャンパス授業", "自主学習"] as const,
    "FourthPeriod" : ["アート・デザイン", "自主学習"] as const,
    "FifthPeriod"  : ["アート・デザイン", "自主学習"] as const,
    "SixthPeriod"  : ["コミュニティ活動", "自主学習"] as const,
} satisfies DayColumn;

const friday = {
    "FirstPeriod"  : ["プロジェクトNα", "プロジェクトNβ", "自主学習"] as const,
    "SecondPeriod" : ["プロジェクトNα", "プロジェクトNβ", "自主学習"] as const,
    "ThirdPeriod"  : ["目標設定"] as const,
    "FourthPeriod" : ["リベラルアーツ基礎(自然科学)", "自主学習"] as const,
    "FifthPeriod"  : ["英語検定2級対策", "英語討論講座", "自主学習"] as const,
    "SixthPeriod"  : ["キャンパス授業"] as const,
} satisfies DayColumn;

const saturday = {
    "FirstPeriod"  : [] as const,
    "SecondPeriod" : [] as const,
    "ThirdPeriod"  : [] as const,
    "FourthPeriod" : [] as const,
    "FifthPeriod"  : [] as const,
    "SixthPeriod"  : [] as const,
} satisfies DayColumn;

const table = {
    "Sunday"    : sunday,
    "Monday"    : monday,
    "Tuesday"   : tuesday,
    "Wednesday" : wednesday,
    "Thursday"  : thursday,
    "Friday"    : friday,
    "Saturday"  : saturday
} satisfies WeekTable;

export default table;
