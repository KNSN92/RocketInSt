
import seedCampus  from "./seed/campus";
import seedPeriods from "./seed/periods";
import seedLessons from "./seed/lesson";
import { prisma } from "@/prisma";

async function main() {
    await seedPeriods();
    await seedLessons();
    await seedCampus();
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
