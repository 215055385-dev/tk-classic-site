import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { cmsPrisma?: PrismaClient };

function createPrismaClient() {
  const connectionString =
    process.env.CMS_DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL;

  if (!connectionString) throw new Error("Missing CMS database connection string");

  const databaseHost = new URL(connectionString).hostname;
  const allowSelfSigned =
    process.env.CMS_ALLOW_SELF_SIGNED_CERTIFICATE === "true" ||
    databaseHost.endsWith(".supabase.co") ||
    databaseHost.endsWith(".pooler.supabase.com");
  const runtimeConnectionString = new URL(connectionString);
  if (allowSelfSigned) {
    runtimeConnectionString.searchParams.delete("sslmode");
  } else if (["prefer", "require", "verify-ca"].includes(runtimeConnectionString.searchParams.get("sslmode") ?? "")) {
    // pg currently treats these modes like verify-full and warns that this aliasing will change.
    // Keep the existing strict certificate and hostname verification behavior explicit.
    runtimeConnectionString.searchParams.set("sslmode", "verify-full");
  }

  const adapter = new PrismaPg({
    connectionString: runtimeConnectionString.toString(),
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ssl: allowSelfSigned
      ? { rejectUnauthorized: false }
      : undefined,
  });

  return new PrismaClient({ adapter });
}

export function getPrisma() {
  if (!globalForPrisma.cmsPrisma) globalForPrisma.cmsPrisma = createPrismaClient();
  return globalForPrisma.cmsPrisma;
}
