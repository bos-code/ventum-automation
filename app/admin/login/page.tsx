import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { Logo } from "@/components/site/logo";
import { getAdminUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getAdminUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1 text-center">
          <Logo className="justify-center" />
          <p className="text-sm text-muted-foreground">Admin sign in</p>
        </div>
        <Suspense fallback={<div className="h-40" aria-hidden="true" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
