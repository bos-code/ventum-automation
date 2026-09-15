import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/appwrite/session";
import { logout } from "../login/actions";
import { AdminSidebarNav, AdminMobileNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-mist-100">
      <header className="sticky top-0 z-30 border-b border-navy-950/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="font-display text-sm font-extrabold tracking-tight text-navy-950">
              Ventum admin
            </p>
            <p className="truncate text-xs text-steel-500">{user.email}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Sign out is kept clear of the nav destinations. Below lg it
                moves into the drawer so the bar has room for the menu button. */}
            <form action={logout} className="hidden lg:block">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-navy-950/15 px-3 text-xs font-semibold text-steel-700 transition-colors hover:border-ventum-red-600 hover:text-ventum-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinejoin="round" />
                </svg>
                Sign out
              </button>
            </form>

            <AdminMobileNav signOut={logout} />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:py-10">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24">
            <AdminSidebarNav />
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
