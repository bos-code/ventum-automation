import "server-only";

import { ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "./clients";
import { appwriteEnv } from "./config";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export function isAllowedImage(file: File): boolean {
  return (
    (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type) &&
    file.size > 0 &&
    file.size <= MAX_IMAGE_BYTES
  );
}

/**
 * Upload one product image. Files are created with public read so the
 * `/view` URL works for `next/image`; writes remain server-only (this
 * runs with the API key). Requires "File Security" enabled on the bucket.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const { storage } = createAdminClient();
  const buffer = await file.arrayBuffer();
  const created = await storage.createFile({
    bucketId: appwriteEnv.bucketId,
    fileId: ID.unique(),
    file: InputFile.fromBuffer(buffer, file.name || "image"),
    permissions: [Permission.read(Role.any())],
  });
  return created.$id;
}

export async function deleteProductImage(fileId: string): Promise<void> {
  const { storage } = createAdminClient();
  await storage.deleteFile({
    bucketId: appwriteEnv.bucketId,
    fileId,
  });
}

/** Best-effort bulk delete — logs, never throws. */
export async function deleteProductImages(fileIds: string[]): Promise<void> {
  await Promise.all(
    fileIds.map((id) =>
      deleteProductImage(id).catch((error) => {
        console.error("[storage] failed to delete file", id, error);
      }),
    ),
  );
}
