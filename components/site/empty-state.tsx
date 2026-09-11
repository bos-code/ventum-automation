import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-[#d9dbe4] bg-[#f8f8f5] px-6 py-16 sm:px-10 sm:py-20",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 ventum-grid opacity-55" />
      <div className="relative mx-auto flex max-w-xl flex-col items-start">
        <span className="grid size-11 place-items-center bg-[#06065c] text-white">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-[#06065c] sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-lg text-sm leading-7 text-[#656879] sm:text-base">
            {description}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
