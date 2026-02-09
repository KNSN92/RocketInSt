import campuses from "@/src/data/campus";
import { Prisma, PrismaClient } from "@/prisma/generated/prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/client";

export default async function seed(prisma: Omit<PrismaClient<never, undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">) {
  await prisma.campus.deleteMany();
  await prisma.room.deleteMany();

  await Promise.all(Object.entries(campuses).map(async (value) => {
    const [campusName, { mainRoom: mainRoomIdx, memberCount, rooms }] = value;
    const mainRoom = rooms[mainRoomIdx];
    const campus = await prisma.campus.create({
      data: {
        name: campusName,
        memberCount: memberCount,
      },
      select: {
        id: true
      }
    });
    await prisma.room.createMany({
      data: rooms.map<Prisma.RoomCreateManyInput>(room => ({
        campusId: campus.id,
        name: room.name,
        capacity: room.capacity,
        accentColor: room.accentColor,
        roomPlan: room.plan,
      }))
    })
    await prisma.campus.update({
      where: {
        id: campus.id
      },
      data: {
        mainRoom: {
          connect: {
            name_campusId: {
              campusId: campus.id,
              name: mainRoom.name
            }
          }
        }
      }
    });
    await Promise.all(rooms.map(async (room) => {
      if (room.lessons.length > 0) {
        const lessonTargets = await prisma.lesson.findMany({
          where: {
            OR: room.lessons.map((lesson) => ({
              title: lesson.name && (lesson.name as string),
              period: {
                some: {
                  weekday: lesson.weekday,
                  innername: lesson.period,
                }
              }
            }))
          },
          select: {
            id: true
          }
        });
        await prisma.room.update({
          where: {
            name_campusId: {
              campusId: campus.id,
              name: room.name
            }
          },
          data: {
            lessons: {
              connect: lessonTargets,
            },
          },
        });
      }
    }));
  }));
}
