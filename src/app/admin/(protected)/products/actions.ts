"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  type CreateProductInput,
  type ProductUpdate,
} from "@/lib/data/products";
import {
  uploadProductImages,
  deleteProductImage,
  readImageFiles,
  readKeptImageIds,
} from "@/lib/data/product-images";
import type { ProductSpec } from "@/lib/types";

export interface ProductFormState {
  status: "idle" | "success" | "error";
  message: string;
  productId?: string;
  /** True when the save succeeded but the product was held back as a draft. */
  savedAsDraft?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseSpecs(raw: FormDataEntryValue | null): ProductSpec[] {
  if (!raw || typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && typeof s.label === "string" && typeof s.value === "string")
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
      .filter((s) => s.label.length > 0 || s.value.length > 0);
  } catch {
    return [];
  }
}

/** Everything the form carries, parsed without rejecting incomplete work. */
function readFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim() || null;

  const priceRaw = String(formData.get("price") ?? "").trim();
  const parsedPrice = priceRaw ? parseInt(priceRaw, 10) : null;
  const price =
    parsedPrice != null && !Number.isNaN(parsedPrice) ? Math.max(0, parsedPrice) : null;

  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();
  const parsedSort = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;

  return {
    name,
    brand,
    model,
    slugInput: String(formData.get("slug") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? "").trim() || null,
    shortDescription: String(formData.get("shortDescription") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    price,
    currency: String(formData.get("currency") ?? "NGN").trim() || "NGN",
    specifications: parseSpecs(formData.get("specifications")),
    sortOrder: Number.isNaN(parsedSort) ? 0 : parsedSort,
    wantsPublished: formData.get("published") === "on" || formData.get("published") === "true",
    isNewArrival:
      formData.get("isNewArrival") === "on" || formData.get("isNewArrival") === "true",
    isNowAvailable:
      formData.get("isNowAvailable") === "on" || formData.get("isNowAvailable") === "true",
    inStock: formData.get("inStock") === "on" || formData.get("inStock") === "true",
  };
}

/**
 * A product only reaches the storefront when it is actually presentable.
 * Nothing is rejected — incomplete work saves as a draft and the admin is
 * told which piece is missing. This is enforced here, on the server, so it
 * holds regardless of what the form sends.
 */
function resolvePublish(
  wantsPublished: boolean,
  fields: { name: string; brand: string },
  imageIds: string[]
): { published: boolean; blockers: string[] } {
  const blockers: string[] = [];
  if (imageIds.length === 0) blockers.push("at least one image");
  if (!fields.name) blockers.push("a product name");
  if (!fields.brand) blockers.push("a brand");
  return { published: wantsPublished && blockers.length === 0, blockers };
}

function draftNotice(blockers: string[]): string {
  return `Saved as a draft — not live on the site yet. Add ${blockers.join(
    ", "
  )} to publish it.`;
}

function revalidateProduct(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/products");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const fields = readFields(formData);

  // Slug must exist and be unique even for a half-filled draft.
  let slug = fields.slugInput
    ? slugify(fields.slugInput)
    : slugify(
        [fields.brand, fields.name, fields.model].filter(Boolean).join(" ")
      );
  if (!slug) slug = `draft-${Date.now()}`;

  const { ids: uploadedIds, rejected } = await uploadProductImages(
    readImageFiles(formData)
  );

  const { published, blockers } = resolvePublish(
    fields.wantsPublished,
    fields,
    uploadedIds
  );

  const input: CreateProductInput = {
    name: fields.name || "Untitled product",
    slug,
    brand: fields.brand,
    model: fields.model,
    categoryId: fields.categoryId,
    shortDescription: fields.shortDescription,
    description: fields.description,
    price: fields.price,
    currency: fields.currency,
    isNewArrival: fields.isNewArrival,
    isNowAvailable: fields.isNowAvailable,
    inStock: fields.inStock,
    published,
    specifications: fields.specifications,
    sortOrder: fields.sortOrder,
    imageIds: uploadedIds,
  };

  try {
    const newId = await createProduct(input);
    revalidateProduct(slug);

    const notes: string[] = [];
    if (rejected.length > 0) {
      notes.push(
        `Skipped ${rejected.map((r) => `${r.name} (${r.reason})`).join(", ")}.`
      );
    }

    return {
      status: "success",
      productId: newId,
      savedAsDraft: !published,
      message: published
        ? ["Product published.", ...notes].join(" ")
        : [draftNotice(blockers), ...notes].join(" "),
    };
  } catch (error) {
    console.error("createProductAction failed:", error);
    // Don't strand the just-uploaded files if the row never got created.
    await Promise.all(uploadedIds.map(deleteProductImage));
    return {
      status: "error",
      message: "Could not save. The slug may already be in use — try a different one.",
    };
  }
}

