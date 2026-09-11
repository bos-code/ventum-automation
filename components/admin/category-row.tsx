"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types";
import { TD, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/admin/category-dialog";
import {
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/lib/actions/categories";

export function CategoryRow({
  category,
  allCategoryIds,
  index,
}: {
  category: Category;
  allCategoryIds: string[];
  index: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function move(direction: -1 | 1) {
    const next = [...allCategoryIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];

    startTransition(async () => {
      const result = await reorderCategoriesAction({ order: next });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function onDelete() {
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Category deleted");
      router.refresh();
    });
  }

  return (
    <TR className={isPending ? "opacity-60" : undefined}>
      <TD>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={index === 0 || isPending}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            aria-label="Move up"
          >
            <ArrowUp className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={index === allCategoryIds.length - 1 || isPending}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            aria-label="Move down"
          >
            <ArrowDown className="size-3.5" />
          </button>
        </div>
      </TD>
      <TD>
        <p className="font-medium">{category.name}</p>
        <p className="text-xs text-muted-foreground">/products?category={category.slug}</p>
      </TD>
      <TD className="max-w-xs truncate text-sm text-muted-foreground">
        {category.description || "—"}
      </TD>
      <TD>
        <Badge variant={category.published ? "success" : "outline"}>
          {category.published ? "Published" : "Hidden"}
        </Badge>
      </TD>
      <TD>
        <div className="flex justify-end gap-1">
          <CategoryDialog
            mode="edit"
            categoryId={category.id}
            defaultValues={{
              name: category.name,
              slug: category.slug,
              description: category.description ?? "",
              published: category.published,
            }}
            trigger={
              <Button variant="ghost" size="icon" aria-label="Edit category">
                <Pencil className="size-4" />
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete category"
            onClick={onDelete}
            disabled={isPending}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </TD>
    </TR>
  );
}
