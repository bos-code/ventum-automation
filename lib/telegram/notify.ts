import "server-only";

import { formatDateTime } from "@/lib/utils";

export interface TelegramEnquiryPayload {
  productName: string;
  model: string | null;
  price: string;
  quantity: number;
  customerName: string;
  phone: string;
  message: string | null;
  productUrl: string;
  createdAt: string;
}

export type TelegramResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "http-error" | "network-error" };

/** True when both the bot token and a chat id are available. */
export function isTelegramConfigured(chatIdOverride?: string | null): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN &&
      (chatIdOverride || process.env.TELEGRAM_CHAT_ID),
  );
}

function formatMessage(p: TelegramEnquiryPayload): string {
  return [
    "NEW PRODUCT ENQUIRY",
    "",
    "Product:",
    p.productName,
    "",
    "Model:",
    p.model || "—",
    "",
    "Price:",
    p.price,
    "",
    "Quantity:",
    String(p.quantity),
    "",
    "Customer:",
    p.customerName,
    "",
    "Phone:",
    p.phone,
    "",
    "Message:",
    p.message || "—",
    "",
    "Product URL:",
    p.productUrl,
    "",
    "Time:",
    formatDateTime(p.createdAt),
  ].join("\n");
}

/**
 * Send an enquiry alert to Telegram. Never throws — the caller has
 * already persisted the enquiry, so a failed notification must not fail
 * the request. Failures are logged for the operator.
 */
export async function sendTelegramEnquiry(
  payload: TelegramEnquiryPayload,
  chatIdOverride?: string | null,
): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = chatIdOverride || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — enquiry saved but not notified",
    );
    return { ok: false, reason: "not-configured" };
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: formatMessage(payload),
          disable_web_page_preview: true,
        }),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[telegram] sendMessage failed", res.status, body.slice(0, 500));
      return { ok: false, reason: "http-error" };
    }

    return { ok: true };
  } catch (error) {
    console.error("[telegram] sendMessage error", error);
    return { ok: false, reason: "network-error" };
  }
}
