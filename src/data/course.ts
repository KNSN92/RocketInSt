import { Course, WeekDay } from "@prisma-gen/browser";

export const CourseDays = [1, 3, 5] as const;

export type CourseDay = (typeof CourseDays)[number];

export const DaysToCourseMap: { [day in CourseDay]: Course } =
  {
    1: Course.OncePerWeek,
    3: Course.ThricePerWeek,
    5: Course.FiveTimesPerWeek,
  } as const;

export const CourseToDaysMap: {
  [course in Course]: CourseDay;
} = {
  OncePerWeek: 1,
  ThricePerWeek: 3,
  FiveTimesPerWeek: 5,
};

export const DaysToWeekDayMap: { [day in CourseDay]: WeekDay[] } = {
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

export const WeekDayToCourseMap: {
  [weekday in WeekDay]: Course[];
} = {
  Sunday: [],
  Monday: ["ThricePerWeek", "FiveTimesPerWeek"],
  Tuesday: ["FiveTimesPerWeek"],
  Wednesday: ["ThricePerWeek", "FiveTimesPerWeek"],
  Thursday: ["OncePerWeek", "FiveTimesPerWeek"],
  Friday: ["ThricePerWeek", "FiveTimesPerWeek"],
  Saturday: [],
};

export const CourseJA: { [course in Course]: string } = {
  OncePerWeek: "週1日",
  ThricePerWeek: "週3日",
  FiveTimesPerWeek: "週5日",
};
