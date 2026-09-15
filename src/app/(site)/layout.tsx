import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSettings } from "@/lib/data/settings";
import { EnquiryProvider } from "@/components/enquiry/enquiry-context";
import { EnquiryDrawer } from "@/components/enquiry/enquiry-drawer";

/**
 * Public site chrome. Lives here rather than in the root layout so /admin
 * does not inherit the marketing header and footer — a staff tool should not
 * carry customer navigation, and on a phone that chrome cost the admin a
 * header plus a full footer of vertical space.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <EnquiryProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader settings={settings} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
        <EnquiryDrawer whatsappNumber={settings.whatsapp} />
      </div>
    </EnquiryProvider>
  );
}
