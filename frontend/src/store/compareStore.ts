import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  brand: string;
  category: any;
  rating: number;
  numReviews: number;
  features?: string[];
  specifications?: any[];
  shortDescription?: string;
}

interface CompareStore {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearCompare: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) => set((state) => {
        if (state.items.find(i => i._id === item._id)) return state;
        // Keep max 4 items
        const newItems = [...state.items, item].slice(-4);
        return { items: newItems, isOpen: true };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i._id !== id)
      })),
      clearCompare: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'compare-storage',
    }
  )
);

export default useCompareStore;
