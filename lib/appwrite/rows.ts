import "server-only";

import { type Models, Query, type TablesDB } from "node-appwrite";
import { appwriteEnv } from "./config";

/**
 * Fetch every row that matches `queries`, following cursor pagination so
 * we are not limited by Appwrite's per-request page size. `cap` is a
 * safety limit for this small catalogue.
 */
export async function listAllRows(
  tables: TablesDB,
  tableId: string,
  queries: string[] = [],
  cap = 2000,
): Promise<Models.DefaultRow[]> {
  const pageSize = 100;
  const out: Models.DefaultRow[] = [];
  let cursor: string | undefined;

  for (;;) {
    const pageQueries = [...queries, Query.limit(pageSize)];
    if (cursor) pageQueries.push(Query.cursorAfter(cursor));

    const res = await tables.listRows({
      databaseId: appwriteEnv.databaseId,
      tableId,
      queries: pageQueries,
    });

    out.push(...res.rows);

    if (res.rows.length < pageSize || out.length >= cap) break;
    cursor = res.rows[res.rows.length - 1]?.$id;
    if (!cursor) break;
  }

  return out;
}
