import { AlertTriangle } from "lucide-react";

export function ConfigBanner() {
  return (
    <div className="flex items-start gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        Appwrite is not fully configured yet — set the variables in{" "}
        <code className="rounded bg-black/10 px-1 py-0.5 dark:bg-white/10">
          .env.local
        </code>{" "}
        (see <code className="rounded bg-black/10 px-1 py-0.5 dark:bg-white/10">docs/SETUP.md</code>
        ). Product, category and enquiry data will not load until it is.
      </p>
    </div>
  );
}
