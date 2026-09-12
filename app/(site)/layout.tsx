import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  EnquirySelectionPanel,
  EnquirySelectionProvider,
} from "@/components/catalog/enquiry-selection";
import { getSettings } from "@/lib/appwrite/settings";

export default async function SiteLayout({
  children,
}: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <EnquirySelectionProvider>
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <EnquirySelectionPanel whatsappNumber={settings.whatsapp} />
    </EnquirySelectionProvider>
  );
}
