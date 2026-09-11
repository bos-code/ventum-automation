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
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Edit product</h1>
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
