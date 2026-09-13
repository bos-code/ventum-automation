export interface ProductSpec {
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
  price: number | null;
  currency: string;
  featured: boolean;
  inStock: boolean;
  published: boolean;
  imageIds: string[];
  specifications: ProductSpec[];
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  published: boolean;
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

export type EnquirySource = "whatsapp" | "request_form" | "contact_form";
export type EnquiryStatus = "new" | "read" | "responded" | "closed";

export interface EnquiryInput {
  productId?: string;
  productName: string;
  productModel?: string | null;
  productPrice?: number | null;
  productCurrency?: string | null;
  customerName: string;
  phone: string;
  quantity: number;
  message?: string | null;
  source: EnquirySource;
}

export interface Enquiry {
  id: string;
  createdAt: string;
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
  status: EnquiryStatus;
}
