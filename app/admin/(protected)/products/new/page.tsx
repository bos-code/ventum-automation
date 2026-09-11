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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Add product</h1>
        <p className="text-sm text-muted-foreground">
          New products are saved unpublished until you tick &quot;Published&quot;.
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
