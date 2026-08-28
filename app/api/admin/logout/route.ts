import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assertAdminOrigin } from "@/lib/admin-permissions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertAdminOrigin(request);
  } catch {
    return NextResponse.json({ ok: false }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
}
