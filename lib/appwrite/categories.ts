import "server-only";

import { unstable_cache } from "next/cache";
import { ID } from "node-appwrite";
import type { Category } from "@/types";
import { CACHE_TAGS, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache";
import type { CategoryData } from "@/lib/validation/category";
import { createAdminClient } from "./clients";
import { appwriteEnv, isAppwriteConfigured } from "./config";
import { rowToCategory } from "./mappers";
import { listAllRows } from "./rows";

const TABLE = appwriteEnv.collections.categories;

function bySortOrder(a: Category, b: Category) {
  return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
}

async function fetchAllCategories(): Promise<Category[]> {
  const { tables } = createAdminClient();
  const rows = await listAllRows(tables, TABLE);
  return rows.map(rowToCategory).sort(bySortOrder);
}

const getPublishedCategoriesCached = unstable_cache(
  async (): Promise<Category[]> => {
    const all = await fetchAllCategories();
    return all.filter((c) => c.published);
  },
  ["published-categories"],
  { tags: [CACHE_TAGS.categories], revalidate: PUBLIC_REVALIDATE_SECONDS },
);

/** Public: published categories only, cached and tag-revalidated. */
export async function getPublishedCategories(): Promise<Category[]> {
  if (!isAppwriteConfigured()) return [];
  try {
    return await getPublishedCategoriesCached();
  } catch (error) {
    console.error("[categories] getPublishedCategories failed", error);
    return [];
  }
}

/** Admin: every category, always fresh. */
export async function getAllCategories(): Promise<Category[]> {
  if (!isAppwriteConfigured()) return [];
  try {
    return await fetchAllCategories();
  } catch (error) {
    console.error("[categories] getAllCategories failed", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { tables } = createAdminClient();
    const row = await tables.getRow({
      databaseId: appwriteEnv.databaseId,
      tableId: TABLE,
      rowId: id,
    });
    return rowToCategory(row);
  } catch {
    return null;
  }
}

/** True if another category already uses this slug. */
export async function categorySlugTaken(
  slug: string,
  exceptId?: string,
): Promise<boolean> {
  const all = await getAllCategories();
  return all.some((c) => c.slug === slug && c.id !== exceptId);
}

export async function createCategory(data: CategoryData): Promise<Category> {
  const { tables } = createAdminClient();
  const row = await tables.createRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: ID.unique(),
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      sortOrder: data.sortOrder,
      published: data.published,
    },
  });
  return rowToCategory(row);
}

export async function updateCategory(
  id: string,
  data: CategoryData,
): Promise<Category> {
  const { tables } = createAdminClient();
  const row = await tables.updateRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: id,
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      sortOrder: data.sortOrder,
      published: data.published,
    },
  });
  return rowToCategory(row);
}

export async function deleteCategory(id: string): Promise<void> {
  const { tables } = createAdminClient();
  await tables.deleteRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: id,
  });
}

/** Persist a new display order (array of category ids, first = top). */
export async function reorderCategories(orderedIds: string[]): Promise<void> {
  const { tables } = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      tables.updateRow({
        databaseId: appwriteEnv.databaseId,
        tableId: TABLE,
        rowId: id,
        data: { sortOrder: index },
      }),
    ),
  );
}
