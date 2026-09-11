import "server-only";

import type { Models } from "node-appwrite";
import type {
  Category,
  Enquiry,
  EnquirySource,
  EnquiryStatus,
  Product,
  Settings,
  Specification,
} from "@/types";
import { BUSINESS } from "@/lib/constants";

type Row = Models.DefaultRow;

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function optionalStr(value: unknown): string | null {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length > 0 ? s : null;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function int(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function optionalInt(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.length > 0);
}

/** `specifications` is stored as a JSON string: `[{ "label", "value" }]`. */
export function parseSpecifications(value: unknown): Specification[] {
  let raw = value;
  if (typeof value === "string") {
    if (value.trim() === "") return [];
    try {
      raw = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => ({
      label: str((entry as Specification)?.label).trim(),
      value: str((entry as Specification)?.value).trim(),
    }))
    .filter((s) => s.label.length > 0 || s.value.length > 0);
}

export function serializeSpecifications(specs: Specification[]): string {
  return JSON.stringify(
    specs
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
      .filter((s) => s.label.length > 0 || s.value.length > 0),
  );
}

export function rowToCategory(row: Row): Category {
  return {
    id: row.$id,
    name: str(row.name),
    slug: str(row.slug),
    description: optionalStr(row.description),
    sortOrder: int(row.sortOrder),
    published: bool(row.published, true),
    createdAt: row.$createdAt,
    updatedAt: row.$updatedAt,
  };
}

export function rowToProduct(row: Row): Product {
  return {
    id: row.$id,
    name: str(row.name),
    slug: str(row.slug),
    brand: str(row.brand),
    categoryId: optionalStr(row.categoryId),
    model: optionalStr(row.model),
    shortDescription: optionalStr(row.shortDescription),
    description: optionalStr(row.description),
    price: optionalInt(row.price),
    currency: str(row.currency, "NGN"),
    featured: bool(row.featured),
    inStock: bool(row.inStock, true),
    published: bool(row.published),
    imageIds: stringArray(row.imageIds),
    specifications: parseSpecifications(row.specifications),
    sortOrder: int(row.sortOrder),
    createdAt: row.$createdAt,
    updatedAt: row.$updatedAt,
  };
}

const ENQUIRY_STATUSES: EnquiryStatus[] = ["new", "contacted", "resolved"];
const ENQUIRY_SOURCES: EnquirySource[] = ["request_form", "whatsapp"];

export function rowToEnquiry(row: Row): Enquiry {
  const status = str(row.status, "new") as EnquiryStatus;
  const source = str(row.source, "request_form") as EnquirySource;
  return {
    id: row.$id,
    productId: optionalStr(row.productId),
    productName: str(row.productName),
    productModel: optionalStr(row.productModel),
    productPrice: optionalInt(row.productPrice),
    productCurrency: optionalStr(row.productCurrency),
    customerName: str(row.customerName),
    phone: str(row.phone),
    quantity: int(row.quantity, 1),
    message: optionalStr(row.message),
    source: ENQUIRY_SOURCES.includes(source) ? source : "request_form",
    status: ENQUIRY_STATUSES.includes(status) ? status : "new",
    createdAt: row.$createdAt,
  };
}

export function rowToSettings(row: Row | null): Settings {
  return {
    businessName: str(row?.businessName) || BUSINESS.name,
    legalName: str(row?.legalName) || BUSINESS.legalName,
    email: str(row?.email) || BUSINESS.email,
    phone: str(row?.phone) || BUSINESS.phone,
    whatsapp: str(row?.whatsapp) || BUSINESS.whatsapp,
    secondaryPhone: str(row?.secondaryPhone) || BUSINESS.secondaryPhone,
    address: str(row?.address) || BUSINESS.address,
    tagline: str(row?.tagline) || BUSINESS.tagline,
    domain: str(row?.domain) || BUSINESS.domain,
    telegramChatId: optionalStr(row?.telegramChatId),
  };
}
