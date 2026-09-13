import type { Metadata, Viewport } from "next";
import { AdminPwaRegister } from "./admin-pwa-register";

export const metadata: Metadata = {
  title: {
    default: "Ventum Admin",
    template: "%s | Ventum Admin",
  },
  applicationName: "Ventum Admin",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Ventum Admin",
    statusBarStyle: "default",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#081525",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminPwaRegister />
      {children}
    </>
  );
}
