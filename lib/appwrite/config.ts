import "server-only";

/**
 * Central Appwrite configuration. All values come from environment
 * variables. Nothing here is exposed to the browser except the two
 * `NEXT_PUBLIC_` values (endpoint + project id), which are safe to ship.
 */

export const SESSION_COOKIE = "ventum_admin_session";

export const appwriteEnv = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  apiKey: process.env.APPWRITE_API_KEY ?? "",
  databaseId: process.env.APPWRITE_DATABASE_ID ?? "",
  bucketId: process.env.APPWRITE_BUCKET_ID ?? "",
  collections: {
    products: process.env.APPWRITE_PRODUCTS_COLLECTION_ID ?? "products",
    categories: process.env.APPWRITE_CATEGORIES_COLLECTION_ID ?? "categories",
    enquiries: process.env.APPWRITE_ENQUIRIES_COLLECTION_ID ?? "enquiries",
    settings: process.env.APPWRITE_SETTINGS_COLLECTION_ID ?? "settings",
  },
} as const;

/** The single settings row id created by the seed script. */
export const SETTINGS_DOC_ID = "business";

const PLACEHOLDER_VALUES = new Set([
  "placeholder-project",
  "placeholder-api-key",
  "your-project-id",
  "",
]);

/**
 * True when the core Appwrite variables look real. Used to show a setup
 * notice in the admin area and to skip network calls that would fail.
 */
export function isAppwriteConfigured(): boolean {
  return (
    !PLACEHOLDER_VALUES.has(appwriteEnv.projectId) &&
    !PLACEHOLDER_VALUES.has(appwriteEnv.apiKey) &&
    !PLACEHOLDER_VALUES.has(appwriteEnv.databaseId) &&
    appwriteEnv.endpoint.startsWith("http")
  );
}

/** Throw a clear, aggregated error if any required server variable is missing. */
export function assertAppwriteConfig(): void {
  const missing: string[] = [];
  if (!appwriteEnv.endpoint) missing.push("NEXT_PUBLIC_APPWRITE_ENDPOINT");
  if (!appwriteEnv.projectId) missing.push("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  if (!appwriteEnv.apiKey) missing.push("APPWRITE_API_KEY");
  if (!appwriteEnv.databaseId) missing.push("APPWRITE_DATABASE_ID");
  if (missing.length > 0) {
    throw new Error(
      `Appwrite is not configured. Missing: ${missing.join(", ")}. ` +
        `See .env.example and docs/SETUP.md.`,
    );
  }
}

/** Build a public URL for an original file in the product-images bucket. */
export function fileViewUrl(fileId: string): string {
  const { endpoint, bucketId, projectId } = appwriteEnv;
  return `${endpoint}/storage/buckets/${bucketId}/files/${encodeURIComponent(
    fileId,
  )}/view?project=${encodeURIComponent(projectId)}`;
}
