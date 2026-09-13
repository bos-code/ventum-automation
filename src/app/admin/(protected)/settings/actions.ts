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
