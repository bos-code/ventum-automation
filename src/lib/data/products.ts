import "server-only";
import { cache } from "react";
import { ID, Query } from "node-appwrite";
import { getTablesDB } from "@/lib/appwrite/client";
import { appwriteEnv } from "@/lib/appwrite/env";
import type { Product, ProductSpec } from "@/lib/types";

function parseSpecifications(raw: unknown): ProductSpec[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProductSpec[]) : [];
  } catch {
    return [];
  }
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.$id as string,
    name: row.name as string,
    slug: row.slug as string,
    brand: row.brand as string,
    categoryId: (row.categoryId as string | null) ?? null,
    model: (row.model as string | null) ?? null,
    shortDescription: (row.shortDescription as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    price: (row.price as number | null) ?? null,
    currency: (row.currency as string) ?? "NGN",
    isNewArrival: Boolean(row.isNewArrival),
    isNowAvailable: Boolean(row.isNowAvailable),
    inStock: row.inStock !== false,
    published: Boolean(row.published),
    imageIds: (row.imageIds as string[]) ?? [],
    specifications: parseSpecifications(row.specifications),
    sortOrder: (row.sortOrder as number) ?? 0,
  };
}

/**
 * Reads all published products. Returns an empty list (instead of
 * throwing) on an Appwrite/network failure — every homepage section
 * that calls this already handles an empty list gracefully, so a
 * transient outage degrades to "no products shown here" rather than
 * crashing the whole page.
 */
export const getPublishedProducts = cache(async (): Promise<Product[]> => {
  try {
    const tablesDB = getTablesDB();
    const { rows } = await tablesDB.listRows({
      databaseId: appwriteEnv.databaseId,
      tableId: appwriteEnv.tables.products,
      queries: [Query.equal("published", true), Query.orderAsc("sortOrder")],
    });
    return rows.map((row) => mapProduct(row as unknown as Record<string, unknown>));
  } catch (error) {
    console.error("getPublishedProducts failed:", error);
    return [];
  }
});

export async function getNewArrivals(): Promise<Product[]> {
  const products = await getPublishedProducts();
  return products.filter((product) => product.isNewArrival);
}

export async function getNowAvailable(): Promise<Product[]> {
  const products = await getPublishedProducts();
  return products.filter((product) => product.isNowAvailable);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const tablesDB = getTablesDB();
    const { rows } = await tablesDB.listRows({
      databaseId: appwriteEnv.databaseId,
      tableId: appwriteEnv.tables.products,
      queries: [
        Query.equal("slug", slug),
        Query.equal("published", true),
        Query.limit(1),
      ],
    });
    const row = rows[0];
    return row ? mapProduct(row as unknown as Record<string, unknown>) : null;
  } catch (error) {
    console.error(`getProductBySlug(${slug}) failed:`, error);
    return null;
  }
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const products = await getPublishedProducts();
  return products.filter((product) => product.categoryId === categoryId);
}

/** Admin-only: every product regardless of published status. */
export async function getAllProductsForAdmin(): Promise<Product[]> {
  const tablesDB = getTablesDB();
  const { rows } = await tablesDB.listRows({
    databaseId: appwriteEnv.databaseId,
    tableId: appwriteEnv.tables.products,
    queries: [Query.orderAsc("sortOrder")],
  });
  return rows.map((row) => mapProduct(row as unknown as Record<string, unknown>));
}

export interface CreateProductInput {
  name: string;
  slug: string;
  brand: string;
  categoryId?: string | null;
  model?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string;
  isNewArrival?: boolean;
  isNowAvailable?: boolean;
  inStock?: boolean;
  published?: boolean;
  imageIds?: string[];
  specifications?: ProductSpec[] | string;
  sortOrder?: number;
}

export interface ProductUpdate {
  name?: string;
  slug?: string;
  brand?: string;
  categoryId?: string | null;
  model?: string | null;
  price?: number | null;
  currency?: string;
  inStock?: boolean;
  published?: boolean;
  isNewArrival?: boolean;
  isNowAvailable?: boolean;
  shortDescription?: string | null;
  description?: string | null;
  imageIds?: string[];
  specifications?: ProductSpec[] | string;
  sortOrder?: number;
}

export async function createProduct(input: CreateProductInput): Promise<string> {
  const tablesDB = getTablesDB();
  const id = ID.unique();

  const specsString =
    typeof input.specifications === "string"
      ? input.specifications
      : Array.isArray(input.specifications)
      ? JSON.stringify(input.specifications)
      : "[]";

  const row = await tablesDB.createRow({
    databaseId: appwriteEnv.databaseId,
    tableId: appwriteEnv.tables.products,
    rowId: id,
    data: {
      name: input.name.trim(),
      slug: input.slug.trim(),
      brand: input.brand.trim(),
      categoryId: input.categoryId || null,
      model: input.model ? input.model.trim() : null,
      shortDescription: input.shortDescription ? input.shortDescription.trim() : null,
      description: input.description ? input.description.trim() : null,
      price: input.price != null ? input.price : null,
      currency: input.currency || "NGN",
      isNewArrival: Boolean(input.isNewArrival),
      isNowAvailable: Boolean(input.isNowAvailable),
      inStock: input.inStock !== false,
      published: Boolean(input.published),
      imageIds: input.imageIds ?? [],
      specifications: specsString,
      sortOrder: input.sortOrder ?? 0,
    },
  });

  return (row as unknown as { $id: string }).$id;
}

export async function updateProduct(
  id: string,
  data: ProductUpdate
): Promise<void> {
  const tablesDB = getTablesDB();

  const payload: Record<string, unknown> = { ...data };
  if (Array.isArray(payload.specifications)) {
    payload.specifications = JSON.stringify(payload.specifications);
  }

  await tablesDB.updateRow({
    databaseId: appwriteEnv.databaseId,
    tableId: appwriteEnv.tables.products,
    rowId: id,
    data: payload,
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const tablesDB = getTablesDB();
  await tablesDB.deleteRow({
    databaseId: appwriteEnv.databaseId,
    tableId: appwriteEnv.tables.products,
    rowId: id,
  });
}

