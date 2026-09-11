"use server";

import { z } from "zod";
import type { ActionResult } from "@/types";
import { SITE_URL } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { enquiryFormSchema } from "@/lib/validation/enquiry";
import { createEnquiry } from "@/lib/appwrite/enquiries";
import { getProductById } from "@/lib/appwrite/products";
import { getTelegramChatId } from "@/lib/appwrite/settings";
import { sendTelegramEnquiry } from "@/lib/telegram/notify";

/**
 * Public "Request Product" submission.
 *
 * Security notes:
 * - `productId` is the only client-supplied product data we accept; the
 *   product is re-loaded server-side and its name / model / price are
 *   snapshotted from the database.
 * - `company` is a honeypot — a filled value is treated as a bot and
 *   silently accepted without persisting anything.
 * - A failed Telegram notification never fails the request; the enquiry
 *   is already saved and visible in the admin area.
 */
export async function submitEnquiry(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = enquiryFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields and try again.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const data = parsed.data;

  if (data.company && data.company.length > 0) {
    return { ok: true, data: { id: "accepted" } };
  }

  const product = await getProductById(data.productId);
  if (!product || !product.published) {
    return {
      ok: false,
      error: "That product is no longer available. Please contact us on WhatsApp.",
    };
  }

  const message = (data.message ?? "").trim() || null;

  let enquiryId: string;
  let createdAt: string;
  try {
    const enquiry = await createEnquiry({
      productId: product.id,
      productName: product.name,
      productModel: product.model,
      productPrice: product.price,
      productCurrency: product.currency,
      customerName: data.customerName,
      phone: data.phone,
      quantity: data.quantity,
      message,
      source: "request_form",
    });
    enquiryId = enquiry.id;
    createdAt = enquiry.createdAt;
  } catch (error) {
    console.error("[enquiry] failed to persist", error);
    return {
      ok: false,
      error:
        "We couldn't submit your enquiry just now. Please try again or reach us on WhatsApp.",
    };
  }

  const chatId = await getTelegramChatId();
  await sendTelegramEnquiry(
    {
      productName: product.name,
      model: product.model,
      price:
        product.price != null
          ? formatPrice(product.price, product.currency)
          : "Price on request",
      quantity: data.quantity,
      customerName: data.customerName,
      phone: data.phone,
      message,
      productUrl: `${SITE_URL}/products/${product.slug}`,
      createdAt,
    },
    chatId,
  );

  return { ok: true, data: { id: enquiryId } };
}
