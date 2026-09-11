import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/forms/product-form";
import { getAllCategories } from "@/lib/appwrite/categories";
import { getAllProducts, getProductById } from "@/lib/appwrite/products";
import { fileViewUrl } from "@/lib/appwrite/config";

export const metadata = { title: "Edit product" };

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]/edit">,
) {
  const { id } = await props.params;
  const [product, categories, products] = await Promise.all([
    getProductById(id),
    getAllCategories(),
    getAllProducts(),
  ]);

  if (!product) notFound();

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
          Edit product
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
          Update {product.name}. Changes become visible on the customer catalogue according to its published status.
        </p>
      </div>
      <ProductForm
        mode="edit"
        productId={product.id}
        categories={categories}
        brands={brands}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          categoryId: product.categoryId ?? "",
          model: product.model ?? "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          price: product.price,
          currency: product.currency,
          featured: product.featured,
          inStock: product.inStock,
          published: product.published,
          imageIds: product.imageIds,
          specifications: product.specifications,
          sortOrder: product.sortOrder,
        }}
        defaultImages={product.imageIds.map((imageId) => ({
          id: imageId,
          url: fileViewUrl(imageId),
        }))}
      />
    </div>
  );
}
