import "server-only";

import { getSettings } from "@/lib/data/settings";

export type TelegramResult =
  | { ok: true; messageId: number; chatId: string }
  | { ok: false; error: string };

/**
 * Sends a message to the configured Telegram chat and reports whether
 * the Telegram API actually accepted it (`ok: true` in its response).
 * Never throws. The error string never contains the bot token.
 */
export async function sendTelegramMessage(text: string): Promise<TelegramResult> {
  const settings = await getSettings();
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = settings.telegramChatId || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, error: "Telegram not configured (TELEGRAM_BOT_TOKEN / chat id missing)" };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
        }),
      }
    );
    const body = (await response.json().catch(() => null)) as
      | { ok?: boolean; description?: string; result?: { message_id?: number } }
      | null;
    if (!response.ok || !body?.ok) {
      return {
        ok: false,
        error: `Telegram API ${response.status}: ${body?.description ?? "unknown error"}`,
      };
    }
    return { ok: true, messageId: body.result?.message_id ?? 0, chatId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `Telegram request failed: ${message.split(token).join("***")}` };
  }
}

/**
 * Sends a plain-text message to the configured Telegram chat.
 * Best-effort: a Telegram outage should never block an enquiry from
 * being saved, so failures are logged, not thrown.
 */
export async function notifyTelegram(text: string): Promise<void> {
  const result = await sendTelegramMessage(text);
  if (!result.ok) {
    console.error("Telegram notification failed:", result.error);
  }
}
