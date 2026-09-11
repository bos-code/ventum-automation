import "server-only";

import { getAdminUser, type AdminUser } from "@/lib/auth";

type AdminGuard =
  | { ok: true; admin: AdminUser }
  | { ok: false; error: string };

/**
 * Authorisation check for server actions. Unlike `requireAdmin()` (which
 * redirects — appropriate for a page render), actions are typically
 * invoked as plain async calls from client forms, so a failed check
 * should come back as a normal `ActionResult`-shaped error instead of a
 * redirect throw.
 */
export async function assertAdmin(): Promise<AdminGuard> {
  const admin = await getAdminUser();
  if (!admin) {
    return {
      ok: false,
      error: "Your session has expired. Please sign in again.",
    };
  }
  return { ok: true, admin };
}
