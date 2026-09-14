"use client";

import { useState, useMemo } from "react";
import { AdminTableToolbar, type FilterOption } from "@/components/admin/table-toolbar";
import { ProductRow } from "./product-row";
import { ProductFormModal } from "@/components/admin/product-form-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import type { Product, Category } from "@/lib/types";

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
  imageUrls: Record<string, string | null>;
  productImages: Record<string, { id: string; url: string }[]>;
}

export function ProductsManager({
  products,
  categories,
  imageUrls,
  productImages,
}: ProductsManagerProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Calculate filter counts
  const filters: FilterOption[] = useMemo(() => {
    return [
      { id: "all", label: "All Products", count: products.length },
      {
        id: "published",
        label: "Published",
        count: products.filter((p) => p.published).length,
      },
      {
        id: "drafts",
        label: "Drafts",
        count: products.filter((p) => !p.published).length,
      },
      {
        id: "in_stock",
        label: "In Stock",
        count: products.filter((p) => p.inStock).length,
      },
      {
        id: "out_of_stock",
        label: "Out of Stock",
        count: products.filter((p) => !p.inStock).length,
      },
      {
        id: "new_arrival",
        label: "New Arrival",
        count: products.filter((p) => p.isNewArrival).length,
      },
      {
        id: "now_available",
        label: "Now Available",
        count: products.filter((p) => p.isNowAvailable).length,
      },
    ];
  }, [products]);

  // Filter products based on search & active filter
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((p) => {
      // Search match
      if (query) {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesModel = p.model?.toLowerCase().includes(query) ?? false;
        const matchesSlug = p.slug.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesModel && !matchesSlug) {
          return false;
        }
      }

      // Filter chip match
      if (activeFilter === "published") return p.published;
      if (activeFilter === "drafts") return !p.published;
      if (activeFilter === "in_stock") return p.inStock;
      if (activeFilter === "out_of_stock") return !p.inStock;
      if (activeFilter === "new_arrival") return p.isNewArrival;
      if (activeFilter === "now_available") return p.isNowAvailable;

      return true;
    });
  }, [products, search, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy-950">
            Product Catalog
          </h1>
          <p className="mt-1 text-sm text-steel-600">
            Manage inventory, technical specifications, marketing badges, and pricing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-navy-900 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ventum-blue-500"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Product
        </button>
      </div>

      {/* Real-time Search & Filter Toolbar */}
      <AdminTableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchPlaceholder="Search by name, model, brand, or SKU..."
      />

      {/* Products List */}
      <div className="flex flex-col gap-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-950/20 bg-white/50 p-12 text-center">
            <svg
              className="h-10 w-10 text-steel-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-3 font-display text-base font-bold text-navy-950">
              No products found
            </h3>
            <p className="mt-1 text-xs text-steel-500 max-w-sm">
              {search
                ? `No products matched "${search}". Try adjusting your search term or clearing filters.`
                : "There are no products in this view."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-4 rounded-lg bg-mist-200 px-3 py-1.5 text-xs font-semibold text-navy-950 hover:bg-mist-300"
              >
                Reset Search & Filters
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              imageUrl={imageUrls[product.id] ?? null}
              onEdit={(prod) => setEditingProduct(prod)}
              onDelete={(prod) => setDeletingProduct(prod)}
            />
          ))
        )}
      </div>

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <ProductFormModal
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          categories={categories}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductFormModal
          key={editingProduct.id}
          isOpen={true}
          product={editingProduct}
          existingImages={productImages[editingProduct.id] ?? []}
          onClose={() => setEditingProduct(null)}
          categories={categories}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingProduct && (
        <DeleteConfirmDialog
          isOpen={true}
          productId={deletingProduct.id}
          productName={deletingProduct.name}
          onClose={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}

