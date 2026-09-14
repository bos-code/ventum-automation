import "server-only";
import { ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { getServerStorage } from "@/lib/appwrite/client";
import { appwriteEnv } from "@/lib/appwrite/env";

/** Appwrite free-tier storage caps individual files; keep well under it. */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export interface UploadResult {
  ids: string[];
  /** Files that were skipped, with the reason, so the admin is told rather than left guessing. */
  rejected: { name: string; reason: string }[];
}

/**
 * Uploads product photos to the Appwrite bucket and returns their file ids.
 *
 * Files are given `read("any")` because product images are public on the
 * storefront — `productImageUrl()` builds a plain /view URL with no API key.
 */
export async function uploadProductImages(files: File[]): Promise<UploadResult> {
  const storage = getServerStorage();
  const ids: string[] = [];
  const rejected: { name: string; reason: string }[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      rejected.push({ name: file.name, reason: "not a JPEG, PNG, WebP or AVIF image" });
      continue;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      rejected.push({ name: file.name, reason: "larger than 8MB" });
      continue;
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const created = await storage.createFile({
        bucketId: appwriteEnv.bucketId,
        fileId: ID.unique(),
        file: InputFile.fromBuffer(buffer, file.name),
        permissions: [Permission.read(Role.any())],
      });
      ids.push((created as unknown as { $id: string }).$id);
    } catch (error) {
      console.error(`uploadProductImages failed for ${file.name}:`, error);
      rejected.push({ name: file.name, reason: "upload failed" });
    }
  }

  return { ids, rejected };
}

/**
 * Best-effort removal of an orphaned file. A failure here is logged and
 * swallowed: the product row is the source of truth, and a stranded file
 * is far less harmful than blocking the admin's save.
 */
export async function deleteProductImage(fileId: string): Promise<void> {
  try {
    await getServerStorage().deleteFile({
      bucketId: appwriteEnv.bucketId,
      fileId,
    });
  } catch (error) {
    console.error(`deleteProductImage(${fileId}) failed:`, error);
  }
}

/** Pulls the repeatable `images` file inputs out of a submitted form. */
export function readImageFiles(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

/** Ids the admin chose to keep, sent as JSON alongside any new uploads. */
export function readKeptImageIds(formData: FormData): string[] {
  const raw = formData.get("keepImageIds");
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}
