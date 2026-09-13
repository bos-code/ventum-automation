"use server";

import { createEnquiry } from "@/lib/data/enquiries";
import { getPublishedProducts } from "@/lib/data/products";

export interface EnquiryFormState {
  status: "idle" | "success" | "error";
  message: string;
}

export const initialEnquiryState: EnquiryFormState = {
  status: "idle",
  message: "",
};

export async function submitEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const quantityRaw = String(formData.get("quantity") ?? "1").trim();
  const productSlug = String(formData.get("product") ?? "");

  if (!name || !phone) {
    return { status: "error", message: "Please enter your name and phone number." };
  }

  const quantity = Math.max(1, parseInt(quantityRaw, 10) || 1);

  let productId: string | undefined;
  let productName = "General enquiry";
  let productModel: string | null = null;
  let productPrice: number | null = null;
  let productCurrency: string | null = null;

  if (productSlug) {
    const products = await getPublishedProducts();
    const product = products.find((p) => p.slug === productSlug);
    if (product) {
      productId = product.id;
      productName = product.name;
      productModel = product.model;
      productPrice = product.price;
      productCurrency = product.currency;
    }
  }

  try {
    await createEnquiry({
      productId,
      productName,
      productModel,
      productPrice,
      productCurrency,
      customerName: name,
      phone,
      quantity,
      message: message || null,
      source: "contact_form",
    });
    return {
      status: "success",
      message: "Thanks — we've received your enquiry and will reach out on WhatsApp or phone shortly.",
    };
  } catch (error) {
    console.error("submitEnquiry failed:", error);
    return {
      status: "error",
      message: "Something went wrong sending that. Please try WhatsApp instead.",
    };
  }
}
