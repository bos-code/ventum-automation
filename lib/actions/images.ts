"use server";

import type { ActionResult } from "@/types";
import { assertAdmin } from "./guard";
import { fileViewUrl } from "@/lib/appwrite/config";
import {
  deleteProductImage,
  isAllowedImage,
  uploadProductImage,
} from "@/lib/appwrite/storage";

export async function uploadProductImageAction(
  formData: FormData,
): Promise<ActionResult<{ id: string; url: string }>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image to upload." };
  }
  if (!isAllowedImage(file)) {
    return {
      ok: false,
      error: "Use a JPEG, PNG, WebP or AVIF image up to 5MB.",
    };
  }

  try {
    const id = await uploadProductImage(file);
    return { ok: true, data: { id, url: fileViewUrl(id) } };
  } catch (error) {
    console.error("[images] upload failed", error);
    return { ok: false, error: "Image upload failed. Please try again." };
  }
}

export async function deleteProductImageAction(
  fileId: string,
): Promise<ActionResult<void>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  try {
    await deleteProductImage(fileId);
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("[images] delete failed", error);
    return { ok: false, error: "Could not delete the image." };
  }
}
