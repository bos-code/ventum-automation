import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableWrap, TBody, TH, THead, TR } from "@/components/ui/table";
import { EmptyState } from "@/components/site/empty-state";
import { CategoryDialog } from "@/components/admin/category-dialog";
import { CategoryRow } from "@/components/admin/category-row";
import { CategoryCard } from "@/components/admin/category-card";
import { emptyCategoryFormValues } from "@/components/forms/category-form-schema";
import { getAllCategories } from "@/lib/appwrite/categories";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();
  const ids = categories.map((c) => c.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ed0101]">
            Catalogue structure
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#06065c]">
            Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}
          </p>
        </div>
        <CategoryDialog
          mode="create"
          defaultValues={emptyCategoryFormValues}
          trigger={
            <Button className="min-h-11 w-full sm:w-auto">
              <Plus aria-hidden="true" />
              Add category
            </Button>
          }
        />
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Categories group products for browsing and filtering."
          action={
            <CategoryDialog
              mode="create"
              defaultValues={emptyCategoryFormValues}
              trigger={<Button size="sm">Add category</Button>}
            />
          }
        />
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                allCategoryIds={ids}
                index={index}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <TableWrap>
              <Table>
                <THead>
                  <TR>
                    <TH className="w-10">Order</TH>
                    <TH>Name</TH>
                    <TH>Description</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {categories.map((category, index) => (
                    <CategoryRow
                      key={category.id}
                      category={category}
                      allCategoryIds={ids}
                      index={index}
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
