import type { LessonPeriod } from "@prisma/client";

type Time = { hours: number, minutes: number }

const courseFreqTimes: {[key in LessonPeriod]: { start: Time, end: Time }} = {
    FirstPeriod:  { start: { hours:  9, minutes: 45 }, end: { hours: 10, minutes: 35 } },
    SecondPeriod: { start: { hours: 10, minutes: 45 }, end: { hours: 11, minutes: 35 } },
    ThirdPeriod:  { start: { hours: 11, minutes: 45 }, end: { hours: 12, minutes: 35 } },
    FourthPeriod: { start: { hours: 13, minutes: 15 }, end: { hours: 14, minutes:  5 } },
    FifthPeriod:  { start: { hours: 14, minutes: 15 }, end: { hours: 15, minutes:  5 } },
    SixthPeriod:  { start: { hours: 15, minutes: 15 }, end: { hours: 16, minutes:  5 } },
    AfterSchool:  { start: { hours: 16, minutes: 15 }, end: { hours: 17, minutes: 30 } },
}

export default courseFreqTimes;
