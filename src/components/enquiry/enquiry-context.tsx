"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  brand: string;
  model: string | null;
  price: number | null;
  currency: string;
  quantity: number;
  imageIds: string[];
  /** Resolved on the server at add time — productImageUrl cannot run in the
      browser, because the bucket id is not a NEXT_PUBLIC env var. */
  imageUrl?: string | null;
}

interface EnquiryContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, imageUrl?: string | null) => void;
  removeItem: (id: string) => void;
  /** Lets a product button render its own selected state. */
  hasItem: (id: string) => boolean;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const EnquiryContext = createContext<EnquiryContextValue | undefined>(undefined);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ventum_enquiry_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ventum_enquiry_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, quantity = 1, imageUrl: string | null = null) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + quantity, imageUrl: imageUrl ?? i.imageUrl }
            : i
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          model: product.model,
          price: product.price,
          currency: product.currency,
          imageIds: product.imageIds,
          imageUrl,
          quantity,
        },
      ];
    });
    // Deliberately does NOT open the drawer. Selecting a product is a quiet
    // act — the customer picks several, then opens the list once to send.
  };

  const hasItem = (id: string) => items.some((i) => i.id === id);

  const removeItem = (id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((current) =>
      current.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <EnquiryContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        hasItem,
        updateQuantity,
        clearCart,
        totalItems,
        isDrawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }
  return context;
}

