import { prisma } from "@/prisma";
import campuses from "@/data/campus";
import { Prisma } from "@prisma/client";

export default async function seed() {
    await prisma.campus.deleteMany()
    await prisma.room.deleteMany()
    await prisma.roomPlan.deleteMany()

    Object.entries(campuses).forEach(async (value) => {
        const [campusName, { mainRoom, allMember, rooms}] = value
        const { id } = await prisma.campus.create({
            data: {
                name: campusName,
                allMember: allMember,
            }
        });
        await rooms.forEach(async (room, i) => {
            const createdRoom = await prisma.room.create({
                data: {
                    name: room.name,
                    capacity: room.capacity,
                    roomPlan: {
                        create: {
                            x: room.plan.x,
                            y: room.plan.y,
                            w: room.plan.w,
                            h: room.plan.h,
                        }
                    },
                    campus: {
                        connect: {
                            id: id
                        }
                    }
                }
            })
            if(i === mainRoom) {
                await prisma.campus.update({
                    where: {
                        id: id
                    },
                    data: {
                        mainRoom: {
                            connect: {
                                id: createdRoom.id
                            }
                        }
                    }
                })
            }
            if(room.lessons.length > 0) {
                const lessonTargets = await Promise.all(
                    room.lessons.map<Promise<Prisma.LessonWhereUniqueInput>>(async (lesson) => {
                        const lessonId = (
                            await prisma.lesson.findFirst({
                                where: {
                                    title: lesson.name ? lesson.name as string : undefined,
                                    period: {
                                        some: {
                                            weekday: lesson.weekday,
                                            innername: lesson.period,
                                        }
                                    }
                                }
                            })
                        )?.id;
                        return {
                            id: lessonId
                        }
                    })
                );
                await prisma.room.update({
                    where: {
                        id: createdRoom.id
                    },
                    data: {
                        lessons: {
                            connect: lessonTargets
                        }
                    }
                })
            }
        })
    })
}
