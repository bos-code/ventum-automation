"use client";

import { useActionState } from "react";
import { saveSettings, type SettingsFormState } from "./actions";
import type { Settings } from "@/lib/types";

const initialSettingsState: SettingsFormState = { status: "idle", message: "" };

function Field({
  id,
  label,
  defaultValue,
  hint,
  required,
  type = "text",
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  defaultValue: string;
  hint?: string;
  required?: boolean;
  type?: "text" | "tel" | "email";
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-950">
        {label}
        {required && (
          <span className="ml-1 text-ventum-red-700" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={required}
        aria-describedby={hintId}
        className="mt-2 h-12 w-full rounded-xl border border-navy-950/15 bg-white px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
      />

      {/* Helper sits under the field it explains and is linked to it. */}
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-steel-600">
          {hint}
        </p>
      )}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-navy-950/10 bg-white p-4 sm:p-5">
      <legend className="px-1 font-display text-sm font-bold text-navy-950">
        {title}
      </legend>
      <p className="mt-1 text-xs text-steel-600">{description}</p>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </fieldset>
  );
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(
    saveSettings,
    initialSettingsState
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <Section
        title="Business identity"
        description="How the business is named across the site."
      >
        <Field
          id="businessName"
          label="Business name"
          defaultValue={settings.businessName}
          required
          autoComplete="organization"
        />
        <Field id="legalName" label="Legal name" defaultValue={settings.legalName} />
        <Field id="tagline" label="Tagline" defaultValue={settings.tagline} />
      </Section>

      <Section
        title="Contact"
        description="Used for WhatsApp links, the header button and the footer."
      >
        <Field
          id="whatsapp"
          label="WhatsApp number"
          defaultValue={settings.whatsapp}
          hint="Digits only with country code, no + or spaces — used to build wa.me links (e.g. 2348064870941)."
          required
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
        />
        <Field
          id="phone"
          label="Phone (displayed format)"
          defaultValue={settings.phone}
          hint="Shown on the site as text, e.g. +234 806 487 0941."
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
        <Field
          id="secondaryPhone"
          label="Secondary phone"
          defaultValue={settings.secondaryPhone}
          type="tel"
          inputMode="tel"
        />
        <Field
          id="email"
          label="Email"
          defaultValue={settings.email}
          type="email"
          inputMode="email"
          autoComplete="email"
        />
        <Field
          id="address"
          label="Address"
          defaultValue={settings.address}
          required
          autoComplete="street-address"
        />
      </Section>

      {/* Result sits beside the button rather than below the fold. */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-navy-950 px-6 text-sm font-semibold text-offwhite transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
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
          {pending ? "Saving…" : "Save settings"}
        </button>

        {state.status !== "idle" && (
          <p
            role="alert"
            className={`text-sm font-semibold ${
              state.status === "error" ? "text-ventum-red-700" : "text-green-800"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
