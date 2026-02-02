import RegisterForm from "@/app/register/RegisterForm";
import authConfig from "@/auth.config";
import { CourseToDaysMap } from "@/data/course";
import { AfterSchoolPeriod, LessonPeriods } from "@/data/periods";
import { prisma } from "@/prisma";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Register",
};

export default async function Register() {
  const session = await getServerSession(authConfig);
  try {
    const table = await fetchLessonsAndGenTable(session?.user?.id || undefined);
    const campuses = await fetchCampuses();
    const { campus, course, afterschool } =
      await fetchUserSchoolInfoOrUndefined(session?.user?.id || undefined);
    return (
      <RegisterForm
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
      campus: undefined,
      course: undefined,
      afterschool: undefined,
    };
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      campus: true,
      course: true,
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
    campus: data?.campus?.id || undefined,
    course: data?.course
      ? CourseToDaysMap[data.course]
      : undefined,
    afterschool: data?._count.lessons ? 1 : 0,
  };
}
