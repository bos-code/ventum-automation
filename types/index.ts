/**
 * Domain types for the Ventum catalogue.
 *
 * These are the shapes the application works with — mapped from Appwrite
 * rows by `lib/appwrite/mappers.ts`. Appwrite system fields (`$id`,
 * `$createdAt`, `$updatedAt`) are surfaced as `id`, `createdAt`,
 * `updatedAt`.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string | null;
  model: string | null;
  shortDescription: string | null;
  description: string | null;
  /** Whole units (Naira). `null` renders as "Price on request". */
  price: number | null;
  currency: string;
  featured: boolean;
  inStock: boolean;
  published: boolean;
  imageIds: string[];
  specifications: Specification[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** A product with its category resolved and image URLs built, for view layers. */
export interface ProductView extends Product {
  category: Category | null;
  imageUrls: string[];
}

export type EnquiryStatus = "new" | "contacted" | "resolved";
export type EnquirySource = "request_form" | "whatsapp";

export interface Enquiry {
  id: string;
  productId: string | null;
  /** Snapshots taken server-side at submission — never trust client values. */
  productName: string;
  productModel: string | null;
  productPrice: number | null;
  productCurrency: string | null;
  customerName: string;
  phone: string;
  quantity: number;
  message: string | null;
  source: EnquirySource;
  status: EnquiryStatus;
  createdAt: string;
}

export interface Settings {
  businessName: string;
  legalName: string;
  email: string;
  phone: string;
  whatsapp: string;
  secondaryPhone: string;
  address: string;
  tagline: string;
  domain: string;
  telegramChatId: string | null;
}

/** Filters accepted by the public catalogue listing. */
export interface CatalogueQuery {
  category?: string;
  brand?: string;
  search?: string;
  page?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

/** Standard result shape returned by server actions to client forms. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
