"use client";

// Root-level error boundary — catches errors thrown by the root layout
// itself. Must render its own <html>/<body> since it replaces the
// entire tree.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center font-sans">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="max-w-sm text-gray-500">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
