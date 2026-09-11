"use server";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import type { ActionResult } from "@/types";
import { assertAdmin } from "./guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  categoryInputSchema,
  categoryReorderSchema,
} from "@/lib/validation/category";
import {
  categorySlugTaken,
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  reorderCategories,
  updateCategory,
} from "@/lib/appwrite/categories";
import { getAllProducts } from "@/lib/appwrite/products";

// The client form doesn't manage display order — that's the reorder
// buttons' job — so it submits everything except `sortOrder`.
const categoryFormInputSchema = categoryInputSchema.omit({ sortOrder: true });

function invalidateCategories() {
  revalidateTag(CACHE_TAGS.categories, "max");
}

export async function createCategoryAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const parsed = categoryFormInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (await categorySlugTaken(parsed.data.slug)) {
    return {
      ok: false,
      error: "That slug is already used by another category.",
      fieldErrors: { slug: ["Slug already in use"] },
    };
  }

  try {
    const existing = await getAllCategories();
    const category = await createCategory({
      ...parsed.data,
      sortOrder: existing.length,
    });
    invalidateCategories();
    return { ok: true, data: { id: category.id } };
  } catch (error) {
    console.error("[categories] create failed", error);
    return { ok: false, error: "Could not create the category." };
  }
}

export async function updateCategoryAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const parsed = categoryFormInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (await categorySlugTaken(parsed.data.slug, id)) {
    return {
      ok: false,
      error: "That slug is already used by another category.",
      fieldErrors: { slug: ["Slug already in use"] },
    };
  }

  const current = await getCategoryById(id);
  if (!current) return { ok: false, error: "Category not found." };

  try {
    const category = await updateCategory(id, {
      ...parsed.data,
      sortOrder: current.sortOrder,
    });
    invalidateCategories();
    return { ok: true, data: { id: category.id } };
  } catch (error) {
    console.error("[categories] update failed", error);
    return { ok: false, error: "Could not update the category." };
  }
}

export async function deleteCategoryAction(
  id: string,
): Promise<ActionResult<void>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const products = await getAllProducts();
  if (products.some((p) => p.categoryId === id)) {
    return {
      ok: false,
      error:
        "This category still has products assigned to it. Move or delete them first.",
    };
  }

  try {
    await deleteCategory(id);
    invalidateCategories();
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("[categories] delete failed", error);
    return { ok: false, error: "Could not delete the category." };
  }
}

export async function reorderCategoriesAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const guard = await assertAdmin();
  if (!guard.ok) return guard;

  const parsed = categoryReorderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid order." };

  const existing = new Set((await getAllCategories()).map((c) => c.id));
  if (!parsed.data.order.every((id) => existing.has(id))) {
    return { ok: false, error: "Unknown category in reorder request." };
  }

  try {
    await reorderCategories(parsed.data.order);
    invalidateCategories();
    return { ok: true, data: undefined };
  } catch (error) {
    console.error("[categories] reorder failed", error);
    return { ok: false, error: "Could not save the new order." };
  }
}
