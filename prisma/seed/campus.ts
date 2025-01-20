import { prisma } from "@/prisma";
import campuses from "@/data/campus";

export default async function seed() {
    await prisma.campus.deleteMany()
    await prisma.room.deleteMany()
    await prisma.roomPlan.deleteMany()

    Object.entries(campuses).forEach(async (value) => {
        const [campus, rooms] = value
        const { id } = await prisma.campus.create({
            data: {
                name: campus,
            }
        })
        await rooms.forEach(async (room) => {
            await prisma.room.create({
                data: {
                    name: room.name,
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
        })
    })
}
