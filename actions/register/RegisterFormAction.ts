"use server";

import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { Prisma, CourseFrequency, AfterSchool, LessonPeriod } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { redirect } from "next/navigation";
import { CourseFreqDays, CourseFreqToDayOfWeekMap, DaysToCourseFreqMap } from "@/data/courseFreqs";
import type { CourseFreqDay } from "@/data/courseFreqs";
import { AfterSchoolKey, AfterSchoolMap } from "@/data/afterschool";


const nicknameSchema = z.string({invalid_type_error: "ニックネームは文字列として入力してください。"}).nonempty({ message: "ニックネームは1文字以上の長さにしてください。" })
const campusSchema = z.string({invalid_type_error: "キャンパスは文字列として入力してください。",}).uuid({ message: "キャンパスはuuidとして入力してください。" }).superRefine(validateCampus)
const courseSchema = z.coerce.number({ invalid_type_error: "整数を入力してください。" }).int({ message: "整数を入力してください。" }).refine((num) => (CourseFreqDays as ReadonlyArray<number>).includes(num), {message: `${CourseFreqDays.join(",")}のいずれかの整数を入力してください。`,})
const afterschoolSchema = z.coerce.number({ invalid_type_error: "整数を入力してください。" }).int({ message: "整数を入力してください。" }).refine((num) => 1 <= num && num <= 2, {message: "1~2の整数を入力してください。",})
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
  const requiredLessons = course * Object.keys(LessonPeriod).length;

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
        day: { in: CourseFreqToDayOfWeekMap[course as CourseFreqDay ] },
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
  console.log(afterschool);
  console.log(AfterSchoolMap)
  const afterschoolEnum: AfterSchool =
    AfterSchoolMap[afterschool as AfterSchoolKey];
  console.log(afterschoolEnum)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        nickname: nickname,
        campus: { connect: { id: campus } },
        courseFrequency: courseFreqEnum,
        afterSchool: afterschoolEnum,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        lesson: {
          set: [],
        },
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        lesson: {
          connect: lessons.map((lesson) => {
            return { id: lesson };
          }),
        },
      },
    }),
  ]);

  return redirect("/");
}
