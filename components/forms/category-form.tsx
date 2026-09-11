"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/field";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/components/forms/category-form-schema";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/categories";
import { slugify } from "@/lib/utils";

interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId?: string;
  defaultValues: CategoryFormValues;
  onSuccess: () => void;
}

export function CategoryForm({
  mode,
  categoryId,
  defaultValues,
  onSuccess,
}: CategoryFormProps) {
  const slugTouched = useRef(mode === "edit");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  async function onSubmit(values: CategoryFormValues) {
    const result =
      mode === "create"
        ? await createCategoryAction(values)
        : await updateCategoryAction(categoryId!, values);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(key as keyof CategoryFormValues, { message: messages[0] });
          }
        }
      }
      toast.error(result.error);
      return;
    }

    toast.success(mode === "create" ? "Category created" : "Category updated");
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Field label="Name" required error={errors.name?.message}>
        {(props) => (
          <Input
            {...props}
            {...register("name", {
              onChange: (e) => {
                if (!slugTouched.current) {
                  setValue("slug", slugify(e.target.value), {
                    shouldValidate: true,
                  });
                }
              },
            })}
          />
        )}
      </Field>

      <Field label="Slug" required error={errors.slug?.message}>
        {(props) => (
          <Input
            {...props}
            {...register("slug", {
              onChange: () => {
                slugTouched.current = true;
              },
            })}
          />
        )}
      </Field>

      <Field label="Description" error={errors.description?.message}>
        {(props) => <Textarea {...props} {...register("description")} rows={2} />}
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("published")} className="size-4" />
        Published
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : mode === "create" ? "Create" : "Save"}
        </Button>
      </div>
    </form>
  );
}
