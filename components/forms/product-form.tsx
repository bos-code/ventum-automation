"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/forms/field";
import {
  ProductImageManager,
  type ManagedImage,
} from "@/components/forms/product-image-manager";
import { ProductSpecsEditor } from "@/components/forms/product-specs-editor";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/components/forms/product-form-schema";
import { createProductAction, updateProductAction } from "@/lib/actions/products";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  categories: Category[];
  brands: string[];
  defaultValues: ProductFormValues;
  defaultImages: ManagedImage[];
}

export function ProductForm({
  mode,
  productId,
  categories,
  brands,
  defaultValues,
  defaultImages,
}: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<ManagedImage[]>(defaultImages);
  const slugTouched = useRef(mode === "edit");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    register("name").onChange(e);
    if (!slugTouched.current) {
      setValue("slug", slugify(e.target.value), { shouldValidate: true });
    }
  }

  async function onSubmit(values: ProductFormValues) {
    const payload = { ...values, imageIds: images.map((i) => i.id) };
    const result =
      mode === "create"
        ? await createProductAction(payload)
        : await updateProductAction(productId!, payload);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [key, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(key as keyof ProductFormValues, { message: messages[0] });
          }
        }
      }
      toast.error(result.error);
      return;
    }

    toast.success(mode === "create" ? "Product created" : "Product updated");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8" noValidate>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Basics
        </h2>

        <Field label="Product name" required error={errors.name?.message}>
          {(props) => (
            <Input
              {...props}
              {...register("name")}
              onChange={onNameChange}
              placeholder="e.g. 24-Hour Analog Timer Horloge"
            />
          )}
        </Field>

        <Field
          label="Slug"
          required
          error={errors.slug?.message}
          hint="Used in the product URL: /products/your-slug"
        >
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand" required error={errors.brand?.message}>
            {(props) => (
              <>
                <Input {...props} {...register("brand")} list="brand-options" />
                <datalist id="brand-options">
                  {brands.map((brand) => (
                    <option key={brand} value={brand} />
                  ))}
                </datalist>
              </>
            )}
          </Field>

          <Field label="Category" required error={errors.categoryId?.message}>
            {(props) => (
              <Select {...props} {...register("categoryId")}>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Field
          label="Model / type"
          error={errors.model?.message}
          hint="e.g. SUL 181h, D0910, DJO"
        >
          {(props) => <Input {...props} {...register("model")} />}
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Description
        </h2>

        <Field
          label="Short description"
          error={errors.shortDescription?.message}
          hint="Shown on product cards and search results."
        >
          {(props) => <Textarea {...props} {...register("shortDescription")} rows={2} />}
        </Field>

        <Field label="Full description" error={errors.description?.message}>
          {(props) => <Textarea {...props} {...register("description")} rows={6} />}
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Pricing &amp; availability
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Price"
            error={errors.price?.message}
            hint="Leave blank for “Price on request”."
          >
            {(props) => (
              <Controller
                control={control}
                name="price"
                render={({ field }) => (
                  <Input
                    {...props}
                    type="number"
                    min={0}
                    step={1}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? null : Number(e.target.value))
                    }
                    onBlur={field.onBlur}
                  />
                )}
              />
            )}
          </Field>

          <Field label="Currency" required error={errors.currency?.message}>
            {(props) => <Input {...props} {...register("currency")} />}
          </Field>

          <Field
            label="Sort order"
            error={errors.sortOrder?.message}
            hint="Lower shows first."
          >
            {(props) => (
              <Input
                {...props}
                type="number"
                min={0}
                step={1}
                {...register("sortOrder", { valueAsNumber: true })}
              />
            )}
          </Field>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("published")} className="size-4" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("inStock")} className="size-4" />
            In stock
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("featured")} className="size-4" />
            Featured
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Images
        </h2>
        <ProductImageManager value={images} onChange={setImages} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Specifications
        </h2>
        <p className="text-xs text-muted-foreground">
          Preserve values exactly as supplied by the client or manufacturer —
          don&apos;t invent or &quot;correct&quot; specs that haven&apos;t been verified.
        </p>
        <ProductSpecsEditor control={control} register={register} />
      </section>

      <div className="flex gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Create product"
              : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
