import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/lib/appwrite/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-mist-100 px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-navy-950/10 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-950">
          Ventum Admin
        </h1>
        <p className="mt-2 text-sm text-steel-600">
          Sign in to manage products, enquiries and settings.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
