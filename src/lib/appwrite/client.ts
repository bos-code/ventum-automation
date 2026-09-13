import "server-only";
import { Client, TablesDB, Storage, Users } from "node-appwrite";
import { appwriteEnv } from "./env";

/**
 * Server-only Appwrite client, authenticated with the API key.
 * Never import this from a Client Component — it would leak the key.
 */
function createServerClient() {
  return new Client()
    .setEndpoint(appwriteEnv.endpoint)
    .setProject(appwriteEnv.projectId)
    .setKey(appwriteEnv.apiKey);
}

export function getTablesDB() {
  return new TablesDB(createServerClient());
}

export function getServerStorage() {
  return new Storage(createServerClient());
}

export function getServerUsers() {
  return new Users(createServerClient());
}
