import {
  AfterSchoolPeriod,
  AfterSchoolPeriodJA,
  LessonPeriods,
  LessonToRecessPeriodMap,
  MeetingPeriods,
  MeetingPeriodsJA,
  RecessPeriodsJA,
  RecessPeriodType,
} from "@/data/periods";
import schedules from "@/data/schedules";
import { WeekDayArray } from "@/data/weekdays";
import { prisma } from "@/prisma";
import type { Prisma, WeekDay as WeekDayType } from "@prisma/client";

export default async function seed() {
  await prisma.lesson.deleteMany();

  await WeekDayArray.forEach(async (weekday) => {
    await LessonPeriods.forEach(async (lessonPeriod) => {
      const lessonNames = [...schedules[weekday as WeekDayType][lessonPeriod]];
      await lessonNames.forEach(async (lessonName) => {
        const periods: Prisma.PeriodWhereUniqueInput[] = [
          {
            innername_weekday: {
              innername: lessonPeriod,
              weekday: weekday,
            },
          },
        ];
        if (LessonToRecessPeriodMap[lessonPeriod])
          periods.push({
            innername_weekday: {
              innername: LessonToRecessPeriodMap[lessonPeriod],
              weekday: weekday,
            },
          });
        await prisma.lesson.create({
          data: {
            title: lessonName,
            period: {
              connect: periods,
            },
          },
        });
      });
    });
    const noonRecessPeriod: RecessPeriodType = "NoonRecess";
    const noonRecessName = RecessPeriodsJA[noonRecessPeriod];
    await prisma.lesson.create({
      data: {
        title: noonRecessName,
        period: {
          connect: {
            innername_weekday: {
              innername: noonRecessPeriod,
              weekday: weekday,
            },
          },
        },
      },
    });
    await MeetingPeriods.forEach(async (meetingPeriod) => {
      const meetingName = MeetingPeriodsJA[meetingPeriod];
      await prisma.lesson.create({
        data: {
          title: meetingName,
          period: {
            connect: {
              innername_weekday: {
                innername: meetingPeriod,
                weekday: weekday,
              },
            },
          },
        },
      });
    });
    await prisma.lesson.create({
      data: {
        title: AfterSchoolPeriodJA,
        period: {
          connect: {
            innername_weekday: {
              innername: AfterSchoolPeriod,
              weekday: weekday,
            },
          },
        },
      },
    });
  });
}
