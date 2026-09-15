"use server";

import { revalidatePath } from "next/cache";
import { updateSettings } from "@/lib/data/settings";

export interface SettingsFormState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function saveSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const field = (name: string) => String(formData.get(name) ?? "").trim();

  const businessName = field("businessName");
  const legalName = field("legalName");
  const tagline = field("tagline");
  const email = field("email");
  const whatsapp = field("whatsapp");
  const phone = field("phone");
  const secondaryPhone = field("secondaryPhone");
  const address = field("address");
  const telegramChatId = field("telegramChatId") || null;

  if (!businessName || !whatsapp || !address) {
    return {
      status: "error",
      message: "Business name, WhatsApp number, and address are required.",
    };
  }

  try {
    await updateSettings({
      businessName,
      legalName,
      tagline,
      email,
      whatsapp,
      phone,
      secondaryPhone,
      address,
      telegramChatId,
    });
  } catch (error) {
    console.error("saveSettings failed:", error);
    return { status: "error", message: "Could not save settings. Try again." };
  }

  // The app is force-dynamic, so the next request already re-fetches
  // settings fresh — this just clears the client-side Router Cache so
  // an already-open tab on the public site doesn't show a stale copy.
  revalidatePath("/", "layout");

  return { status: "success", message: "Settings saved." };
}

export async function testTelegramNotification(): Promise<{ success: boolean; message: string }> {
  try {
    // Import dynamically to avoid circular dependencies if any
    const { notifyTelegram } = await import("@/lib/telegram");
    const { getSettings } = await import("@/lib/data/settings");
    
    const settings = await getSettings();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = settings.telegramChatId || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return { success: false, message: "Missing Telegram Bot Token or Chat ID." };
    }

    await notifyTelegram("✅ <b>Test successful.</b>\nVentum Telegram notifications are connected correctly.");
    return { success: true, message: "Test notification sent successfully." };
  } catch (error: any) {
    console.error("Telegram test failed:", error);
    return { success: false, message: "Failed to send test notification." };
  }
}
