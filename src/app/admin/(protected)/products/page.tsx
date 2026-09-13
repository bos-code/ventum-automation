import { getAllProductsForAdmin } from "@/lib/data/products";
import { ProductRow } from "./product-row";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-950">
        Products
      </h1>
      <p className="mt-2 text-sm text-steel-600">
        Edit price, stock, and visibility. Adding new products or changing
        photos still needs a developer for now.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
