import authConfig from "@/auth.config";
import RegisterForm from "@/components/register/RegisterForm";
import { CourseFreqToDaysMap } from "@/data/courseFreqs";
import { AfterSchoolPeriod, LessonPeriods } from "@/data/periods";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";

export default async function Register() {
  const session = await getServerSession(authConfig);
  try {
    const table = await fetchLessonsAndGenTable(session?.user?.id || undefined);
    const campuses = await fetchCampuses();
    const { nickname, campus, course, afterschool } =
      await fetchUserSchoolInfoOrUndefined(session?.user?.id || undefined);
    return (
      <RegisterForm
        initialNickName={nickname}
        campuses={campuses}
        initialTable={table}
        initialCampus={campus}
        initialCourse={course}
        initialAfterschool={afterschool}
      />
    );
  } catch (e) {
    console.error(e);
    return (
      <div>
        ページの構築中にエラーが発生しました。ページをリロードし、改善されない場合、改善されるまでしばらくお待ちください。
      </div>
    );
  }
}

async function fetchLessonsAndGenTable(userId?: string) {
  const items = await prisma.lesson.findMany({
    where: {
      period: {
        some: {
          tag: "Lesson",
          innername: {
            in: [...LessonPeriods],
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
      period: {
        where: {
          tag: "Lesson",
          innername: {
            in: [...LessonPeriods],
          },
        },
        select: {
          innername: true,
          weekday: true,
        },
      },
      students: {
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });
  const table: {
    [key: string]: {
      [key: string]: {
        id: string;
        title: string;
        selected: boolean;
      }[];
    };
  } = {};
  items.forEach((item) => {
    const { weekday, innername } = item.period[0];
    if (!table[weekday]) table[weekday] = {};
    if (!table[weekday][innername]) table[weekday][innername] = [];
    table[weekday][innername].push({
      id: item.id,
      title: item.title,
      selected: item.students.length > 0,
    });
  });
  return table;
}

async function fetchCampuses() {
  return (
    await prisma.campus.findMany({
      select: {
        id: true,
        name: true,
      },
    })
  ).map((item) => {
    return {
      title: item.name,
      value: item.id,
    };
  });
}

async function fetchUserSchoolInfoOrUndefined(userId?: string) {
  if (!userId)
    return {
      nickname: undefined,
      campus: undefined,
      course: undefined,
      afterschool: undefined,
    };
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      nickname: true,
      campus: true,
      courseFrequency: true,
      _count: {
        select: {
          lessons: {
            where: {
              period: {
                some: {
                  innername: AfterSchoolPeriod,
                },
              },
            },
          },
        },
      },
    },
  });
  return {
    nickname: data?.nickname || undefined,
    campus: data?.campus?.id || undefined,
    course: data?.courseFrequency
      ? CourseFreqToDaysMap[data.courseFrequency]
      : undefined,
    afterschool: data?._count.lessons ? 1 : 0,
  };
}
