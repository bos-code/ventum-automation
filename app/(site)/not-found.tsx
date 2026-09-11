import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SiteNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">
        The page or product you&apos;re looking for doesn&apos;t exist or has
        been removed.
      </p>
      <Button asChild>
        <Link href="/products">Browse products</Link>
      </Button>
    </div>
  );
}
