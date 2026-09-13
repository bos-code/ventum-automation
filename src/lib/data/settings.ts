import "server-only";
import { cache } from "react";
import { getTablesDB } from "@/lib/appwrite/client";
import { appwriteEnv } from "@/lib/appwrite/env";
import { siteConfig } from "@/lib/site-config";
import type { Settings } from "@/lib/types";

const SETTINGS_ROW_ID = "business";

function fallbackSettings(): Settings {
  return {
    businessName: siteConfig.name,
    legalName: siteConfig.legalName,
    email: siteConfig.email,
    phone: siteConfig.whatsappDisplay,
    whatsapp: siteConfig.whatsappNumber,
    secondaryPhone: siteConfig.phoneSecondary,
    address: siteConfig.address,
    tagline: siteConfig.tagline,
    domain: siteConfig.siteUrl,
    telegramChatId: null,
  };
}

/**
 * Reads the single `settings/business` row. Falls back to the static
 * site-config values if Appwrite is unreachable, so the site never
 * breaks just because the database is briefly down.
 */
export const getSettings = cache(async (): Promise<Settings> => {
  try {
    const tablesDB = getTablesDB();
    const row = await tablesDB.getRow({
      databaseId: appwriteEnv.databaseId,
      tableId: appwriteEnv.tables.settings,
      rowId: SETTINGS_ROW_ID,
    });
    const data = row as unknown as Record<string, unknown>;
    return {
      businessName: (data.businessName as string) ?? siteConfig.name,
      legalName: (data.legalName as string) ?? siteConfig.legalName,
      email: (data.email as string) ?? siteConfig.email,
      phone: (data.phone as string) ?? siteConfig.whatsappDisplay,
      whatsapp: (data.whatsapp as string) ?? siteConfig.whatsappNumber,
      secondaryPhone: (data.secondaryPhone as string) ?? siteConfig.phoneSecondary,
      address: (data.address as string) ?? siteConfig.address,
      tagline: (data.tagline as string) ?? siteConfig.tagline,
      domain: (data.domain as string) ?? siteConfig.siteUrl,
      telegramChatId: (data.telegramChatId as string | null) ?? null,
    };
  } catch {
    return fallbackSettings();
  }
});

export async function updateSettings(data: Partial<Settings>): Promise<void> {
  const tablesDB = getTablesDB();
  await tablesDB.updateRow({
    databaseId: appwriteEnv.databaseId,
    tableId: appwriteEnv.tables.settings,
    rowId: SETTINGS_ROW_ID,
    data,
  });
}
