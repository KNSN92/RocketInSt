import { prisma } from "@/prisma";
import { PrismaClient } from "@prisma-gen/client";
import { DefaultArgs } from "@prisma/client/runtime/client";
import seedCampus from "./seed/campus";
import seedLessons from "./seed/lesson";
import seedLessonPeriods from "./seed/lessonPeriod";
import seedPeriods from "./seed/periods";

export type TransactionPrismaClient = Omit<
  PrismaClient<never, undefined, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

async function main() {
  await seedPeriods(prisma);
  await seedLessons(prisma);
  await seedLessonPeriods(prisma);
  await seedCampus(prisma);
  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
