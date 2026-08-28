import { getAdminIdentity } from "@/lib/admin-auth";

export function assertAdminOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;

  const allowedOrigins = new Set([new URL(request.url).origin]);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  if (forwardedHost) allowedOrigins.add(`${forwardedProto}://${forwardedHost}`);

  if (!allowedOrigins.has(origin)) throw new Error("INVALID_ORIGIN");
}

export async function requireAdmin(write = false, request?: Request) {
  if (write) {
    if (!request) throw new Error("INVALID_ORIGIN");
    assertAdminOrigin(request);
  }
  const identity = await getAdminIdentity();
  if (!identity) throw new Error("UNAUTHORIZED");
  if (write && !["SUPER_ADMIN", "EDITOR"].includes(identity.role)) {
    throw new Error("FORBIDDEN");
  }
  return identity;
}

export function adminErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN";
  if (message === "UNAUTHORIZED") return Response.json({ error: "请先登录后台" }, { status: 401 });
  if (message === "FORBIDDEN") return Response.json({ error: "当前账号没有编辑权限" }, { status: 403 });
  if (message === "INVALID_ORIGIN") return Response.json({ error: "请求来源无效" }, { status: 403 });
  console.error(error);
  return Response.json({ error: "操作失败，请稍后重试" }, { status: 500 });
}
