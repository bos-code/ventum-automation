import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/forms/product-form";
import { emptyProductFormValues } from "@/components/forms/product-form-schema";
import { getAllCategories } from "@/lib/appwrite/categories";
import { getAllProducts } from "@/lib/appwrite/products";

export const metadata = { title: "Add product" };

export default async function NewProductPage() {
  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);
  const brands = [...new Set(products.map((p) => p.brand))].sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <div className="space-y-7">
      <div>
        <Link
          href="/admin/products"
          className="mb-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#06065c]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to products
        </Link>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ed0101]">
          Catalogue
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#06065c]">
          Add product
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
          Add the product details, images and specifications. New products stay hidden until Published is enabled.
        </p>
      </div>
      <ProductForm
        mode="create"
        categories={categories}
        brands={brands}
        defaultValues={emptyProductFormValues}
        defaultImages={[]}
      />
    </div>
  );
}
