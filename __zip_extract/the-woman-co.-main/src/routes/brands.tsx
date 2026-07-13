import { createFileRoute, Link } from "@tanstack/react-router";
import { BRANDS } from "@/lib/catalog";

export const Route = createFileRoute("/brands")({
  component: Brands,
  head: () => ({
    meta: [
      { title: "Brands — The Woman Company" },
      { name: "description", content: "A carefully curated house of women-first beauty and body care brands." },
    ],
  }),
});

function Brands() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">The house</div>
      <h1 className="font-display text-4xl md:text-5xl mt-2">Our featured brands</h1>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {BRANDS.map((b) => (
          <Link to="/shop" key={b} className="rounded-2xl border border-border bg-card p-8 h-40 flex flex-col items-center justify-center text-center hover:shadow-luxury transition">
            <div className="font-display text-xl">{b}</div>
            <div className="text-xs text-muted-foreground mt-2">Explore →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
