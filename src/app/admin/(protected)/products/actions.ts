"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type CreateProductInput,
  type ProductUpdate,
} from "@/lib/data/products";
import type { ProductSpec } from "@/lib/types";

export interface ProductFormState {
  status: "idle" | "success" | "error";
  message: string;
  productId?: string;
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

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim() || null;
  let slug = String(formData.get("slug") ?? "").trim();

  if (!name) {
    return { status: "error", message: "Product name is required." };
  }
  if (!brand) {
    return { status: "error", message: "Brand is required." };
  }

  if (!slug) {
    slug = slugify(model ? `${brand} ${name} ${model}` : `${brand} ${name}`);
  } else {
    slug = slugify(slug);
  }

  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  const shortDescription = String(formData.get("shortDescription") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = priceRaw ? Math.max(0, parseInt(priceRaw, 10)) : null;
  if (priceRaw && Number.isNaN(price)) {
    return { status: "error", message: "Price must be a valid number." };
  }

  const currency = String(formData.get("currency") ?? "NGN").trim() || "NGN";
  const specifications = parseSpecs(formData.get("specifications"));

  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();
  const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;

  const input: CreateProductInput = {
    name,
    slug,
    brand,
    model,
    categoryId,
    shortDescription,
    description,
    price,
    currency,
    isNewArrival: formData.get("isNewArrival") === "on" || formData.get("isNewArrival") === "true",
    isNowAvailable: formData.get("isNowAvailable") === "on" || formData.get("isNowAvailable") === "true",
    inStock: formData.get("inStock") === "on" || formData.get("inStock") === "true",
    published: formData.get("published") === "on" || formData.get("published") === "true",
    specifications,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    imageIds: [],
  };

  try {
    const newId = await createProduct(input);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/products");
    return { status: "success", message: "Product created successfully.", productId: newId };
  } catch (error) {
    console.error("createProductAction failed:", error);
    return { status: "error", message: "Failed to create product. Check if slug is unique or try again." };
  }
}

export async function updateProductFullAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim() || null;
  let slug = String(formData.get("slug") ?? "").trim();

  if (!name) {
    return { status: "error", message: "Product name is required." };
  }
  if (!brand) {
    return { status: "error", message: "Brand is required." };
  }

  if (!slug) {
    slug = slugify(model ? `${brand} ${name} ${model}` : `${brand} ${name}`);
  } else {
    slug = slugify(slug);
  }

  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  const shortDescription = String(formData.get("shortDescription") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;

  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = priceRaw ? Math.max(0, parseInt(priceRaw, 10)) : null;
  if (priceRaw && Number.isNaN(price)) {
    return { status: "error", message: "Price must be a valid number." };
  }

  const currency = String(formData.get("currency") ?? "NGN").trim() || "NGN";
  const specifications = parseSpecs(formData.get("specifications"));

  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();
  const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;

  const update: ProductUpdate = {
    name,
    slug,
    brand,
    model,
    categoryId,
    shortDescription,
    description,
    price,
    currency,
    isNewArrival: formData.get("isNewArrival") === "on" || formData.get("isNewArrival") === "true",
    isNowAvailable: formData.get("isNowAvailable") === "on" || formData.get("isNowAvailable") === "true",
    inStock: formData.get("inStock") === "on" || formData.get("inStock") === "true",
    published: formData.get("published") === "on" || formData.get("published") === "true",
    specifications,
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
  };

  try {
    await updateProduct(id, update);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/products");
    if (slug) revalidatePath(`/products/${slug}`);
    return { status: "success", message: "Product updated successfully." };
  } catch (error) {
    console.error(`updateProductFullAction(${id}) failed:`, error);
    return { status: "error", message: "Failed to update product." };
  }
}

export async function deleteProductAction(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await deleteProduct(id);
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/products");
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
  const price = priceRaw ? Math.max(0, parseInt(priceRaw, 10)) : null;

  if (priceRaw && Number.isNaN(price)) {
    return { status: "error", message: "Price must be a number." };
  }

  try {
    await updateProduct(id, {
      price,
      inStock: formData.get("inStock") === "on",
      published: formData.get("published") === "on",
      isNewArrival: formData.get("isNewArrival") === "on",
      isNowAvailable: formData.get("isNowAvailable") === "on",
    });
  } catch (error) {
    console.error(`saveProduct(${id}) failed:`, error);
    return { status: "error", message: "Could not save. Try again." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");

  return { status: "success", message: "Saved." };
}

export async function toggleProductFlag(
  id: string,
  field: "inStock" | "published" | "isNewArrival" | "isNowAvailable",
  value: boolean
): Promise<{ ok: boolean; error?: string }> {
  try {
    await updateProduct(id, { [field]: value });
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { ok: true };
  } catch (error) {
    console.error(`toggleProductFlag(${id}, ${field}) failed:`, error);
    return { ok: false, error: "Failed to update status." };
  }
}

