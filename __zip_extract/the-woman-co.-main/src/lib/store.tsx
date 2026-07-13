// Cart + Wishlist stores (persisted to localStorage).
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./catalog";

type CartItem = { slug: string; qty: number };

type CartCtx = {
  items: CartItem[];
  detailed: Array<{ product: Product; qty: number }>;
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};
type WishCtx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  items: Product[];
};

const CartContext = createContext<CartCtx | null>(null);
const WishContext = createContext<WishCtx | null>(null);

function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocal<CartItem[]>("twc.cart", []);
  const [slugs, setSlugs] = useLocal<string[]>("twc.wishlist", []);

  const cart = useMemo<CartCtx>(() => {
    const detailed = items
      .map((i) => {
        const p = PRODUCTS.find((x) => x.slug === i.slug);
        return p ? { product: p, qty: i.qty } : null;
      })
      .filter(Boolean) as Array<{ product: Product; qty: number }>;
    return {
      items,
      detailed,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: detailed.reduce((s, i) => s + i.product.price * i.qty, 0),
      add: (slug, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((x) => x.slug === slug);
          if (existing) return prev.map((x) => (x.slug === slug ? { ...x, qty: x.qty + qty } : x));
          return [...prev, { slug, qty }];
        }),
      remove: (slug) => setItems((prev) => prev.filter((x) => x.slug !== slug)),
      setQty: (slug, qty) =>
        setItems((prev) => (qty <= 0 ? prev.filter((x) => x.slug !== slug) : prev.map((x) => (x.slug === slug ? { ...x, qty } : x)))),
      clear: () => setItems([]),
    };
  }, [items, setItems]);

  const wish = useMemo<WishCtx>(
    () => ({
      slugs,
      has: (slug) => slugs.includes(slug),
      toggle: (slug) => setSlugs((prev) => (prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug])),
      items: slugs.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean) as Product[],
    }),
    [slugs, setSlugs],
  );

  return (
    <CartContext.Provider value={cart}>
      <WishContext.Provider value={wish}>{children}</WishContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside StoreProvider");
  return ctx;
}
export function useWishlist() {
  const ctx = useContext(WishContext);
  if (!ctx) throw new Error("useWishlist outside StoreProvider");
  return ctx;
}
