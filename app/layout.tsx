import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { BUSINESS, SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    template: `%s — ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  applicationName: BUSINESS.name,
  keywords: [
    "electrical products Lagos",
    "circuit breakers",
    "contactors",
    "relays",
    "surge protection",
    "solar protection box",
    "voltage protection",
    "automation equipment",
    "Alaba International Market",
  ],
  openGraph: {
    type: "website",
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    description: BUSINESS.description,
    url: SITE_URL,
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} — ${BUSINESS.tagline}`,
    description: BUSINESS.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
