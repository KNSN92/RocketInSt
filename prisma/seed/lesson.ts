import type { WeekDay as WeekDayType } from "@/prisma/generated/prisma/client";
import {
  AfterSchoolPeriodJA,
  MeetingPeriodsJA,
  Periods,
  PeriodType,
  RecessPeriodsJA,
} from "@/src/data/periods";
import schedules from "@/src/data/schedules";
import { WeekDayArray } from "@/src/data/weekdays";
import { TransactionClient } from "@prisma-gen/internal/prismaNamespace";
import { LessonCreateManyInput } from "@prisma-gen/models";

type LessonRecords = Record<
  string,
  { weekday: WeekDayType; period: PeriodType }[]
>;

export default async function seed(prisma: TransactionClient) {
  await prisma.lesson.deleteMany();

  const lessons: LessonRecords = {};
  await WeekDayArray.forEach(async (weekday) => {
    await Periods.forEach(async (period) => {
      addLessonPeriods(lessons, weekday, period);
      addRecessPeriods(lessons, weekday, period);
      addMeetingPeriods(lessons, weekday, period);
      addAfterSchoolPeriods(lessons, weekday, period);
    });
  });

  await prisma.lesson.createMany({
    data: Object.keys(lessons).map<LessonCreateManyInput>((lesson) => ({
      title: lesson,
    })),
  });
}

function addLessonPeriods(
  lessons: LessonRecords,
  weekday: WeekDayType,
  period: PeriodType,
) {
  const lessonNames: string[] | undefined = schedules[weekday]?.[period]; // なんで型付かないの？
  if (!lessonNames) return;
  lessonNames.forEach(async (lessonName) => {
    if (!lessons[lessonName]) {
      lessons[lessonName] = [];
    }
    lessons[lessonName].push({ weekday, period });
  });
}

function addRecessPeriods(
  lessons: LessonRecords,
  weekday: WeekDayType,
  period: PeriodType,
) {
  Object.values(RecessPeriodsJA).forEach((recessName) => {
    if (!lessons[recessName]) {
      lessons[recessName] = [];
    }
    lessons[recessName].push({ weekday, period });
  });
}

function addMeetingPeriods(
  lessons: LessonRecords,
  weekday: WeekDayType,
  period: PeriodType,
) {
  Object.values(MeetingPeriodsJA).forEach((meetingName) => {
    if (!lessons[meetingName]) {
      lessons[meetingName] = [];
    }
    lessons[meetingName].push({ weekday, period });
  });
}

function addAfterSchoolPeriods(
  lessons: LessonRecords,
  weekday: WeekDayType,
  period: PeriodType,
) {
  if (!lessons[AfterSchoolPeriodJA]) {
    lessons[AfterSchoolPeriodJA] = [];
  }
  lessons[AfterSchoolPeriodJA].push({ weekday, period });
}
