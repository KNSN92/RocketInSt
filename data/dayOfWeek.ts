import { DayOfWeek } from "@prisma/client";

export const NumToDayOfWeekMap: {[dayOfweek: number]: DayOfWeek} = {
    1: DayOfWeek.Monday,
    2: DayOfWeek.Tuesday,
    3: DayOfWeek.Wednesday,
    4: DayOfWeek.Thursday,
    5: DayOfWeek.Friday,
}