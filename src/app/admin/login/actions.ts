"use server";

import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appwriteEnv } from "@/lib/appwrite/env";
import { SESSION_COOKIE } from "@/lib/appwrite/session";

export interface LoginState {
  status: "idle" | "error";
  message: string;
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  // Session secrets are only returned when the login request is made
  // with an API key — so this must run server-side with the admin
  // client, not the browser SDK.
  const client = new Client()
    .setEndpoint(appwriteEnv.endpoint)
    .setProject(appwriteEnv.projectId)
    .setKey(appwriteEnv.apiKey);

  let sessionSecret: string;
  let sessionExpire: string;
  try {
    const session = await new Account(client).createEmailPasswordSession({
      email,
      password,
    });
    sessionSecret = session.secret;
    sessionExpire = session.expire;
  } catch (error) {
    console.error("Admin login failed:", error);
    return { status: "error", message: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(sessionExpire),
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionSecret) {
    // Revoke the session on Appwrite's side too, not just the cookie —
    // otherwise a leaked cookie value would stay valid for up to a
    // year (the session's lifetime) even after "logging out". A user
    // can always delete their own current session with just the
    // session secret, no API key or special scope needed.
    const sessionClient = new Client()
      .setEndpoint(appwriteEnv.endpoint)
      .setProject(appwriteEnv.projectId)
      .setSession(sessionSecret);
    try {
      await new Account(sessionClient).deleteSession({ sessionId: "current" });
    } catch (error) {
      console.error("Failed to revoke Appwrite session on logout:", error);
    }
  }

  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
