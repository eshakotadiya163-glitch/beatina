import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  countInStock: number;
}

interface CartState {
  cartItems: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (item) => set((state) => {
        const existItem = state.cartItems.find((x) => x._id === item._id);
        if (existItem) {
          return {
            cartItems: state.cartItems.map((x) =>
              x._id === existItem._id ? item : x
            ),
          };
        } else {
          return { cartItems: [...state.cartItems, item] };
        }
      }),
      removeItem: (id) => set((state) => ({
        cartItems: state.cartItems.filter((x) => x._id !== id),
      })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
