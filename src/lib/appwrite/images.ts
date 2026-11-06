import { catalogueSnapshot } from "@/lib/data/catalogue-snapshot";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const bucketId = process.env.APPWRITE_BUCKET_ID;

/**
 * Builds a public URL for a product image stored in Appwrite Storage.
 * Files in this bucket are readable by anyone (permission `read("any")`),
 * so no API key is needed here.
 *
 * SERVER ONLY. APPWRITE_BUCKET_ID has no NEXT_PUBLIC_ prefix, so it is
 * undefined in the browser bundle and this throws. Resolve the URL in a
 * Server Component and pass the resulting string down to Client Components.
 *
 * Uses the raw `/view` endpoint, not `/preview` — image transformations
 * are blocked on the current Appwrite plan (verified: preview returns
 * 403 storage_image_transformations_blocked). Resizing/format conversion
 * is left to next/image instead.
 *
 * Photos already copied into the catalogue snapshot are served from the
 * site itself (file ids are immutable, so it is the same image) and keep
 * working while Appwrite is unreachable.
 */
export function productImageUrl(fileId: string) {
  const local = catalogueSnapshot.images[fileId];
  if (local) return local;

  if (!endpoint || !projectId || !bucketId) {
    throw new Error(
      "Missing NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, or APPWRITE_BUCKET_ID"
    );
  }

  const url = new URL(
    `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view`
  );
  url.searchParams.set("project", projectId);
  return url.toString();
}
