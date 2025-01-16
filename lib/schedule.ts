export const ROW = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"]
export const COL = ["1限目", "2限目", "3限目", "4限目", "5限目", "6限目"]

type PeriodField = { title: string, value: string | number | readonly string[] | undefined }[]
type DayColumn = PeriodField[]
type WeekTable = DayColumn[]

const monday: DayColumn = [
    [{ title: "サークル活動", value: "" }, { title: "エキスパートプログラム", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "サークル活動", value: "" }, { title: "エキスパートプログラム", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "進路授業1,2年次", value: "" }, { title: "進路準備3年(進学)", value: "" }, { title: "進路準備3年(就職)", value: "" }],
    [{ title: "リベラルアーツ基礎(人文科学)", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "実践英語", value: "" }, { title: "プログラミングTA講座", value: "" }, { title: "クリエイティブ検定", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "一般教養(数学)", value: "" }, { title: "自主学習", value: "" }],
]

const tuesday: DayColumn = [
    [{ title: "リベラルアーツ応用", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "リベラルアーツ応用", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "キャンパス授業", value: "" }],
    [{ title: "総合型選抜対策(応用)", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "中国語初級", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "中国語初級", value: "" }, { title: "自主学習", value: "" }],
]

const wednesday: DayColumn = [
    [{ title: "プロジェクトNα", value: "" }, { title: "プロジェクトNβ", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "プロジェクトNα", value: "" }, { title: "プロジェクトNβ", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "総合型選抜対策(標準)", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "リベラルアーツ基礎(社会科学)", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "統計検定4級対策", value: "" }, { title: "中国語中級", value: "" }, { title: "中国語スピーキング講座", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "ゼミナール", value: "" }, { title: "中国語中級", value: "" }, { title: "中国語スピーキング講座", value: "" }, { title: "自主学習", value: "" }],
]

const thursday: DayColumn = [
    [{ title: "プロジェクトN応用", value: "" }, { title: "自習", value: "" }],
    [{ title: "プロジェクトN応用", value: "" }, { title: "自習", value: "" }],
    [{ title: "キャンパス授業", value: "" }],
    [{ title: "アート・デザイン", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "アート・デザイン", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "コミュニティ活動", value: "" }, { title: "自主学習", value: "" }],
]

const friday: DayColumn = [
    [{ title: "プロジェクトNα", value: "" }, { title: "プロジェクトNβ", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "プロジェクトNα", value: "" }, { title: "プロジェクトNβ", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "目標設定", value: "" }],
    [{ title: "リベラルアーツ基礎(自然科学)", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "英語検定2級対策", value: "" }, { title: "英語討論講座", value: "" }, { title: "自主学習", value: "" }],
    [{ title: "キャンパス授業", value: "" }],
]

export const table: WeekTable = [monday, tuesday, wednesday, thursday, friday]