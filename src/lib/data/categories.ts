import "server-only";
import { cache } from "react";
import { Query } from "node-appwrite";
import { getTablesDB } from "@/lib/appwrite/client";
import { appwriteEnv } from "@/lib/appwrite/env";
import type { Category } from "@/lib/types";

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.$id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string | null) ?? null,
    sortOrder: (row.sortOrder as number) ?? 0,
    published: Boolean(row.published),
  };
}

export const getPublishedCategories = cache(async (): Promise<Category[]> => {
  try {
    const tablesDB = getTablesDB();
    const { rows } = await tablesDB.listRows({
      databaseId: appwriteEnv.databaseId,
      tableId: appwriteEnv.tables.categories,
      queries: [Query.equal("published", true), Query.orderAsc("sortOrder")],
    });
    return rows.map((row) => mapCategory(row as unknown as Record<string, unknown>));
  } catch (error) {
    console.error("getPublishedCategories failed:", error);
    return [];
  }
});

export async function getAllCategoriesForAdmin(): Promise<Category[]> {
  try {
    const tablesDB = getTablesDB();
    const { rows } = await tablesDB.listRows({
      databaseId: appwriteEnv.databaseId,
      tableId: appwriteEnv.tables.categories,
      queries: [Query.orderAsc("sortOrder")],
    });
    return rows.map((row) => mapCategory(row as unknown as Record<string, unknown>));
  } catch (error) {
    console.error("getAllCategoriesForAdmin failed:", error);
    return [];
  }
}

