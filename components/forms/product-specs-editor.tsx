"use client";

import { useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductFormValues } from "./product-form-schema";

export function ProductSpecsEditor({
  control,
  register,
}: {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <div className="space-y-3">
      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                placeholder="Label (e.g. Rated current)"
                {...register(`specifications.${index}.label` as const)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g. 25A)"
                {...register(`specifications.${index}.value` as const)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                aria-label="Remove specification"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => append({ label: "", value: "" })}
      >
        <Plus aria-hidden="true" />
        Add specification
      </Button>
    </div>
  );
}
