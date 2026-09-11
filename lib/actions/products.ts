"use server";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import type { ActionResult } from "@/types";
import { assertAdmin } from "./guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  productDeleteSchema,
  productInputSchema,
  productPublishSchema,
} from "@/lib/validation/product";
import {
  createProduct,
  deleteProduct,
  productSlugTaken,
  setProductFlag,
  updateProduct,
} from "@/lib/appwrite/products";
import { deleteProductImages } from "@/lib/appwrite/storage";

function invalidateProducts() {
  revalidateTag(CACHE_TAGS.products, "max");
}

export async function createProductAction(
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (await productSlugTaken(parsed.data.slug)) {
    return {
      ok: false,
      error: "That slug is already used by another product.",
      fieldErrors: { slug: ["Slug already in use"] },
    };
  }

  try {
    const product = await createProduct(parsed.data);
    invalidateProducts();
    return { ok: true, data: { id: product.id, slug: product.slug } };
  } catch (error) {
    console.error("[products] create failed", error);
    return { ok: false, error: "Could not create the product." };
  }
}

export async function updateProductAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (await productSlugTaken(parsed.data.slug, id)) {
    return {
      ok: false,
      error: "That slug is already used by another product.",
      fieldErrors: { slug: ["Slug already in use"] },
    };
  }

  try {
    const product = await updateProduct(id, parsed.data);
    invalidateProducts();
    return { ok: true, data: { id: product.id, slug: product.slug } };
  } catch (error) {
    console.error("[products] update failed", error);
    return { ok: false, error: "Could not update the product." };
  }
}

export async function deleteProductAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const parsed = productDeleteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid product." };

  try {
    const deleted = await deleteProduct(parsed.data.id);
    if (deleted?.imageIds.length) {
      await deleteProductImages(deleted.imageIds);
    }
    invalidateProducts();
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("[products] delete failed", error);
    return { ok: false, error: "Could not delete the product." };
  }
}

/** Toggle published / featured / inStock from the product list. */
export async function setProductFlagAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const parsed = productPublishSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid request." };

  try {
    await setProductFlag(parsed.data.id, parsed.data.field, parsed.data.value);
    invalidateProducts();
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("[products] flag update failed", error);
    return { ok: false, error: "Could not update the product." };
  }
}
