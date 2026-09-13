import "server-only";
import { Client, Account, type Models } from "node-appwrite";
import { cookies } from "next/headers";
import { appwriteEnv } from "./env";

export const SESSION_COOKIE = "admin_session";

/**
 * Reads the session cookie and returns the logged-in Appwrite user, or
 * null if there's no session or it's invalid/expired. Since there's no
 * public registration flow and only one Appwrite Auth user exists
 * (the admin bootstrap account), a valid session here is sufficient —
 * no extra role check needed.
 */
export async function getLoggedInUser(): Promise<Models.User<Models.Preferences> | null> {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionSecret) return null;

  const client = new Client()
    .setEndpoint(appwriteEnv.endpoint)
    .setProject(appwriteEnv.projectId)
    .setSession(sessionSecret);

  try {
    return await new Account(client).get();
  } catch {
    return null;
  }
}
