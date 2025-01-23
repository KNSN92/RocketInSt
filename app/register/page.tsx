import authConfig from "@/auth.config";
import RegisterForm from "@/components/register/RegisterForm";
import { ReversedAfterSchoolMap } from "@/data/afterschool";
import { CourseFreqToDaysMap } from "@/data/courseFreqs";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";

export default async function Register() {
  const session = await getServerSession(authConfig);
  try {
    const table = await fetchLessonsAndGenTable(session?.user?.id || undefined);
    const campuses = await fetchCampuses();
    const { campus, course, afterschool } =
      await fetchUserSchoolInfoOrUndefined(session?.user?.id || undefined);
    return (
      <div className="w-fit mx-auto mt-12 p-16 rounded-2xl border-[1px] border-gray-800">
        <h1 className="block w-fit mx-auto mb-4 text-4xl font-bold">自身の学校の情報を設定</h1>
        <RegisterForm
          campuses={campuses}
          initialTable={table}
          initialCampus={campus}
          initialCourse={course}
          initialAfterschool={afterschool}
        />
      </div>
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
    select: {
      id: true,
      title: true,
      day: true,
      period: true,
      enrolledUsers: {
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
        take: 1,
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
        selected?: boolean;
      }[];
    };
  } = {};
  items.forEach((item) => {
    if (!table[item.day]) table[item.day] = {};
    if (!table[item.day][item.period]) table[item.day][item.period] = [];
    table[item.day][item.period].push({
      id: item.id,
      title: item.title,
      selected: item.enrolledUsers.length > 0,
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
      courseFrequency: true,
      afterSchool: true,
    },
  });
  return {
    campus: data?.campus?.id || undefined,
    course: data?.courseFrequency
      ? CourseFreqToDaysMap[data.courseFrequency]
      : undefined,
    afterschool: data?.afterSchool
      ? ReversedAfterSchoolMap[data.afterSchool]
      : undefined,
  };
}
