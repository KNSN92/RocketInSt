import { RecessPeriods, RecessPeriodsJA, RecessPeriodType } from "@/data/periods";
import { Prisma, WeekDay } from "@prisma/client";

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

type UserTakingLessonQuery =  {
  where: {
    period: {
      some: {
        weekday: WeekDay | undefined,
        AND: {
          beginTime: {
            lte: number,
          },
          endTime: {
            gte: number,
          },
        },
      },
    },
  },
  select: {
    title: true,
    rooms: true,
    period: {
      where: {
        weekday: WeekDay | undefined,
        AND: {
          beginTime: {
            lte: number,
          },
          endTime: {
            gte: number,
          },
        },
      },
      select: {
        name: true,
        innername: true,
      },
    },
  },
};

export function genUserTakingLessonQuery(minutes: number, weekdayEnum: WeekDay | undefined): UserTakingLessonQuery {
  return (
    {
      where: {
        period: {
          some: {
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
      },
      select: {
        title: true,
        rooms: true,
        period: {
          where: {
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
          select: {
            name: true,
            innername: true,
          },
        },
      },
    }
  );
}

type Lesson = Prisma.LessonGetPayload<{
  select: {
    title: true,
    rooms: {
      select: {
        id: true,
        name: true,
      }
    },
    period: {
      select: {
        name: true,
        innername: true,
      }
    }
  }
}>;

export function getTakingRoomId(lessons: Lesson[]) {
  if(lessons.length > 0) {
    const firstLesson = lessons[0];
    if(firstLesson.rooms.length > 0) {
      return firstLesson.rooms[0].id;
    }
  }
  return "キャンパスに居ません。"
}

export function getTakingRoom(lessons: Lesson[]) {
  if(lessons.length > 0) {
    const firstLesson = lessons[0];
    if(firstLesson.rooms.length > 0) {
      return firstLesson.rooms[0].name; 
    }else {
      return "???";
    }
  }else {
    return "キャンパスに居ません。"
  }
}

export function getTakingLesson(lessons: Lesson[]) {
  if(lessons.length > 0) {
    const firstLesson = lessons[0];
    if(firstLesson.period.length > 0 && (RecessPeriods as ReadonlyArray<string>).includes(
      firstLesson.period[0].innername
    )) {
      return RecessPeriodsJA[firstLesson.period[0].innername as RecessPeriodType];
    }else {
      return firstLesson.title
    }
  }else {
    return "キャンパスに居ません。";
  }
}