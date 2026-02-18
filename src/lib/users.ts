import {
  RecessPeriods,
  RecessPeriodsJA,
  RecessPeriodType,
} from "@/src/data/periods";
import { Prisma, WeekDay } from "@prisma-gen/browser";

export function combinateUserName(
  name?: string | null,
  nickname?: string | null,
) {
  if (name && nickname) {
    return `${nickname}(${name})`;
  } else if (name) {
    return name;
  } else if (nickname) {
    return nickname;
  } else {
    return "???";
  }
}

export function genUserTakingLessonQuery(
  campusId: string,
  minutes: number,
  weekdayEnum: WeekDay | undefined,
) {
  return {
    where: {
      period: {
        weekday: weekdayEnum,
        AND: {
          beginTime: {
            lte: minutes,
          },
          endTime: {
            gte: minutes,
          },
        },
      },
    },
    select: {
      lesson: {
        select: {
          title: true,
        },
      },
      rooms: {
        where: {
          campusId: campusId,
        },
      },
      period: {
        select: {
          name: true,
          innername: true,
        },
      },
    },
  } as const satisfies Prisma.UserSelect["lessonPeriods"];
}

type LessonPeriodPayload = Prisma.LessonPeriodGetPayload<{
  select: {
    lesson: {
      select: {
        title: true;
      };
    };
    rooms: {
      select: {
        id: true;
        name: true;
      };
    };
    period: {
      select: {
        name: true;
        innername: true;
      };
    };
  };
}>;

export function getTakingRoomId(lessons: LessonPeriodPayload[]) {
  if (lessons.length > 0) {
    const firstLesson = lessons[0];
    if (firstLesson.rooms.length > 0) {
      return firstLesson.rooms[0].id;
    }
  }
  return undefined;
}

export function getTakingRoom(lessons: LessonPeriodPayload[]) {
  if (lessons.length > 0) {
    const firstLesson = lessons[0];
    if (firstLesson.rooms.length > 0) {
      return firstLesson.rooms[0].name;
    } else {
      return "???";
    }
  } else {
    return "キャンパスに居ません。";
  }
}

export function getTakingLesson(lessons: LessonPeriodPayload[]) {
  if (lessons.length > 0) {
    const firstLesson = lessons[0];
    if (
      (RecessPeriods as ReadonlyArray<string>).includes(
        firstLesson.period.innername,
      )
    ) {
      return RecessPeriodsJA[firstLesson.period.innername as RecessPeriodType];
    } else {
      return firstLesson.lesson.title;
    }
  } else {
    return "キャンパスに居ません。";
  }
}
