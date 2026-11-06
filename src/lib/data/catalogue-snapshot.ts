import "server-only";
import snapshot from "@/data/catalogue-snapshot.json";

/**
 * Last known copy of the published catalogue, written by
 * scripts/snapshot-catalogue.mjs (run daily by
 * .github/workflows/catalogue-snapshot.yml). The public catalogue reads
 * from it only when Appwrite itself fails, e.g. while the project is
 * paused. Rows have the same shape as Appwrite rows, so the normal
 * mappers in products.ts / categories.ts apply.
 */
export const catalogueSnapshot = snapshot as {
  generatedAt: string | null;
  products: Record<string, unknown>[];
  categories: Record<string, unknown>[];
  /** Appwrite file id → photo copied into /public. */
  images: Record<string, string>;
};
