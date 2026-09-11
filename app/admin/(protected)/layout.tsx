import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { ConfigBanner } from "@/components/admin/config-banner";
import { requireAdmin } from "@/lib/auth";
import { isAppwriteConfigured } from "@/lib/appwrite/config";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: { template: `%s — Admin — ${BUSINESS.name}`, default: "Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-dvh bg-[#f5f6f9]">
      {!isAppwriteConfigured() && <ConfigBanner />}

      <header className="sticky top-0 z-40 border-b border-[#06065c]/10 bg-white/95 backdrop-blur">
        <div className="border-b border-[#06065c]/8 bg-[#06065c] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
            <Link href="/admin" className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-[0.12em]">
                {BUSINESS.name}
              </p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">
                Administration
              </p>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden max-w-[14rem] truncate text-xs text-white/60 md:inline">
                {admin.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
          <AdminNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
