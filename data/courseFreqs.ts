import { CourseFrequency, DayOfWeek } from "@prisma/client";

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

export const CourseFreqToDayOfWeekMap: {[day in CourseFreqDay]: DayOfWeek[]} = {
  1: [DayOfWeek.Thursday],
  3: [DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday],
  5: [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
  ],
};

