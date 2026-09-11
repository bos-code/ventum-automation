import type { Specification } from "@/types";

export function ProductSpecs({
  specifications,
}: {
  specifications: Specification[];
}) {
  if (specifications.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Specifications
      </h2>
      <dl className="mt-3 divide-y divide-border rounded-lg border border-border">
        {specifications.map((spec, index) => (
          <div
            key={`${spec.label}-${index}`}
            className="grid grid-cols-2 gap-4 px-4 py-2.5 text-sm"
          >
            <dt className="text-muted-foreground">{spec.label}</dt>
            <dd className="font-medium">{spec.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-muted-foreground">
        Specifications are listed as supplied by the client or manufacturer.
        Confirm critical details with us before purchase.
      </p>
    </div>
  );
}
