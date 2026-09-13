import "server-only";

/**
 * Sends a plain-text message to the configured Telegram chat.
 * Best-effort: a Telegram outage should never block an enquiry from
 * being saved, so failures are logged, not thrown.
 */
export async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram not configured; skipping notification.");
    return;
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
    if (!response.ok) {
      console.error("Telegram notification failed:", await response.text());
    }
  } catch (error) {
    console.error("Telegram notification error:", error);
  }
}
