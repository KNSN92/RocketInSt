import { PeriodTag, Prisma, WeekDay } from "@/prisma/generated/prisma/client";
import {
  AfterSchoolPeriod,
  AfterSchoolPeriodJA,
  AfterSchoolPeriodTime,
  LessonPeriods,
  LessonPeriodsJA,
  LessonPeriodTimes,
  MeetingPeriods,
  MeetingPeriodsJA,
  MeetingPeriodTimes,
  RecessPeriods,
  RecessPeriodsJA,
  RecessPeriodTimes,
} from "@/src/data/periods";
import { WeekDayArray } from "@/src/data/weekdays";
import { TransactionClient } from "@prisma-gen/internal/prismaNamespace";

interface Period {
  name: string;
  innername: string;
  weekday: WeekDay;
  beginTime: number;
  endTime: number;
  tag: PeriodTag;
}

export default async function seed(prisma: TransactionClient) {
  await prisma.period.deleteMany();

  const periods: Period[] = [];
  WeekDayArray.forEach((weekday) => {
    addLessonPeriods(periods, weekday);
    addRecessPeriods(periods, weekday);
    addMeetingPeriods(periods, weekday);
    addAfterSchoolPeriods(periods, weekday);
  });

  await prisma.period.createMany({
    data: periods,
  });
}

function addLessonPeriods(periods: Period[], weekday: WeekDay) {
  LessonPeriods.forEach((lessonPeriod) => {
    const periodTime = LessonPeriodTimes[lessonPeriod];
    const periodTemp: Omit<Prisma.PeriodCreateManyInput, "weekday"> = {
      name: LessonPeriodsJA[lessonPeriod],
      innername: lessonPeriod,
      beginTime: periodTime.start.hours * 60 + periodTime.start.minutes,
      endTime: periodTime.end.hours * 60 + periodTime.end.minutes,
      tag: "Lesson",
    };
    periods.push({ ...periodTemp, weekday });
  });
}

function addRecessPeriods(periods: Period[], weekday: WeekDay) {
  RecessPeriods.forEach(async (recessPeriod) => {
    const periodTime = RecessPeriodTimes[recessPeriod];
    const periodTemp: Omit<Prisma.PeriodCreateManyInput, "weekday"> = {
      name: RecessPeriodsJA[recessPeriod],
      innername: recessPeriod,
      beginTime: periodTime.start.hours * 60 + periodTime.start.minutes,
      endTime: periodTime.end.hours * 60 + periodTime.end.minutes,
      tag: "Recess",
    };
    periods.push({ ...periodTemp, weekday });
  });
}

function addMeetingPeriods(periods: Period[], weekday: WeekDay) {
  MeetingPeriods.forEach(async (meetingPeriod) => {
    const periodTime = MeetingPeriodTimes[meetingPeriod];
    const periodTemp: Omit<Prisma.PeriodCreateManyInput, "weekday"> = {
      name: MeetingPeriodsJA[meetingPeriod],
      innername: meetingPeriod,
      beginTime: periodTime.start.hours * 60 + periodTime.start.minutes,
      endTime: periodTime.end.hours * 60 + periodTime.end.minutes,
      tag: "Meeting",
    };
    periods.push({ ...periodTemp, weekday });
  });
}

function addAfterSchoolPeriods(periods: Period[], weekday: WeekDay) {
  const periodTemp: Omit<Prisma.PeriodCreateManyInput, "weekday"> = {
    name: AfterSchoolPeriodJA,
    innername: AfterSchoolPeriod,
    beginTime:
      AfterSchoolPeriodTime.start.hours * 60 +
      AfterSchoolPeriodTime.start.minutes,
    endTime:
      AfterSchoolPeriodTime.end.hours * 60 + AfterSchoolPeriodTime.end.minutes,
    tag: "Other",
  };
  periods.push({ ...periodTemp, weekday });
}
