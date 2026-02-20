import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node -r tsconfig-paths/register --project prisma/tsconfig.json prisma/seed.ts",
  },
  datasource: {
    url: env("ROCKETINST_DATABASE_URL"),
  },
});
