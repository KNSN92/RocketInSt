"use server";

import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import type { CourseDay } from "@/src/data/course";
import {
  CourseDays,
  DaysToCourseMap,
  DaysToWeekDayMap,
} from "@/src/data/course";
import {
  AfterSchoolPeriod,
  LessonPeriods,
  MeetingPeriods,
  RecessPeriods,
} from "@/src/data/periods";
import { Course, Prisma } from "@prisma-gen/browser";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { getServerSession } from "next-auth";
import { z } from "zod";

const campusSchema = z
  .string({ invalid_type_error: "キャンパスは文字列として入力してください。" })
  .uuid({ message: "キャンパスはuuidとして入力してください。" })
  .superRefine(validateCampus);
const courseSchema = z.coerce
  .number({ invalid_type_error: "整数を入力してください。" })
  .int({ message: "整数を入力してください。" })
  .refine((num) => (CourseDays as ReadonlyArray<number>).includes(num), {
    message: `${CourseDays.join(",")}のいずれかの整数を入力してください。`,
  });
const afterschoolSchema = z.coerce
  .number({ invalid_type_error: "整数を入力してください。" })
  .int({ message: "整数を入力してください。" })
  .refine((num) => 0 <= num && num <= 1, {
    message: "0~1の整数を入力してください。",
  });
const lessonsSchema = z
  .string({
    invalid_type_error: "授業の一つ一つは文字列として入力してください。",
  })
  .uuid({ message: "授業の一つ一つはuuidとして入力してください。" })
  .array();

const schema = z
  .object({
    campus: campusSchema,
    course: courseSchema,
    afterschool: afterschoolSchema,
    lessons: lessonsSchema,
  })
  .superRefine(validateLessons);

async function validateCampus(campus: string, ctx: z.RefinementCtx) {
  try {
    const foundCampus = await prisma.campus.findUnique({
      where: { id: campus },
    });
    if (!foundCampus) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `キャンパスがデータベースに存在しません。`,
      });
    }
  } catch (e) {
    console.error(e);
    if (e instanceof PrismaClientKnownRequestError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "データベースに接続出来ませんでした。",
      });
    }
  }
}

async function validateLessons(
  data: {
    campus: string;
    course: number;
    afterschool: number;
    lessons: string[];
  },
  ctx: z.RefinementCtx,
) {
  const { lessons, course } = data;
  const requiredLessons = course * LessonPeriods.length;

  if (lessons.length !== requiredLessons) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `全部で${requiredLessons}個の授業を入力してください。`,
    });
  }

  if (new Set<string>(lessons).size !== lessons.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "授業はそれぞれ重複が無い値を入力してください。",
    });
  }
  try {
    const foundLessons = await prisma.lessonPeriod.count({
      where: {
        id: { in: lessons },
        period: {
          weekday: {
            in: DaysToWeekDayMap[course as CourseDay],
          },
          tag: "Lesson",
        },
      },
    });
    if (foundLessons < requiredLessons) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${
          requiredLessons - foundLessons
        }個の授業IDがデータベースに存在しません。`,
      });
    }
  } catch (e) {
    console.error(e);
    if (e instanceof PrismaClientKnownRequestError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "データベースに接続出来ませんでした。",
      });
    }
  }
}

export default async function handleRegisterAction(
  previousState: { success: boolean; error: boolean; msg?: string },
  formData: FormData,
): Promise<{ success: boolean; error: boolean; msg?: string }> {
  const parseResult = await schema.safeParseAsync({
    campus: formData.get("campus"),
    course: formData.get("course"),
    afterschool: formData.get("afterschool"),
    lessons: formData.getAll("lessons"),
  });
  if (!parseResult.success)
    return {
      success: false,
      error: true,
      msg: parseResult.error?.errors[0].message,
    };
  const { campus, course, afterschool, lessons } = parseResult.data;
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  if (!userId)
    return {
      success: false,
      error: true,
      msg: "ユーザーidを取得出来ませんでした。",
    };

  const courseEnum: Course = DaysToCourseMap[course as CourseDay];

  const lessonsEntry: Prisma.LessonPeriodWhereUniqueInput[] = (
    await prisma.lessonPeriod.findMany({
      where: {
        id: { in: lessons },
        period: {
          weekday: {
            in: DaysToWeekDayMap[course as CourseDay],
          },
          tag: "Lesson",
        },
      },
      select: { id: true },
    })
  ).map((lp) => ({ id: lp.id }));
  console.log("lessonsEntry", lessonsEntry);
  const otherEntryInnernames: string[] = [...MeetingPeriods, RecessPeriods[2]];
  if (afterschool === 1) otherEntryInnernames.push(AfterSchoolPeriod);

  const otherEntry: Prisma.LessonPeriodWhereUniqueInput[] = (
    await prisma.lessonPeriod.findMany({
      where: {
        period: {
          innername: {
            in: otherEntryInnernames,
          },
          weekday: {
            in: DaysToWeekDayMap[course as CourseDay],
          },
        },
      },
      select: {
        id: true,
      },
    })
  ).map((item) => ({ id: item.id }));

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        campus: { connect: { id: campus } },
        course: courseEnum,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        lessonPeriods: {
          set: [...lessonsEntry, ...otherEntry],
        },
      },
    }),
  ]);

  return { success: true, error: false };
}
