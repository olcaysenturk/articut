import { create } from "zustand";

type CartUiState = {
  isDrawerOpen: boolean;
  isLoading: boolean;
  selectedVariantId: string | null;
  errorMessage: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setLoading: (isLoading: boolean) => void;
  setSelectedVariantId: (variantId: string | null) => void;
  setError: (message: string | null) => void;
};

export const useCartStore = create<CartUiState>((set) => ({
  isDrawerOpen: false,
  isLoading: false,
  selectedVariantId: null,
  errorMessage: null,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedVariantId: (selectedVariantId) => set({ selectedVariantId }),
  setError: (errorMessage) => set({ errorMessage }),
}));
