"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">
        We couldn&apos;t load this page
      </h1>
      <p className="text-muted-foreground">
        Please try again, or contact us on WhatsApp if the problem continues.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="secondary">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
