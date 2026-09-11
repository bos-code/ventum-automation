import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/appwrite/clients";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Resolve the currently logged-in admin from the session cookie, or
 * `null`. Memoised per request with React `cache` so multiple callers
 * in one render share a single `account.get()` round-trip.
 *
 * This is the security boundary: it validates the session against
 * Appwrite on every request. There is no public sign-up, so any user
 * who can authenticate is an admin.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return { id: user.$id, name: user.name || user.email, email: user.email };
  } catch {
    return null;
  }
});

/** Redirect to the login page unless a valid admin session exists. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
