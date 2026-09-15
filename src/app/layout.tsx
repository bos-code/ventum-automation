import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Settings and product data live in Appwrite and power every page.
// Rendered per-request (not statically prerendered) so an edit shows up
// immediately and, critically, so a deploy never fails just because
// Appwrite was briefly unreachable at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.siteUrl),
};

// Only the document shell. Public chrome lives in (site)/layout.tsx so the
// admin can own its own shell.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
