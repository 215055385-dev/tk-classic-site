import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "tk_admin_session";

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAdminToken() {
  const passwordHash = process.env.ADMIN_DASHBOARD_PASSWORD_HASH?.trim();
  const token = passwordHash ? `hash:${passwordHash}` : (process.env.ADMIN_DASHBOARD_PASSWORD ?? process.env.ADMIN_DASHBOARD_TOKEN)?.trim();
  if (!token) throw new Error("Missing ADMIN_DASHBOARD_TOKEN");
  return token;
}

export function matchesAdminToken(candidate: string, expected: string) {
  const normalizedCandidate = candidate.normalize("NFKC").trim();
  const candidateHash = Buffer.from(tokenHash(normalizedCandidate));
  const expectedHash = Buffer.from(expected.startsWith("hash:") ? expected.slice(5) : tokenHash(expected));
  return candidateHash.length === expectedHash.length && timingSafeEqual(candidateHash, expectedHash);
}

export function adminCookieValue(token: string) {
  return tokenHash(token);
}

export function matchesAdminSession(cookieValue: string, token: string) {
  const actual = Buffer.from(cookieValue);
  const expected = Buffer.from(adminCookieValue(token));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function hasAdminSession() {
  let token: string;
  try {
    token = getAdminToken();
  } catch {
    return false;
  }

  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(cookie && matchesAdminSession(cookie, token));
}
