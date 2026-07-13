import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/offers")({
  component: Offers,
  head: () => ({
    meta: [
      { title: "Offers — The Woman Company" },
      { name: "description", content: "Members' offers, bundles and seasonal edits on premium beauty." },
    ],
  }),
});

function Offers() {
  const onSale = PRODUCTS.filter((p) => p.mrp > p.price).sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price));
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="rounded-3xl gradient-primary text-primary-foreground p-10 md:p-14 shadow-luxury mb-10">
        <div className="text-xs uppercase tracking-[0.3em] opacity-90">Members' edit</div>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Up to 40% off</h1>
        <p className="mt-2 opacity-90 max-w-lg">A curated set of pieces we love — at prices that feel like a small kindness.</p>
        <Link to="/auth" className="mt-6 inline-flex bg-card text-foreground rounded-full px-6 py-3 text-sm font-medium">Join to unlock</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {onSale.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
      </div>
    </div>
  );
}
