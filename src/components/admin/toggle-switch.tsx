"use client";

import { useState, useTransition } from "react";

interface AdminToggleSwitchProps {
  label: string;
  checked: boolean;
  activeColor?: "green" | "blue" | "amber" | "navy";
  disabled?: boolean;
  variant?: "inline" | "badge";
  onChange: (checked: boolean) => Promise<void> | void;
}

const COLOR_STYLES = {
  navy: "bg-navy-950 shadow-sm shadow-navy-950/40",
  blue: "bg-ventum-blue-600 shadow-sm shadow-blue-600/40",
  green: "bg-emerald-600 shadow-sm shadow-emerald-600/40",
  amber: "bg-amber-600 shadow-sm shadow-amber-600/40",
};

export function AdminToggleSwitch({
  label,
  checked: controlledChecked,
  activeColor = "navy",
  disabled = false,
  variant = "badge",
  onChange,
}: AdminToggleSwitchProps) {
  const [optimisticChecked, setOptimisticChecked] = useState(controlledChecked);
  const [isPending, startTransition] = useTransition();

  // Sync if controlled value changes from outside
  if (optimisticChecked !== controlledChecked && !isPending) {
    setOptimisticChecked(controlledChecked);
  }

  function handleToggle() {
    if (disabled || isPending) return;
    const nextChecked = !optimisticChecked;
    setOptimisticChecked(nextChecked);

    startTransition(async () => {
      try {
        await onChange(nextChecked);
      } catch (err) {
        // Revert on error
        setOptimisticChecked(controlledChecked);
        console.error("Toggle action failed:", err);
      }
    });
  }

  if (variant === "badge") {
    const isBlue = activeColor === "blue";
    const isGreen = activeColor === "green";

    return (
      <button
        type="button"
        role="switch"
        aria-checked={optimisticChecked}
        aria-label={label}
        disabled={disabled || isPending}
        onClick={handleToggle}
        className={`group inline-flex min-h-11 items-center gap-3 rounded-xl border px-3.5 py-1.5 transition-all duration-200 select-none disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500 ${
          optimisticChecked
            ? isBlue
              ? "border-ventum-blue-500/40 bg-blue-50/80 shadow-md shadow-blue-900/10 text-navy-950"
              : isGreen
              ? "border-emerald-500/40 bg-emerald-50/80 shadow-md shadow-emerald-900/10 text-navy-950"
              : "border-navy-950/20 bg-mist-100 shadow-md shadow-navy-950/10 text-navy-950"
            : "border-navy-950/10 bg-white shadow-xs text-steel-600 hover:border-navy-950/25 hover:text-navy-950"
        }`}
      >
        <span
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            optimisticChecked ? COLOR_STYLES[activeColor] : "bg-steel-300"
          } ${isPending ? "opacity-70 animate-pulse" : ""}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              optimisticChecked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </span>
        <span
          className={`text-xs ${
            optimisticChecked
              ? isBlue
                ? "font-bold text-ventum-blue-700"
                : isGreen
                ? "font-bold text-emerald-800"
                : "font-bold text-navy-950"
              : "font-semibold text-steel-700"
          }`}
        >
          {label}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimisticChecked}
      aria-label={label}
      disabled={disabled || isPending}
      onClick={handleToggle}
      className="group inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-steel-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
    >
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          optimisticChecked ? COLOR_STYLES[activeColor] : "bg-steel-300"
        } ${isPending ? "opacity-70 animate-pulse" : ""}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            optimisticChecked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
      <span className="select-none font-semibold text-navy-950">{label}</span>
    </button>
  );
}
