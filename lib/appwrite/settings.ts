import "server-only";

import { unstable_cache } from "next/cache";
import type { Settings } from "@/types";
import { BUSINESS } from "@/lib/constants";
import { CACHE_TAGS, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache";
import { createAdminClient } from "./clients";
import {
  appwriteEnv,
  isAppwriteConfigured,
  SETTINGS_DOC_ID,
} from "./config";
import { rowToSettings } from "./mappers";

const TABLE = appwriteEnv.collections.settings;

/** Build-time fallback used before Appwrite is configured. */
export function defaultSettings(): Settings {
  return rowToSettings(null);
}

const getSettingsCached = unstable_cache(
  async (): Promise<Settings> => {
    const { tables } = createAdminClient();
    try {
      const row = await tables.getRow({
        databaseId: appwriteEnv.databaseId,
        tableId: TABLE,
        rowId: SETTINGS_DOC_ID,
      });
      return rowToSettings(row);
    } catch {
      // No settings row yet — fall back to the canonical constants.
      return rowToSettings(null);
    }
  },
  ["business-settings"],
  { tags: [CACHE_TAGS.settings], revalidate: PUBLIC_REVALIDATE_SECONDS },
);

/**
 * Business settings for the public site. Always resolves — falls back to
 * `lib/constants` when Appwrite is unavailable or the row is absent.
 */
export async function getSettings(): Promise<Settings> {
  if (!isAppwriteConfigured()) return defaultSettings();
  try {
    return await getSettingsCached();
  } catch (error) {
    console.error("[settings] getSettings failed", error);
    return defaultSettings();
  }
}

/** The Telegram chat id to notify: settings row overrides the env var. */
export async function getTelegramChatId(): Promise<string | null> {
  const settings = await getSettings();
  return settings.telegramChatId || process.env.TELEGRAM_CHAT_ID || null;
}

export { BUSINESS };
