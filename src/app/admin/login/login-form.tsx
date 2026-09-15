"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "./actions";

const initialLoginState: LoginState = { status: "idle", message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialLoginState);
  const [revealed, setRevealed] = useState(false);
  const failed = state.status === "error";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-navy-950"
        >
          Password
        </label>

        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={revealed ? "text" : "password"}
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={failed || undefined}
            aria-describedby={failed ? "password-error" : undefined}
            className={`h-12 w-full rounded-xl border bg-white pl-3 pr-12 text-base text-navy-950 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 ${
              failed ? "border-ventum-red-600" : "border-navy-950/15"
            }`}
          />

          {/* Toggle sits inside the field but keeps a 44px target. */}
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-pressed={revealed}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-steel-600 transition-colors hover:text-navy-950 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ventum-blue-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              aria-hidden="true"
              className="h-5 w-5"
            >
              {revealed ? (
                <>
                  <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
                  <path d="M9.9 5.2A9.5 9.5 0 0 1 12 5c5 0 9 4.5 9 7a11 11 0 0 1-2.4 3.4M6.3 6.7A11.6 11.6 0 0 0 3 12c0 2.5 4 7 9 7a9.6 9.6 0 0 0 3.2-.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

        {failed && (
          <p
            id="password-error"
            role="alert"
            className="mt-2 flex items-start gap-1.5 text-sm font-medium text-ventum-red-700"
          >
            {/* Icon so the error is not carried by colour alone. */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
            </svg>
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy-950 text-sm font-semibold text-offwhite transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
      >
        {pending && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="h-4 w-4 animate-spin motion-reduce:animate-none"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={3} opacity={0.3} />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
          </svg>
        )}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
