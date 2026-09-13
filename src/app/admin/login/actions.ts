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
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { status: "error", message: "Enter your password." };
  }

  // The admin identity is resolved only on the server. It is never sent
  // to the browser or rendered into the login form.
  const email = appwriteEnv.adminEmail;

  // Session secrets are only returned when the login request is made
  // with an API key, so this remains server-side with the admin client.
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
    return { status: "error", message: "Invalid password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(sessionExpire),
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionSecret) {
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
