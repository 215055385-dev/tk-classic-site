import "dotenv/config";
import { defineConfig } from "prisma/config";

const buildSafeDatabaseUrl =
  process.env.CMS_DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: buildSafeDatabaseUrl },
});
