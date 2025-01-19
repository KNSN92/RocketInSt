
import seedLesson from "./seed/lesson";
import seedCampus from "./seed/campus";
import { prisma } from "@/prisma";

async function main() {
    await seedCampus();
    await seedLesson();
    console.log('Seed data inserted successfully.')
}

main()
.catch((e) => {
    console.error(e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})
