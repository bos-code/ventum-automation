import "server-only";
import { AppwriteException, Query } from "node-appwrite";
import { getTablesDB } from "@/lib/appwrite/client";
import { appwriteEnv } from "@/lib/appwrite/env";

export const REPORT_PERIOD_DAYS = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 100;

/**
 * Day the 5-day cycle is counted from (UTC). The first report was sent
 * manually on this day; the daily scheduled call only sends on every fifth day
 * after it (2026-10-04, 2026-10-09, ...).
 */
const CYCLE_ANCHOR_UTC = Date.UTC(2026, 8, 29);

export function isReportDay(now: Date): boolean {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const days = Math.round((today - CYCLE_ANCHOR_UTC) / DAY_MS);
  return ((days % REPORT_PERIOD_DAYS) + REPORT_PERIOD_DAYS) % REPORT_PERIOD_DAYS === 0;
}

export type AppwriteFailureKind =
  | "project_paused"
  | "config_or_auth"
  | "unreachable"
  | "failed";

export class AppwriteCheckError extends Error {
  constructor(
    readonly kind: AppwriteFailureKind,
    readonly step: string,
    readonly cause: unknown
  ) {
    super(`Appwrite ${step} failed (${kind})`);
  }
}

function classify(error: unknown): AppwriteFailureKind {
  if (error instanceof AppwriteException) {
    const type = error.type ?? "";
    if (type === "project_paused") return "project_paused";
    if (
      // code 0 = rejected client-side by the SDK (e.g. invalid endpoint).
      !error.code ||
      error.code === 401 ||
      error.code === 403 ||
      error.code === 404 ||
      type.startsWith("general_unauthorized") ||
      type.startsWith("project_")
    ) {
      return "config_or_auth";
    }
    return "failed";
  }
  if (error instanceof Error) {
    if (error.message.startsWith("Missing required environment variable")) {
      return "config_or_auth";
    }
    if (error.name === "TypeError" || /fetch failed|ECONN|ENOTFOUND|ETIMEDOUT/i.test(error.message)) {
      return "unreachable";
    }
  }
  return "failed";
}

/** Runs an Appwrite call, re-throwing any failure as a classified error. */
async function step<T>(name: string, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    throw new AppwriteCheckError(classify(error), name, error);
  }
}

export interface ActivityStats {
  periodStart: string;
  periodEnd: string;
  enquiries: number;
  productsRequested: number;
  /** Sum of NGN unit price × quantity for every item with a stored price. */
  enquiryValueNgn: number;
  /** Requested units whose value could not be derived (no stored NGN price). */
  unpricedUnits: number;
  publishedProducts: number;
  publishedCategories: number;
}

interface EnquiryRow {
  productId?: string | null;
  productName?: string | null;
  productPrice?: number | null;
  productCurrency?: string | null;
  quantity?: number | null;
  message?: string | null;
}

interface Line {
  quantity: number;
  unitPriceNgn: number | null;
}

/**
 * Multi-product enquiries (submitMultiProductEnquiry) are stored as a
 * single row with no price column set — the items, quantities and unit
 * prices only exist in the itemised `message` that action generates:
 *
 *   Enquiry List:\n\n1. Name (Model)\n   Quantity: 2\n   Unit Price: ₦12,000\n\n2. ...
 *
 * Returns null when the message isn't in that format.
 */
function parseItemisedMessage(message: string): Line[] | null {
  if (!message.startsWith("Enquiry List:\n\n")) return null;
  const list = message.slice("Enquiry List:\n\n".length).split("\n\nCustomer Note:\n")[0];
  const lines: Line[] = [];
  for (const block of list.split("\n\n")) {
    const quantity = block.match(/^\s*Quantity:\s*(\d+)\s*$/m);
    if (!quantity) return null;
    const price = block.match(/^\s*Unit Price:\s*₦([\d,]+(?:\.\d+)?)\s*$/m);
    lines.push({
      quantity: Number(quantity[1]),
      unitPriceNgn: price ? Number(price[1].replace(/,/g, "")) : null,
    });
  }
  return lines;
}

