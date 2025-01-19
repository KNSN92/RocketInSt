import { prisma } from "@/prisma";
import schedules from "@/data/schedules";
import { DayOfWeek, LessonPeriod } from "@prisma/client";
import type { LessonPeriod as LessonPeriodType, DayOfWeek as DayOfWeekType } from "@prisma/client";

export default async function seed() {
    await prisma.lesson.deleteMany();

    await Object.keys(DayOfWeek).forEach(async (dayOfWeek) => {
        await Object.keys(LessonPeriod).forEach(async (lessonPeriod) => {
            const lessons = schedules[dayOfWeek as DayOfWeekType][lessonPeriod as LessonPeriodType];
            await lessons.forEach( async (lesson) => {
                await prisma.lesson.create({
                    data: {
                        day: dayOfWeek as DayOfWeekType,
                        period: lessonPeriod as LessonPeriodType,
                        title: lesson
                    }
                })
            })
        })
    })
}
