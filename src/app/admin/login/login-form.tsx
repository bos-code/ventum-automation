"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialLoginState: LoginState = { status: "idle", message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    login,
    initialLoginState
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-navy-950">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-lg border border-navy-950/15 px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-ventum-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-navy-950 text-sm font-semibold text-offwhite transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
