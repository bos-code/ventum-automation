"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * App-wide toast host. Rendered once in the root layout.
 * Styling is intentionally minimal — restyle via Sonner's `toastOptions`
 * or the `--normal-*` CSS variables.
 */
export function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-md border border-border bg-card text-card-foreground shadow-lg",
        },
      }}
      {...props}
    />
  );
}
