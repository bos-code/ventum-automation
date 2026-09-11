import "server-only";

import { cookies } from "next/headers";
import { Account, Client, Storage, TablesDB, Users } from "node-appwrite";
import { appwriteEnv, assertAppwriteConfig, SESSION_COOKIE } from "./config";

/**
 * A fresh `Client` is created per call — Appwrite's SSR guidance is to
 * never share a client between requests.
 */

function baseClient() {
  assertAppwriteConfig();
  return new Client()
    .setEndpoint(appwriteEnv.endpoint)
    .setProject(appwriteEnv.projectId);
}

/**
 * Server client authenticated with the project API key. Bypasses
 * document permissions — use it for all catalogue reads and for admin
 * writes *after* the caller has been authorised.
 */
export function createAdminClient() {
  const client = baseClient().setKey(appwriteEnv.apiKey);
  return {
    get tables() {
      return new TablesDB(client);
    },
    get storage() {
      return new Storage(client);
    },
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
  };
}

/**
 * Server client scoped to the current admin's session cookie. Used only
 * to verify the logged-in user (`account.get()`). Throws if there is no
 * session cookie.
 */
export async function createSessionClient() {
  const session = (await cookies()).get(SESSION_COOKIE);
  if (!session?.value) {
    throw new Error("No admin session");
  }
  const client = baseClient().setSession(session.value);
  return {
    get account() {
      return new Account(client);
    },
  };
}
