import { WeekDay } from "@prisma/client";

export const NumToWeekDayMap: {[dayOfweek: number]: WeekDay | null} = {
    0: WeekDay.Sunday,
    1: WeekDay.Monday,
    2: WeekDay.Tuesday,
    3: WeekDay.Wednesday,
    4: WeekDay.Thursday,
    5: WeekDay.Friday,
    6: WeekDay.Saturday,
}

export const WeekDayArray: WeekDay[] = Object.keys(WeekDay) as Array<keyof typeof WeekDay>;

export const WeekDayJA: {[key in WeekDay]: string} = {
    "Sunday"   : "日曜日",
    "Monday"   : "月曜日",
    "Tuesday"  : "火曜日",
    "Wednesday": "水曜日",
    "Thursday" : "木曜日",
    "Friday"   : "金曜日",
    "Saturday" : "土曜日",
} as const
