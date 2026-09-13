import { getSettings } from "@/lib/data/settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-950">
        Settings
      </h1>
      <p className="mt-2 text-sm text-steel-600">
        These values power the header, footer, and every contact/WhatsApp
        link across the site.
      </p>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
