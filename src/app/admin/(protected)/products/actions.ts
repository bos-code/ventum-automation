"use server";

import { revalidatePath } from "next/cache";
import { updateProduct } from "@/lib/data/products";

export interface ProductFormState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function saveProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = priceRaw ? Math.max(0, parseInt(priceRaw, 10)) : null;

  if (priceRaw && Number.isNaN(price)) {
    return { status: "error", message: "Price must be a number." };
  }

  try {
    await updateProduct(id, {
      price,
      inStock: formData.get("inStock") === "on",
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
    });
  } catch (error) {
    console.error(`saveProduct(${id}) failed:`, error);
    return { status: "error", message: "Could not save. Try again." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");

  return { status: "success", message: "Saved." };
}
