import "server-only";
import { cache } from "react";
import { Query } from "node-appwrite";
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
    featured: Boolean(row.featured),
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

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getPublishedProducts();
  return products.filter((product) => product.featured);
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
