"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/admin/category-dialog";
import {
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/lib/actions/categories";

export function CategoryCard({
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
    <article className={`rounded-2xl border border-border bg-white p-4 shadow-sm ${isPending ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#ed0101]">
            Category {index + 1}
          </p>
          <h2 className="mt-1 truncate font-semibold text-[#06065c]">{category.name}</h2>
          <p className="mt-1 truncate text-xs text-muted-foreground">/products?category={category.slug}</p>
        </div>
        <Badge variant={category.published ? "success" : "outline"}>
          {category.published ? "Published" : "Hidden"}
        </Badge>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {category.description || "No description added."}
      </p>

      <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => move(-1)}
          disabled={index === 0 || isPending}
          aria-label="Move category up"
        >
          <ArrowUp className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => move(1)}
          disabled={index === allCategoryIds.length - 1 || isPending}
          aria-label="Move category down"
        >
          <ArrowDown className="size-4" />
        </Button>

        <div className="ml-auto flex gap-1">
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
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={isPending}
            aria-label="Delete category"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    </article>
  );
}
