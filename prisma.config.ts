import "dotenv/config";
import { env, defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "ts-node -r tsconfig-paths/register --project prisma/tsconfig.json prisma/seed.ts"
    },
    datasource: {
        url: env("DATABASE_URL")
    }
})