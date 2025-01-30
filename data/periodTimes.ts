import { Time, TimeBetween } from "@/lib/time";
import type { LessonPeriod } from "@prisma/client";

export type ExtraLessonPeriod = "MorningMeeting" | "ClosingMeeting" | "AfterSchool"

export const ExtraLessonPeriodJA: {[key in ExtraLessonPeriod]: string} = {
    AfterSchool: "放課後",
    MorningMeeting: "朝礼",
    ClosingMeeting: "終礼"
}

//resessはmainの時間の前の休み時間
const periods: {[key in LessonPeriod]: {recess?: TimeBetween, main: TimeBetween}} = {
    FirstPeriod:  { recess: undefined,                                                              main: { start: { hours:  9, minutes: 45 }, end: { hours: 10, minutes: 34 } } },
    SecondPeriod: { recess: { start: { hours: 10, minutes: 35 }, end: { hours: 10, minutes: 44 } }, main: { start: { hours: 10, minutes: 45 }, end: { hours: 11, minutes: 34 } } },
    ThirdPeriod:  { recess: { start: { hours: 11, minutes: 35 }, end: { hours: 11, minutes: 44 } }, main: { start: { hours: 11, minutes: 45 }, end: { hours: 12, minutes: 34 } } },
    FourthPeriod: { recess: { start: { hours: 12, minutes: 35 }, end: { hours: 13, minutes: 14 } }, main: { start: { hours: 13, minutes: 15 }, end: { hours: 14, minutes:  4 } } },
    FifthPeriod:  { recess: { start: { hours: 14, minutes:  5 }, end: { hours: 14, minutes: 14 } }, main: { start: { hours: 14, minutes: 15 }, end: { hours: 15, minutes:  4 } } },
    SixthPeriod:  { recess: { start: { hours: 15, minutes:  5 }, end: { hours: 15, minutes: 14 } }, main: { start: { hours: 15, minutes: 15 }, end: { hours: 16, minutes:  4 } } },
} as const

export const MorningMeeting:  TimeBetween = { start: { hours: 9, minutes:  30 }, end: { hours: 9, minutes: 44 } } as const
export const ClosisngMeeting: TimeBetween = { start: { hours: 16, minutes:  5 }, end: { hours: 16, minutes: 14 } } as const
export const AfterSchool:     TimeBetween = { start: { hours: 16, minutes: 15 }, end: { hours: 17, minutes: 30 } } as const

export default periods;

export function isTimeInRange(time: Time, timeRange: TimeBetween) {
    const totalMinutes = time.hours * 60 + time.minutes;
    const startMinutes = timeRange.start.hours * 60 + timeRange.start.minutes;
    const tmpEndMinutes = timeRange.end.hours * 60 + timeRange.end.minutes;
    const endMinutes = startMinutes <= tmpEndMinutes ? tmpEndMinutes : tmpEndMinutes + 60 * 24
    return startMinutes <= totalMinutes && totalMinutes <= endMinutes;
}

export function getPeriodFromTime(time: Time): { period: LessonPeriod, isRecess: boolean} | null {
    const find = Object.entries(periods).find(([, timeBetween]) => (
        isTimeInRange(time, timeBetween.main) || (timeBetween.recess && isTimeInRange(time, timeBetween.recess))
    ))
    if(!find) return null;
    const [period, { recess }] = find;
    if(!recess) return { period: period as LessonPeriod, isRecess: false };
    const isRecess = recess && isTimeInRange(time, recess)
    return { period: period as LessonPeriod, isRecess: isRecess };
}

export function getExtraPeriodFromTime(time: Time): { period: LessonPeriod, isRecess: boolean} | ExtraLessonPeriod | null {
    const period = getPeriodFromTime(time);
    if(period) return period;
    if(isTimeInAfterSchool(time)) return "AfterSchool";
    if(isTimeInMorningMeeting(time)) return "MorningMeeting";
    if(isTimeInClosisngMeeting(time)) return "ClosingMeeting";
    return null;
}

export function isTimeInAfterSchool(time: Time): boolean {
    return isTimeInRange(time, AfterSchool);
} 

export function isTimeInMorningMeeting(time: Time): boolean {
    return isTimeInRange(time, MorningMeeting);
}

export function isTimeInClosisngMeeting(time: Time): boolean {
    return isTimeInRange(time, ClosisngMeeting);
} 