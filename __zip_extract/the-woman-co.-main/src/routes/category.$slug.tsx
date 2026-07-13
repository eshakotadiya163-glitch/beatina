import { createFileRoute, notFound } from "@tanstack/react-router";
import { CATEGORIES, productsInCategory, type Product } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { cat, items: productsInCategory(params.slug) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.cat.name} — The Woman Company` : "Category" },
      { name: "description", content: loaderData ? `Shop premium ${loaderData.cat.name.toLowerCase()} from The Woman Company.` : "Shop by category." },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat, items } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="relative rounded-3xl overflow-hidden mb-10 h-56 md:h-72 shadow-luxury">
        <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-14 text-primary-foreground">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] opacity-90">{cat.group}</div>
            <h1 className="font-display text-3xl md:text-5xl mt-1">{cat.name}</h1>
            <p className="mt-2 opacity-90 max-w-md text-sm">Curated {cat.name.toLowerCase()} for a considered ritual.</p>
          </div>
        </div>
      </div>
      {items.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p: Product, i: number) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">New arrivals coming soon.</div>
      )}
    </div>
  );
}
