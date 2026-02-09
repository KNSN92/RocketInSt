import { TimeBetween } from "@/src/lib/time";

export const LessonPeriods = [
  "FirstPeriod",
  "SecondPeriod",
  "ThirdPeriod",
  "FourthPeriod",
  "FifthPeriod",
  "SixthPeriod",
] as const;

export type LessonPeriodType = (typeof LessonPeriods)[number];

export const LessonPeriodsJA: { [key in LessonPeriodType]: string } = {
  FirstPeriod: "一限目",
  SecondPeriod: "二限目",
  ThirdPeriod: "三限目",
  FourthPeriod: "四限目",
  FifthPeriod: "五限目",
  SixthPeriod: "六限目",
} as const;

export const LessonPeriodTimes: { [key in LessonPeriodType]: TimeBetween } = {
  FirstPeriod: {
    start: { hours: 9, minutes: 45 },
    end: { hours: 10, minutes: 35 },
  },
  SecondPeriod: {
    start: { hours: 10, minutes: 45 },
    end: { hours: 11, minutes: 35 },
  },
  ThirdPeriod: {
    start: { hours: 11, minutes: 45 },
    end: { hours: 12, minutes: 35 },
  },
  FourthPeriod: {
    start: { hours: 13, minutes: 15 },
    end: { hours: 14, minutes: 5 },
  },
  FifthPeriod: {
    start: { hours: 14, minutes: 15 },
    end: { hours: 15, minutes: 5 },
  },
  SixthPeriod: {
    start: { hours: 15, minutes: 15 },
    end: { hours: 16, minutes: 5 },
  },
} as const;

export const RecessPeriods = [
  "Morning",
  "FirstSecondRecess",
  "SecondThirdRecess",
  "NoonRecess",
  "FourthFifthRecess",
  "FifthSixthRecess",
] as const;

export type RecessPeriodType = (typeof RecessPeriods)[number];

export const RecessPeriodsJA: { [key in RecessPeriodType]: string } = {
  Morning: "朝",
  FirstSecondRecess: "休み時間",
  SecondThirdRecess: "休み時間",
  NoonRecess: "昼休み",
  FourthFifthRecess: "休み時間",
  FifthSixthRecess: "休み時間",
} as const;

export const RecessPeriodTimes: { [key in RecessPeriodType]: TimeBetween } = {
  Morning: {
    start: { hours: 9, minutes: 0 },
    end: { hours: 9, minutes: 30 },
  },
  FirstSecondRecess: {
    start: { hours: 10, minutes: 35 },
    end: { hours: 10, minutes: 45 },
  },
  SecondThirdRecess: {
    start: { hours: 11, minutes: 35 },
    end: { hours: 11, minutes: 45 },
  },
  NoonRecess: {
    start: { hours: 12, minutes: 35 },
    end: { hours: 13, minutes: 15 },
  },
  FourthFifthRecess: {
    start: { hours: 14, minutes: 5 },
    end: { hours: 14, minutes: 15 },
  },
  FifthSixthRecess: {
    start: { hours: 15, minutes: 5 },
    end: { hours: 15, minutes: 15 },
  },
} as const;

export const LessonToRecessPeriodMap: {
  [key in LessonPeriodType]: RecessPeriodType | null;
} = {
  FirstPeriod: "FirstSecondRecess",
  SecondPeriod: "SecondThirdRecess",
  ThirdPeriod: null,
  FourthPeriod: "FourthFifthRecess",
  FifthPeriod: "FifthSixthRecess",
  SixthPeriod: null,
} as const;

export const MeetingPeriods = ["MorningMeeting", "ClosingMeeting"] as const;

export type MeetingPeriodType = (typeof MeetingPeriods)[number];

export const MeetingPeriodsJA: { [key in MeetingPeriodType]: string } = {
  MorningMeeting: "朝礼",
  ClosingMeeting: "終礼",
} as const;

export const MeetingPeriodTimes: { [key in MeetingPeriodType]: TimeBetween } = {
  MorningMeeting: {
    start: { hours: 9, minutes: 30 },
    end: { hours: 9, minutes: 45 },
  },
  ClosingMeeting: {
    start: { hours: 16, minutes: 5 },
    end: { hours: 16, minutes: 15 },
  },
} as const;

export const AfterSchoolPeriod = "AfterSchool" as const;
export type AfterSchoolPeriodType = typeof AfterSchoolPeriod;
export const AfterSchoolPeriodJA = "放課後";
export const AfterSchoolPeriodTime: TimeBetween = {
  start: { hours: 16, minutes: 15 },
  end: { hours: 17, minutes: 30 },
} as const;

export type PeriodType =
  | LessonPeriodType
  | RecessPeriodType
  | MeetingPeriodType
  | AfterSchoolPeriodType;

export const PeriodsJA = {
  ...LessonPeriodsJA,
  ...RecessPeriodsJA,
  ...MeetingPeriodsJA,
  AfterSchool: AfterSchoolPeriodJA,
} as const;

export const PeriodTimes = {
  ...LessonPeriodTimes,
  ...RecessPeriodTimes,
  ...MeetingPeriodTimes,
  AfterSchool: AfterSchoolPeriodTime,
} as const;