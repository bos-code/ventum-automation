import "server-only";
import { ID } from "node-appwrite";
import { getTablesDB } from "@/lib/appwrite/client";
import { appwriteEnv } from "@/lib/appwrite/env";
import { notifyTelegram } from "@/lib/telegram";
import type { EnquiryInput } from "@/lib/types";

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
