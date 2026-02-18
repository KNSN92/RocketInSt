import RegisterForm from "@/app/register/RegisterForm";
import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { CourseToDaysMap } from "@/src/data/course";
import { AfterSchoolPeriod, LessonPeriods } from "@/src/data/periods";
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
  const items = await prisma.lessonPeriod.findMany({
    where: {
      period: {
        tag: "Lesson",
        innername: {
          in: [...LessonPeriods],
        },
      },
    },
    select: {
      id: true,
      lesson: {
        select: {
          title: true,
        },
      },
      period: {
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
      lesson: {
        title: "asc",
      },
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
    const {
      id,
      period: { weekday, innername },
      lesson: { title },
      students,
    } = item;
    if (!table[weekday]) table[weekday] = {};
    if (!table[weekday][innername]) table[weekday][innername] = [];
    table[weekday][innername].push({
      id: id,
      title: title,
      selected: students.length > 0,
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
          lessonPeriods: {
            where: {
              period: {
                innername: AfterSchoolPeriod,
              },
            },
          },
        },
      },
    },
  });
  return {
    campus: data?.campus?.id || undefined,
    course: data?.course ? CourseToDaysMap[data.course] : undefined,
    afterschool: data?._count.lessonPeriods ? 1 : 0,
  };
}
