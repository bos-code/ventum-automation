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
    <div className="flex min-h-dvh flex-col bg-muted/20">
      {!isAppwriteConfigured() && <ConfigBanner />}

      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="text-sm font-semibold">
              {BUSINESS.name} <span className="text-muted-foreground">Admin</span>
            </Link>
            <div className="sm:hidden">
              <LogoutButton />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AdminNav className="overflow-x-auto" />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {admin.email}
            </span>
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
