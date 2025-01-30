import { DayOfWeek } from "@prisma/client";

export const NumToDayOfWeekMap: {[dayOfweek: number]: DayOfWeek | null} = {
    0: null,
    1: DayOfWeek.Monday,
    2: DayOfWeek.Tuesday,
    3: DayOfWeek.Wednesday,
    4: DayOfWeek.Thursday,
    5: DayOfWeek.Friday,
    6: null,
}