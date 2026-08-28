import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";

export const DEFAULT_ADMIN_USERNAME = "215055385";
export const ADMIN_EMAIL_DOMAIN = "admin.portablecoffeemachine.com";

export function usernameToAdminEmail(username: string) {
  const normalized = username.normalize("NFKC").trim().toLowerCase();
  if (!/^[a-z0-9._-]{3,64}$/.test(normalized)) return null;
  return `${normalized}@${ADMIN_EMAIL_DOMAIN}`;
}

export async function getAdminIdentity() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const profile = await getPrisma().adminProfile.findUnique({
      where: { authUserId: data.user.id },
      select: { id: true, username: true, displayName: true, role: true, status: true },
    });

    if (!profile || profile.status !== "ACTIVE") return null;
    return { userId: data.user.id, ...profile };
  } catch {
    return null;
  }
}

export async function hasAdminSession() {
  return Boolean(await getAdminIdentity());
}
