import {
  AfterSchoolPeriod,
  AfterSchoolPeriodJA,
  LessonPeriods,
  LessonPeriodType,
  MeetingPeriods,
  MeetingPeriodsJA,
  PeriodType,
  RecessPeriods,
  RecessPeriodsJA,
} from "@/src/data/periods";
import table from "@/src/data/schedules";
import { WeekDayArray } from "@/src/data/weekdays";
import { WeekDay } from "@prisma-gen/enums";
import { TransactionClient } from "@prisma-gen/internal/prismaNamespace";

export default async function seed(prisma: TransactionClient) {
  await prisma.lessonPeriod.deleteMany();

  WeekDayArray.forEach((weekday) => {
    LessonPeriods.forEach((period) => {
      createLessonLessonPeriods(prisma, weekday, period);
    });
    RecessPeriods.forEach((period) => {
      createLessonPeriod(prisma, weekday, period, RecessPeriodsJA[period]);
    });
    MeetingPeriods.forEach((period) => {
      createLessonPeriod(prisma, weekday, period, MeetingPeriodsJA[period]);
    });
    createLessonPeriod(prisma, weekday, AfterSchoolPeriod, AfterSchoolPeriodJA);
  });
}

async function createLessonLessonPeriods(
  prisma: TransactionClient,
  weekday: WeekDay,
  period: PeriodType,
) {
  if (!(LessonPeriods as unknown as string[]).includes(period)) return;
  const lessons = table[weekday][period as LessonPeriodType];
  if (!lessons) return;
  await Promise.all(
    lessons.map((lessonTitle) =>
      createLessonPeriod(prisma, weekday, period, lessonTitle),
    ),
  );
}

async function createLessonPeriod(
  prisma: TransactionClient,
  weekday: WeekDay,
  period: PeriodType,
  lessonTitle: string,
) {
  const lessonId = await findLessonIdFromTitle(prisma, lessonTitle);
  const periodId = await findPeriodIdFromWeekdayAndPeriod(
    prisma,
    weekday,
    period,
  );
  await prisma.lessonPeriod.create({
    data: {
      lessonId,
      periodId,
    },
  });
}

async function findLessonIdFromTitle(prisma: TransactionClient, title: string) {
  const lessonRecord = await prisma.lesson.findFirstOrThrow({
    where: {
      title: title,
    },
    select: {
      id: true,
    },
  });
  return lessonRecord.id;
}

async function findPeriodIdFromWeekdayAndPeriod(
  prisma: TransactionClient,
  weekday: WeekDay,
  period: PeriodType,
) {
  const periodRecord = await prisma.period.findFirstOrThrow({
    where: {
      innername: period,
      weekday,
    },
    select: {
      id: true,
    },
  });
  return periodRecord.id;
}
