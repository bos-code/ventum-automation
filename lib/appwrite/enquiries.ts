import "server-only";

import { ID } from "node-appwrite";
import type { Enquiry, EnquirySource, EnquiryStatus } from "@/types";
import { createAdminClient } from "./clients";
import { appwriteEnv, isAppwriteConfigured } from "./config";
import { rowToEnquiry } from "./mappers";
import { listAllRows } from "./rows";

const TABLE = appwriteEnv.collections.enquiries;

export interface CreateEnquiryArgs {
  productId: string | null;
  productName: string;
  productModel: string | null;
  productPrice: number | null;
  productCurrency: string | null;
  customerName: string;
  phone: string;
  quantity: number;
  message: string | null;
  source: EnquirySource;
}

/**
 * Persist an enquiry. Enquiries are never cached and their rows carry no
 * public permissions — only the server (API key) can read them back.
 */
export async function createEnquiry(
  args: CreateEnquiryArgs,
): Promise<Enquiry> {
  const { tables } = createAdminClient();
  const row = await tables.createRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: ID.unique(),
    data: {
      productId: args.productId,
      productName: args.productName,
      productModel: args.productModel,
      productPrice: args.productPrice,
      productCurrency: args.productCurrency,
      customerName: args.customerName,
      phone: args.phone,
      quantity: args.quantity,
      message: args.message,
      source: args.source,
      status: "new" satisfies EnquiryStatus,
    },
  });
  return rowToEnquiry(row);
}

/** Admin: all enquiries, newest first. */
export async function getAllEnquiries(): Promise<Enquiry[]> {
  if (!isAppwriteConfigured()) return [];
  try {
    const { tables } = createAdminClient();
    const rows = await listAllRows(tables, TABLE);
    return rows
      .map(rowToEnquiry)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    console.error("[enquiries] getAllEnquiries failed", error);
    return [];
  }
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  try {
    const { tables } = createAdminClient();
    const row = await tables.getRow({
      databaseId: appwriteEnv.databaseId,
      tableId: TABLE,
      rowId: id,
    });
    return rowToEnquiry(row);
  } catch {
    return null;
  }
}

export async function setEnquiryStatus(
  id: string,
  status: EnquiryStatus,
): Promise<Enquiry> {
  const { tables } = createAdminClient();
  const row = await tables.updateRow({
    databaseId: appwriteEnv.databaseId,
    tableId: TABLE,
    rowId: id,
    data: { status },
  });
  return rowToEnquiry(row);
}

export interface EnquiryStats {
  total: number;
  new: number;
  contacted: number;
  resolved: number;
}

export function summariseEnquiries(enquiries: Enquiry[]): EnquiryStats {
  return {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    resolved: enquiries.filter((e) => e.status === "resolved").length,
  };
}
