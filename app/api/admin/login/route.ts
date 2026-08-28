import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_ADMIN_USERNAME, usernameToAdminEmail } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { assertAdminOrigin } from "@/lib/admin-permissions";

export const runtime = "nodejs";

const MAX_LOGIN_BODY_BYTES = 4 * 1024;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  try {
    assertAdminOrigin(request);
  } catch {
    return noStoreJson({ ok: false, message: "请求来源无效。" }, 403);
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_LOGIN_BODY_BYTES) {
    return noStoreJson({ ok: false, message: "登录请求过大。" }, 413);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
  const rateLimit = consumeLoginAttempt(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, message: "登录尝试过多，请稍后再试。" },
      { status: 429, headers: { "Cache-Control": "private, no-store", "Retry-After": String(rateLimit.retryAfter) } },
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return noStoreJson({ ok: false, message: "请求格式不正确。" }, 400);
  }

  const username = String(body.username ?? DEFAULT_ADMIN_USERNAME);
  const password = String(body.password ?? "");
  const email = usernameToAdminEmail(username);
  if (!email || !password) {
    return noStoreJson({ ok: false, message: "请输入有效的管理员用户名和密码。" }, 400);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return noStoreJson({ ok: false, message: "管理员用户名或密码无效。" }, 401);
  }

  const profile = await getPrisma().adminProfile.findUnique({ where: { authUserId: data.user.id } });
  if (!profile || profile.status !== "ACTIVE") {
    await supabase.auth.signOut();
    return noStoreJson({ ok: false, message: "该管理员账号尚未启用。" }, 403);
  }

  await getPrisma().adminProfile.update({
    where: { id: profile.id },
    data: { lastLoginAt: new Date() },
  });

  loginAttempts.delete(ip);

  return NextResponse.json(
    { ok: true, admin: { username: profile.username, role: profile.role } },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

function consumeLoginAttempt(ip: string) {
  const now = Date.now();
  if (loginAttempts.size > 2000) {
    for (const [key, attempt] of loginAttempts) {
      if (attempt.resetAt <= now) loginAttempts.delete(key);
    }
  }

  const current = loginAttempts.get(ip);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= MAX_LOGIN_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function noStoreJson(body: { ok: false; message: string }, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}