export async function updateProductFullAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const fields = readFields(formData);

  let slug = fields.slugInput
    ? slugify(fields.slugInput)
    : slugify([fields.brand, fields.name, fields.model].filter(Boolean).join(" "));
  if (!slug) slug = `draft-${Date.now()}`;

  const keptIds = readKeptImageIds(formData);
  const { ids: uploadedIds, rejected } = await uploadProductImages(
    readImageFiles(formData)
  );
  const imageIds = [...keptIds, ...uploadedIds];

  const { published, blockers } = resolvePublish(
    fields.wantsPublished,
    fields,
    imageIds
  );

  const update: ProductUpdate = {
    name: fields.name || "Untitled product",
    slug,
    brand: fields.brand,
    model: fields.model,
    categoryId: fields.categoryId,
    shortDescription: fields.shortDescription,
    description: fields.description,
    price: fields.price,
    currency: fields.currency,
    isNewArrival: fields.isNewArrival,
    isNowAvailable: fields.isNowAvailable,
    inStock: fields.inStock,
    published,
    specifications: fields.specifications,
    sortOrder: fields.sortOrder,
    imageIds,
  };

  try {
    // Work out what the admin removed before the row is overwritten.
    const existing = await getProductById(id);
    await updateProduct(id, update);

    if (existing) {
      const removed = existing.imageIds.filter((old) => !imageIds.includes(old));
      await Promise.all(removed.map(deleteProductImage));
    }

    revalidateProduct(slug);

    const notes: string[] = [];
    if (rejected.length > 0) {
      notes.push(
        `Skipped ${rejected.map((r) => `${r.name} (${r.reason})`).join(", ")}.`
      );
    }

    return {
      status: "success",
      savedAsDraft: !published,
      message: published
        ? ["Changes saved and live.", ...notes].join(" ")
        : [draftNotice(blockers), ...notes].join(" "),
    };
  } catch (error) {
    console.error(`updateProductFullAction(${id}) failed:`, error);
    await Promise.all(uploadedIds.map(deleteProductImage));
    return { status: "error", message: "Could not save changes. Try again." };
  }
}

export async function deleteProductAction(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const existing = await getProductById(id);
    await deleteProduct(id);
    if (existing) await Promise.all(existing.imageIds.map(deleteProductImage));
    revalidateProduct();
    return { ok: true };
  } catch (error) {
    console.error(`deleteProductAction(${id}) failed:`, error);
    return { ok: false, error: "Failed to delete product." };
  }
}

export async function saveProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const priceRaw = String(formData.get("price") ?? "").trim();
  const parsed = priceRaw ? parseInt(priceRaw, 10) : null;
  const price = parsed != null && !Number.isNaN(parsed) ? Math.max(0, parsed) : null;

  try {
    const existing = await getProductById(id);
    const wantsPublished = formData.get("published") === "on";
    // Same gate as the full form: an imageless product cannot go live.
    const published = wantsPublished && (existing?.imageIds.length ?? 0) > 0;

    await updateProduct(id, {
      price,
      inStock: formData.get("inStock") === "on",
      published,
      isNewArrival: formData.get("isNewArrival") === "on",
      isNowAvailable: formData.get("isNowAvailable") === "on",
    });

    revalidateProduct();

    if (wantsPublished && !published) {
      return {
        status: "success",
        savedAsDraft: true,
        message: "Saved as a draft — add an image before publishing.",
      };
    }
    return { status: "success", message: "Saved." };
  } catch (error) {
    console.error(`saveProduct(${id}) failed:`, error);
    return { status: "error", message: "Could not save. Try again." };
  }
}

export async function toggleProductFlag(
  id: string,
  field: "inStock" | "published" | "isNewArrival" | "isNowAvailable",
  value: boolean
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (field === "published" && value) {
      const existing = await getProductById(id);
      if (!existing || existing.imageIds.length === 0) {
        return { ok: false, error: "Add an image before publishing this product." };
      }
    }
    await updateProduct(id, { [field]: value });
    revalidateProduct();
    return { ok: true };
  } catch (error) {
    console.error(`toggleProductFlag(${id}, ${field}) failed:`, error);
    return { ok: false, error: "Failed to update status." };
  }
}
