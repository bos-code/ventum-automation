import "server-only";
import { ID, Query } from "node-appwrite";
import { getTablesDB } from "@/lib/appwrite/client";
import { appwriteEnv } from "@/lib/appwrite/env";
import { notifyTelegram } from "@/lib/telegram";
import type { Enquiry, EnquiryInput, EnquiryStatus } from "@/lib/types";

function formatTelegramMessage(input: EnquiryInput): string {
  const lines = [
    "<b>New enquiry — Ventum Automation</b>",
    `Product: ${input.productName}${input.productModel ? ` (${input.productModel})` : ""}`,
    input.productPrice
      ? `Price: ${input.productCurrency ?? "NGN"} ${input.productPrice.toLocaleString()}`
      : undefined,
    `Quantity: ${input.quantity}`,
    `From: ${input.customerName} — ${input.phone}`,
    input.message ? `Message: ${input.message}` : undefined,
    `Source: ${input.source}`,
  ];
  return lines.filter(Boolean).join("\n");
}

/**
 * Writes an enquiry row and pings Telegram. The Telegram push is
 * best-effort and never blocks or fails the enquiry submission itself.
 */
export async function createEnquiry(input: EnquiryInput): Promise<string> {
  const tablesDB = getTablesDB();
  const row = await tablesDB.createRow({
    databaseId: appwriteEnv.databaseId,
    tableId: appwriteEnv.tables.enquiries,
    rowId: ID.unique(),
    data: {
      productId: input.productId ?? null,
      productName: input.productName,
      productModel: input.productModel ?? null,
      productPrice: input.productPrice ?? null,
      productCurrency: input.productCurrency ?? null,
      customerName: input.customerName,
      phone: input.phone,
      quantity: input.quantity,
      message: input.message ?? null,
      source: input.source,
      status: "new",
    },
  });

  await notifyTelegram(formatTelegramMessage(input));

  return (row as unknown as { $id: string }).$id;
}

function mapEnquiry(row: Record<string, unknown>): Enquiry {
  return {
    id: row.$id as string,
    createdAt: row.$createdAt as string,
    productId: (row.productId as string | null) ?? null,
    productName: row.productName as string,
    productModel: (row.productModel as string | null) ?? null,
    productPrice: (row.productPrice as number | null) ?? null,
    productCurrency: (row.productCurrency as string | null) ?? null,
    customerName: row.customerName as string,
    phone: row.phone as string,
    quantity: row.quantity as number,
    message: (row.message as string | null) ?? null,
    source: row.source as Enquiry["source"],
    status: row.status as EnquiryStatus,
  };
}

/** Admin-only: every enquiry, most recent first. */
export async function getAllEnquiries(): Promise<Enquiry[]> {
  const tablesDB = getTablesDB();
  const { rows } = await tablesDB.listRows({
    databaseId: appwriteEnv.databaseId,
    tableId: appwriteEnv.tables.enquiries,
    queries: [Query.orderDesc("$createdAt"), Query.limit(100)],
  });
  return rows.map((row) => mapEnquiry(row as unknown as Record<string, unknown>));
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<void> {
  const tablesDB = getTablesDB();
  await tablesDB.updateRow({
    databaseId: appwriteEnv.databaseId,
    tableId: appwriteEnv.tables.enquiries,
    rowId: id,
    data: { status },
  });
}
