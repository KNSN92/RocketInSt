import { CourseFrequency, WeekDay } from "@prisma/client";

export const CourseFreqDays = [1, 3, 5] as const

export type CourseFreqDay = typeof CourseFreqDays[number];


export const DaysToCourseFreqMap: {[day in CourseFreqDay]: CourseFrequency} = {
  1: CourseFrequency.OncePerWeek,
  3: CourseFrequency.ThricePerWeek,
  5: CourseFrequency.FiveTimesPerWeek,
} as const;

export const CourseFreqToDaysMap: {[courseFreq in CourseFrequency]: CourseFreqDay} = {
    OncePerWeek: 1,
    ThricePerWeek: 3,
    FiveTimesPerWeek: 5
}

export const DaysToWeekDayMap: {[day in CourseFreqDay]: WeekDay[]} = {
  1: [WeekDay.Thursday],
  3: [WeekDay.Monday, WeekDay.Wednesday, WeekDay.Friday],
  5: [
    WeekDay.Monday,
    WeekDay.Tuesday,
    WeekDay.Wednesday,
    WeekDay.Thursday,
    WeekDay.Friday,
  ],
};

export const WeekDayToCourseFreqMap: {[dayOfWeek in WeekDay]: CourseFrequency[]} = {
  Sunday: [],
  Monday: [ "ThricePerWeek", "FiveTimesPerWeek" ],
  Tuesday: [ "FiveTimesPerWeek" ],
  Wednesday: [ "ThricePerWeek", "FiveTimesPerWeek" ],
  Thursday: [ "OncePerWeek", "FiveTimesPerWeek" ],
  Friday: [ "ThricePerWeek", "FiveTimesPerWeek" ],
  Saturday: [],
}
