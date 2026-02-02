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
} from "@/data/periods";
import { WeekDayArray } from "@/data/weekdays";
import { Prisma, PrismaClient } from "@/prisma/generated/prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/client";

export default async function seed(prisma: Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">) {
  await prisma.period.deleteMany();

  await LessonPeriods.forEach(async (lessonPeriod) => {
    const periodTime = LessonPeriodTimes[lessonPeriod];
    const periodTemp: Omit<Prisma.PeriodCreateManyInput, "weekday"> = {
      name: LessonPeriodsJA[lessonPeriod],
      innername: lessonPeriod,
      beginTime: periodTime.start.hours * 60 + periodTime.start.minutes,
      endTime: periodTime.end.hours * 60 + periodTime.end.minutes,
      tag: "Lesson",
    };
    await prisma.period.createMany({
      data: WeekDayArray.map((weekday) => ({
        ...periodTemp,
        weekday: weekday,
      })),
    });
  });

  await RecessPeriods.forEach(async (recessPeriod) => {
    const periodTime = RecessPeriodTimes[recessPeriod];
    const periodTemp: Omit<Prisma.PeriodCreateManyInput, "weekday"> = {
      name: RecessPeriodsJA[recessPeriod],
      innername: recessPeriod,
      beginTime: periodTime.start.hours * 60 + periodTime.start.minutes,
      endTime: periodTime.end.hours * 60 + periodTime.end.minutes,
      tag: "Recess",
    };
    await prisma.period.createMany({
      data: WeekDayArray.map((weekday) => ({
        ...periodTemp,
        weekday: weekday,
      })),
    });
  });

  await MeetingPeriods.forEach(async (meetingPeriod) => {
    const periodTime = MeetingPeriodTimes[meetingPeriod];
    const periodTemp: Omit<Prisma.PeriodCreateManyInput, "weekday"> = {
      name: MeetingPeriodsJA[meetingPeriod],
      innername: meetingPeriod,
      beginTime: periodTime.start.hours * 60 + periodTime.start.minutes,
      endTime: periodTime.end.hours * 60 + periodTime.end.minutes,
      tag: "Meeting",
    };
    await prisma.period.createMany({
      data: WeekDayArray.map((weekday) => ({
        ...periodTemp,
        weekday: weekday,
      })),
    });
  });

  const afterschoolPeriodTemp: Omit<Prisma.PeriodCreateManyInput, "weekday"> = {
    name: AfterSchoolPeriodJA,
    innername: AfterSchoolPeriod,
    beginTime:
      AfterSchoolPeriodTime.start.hours * 60 +
      AfterSchoolPeriodTime.start.minutes,
    endTime:
      AfterSchoolPeriodTime.end.hours * 60 + AfterSchoolPeriodTime.end.minutes,
    tag: "Other",
  };
  await prisma.period.createMany({
    data: WeekDayArray.map((weekday) => ({
      ...afterschoolPeriodTemp,
      weekday: weekday,
    })),
  });
}
