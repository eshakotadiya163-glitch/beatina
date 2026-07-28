import { create } from 'zustand';

interface SearchState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export default useSearchStore;
