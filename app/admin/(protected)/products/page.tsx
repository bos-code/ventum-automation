import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableWrap, TBody, TH, THead, TR } from "@/components/ui/table";
import { EmptyState } from "@/components/site/empty-state";
import { ProductRow } from "@/components/admin/product-row";
import { AdminProductCard } from "@/components/admin/admin-product-card";
import { getAllProducts } from "@/lib/appwrite/products";
import { getAllCategories } from "@/lib/appwrite/categories";
import { fileViewUrl } from "@/lib/appwrite/config";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);
  const categoryNames = new Map(categories.map((c) => [c.id, c.name]));

  const getCategoryName = (categoryId: string | null) =>
    categoryId ? (categoryNames.get(categoryId) ?? null) : null;
  const getImageUrl = (imageIds: string[]) =>
    imageIds[0] ? fileViewUrl(imageIds[0]) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ed0101]">
            Catalogue
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#06065c]">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild className="min-h-11 bg-[#06065c] text-white hover:bg-[#06065c]/90">
          <Link href="/admin/products/new">
            <Plus aria-hidden="true" />
            <span className="hidden sm:inline">Add product</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to start building the catalogue."
          action={
            <Button asChild size="sm">
              <Link href="/admin/products/new">Add product</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {products.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                categoryName={getCategoryName(product.categoryId)}
                imageUrl={getImageUrl(product.imageIds)}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <TableWrap>
              <Table>
                <THead>
                  <TR>
                    <TH>Product</TH>
                    <TH>Category</TH>
                    <TH>Price</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      categoryName={getCategoryName(product.categoryId)}
                      imageUrl={getImageUrl(product.imageIds)}
                    />
                  ))}
                </TBody>
              </Table>
            </TableWrap>
          </div>
        </>
      )}
    </div>
  );
}
