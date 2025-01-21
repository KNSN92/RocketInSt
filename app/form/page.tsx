import authConfig from "@/auth.config";
import RadioButton from "@/components/common/RadioButton";
import { ROW, COL, ROW_JA, COL_JA } from "@/data/schedules";
import { prisma } from "@/prisma";
import { AfterSchool, CourseFrequency, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";

export default async function Form() {
  let items;
  try {
    items = await prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
        day: true,
        period: true,
      },
    });
  } catch (e) {
    console.error(e);
    return (
      <div>
        ページの構築中にエラーが発生しました。ページをリロードし、改善されない場合、改善されるまでしばらくお待ちください。
      </div>
    );
  }
  const table: {
    [key: string]: { [key: string]: { id: string; title: string }[] };
  } = {};
  items.forEach((item) => {
    if (!table[item.day]) table[item.day] = {};
    if (!table[item.day][item.period]) table[item.day][item.period] = [];
    table[item.day][item.period].push({ id: item.id, title: item.title });
  });

  return (
    <div>
      Form
      <form action={handleFormAction}>
        <h1>コースを選択</h1>
        <RadioButton
          name="course"
          buttons={[
            { title: "週1日", value: 1 },
            { title: "週3日", value: 2 },
            { title: "週5日", value: 3 },
          ]}
          required
        />
        <table>
          <thead>
            <tr>
              <th></th>
              {COL.map((col, i) => (
                <th key={i}>{COL_JA[col]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW.map((r, i) => (
              <tr key={i}>
                <th>{ROW_JA[r]}</th>
                {COL.map((c, j) => (
                  <td key={j}>
                    <select
                      required
                      name="lessons"
                      className="w-full bg-black text-white"
                    >
                      <option value="">選択</option>
                      {table[c][r].map(({ id, title }, i) => (
                        <option key={i} value={id} selected={i === 0}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <h1>放課後の動きを選択</h1>
        <RadioButton
          name="afterschool"
          buttons={[
            { title: "すぐ帰る", value: 1 },
            { title: "途中まで居る", value: 2 },
            { title: "最後まで居る", value: 3 },
          ]}
          required
        />
        <button type="submit">送信</button>
      </form>
    </div>
  );
}

const totalLessons = ROW.length * COL.length;

const courseAndAfterschoolNumberSchema = z.coerce
  .number({ invalid_type_error: "整数を入力してください。" })
  .int({ message: "整数を入力してください。" })
  .refine((num) => 1 <= num && num <= 3, {
    message: "1~3の整数を入力してください。",
  });

const schema = z.object({
  course: courseAndAfterschoolNumberSchema,
  afterschool: courseAndAfterschoolNumberSchema,
  lessons: z
    .array(
      z
        .string()
        .uuid({ message: "授業の一つ一つはuuidとして入力してください。" })
    )
    .length(totalLessons, {
      message: `${totalLessons}個の授業を入力してください。`,
    })
    .superRefine(async (lessons, ctx) => {
      if (new Set<string>(lessons).size !== lessons.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "授業はそれぞれ重複が無い値を入力してください。",
        });
      }
      try {
        const foundLessons = await prisma.lesson.count({
          where: { id: { in: lessons } },
        });
        if (foundLessons < totalLessons) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${
              totalLessons - foundLessons
            }個の授業IDがデータベースに存在しません`,
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
    }),
});

const CourseFreqMap = {
  1: CourseFrequency.OncePerWeek,
  2: CourseFrequency.ThricePerWeek,
  3: CourseFrequency.FiveTimesPerWeek,
} as const;
type CourseFreqKey = keyof typeof CourseFreqMap;

const AfterSchoolMap = {
  1: AfterSchool.LeaveImmediately,
  2: AfterSchool.StayForAWhile,
  3: AfterSchool.StayUntilEnd,
} as const;
type AfterSchoolKey = keyof typeof AfterSchoolMap;

async function handleFormAction(formData: FormData) {
  "use server";
  const parseResult = await schema.safeParseAsync({
    course: formData.get("course"),
    afterschool: formData.get("afterschool"),
    lessons: formData.getAll("lessons"),
  });
  if (!parseResult.success) return;
  const { course, afterschool, lessons } = parseResult.data;
  const session = await getServerSession(authConfig);
  console.log(session);
  const userId = session?.user?.id;
  if (!userId) return;

  const courseFreqEnum: CourseFrequency =
    CourseFreqMap[course as CourseFreqKey];
  const afterschoolEnum: AfterSchool =
    AfterSchoolMap[afterschool as AfterSchoolKey];

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
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
}
