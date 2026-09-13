import { getAllProductsForAdmin } from "@/lib/data/products";
import { getAllCategoriesForAdmin } from "@/lib/data/categories";
import { productImageUrl } from "@/lib/appwrite/images";
import { ProductsManager } from "./products-manager";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsForAdmin(),
    getAllCategoriesForAdmin(),
  ]);

  const imageUrls: Record<string, string | null> = {};
  for (const product of products) {
    imageUrls[product.id] = product.imageIds[0]
      ? productImageUrl(product.imageIds[0])
      : null;
  }

  return (
    <ProductsManager
      products={products}
      categories={categories}
      imageUrls={imageUrls}
    />
  );
}
