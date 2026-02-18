import { Prisma, WeekDay } from "@/prisma/generated/prisma/client";
import campuses, { RoomData } from "@/src/data/campus";
import { PeriodType } from "@/src/data/periods";
import {
  LessonPeriodWhereUniqueInput,
  TransactionClient,
} from "@prisma-gen/internal/prismaNamespace";

export default async function seed(prisma: TransactionClient) {
  await prisma.campus.deleteMany();
  await prisma.room.deleteMany();

  await Promise.all(
    Object.entries(campuses).map(
      async ([campusName, { mainRoom: mainRoomIdx, memberCount, rooms }]) => {
        const mainRoom = rooms[mainRoomIdx];
        const campusId = await createCampus(prisma, campusName, memberCount);
        await createRooms(prisma, campusId, rooms);
        await setCampusMainRoom(prisma, campusId, mainRoom.name);
        await connectLessonPeriodToRoom(prisma, campusId, rooms);
      },
    ),
  );
}

async function createCampus(
  prisma: TransactionClient,
  campusName: string,
  memberCount: number,
) {
  const campus = await prisma.campus.create({
    data: {
      name: campusName,
      memberCount: memberCount,
    },
    select: {
      id: true,
    },
  });
  return campus.id;
}

async function createRooms(
  prisma: TransactionClient,
  campusId: string,
  rooms: RoomData[],
) {
  await prisma.room.createMany({
    data: rooms.map<Prisma.RoomCreateManyInput>((room) => ({
      campusId,
      name: room.name,
      capacity: room.capacity,
      mustShow: room.mustShow ?? false,
      order: room.order,
      accentColor: room.accentColor,
      roomPlan: room.plan as object,
    })),
  });
}

async function setCampusMainRoom(
  prisma: TransactionClient,
  campusId: string,
  mainRoomName: string,
) {
  await prisma.campus.update({
    where: {
      id: campusId,
    },
    data: {
      mainRoom: {
        connect: {
          name_campusId: {
            campusId,
            name: mainRoomName,
          },
        },
      },
    },
  });
}

async function findLessonIdFromTitle(prisma: TransactionClient, title: string) {
  const lessonRecord = await prisma.lesson.findFirstOrThrow({
    where: {
      title: title,
    },
    select: {
      id: true,
    },
  });
  return lessonRecord.id;
}

async function findPeriodIdFromWeekdayAndPeriod(
  prisma: TransactionClient,
  weekday: WeekDay,
  period: PeriodType,
) {
  const periodRecord = await prisma.period.findFirstOrThrow({
    where: {
      innername: period,
      weekday,
    },
    select: {
      id: true,
    },
  });
  return periodRecord.id;
}

async function connectLessonPeriodToRoom(
  prisma: TransactionClient,
  campusId: string,
  rooms: RoomData[],
) {
  await Promise.all(
    rooms.map(async (room) => {
      if (room.lessons.length === 0) return;
      await prisma.room.update({
        where: {
          name_campusId: {
            campusId,
            name: room.name,
          },
        },
        data: {
          lessonPeriods: {
            connect: await Promise.all(
              room.lessons.map<Promise<LessonPeriodWhereUniqueInput>>(
                async (lesson) => {
                  const lessonId = await findLessonIdFromTitle(
                    prisma,
                    lesson.title,
                  );
                  const periodId = await findPeriodIdFromWeekdayAndPeriod(
                    prisma,
                    lesson.weekday,
                    lesson.period,
                  );
                  return {
                    lessonId_periodId: {
                      lessonId,
                      periodId,
                    },
                  };
                },
              ),
            ),
          },
        },
      });
    }),
  );
}
