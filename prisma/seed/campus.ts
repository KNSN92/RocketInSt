import { prisma } from "@/prisma";
import campuses from "@/data/campus";

export default async function seed() {
    await prisma.campus.deleteMany()
    await prisma.room.deleteMany()

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
                    name: room,
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
