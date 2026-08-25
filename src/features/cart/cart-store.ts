import { create } from "zustand";
import type { Cart } from "@/types/shopify";

type CartUiState = {
  cart: Cart | null;
  isDrawerOpen: boolean;
  isLoading: boolean;
  selectedVariantId: string | null;
  errorMessage: string | null;
  setCart: (cart: Cart | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setLoading: (isLoading: boolean) => void;
  setSelectedVariantId: (variantId: string | null) => void;
  setError: (message: string | null) => void;
};

export const useCartStore = create<CartUiState>((set) => ({
  cart: null,
  isDrawerOpen: false,
  isLoading: false,
  selectedVariantId: null,
  errorMessage: null,
  setCart: (cart) => set({ cart }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedVariantId: (selectedVariantId) => set({ selectedVariantId }),
  setError: (errorMessage) => set({ errorMessage }),
}));
