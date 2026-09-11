import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableWrap, TBody, TH, THead, TR } from "@/components/ui/table";
import { EmptyState } from "@/components/site/empty-state";
import { ProductRow } from "@/components/admin/product-row";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus aria-hidden="true" />
            Add product
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
                  categoryName={
                    product.categoryId
                      ? (categoryNames.get(product.categoryId) ?? null)
                      : null
                  }
                  imageUrl={
                    product.imageIds[0]
                      ? fileViewUrl(product.imageIds[0])
                      : undefined
                  }
                />
              ))}
            </TBody>
          </Table>
        </TableWrap>
      )}
    </div>
  );
}
