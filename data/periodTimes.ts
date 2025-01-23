import type { LessonPeriod } from "@prisma/client";

type time = { hours: number, minutes: number }

const periods: {[key in LessonPeriod]: { start: time, end: time }} = {
    FirstPeriod:  { start: { hours:  9, minutes: 45 }, end: { hours: 10, minutes: 35 } },
    SecondPeriod: { start: { hours: 10, minutes: 45 }, end: { hours: 11, minutes: 35 } },
    ThirdPeriod:  { start: { hours: 11, minutes: 45 }, end: { hours: 12, minutes: 35 } },
    FourthPeriod: { start: { hours: 13, minutes: 15 }, end: { hours: 14, minutes:  5 } },
    FifthPeriod:  { start: { hours: 14, minutes: 15 }, end: { hours: 15, minutes:  5 } },
    SixthPeriod:  { start: { hours: 15, minutes: 15 }, end: { hours: 16, minutes:  5 } },
} as const

export const AfterSchool = { start: { hours: 16, minutes: 15 }, end: { hours: 17, minutes: 30 } } as const

export default periods;

export function isTimeInRange(time: time, timeRange: { start: time, end: time}) {
    const totalMinutes = time.hours * 60 + time.minutes;
    const startMinutes = timeRange.start.hours * 60 + timeRange.start.minutes;
    const endMinutes = timeRange.end.hours * 60 + timeRange.end.minutes;
    return startMinutes <= totalMinutes && totalMinutes <= endMinutes;
}
