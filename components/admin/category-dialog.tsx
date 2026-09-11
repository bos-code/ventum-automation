"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/forms/category-form";
import type { CategoryFormValues } from "@/components/forms/category-form-schema";

interface CategoryDialogProps {
  mode: "create" | "edit";
  categoryId?: string;
  defaultValues: CategoryFormValues;
  trigger: React.ReactNode;
}

export function CategoryDialog({
  mode,
  categoryId,
  defaultValues,
  trigger,
}: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add category" : "Edit category"}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          mode={mode}
          categoryId={categoryId}
          defaultValues={defaultValues}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
