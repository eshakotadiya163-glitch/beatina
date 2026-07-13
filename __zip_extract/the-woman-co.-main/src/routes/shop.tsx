import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { CATEGORIES, PRODUCTS, BRANDS, CONCERNS } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

const searchSchema = z.object({
  cat: z.string().optional(),
  sort: z.enum(["new", "best", "price-asc", "price-desc", "rating"]).optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop — The Woman Company" },
      { name: "description", content: "Shop the full edit: body, face, hair, intimate care, fragrance and gift sets." },
    ],
  }),
});

function Shop() {
  const search = useSearch({ from: "/shop" });
  const [category, setCategory] = useState<string | undefined>(search.cat);
  const [brand, setBrand] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState(3500);
  const [minRating, setMinRating] = useState(0);
  const [concern, setConcern] = useState<string | undefined>();
  const [sort, setSort] = useState(search.sort ?? "best");

  const items = useMemo(() => {
    let list = [...PRODUCTS];
    if (category) list = list.filter((p) => p.category === category);
    if (brand) list = list.filter((p) => p.brand === brand);
    if (concern) list = list.filter((p) => p.concerns.includes(concern));
    list = list.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "new": list.sort((a, b) => (a.badge === "New" ? -1 : 1)); break;
      default: list.sort((a, b) => (b.badge === "Bestseller" ? 1 : 0) - (a.badge === "Bestseller" ? 1 : 0));
    }
    return list;
  }, [category, brand, maxPrice, minRating, concern, sort, search.q]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <header className="mb-8">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Shop</div>
        <h1 className="font-display text-3xl md:text-4xl mt-1">The complete edit</h1>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <Group title="Category">
            <button onClick={() => setCategory(undefined)} className={`chip ${!category && "chip-active"}`}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c.slug} onClick={() => setCategory(c.slug)} className={`chip ${category === c.slug && "chip-active"}`}>{c.name}</button>
            ))}
          </Group>
          <Group title="Brand">
            <button onClick={() => setBrand(undefined)} className={`chip ${!brand && "chip-active"}`}>All</button>
            {BRANDS.map((b) => (
              <button key={b} onClick={() => setBrand(b)} className={`chip ${brand === b && "chip-active"}`}>{b}</button>
            ))}
          </Group>
          <Group title="Concern">
            <button onClick={() => setConcern(undefined)} className={`chip ${!concern && "chip-active"}`}>Any</button>
            {CONCERNS.map((c) => (
              <button key={c} onClick={() => setConcern(c)} className={`chip ${concern === c && "chip-active"}`}>{c}</button>
            ))}
          </Group>
          <Group title={`Max price · ₹${maxPrice}`}>
            <input type="range" min={299} max={3500} step={100} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary" />
          </Group>
          <Group title="Rating">
            {[0, 4, 4.5].map((r) => (
              <button key={r} onClick={() => setMinRating(r)} className={`chip ${minRating === r && "chip-active"}`}>{r === 0 ? "Any" : `${r}+ ★`}</button>
            ))}
          </Group>
        </aside>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">{items.length} products</div>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="text-sm rounded-full border border-border bg-card px-4 py-2">
              <option value="best">Bestsellers</option>
              <option value="new">New arrivals</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
          {items.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">No products match your filters.</div>
          )}
        </section>
      </div>

      <style>{`
        .chip { display:inline-block; padding: 0.35rem 0.75rem; margin: 0.15rem; border-radius: 9999px; font-size: 0.8rem; background: var(--color-muted); color: var(--color-foreground); border: 1px solid transparent; transition: all .2s; }
        .chip:hover { background: var(--color-accent); }
        .chip-active { background-image: linear-gradient(135deg, var(--color-primary), var(--color-primary-soft)); color: var(--color-primary-foreground); }
      `}</style>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{title}</div>
      <div className="flex flex-wrap">{children}</div>
    </div>
  );
}
