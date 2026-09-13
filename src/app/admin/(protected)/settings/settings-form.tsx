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
}: {
  id: string;
  label: string;
  defaultValue: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-950">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-steel-600">{hint}</p>}
      <input
        id={id}
        name={id}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 h-12 w-full rounded-lg border border-navy-950/15 px-3 text-base text-navy-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
      />
    </div>
  );
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(
    saveSettings,
    initialSettingsState
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <Field id="businessName" label="Business name" defaultValue={settings.businessName} required />
      <Field id="legalName" label="Legal name" defaultValue={settings.legalName} />
      <Field id="tagline" label="Tagline" defaultValue={settings.tagline} />
      <Field
        id="whatsapp"
        label="WhatsApp number"
        defaultValue={settings.whatsapp}
        hint="Digits only with country code, no + or spaces — used to build wa.me links (e.g. 2348064870941)."
        required
      />
      <Field
        id="phone"
        label="Phone (displayed format)"
        defaultValue={settings.phone}
        hint="Shown on the site as text, e.g. +234 806 487 0941."
      />
      <Field
        id="secondaryPhone"
        label="Secondary phone"
        defaultValue={settings.secondaryPhone}
      />
      <Field id="address" label="Address" defaultValue={settings.address} required />
      <Field id="email" label="Email" defaultValue={settings.email} />

      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-navy-950 text-sm font-semibold text-offwhite transition-colors hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
      >
        {pending ? "Saving..." : "Save settings"}
      </button>

      {state.status !== "idle" && (
        <p
          role="alert"
          className={
            state.status === "error"
              ? "text-sm font-medium text-ventum-red-600"
              : "text-sm font-medium text-green-700"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