function enquiryLines(row: EnquiryRow): Line[] {
  const quantity = Math.max(0, Number(row.quantity) || 0);

  if (row.message && row.productPrice == null) {
    const parsed = parseItemisedMessage(row.message);
    if (parsed) return parsed;
  }

  // A contact-form enquiry with no product attached isn't a product request.
  if (!row.productId && row.productName === "General enquiry") return [];

  const isNgn = (row.productCurrency ?? "NGN") === "NGN";
  return [
    {
      quantity,
      unitPriceNgn: row.productPrice != null && isNgn ? row.productPrice : null,
    },
  ];
}

/**
 * Queries Appwrite directly (unlike getPublishedProducts, failures are
 * NOT swallowed) and computes activity for the `REPORT_PERIOD_DAYS`
 * ending at `now`. Throws AppwriteCheckError on any Appwrite failure.
 */
export async function collectActivityStats(now = new Date()): Promise<ActivityStats> {
  const tablesDB = getTablesDB();
  const databaseId = appwriteEnv.databaseId;
  const periodEnd = now.toISOString();
  const periodStart = new Date(now.getTime() - REPORT_PERIOD_DAYS * DAY_MS).toISOString();

  const products = await step("catalogue check", () =>
    tablesDB.listRows({
      databaseId,
      tableId: appwriteEnv.tables.products,
      queries: [Query.equal("published", true), Query.limit(1)],
    })
  );
  const categories = await step("category check", () =>
    tablesDB.listRows({
      databaseId,
      tableId: appwriteEnv.tables.categories,
      queries: [Query.equal("published", true), Query.limit(1)],
    })
  );

  const rows: EnquiryRow[] = [];
  let cursor: string | undefined;
  for (;;) {
    const page = await step("enquiry query", () =>
      tablesDB.listRows({
        databaseId,
        tableId: appwriteEnv.tables.enquiries,
        queries: [
          Query.greaterThanEqual("$createdAt", periodStart),
          Query.lessThan("$createdAt", periodEnd),
          Query.orderAsc("$createdAt"),
          Query.limit(PAGE_SIZE),
          ...(cursor ? [Query.cursorAfter(cursor)] : []),
        ],
      })
    );
    rows.push(...(page.rows as unknown as EnquiryRow[]));
    if (page.rows.length < PAGE_SIZE) break;
    cursor = page.rows[page.rows.length - 1].$id;
  }

  let productsRequested = 0;
  let enquiryValueNgn = 0;
  let unpricedUnits = 0;
  for (const row of rows) {
    for (const line of enquiryLines(row)) {
      productsRequested += line.quantity;
      if (line.unitPriceNgn == null) unpricedUnits += line.quantity;
      else enquiryValueNgn += line.unitPriceNgn * line.quantity;
    }
  }

  return {
    periodStart,
    periodEnd,
    enquiries: rows.length,
    productsRequested,
    enquiryValueNgn: Math.round(enquiryValueNgn),
    unpricedUnits,
    publishedProducts: products.total,
    publishedCategories: categories.total,
  };
}

export function formatActivityReport(stats: ActivityStats): string {
  const value = `₦${stats.enquiryValueNgn.toLocaleString("en-NG")}`;
  const unpriced = stats.unpricedUnits > 0 ? ` (${stats.unpricedUnits} unpriced)` : "";
  const products = `${stats.publishedProducts} ${stats.publishedProducts === 1 ? "product" : "products"}`;
  return [
    `<b>Ventum — ${REPORT_PERIOD_DAYS}-Day Activity</b>`,
    "",
    `Enquiries: ${stats.enquiries}`,
    `Products requested: ${stats.productsRequested}`,
    `Enquiry value: ${value}${unpriced}`,
    `Catalogue: ${products}`,
  ].join("\n");
}

const FAILURE_LABELS: Record<AppwriteFailureKind, string> = {
  project_paused: "project is paused",
  config_or_auth: "configuration/authentication error",
  unreachable: "Appwrite unreachable",
  failed: "unexpected error",
};

export function formatBackendAlert(error: AppwriteCheckError): string {
  return [
    "<b>Ventum Backend Alert</b>",
    "",
    `Appwrite ${error.step} failed (${FAILURE_LABELS[error.kind]}).`,
    "Activity report could not be generated.",
  ].join("\n");
}
