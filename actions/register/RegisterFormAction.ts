"use server";

import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { Prisma, CourseFrequency } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { redirect } from "next/navigation";
import { CourseFreqDays, DaysToWeekDayMap, DaysToCourseFreqMap } from "@/data/courseFreqs";
import type { CourseFreqDay } from "@/data/courseFreqs";
import { AfterSchoolPeriod, LessonPeriods, MeetingPeriods, RecessPeriods } from "@/data/periods";


const nicknameSchema = z.string({invalid_type_error: "ニックネームは文字列として入力してください。"}).nonempty({ message: "ニックネームは1文字以上の長さにしてください。" })
const campusSchema = z.string({invalid_type_error: "キャンパスは文字列として入力してください。",}).uuid({ message: "キャンパスはuuidとして入力してください。" }).superRefine(validateCampus)
const courseSchema = z.coerce.number({ invalid_type_error: "整数を入力してください。" }).int({ message: "整数を入力してください。" }).refine((num) => (CourseFreqDays as ReadonlyArray<number>).includes(num), {message: `${CourseFreqDays.join(",")}のいずれかの整数を入力してください。`,})
const afterschoolSchema = z.coerce.number({ invalid_type_error: "整数を入力してください。" }).int({ message: "整数を入力してください。" }).refine((num) => 0 <= num && num <= 1, {message: "0~1の整数を入力してください。",})
const lessonsSchema = z.string({invalid_type_error: "授業の一つ一つは文字列として入力してください。",}).uuid({ message: "授業の一つ一つはuuidとして入力してください。" }).array()

const schema = z
  .object({
    nickname: nicknameSchema,
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
        message: `${campus}はデータベースに存在しません。`,
      });
    }
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
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
  ctx: z.RefinementCtx
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
    const foundLessons = await prisma.lesson.count({
      where: {
        id: { in: lessons },
        period: {
          some: {
            weekday: {
              in: DaysToWeekDayMap[course as CourseFreqDay]
            },
            tag: "Lesson"
          }
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
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "データベースに接続出来ませんでした。",
      });
    }
  }
}

export async function handleRegisterAction(previousState: { error: boolean, msg?: string}, formData: FormData): Promise<{ error: boolean, msg?: string}> {
  const parseResult = await schema.safeParseAsync({
    nickname: formData.get("nickname"),
    campus: formData.get("campus"),
    course: formData.get("course"),
    afterschool: formData.get("afterschool"),
    lessons: formData.getAll("lessons"),
  });
  if (!parseResult.success) return { error: true, msg: parseResult.error?.errors[0].message };
  const { nickname, campus, course, afterschool, lessons } = parseResult.data;
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  if (!userId) return { error: true, msg: "ユーザーidを取得出来ませんでした。" };

  const courseFreqEnum: CourseFrequency =
    DaysToCourseFreqMap[course as CourseFreqDay];

  const lessonsEntry: Prisma.LessonWhereUniqueInput[] = lessons.map((lesson) => ({ id: lesson }));
  const otherEntryInnernames: string[] = [ ...MeetingPeriods, RecessPeriods[2] ];
  if(afterschool === 1) otherEntryInnernames.push(AfterSchoolPeriod);

  const otherEntry: Prisma.LessonWhereUniqueInput[] = (await prisma.lesson.findMany({
    where: {
      period: {
        some: {
          innername: {
            in: otherEntryInnernames
          },
          weekday: {
            in: DaysToWeekDayMap[course as CourseFreqDay]
          }
        }
      }
    },
    select: {
      id: true
    }
  })).map((item) => ({ id: item.id }));

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        nickname: nickname,
        campus: { connect: { id: campus } },
        courseFrequency: courseFreqEnum,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        lessons: {
          set: [],
        },
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        lessons: {
          connect: [
            ...lessonsEntry,
            ...otherEntry,
          ]
        },
      },
    }),
  ]);

  return redirect("/");
}
