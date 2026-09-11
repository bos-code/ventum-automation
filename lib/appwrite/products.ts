import "server-only";

import { unstable_cache } from "next/cache";
import { ID } from "node-appwrite";
import type {
  CatalogueQuery,
  Category,
  Paginated,
  Product,
  ProductView,
} from "@/types";
import { CACHE_TAGS, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache";
import {
  cleanSpecifications,
  type ProductData,
} from "@/lib/validation/product";
import { createAdminClient } from "./clients";
import {
  appwriteEnv,
  fileViewUrl,
  isAppwriteConfigured,
} from "./config";
import { rowToProduct, serializeSpecifications } from "./mappers";
import { listAllRows } from "./rows";
import { getPublishedCategories } from "./categories";

const TABLE = appwriteEnv.collections.products;

export const CATALOGUE_PAGE_SIZE = 12;

function bySortOrder(a: Product, b: Product) {
  return (
    a.sortOrder - b.sortOrder || b.createdAt.localeCompare(a.createdAt)
  );
}

async function fetchAllProducts(): Promise<Product[]> {
  const { tables } = createAdminClient();
  const rows = await listAllRows(tables, TABLE);
  return rows.map(rowToProduct).sort(bySortOrder);
}

const getPublishedProductsCached = unstable_cache(
  async (): Promise<Product[]> => {
    const all = await fetchAllProducts();
    return all.filter((p) => p.published);
  },
  ["published-products"],
  { tags: [CACHE_TAGS.products], revalidate: PUBLIC_REVALIDATE_SECONDS },
);

/** Public: every published product, cached and tag-revalidated. */
export async function getPublishedProducts(): Promise<Product[]> {
  if (!isAppwriteConfigured()) return [];
  try {
    return await getPublishedProductsCached();
  } catch (error) {
    console.error("[products] getPublishedProducts failed", error);
    return [];
  }
}

/** Admin: every product regardless of status, always fresh. */
export async function getAllProducts(): Promise<Product[]> {
  if (!isAppwriteConfigured()) return [];
  try {
    return await fetchAllProducts();
  } catch (error) {
    console.error("[products] getAllProducts failed", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { tables } = createAdminClient();
    const row = await tables.getRow({
      databaseId: appwriteEnv.databaseId,
      tableId: TABLE,
      rowId: id,
    });
    return rowToProduct(row);
  } catch {
    return null;
  }
}

/** Attach the product's category and build public image URLs. */
export function toProductView(
  product: Product,
  categories: Category[],
): ProductView {
  return {
    ...product,
    category:
      categories.find((c) => c.id === product.categoryId) ?? null,
    imageUrls: product.imageIds.map(fileViewUrl),
  };
}

export async function getPublishedProductView(
  slug: string,
): Promise<ProductView | null> {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getPublishedCategories(),
  ]);
  const product = products.find((p) => p.slug === slug);
  return product ? toProductView(product, categories) : null;
}

export async function getFeaturedProducts(limit = 6): Promise<ProductView[]> {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getPublishedCategories(),
  ]);
  return products
    .filter((p) => p.featured)
    .slice(0, limit)
    .map((p) => toProductView(p, categories));
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<ProductView[]> {
  if (!product.categoryId) return [];
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getPublishedCategories(),
  ]);
  return products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit)
    .map((p) => toProductView(p, categories));
}

/** Public image URLs across published products, for the stock gallery. */
export async function getStockGalleryImages(limit = 8): Promise<string[]> {
  const products = await getPublishedProducts();
  return products
    .flatMap((p) => p.imageIds)
    .slice(0, limit)
    .map(fileViewUrl);
}

/** Distinct brand names across published products, alphabetical. */
export async function getPublishedBrands(): Promise<string[]> {
  const products = await getPublishedProducts();
  return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );
}

function searchHaystack(product: Product): string {
  return [
    product.name,
    product.brand,
    product.model ?? "",
    product.shortDescription ?? "",
    ...product.specifications.flatMap((s) => [s.label, s.value]),
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Filtered, paginated catalogue view. Filtering and pagination happen in
 * memory over the cached published list — the catalogue is small and this
 * avoids requiring bespoke Appwrite indexes. If the catalogue grows to
 * many hundreds of items, move this to server-side queries + indexes.
 */
export async function getCatalogue(
  query: CatalogueQuery,
): Promise<Paginated<ProductView> & { brands: string[]; categories: Category[] }> {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getPublishedCategories(),
  ]);

  const brands = [
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));

  let items = products;

  if (query.category) {
    const category = categories.find((c) => c.slug === query.category);
    items = category ? items.filter((p) => p.categoryId === category.id) : [];
  }

  if (query.brand) {
    const brand = query.brand.toLowerCase();
    items = items.filter((p) => p.brand.toLowerCase() === brand);
  }

  const term = query.search?.trim().toLowerCase();
  if (term) {
    items = items.filter((p) => searchHaystack(p).includes(term));
  }

  const pageSize = CATALOGUE_PAGE_SIZE;
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);
  const start = (page - 1) * pageSize;

  return {
    items: items
      .slice(start, start + pageSize)
      .map((p) => toProductView(p, categories)),
    total,
    page,
    pageSize,
    pageCount,
    brands,
    categories,
  };
}

export async function productSlugTaken(
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  const all = await getAllProducts();
  return all.some((p) => p.slug === slug && p.id !== exceptId);
}

function toRowData(data: ProductData) {
  return {
    name: data.name,
    slug: data.slug,
    brand: data.brand,
    categoryId: data.categoryId,
    model: data.model || null,
    shortDescription: data.shortDescription || null,
    description: data.description || null,
    price: data.price,
    currency: data.currency || "NGN",
    featured: data.featured,
    inStock: data.inStock,
    published: data.published,
    imageIds: data.imageIds,
    specifications: serializeSpecifications(
      cleanSpecifications(data.specifications),
    ),
    sortOrder: data.sortOrder,
  };
}

export async function createProduct(data: ProductData): Promise<Product> {
  const { tables } = createAdminClient();
  const row = await tables.createRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: ID.unique(),
    data: toRowData(data),
  });
  return rowToProduct(row);
}

export async function updateProduct(
  id: string,
  data: ProductData,
): Promise<Product> {
  const { tables } = createAdminClient();
  const row = await tables.updateRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: id,
    data: toRowData(data),
  });
  return rowToProduct(row);
}

export async function setProductFlag(
  id: string,
  field: "published" | "featured" | "inStock",
  value: boolean,
): Promise<Product> {
  const { tables } = createAdminClient();
  const row = await tables.updateRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: id,
    data: { [field]: value },
  });
  return rowToProduct(row);
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const { tables } = createAdminClient();
  const existing = await getProductById(id);
  await tables.deleteRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: id,
  });
  return existing;
}
