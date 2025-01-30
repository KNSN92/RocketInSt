import { prisma } from "@/prisma";
import campuses from "@/data/campus";

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
        })
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
        })
    })
}
