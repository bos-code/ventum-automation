"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/types";
import { loginSchema } from "@/lib/validation/auth";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/clients";
import { SESSION_COOKIE } from "@/lib/appwrite/config";

/**
 * Admin login. Uses the API-key client to create the session — Appwrite
 * only returns the session `secret` (needed for SSR cookie auth) when the
 * request is made with an API key. There is no public sign-up: any user
 * who can authenticate here is treated as an admin.
 */
export async function login(input: unknown): Promise<ActionResult<void>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Enter a valid email and password.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(parsed.data);

    (await cookies()).set(SESSION_COOKIE, session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(session.expire),
    });

    return { ok: true, data: undefined };
  } catch (error) {
    console.error("[auth] login failed", error);
    return { ok: false, error: "Incorrect email or password." };
  }
}

export async function logout(): Promise<void> {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession({ sessionId: "current" });
  } catch {
    // No valid session to revoke — still clear the cookie below.
  }
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
