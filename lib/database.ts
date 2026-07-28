import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

export function getDatabase() {
  if (!client) {
    const rawUrl = process.env.DATABASE_URL;
    const url = rawUrl?.trim().replace(/^("|')(.*)\1$/, "$2");
    if (!url) throw new Error("Missing DATABASE_URL");
    client = neon(url);
  }
  return client;
}
