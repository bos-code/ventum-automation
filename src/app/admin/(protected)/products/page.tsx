import { getAllProductsForAdmin } from "@/lib/data/products";
import { getAllCategoriesForAdmin } from "@/lib/data/categories";
import { productImageUrl } from "@/lib/appwrite/images";
import { ProductsManager } from "./products-manager";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsForAdmin(),
    getAllCategoriesForAdmin(),
  ]);

  // URLs are built here because the bucket id is server-only env.
  const imageUrls: Record<string, string | null> = {};
  const productImages: Record<string, { id: string; url: string }[]> = {};
  for (const product of products) {
    productImages[product.id] = product.imageIds.map((id) => ({
      id,
      url: productImageUrl(id),
    }));
    imageUrls[product.id] = productImages[product.id][0]?.url ?? null;
  }

  return (
    <ProductsManager
      products={products}
      categories={categories}
      imageUrls={imageUrls}
      productImages={productImages}
    />
  );
}
