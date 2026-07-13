import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, Leaf, ChevronDown } from "lucide-react";
import { findProduct, PRODUCTS } from "@/lib/catalog";
import { useCart, useWishlist } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = findProduct(params.slug);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} — The Woman Company` : "Product" },
      { name: "description", content: loaderData?.product.description ?? "" },
      { property: "og:title", content: loaderData?.product.name ?? "" },
      { property: "og:description", content: loaderData?.product.description ?? "" },
      { property: "og:image", content: loaderData?.product.images[0] ?? "" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [openTab, setOpenTab] = useState<string | null>("ingredients");
  const cart = useCart();
  const wish = useWishlist();
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> ·{" "}
        <Link to="/shop" className="hover:text-primary">Shop</Link> ·{" "}
        <span>{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <motion.div
            key={img}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-luxury"
          >
            <img src={product.images[img]} alt={product.name} className="h-full w-full object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full gradient-primary text-primary-foreground">
                {product.badge}
              </span>
            )}
          </motion.div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src: string, i: number) => (
                <button key={i} onClick={() => setImg(i)} className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition ${i === img ? "border-primary" : "border-transparent"}`}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.brand}</div>
          <h1 className="font-display text-3xl md:text-4xl mt-1">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <div className="text-3xl font-display">₹{product.price}</div>
            {product.mrp > product.price && <>
              <div className="text-lg text-muted-foreground line-through">₹{product.mrp}</div>
              <div className="text-sm font-semibold text-primary">{off}% off</div>
            </>}
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-muted p-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9 rounded-full hover:bg-card">−</button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-9 w-9 rounded-full hover:bg-card">+</button>
            </div>
            <button
              onClick={() => { cart.add(product.slug, qty); toast.success("Added to bag"); }}
              className="btn-luxury btn-luxury-hover"
            >
              <ShoppingBag className="h-4 w-4" /> Add to bag
            </button>
            <button
              onClick={() => { wish.toggle(product.slug); toast.success(wish.has(product.slug) ? "Removed" : "Wishlisted"); }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-card hover:bg-accent/40 text-sm"
            >
              <Heart className={`h-4 w-4 ${wish.has(product.slug) ? "fill-primary text-primary" : ""}`} /> Wishlist
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
            {[
              { icon: Truck, label: "Free shipping ₹799+" },
              { icon: ShieldCheck, label: "100% Authentic" },
              { icon: Leaf, label: "Cruelty-free" },
            ].map((i) => (
              <div key={i.label} className="rounded-xl border border-border bg-card p-3 flex flex-col items-center gap-1 text-center">
                <i.icon className="h-4 w-4 text-primary" />
                <span>{i.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 divide-y divide-border border-y border-border">
            {[
              { key: "ingredients", title: "Ingredients", content: (
                <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {product.ingredients.map((i: string) => <li key={i}>· {i}</li>)}
                </ul>
              )},
              { key: "benefits", title: "Benefits", content: (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {product.benefits.map((b: string) => <li key={b}>· {b}</li>)}
                </ul>
              )},
              { key: "how", title: "How to use", content: <p className="text-sm text-muted-foreground">{product.howToUse}</p> },
              { key: "faq", title: "FAQ", content: (
                <div className="text-sm text-muted-foreground space-y-3">
                  <div><b className="text-foreground">Is this suitable for sensitive skin?</b><br />Yes — dermatologically tested and free of harsh sulphates.</div>
                  <div><b className="text-foreground">When will I see results?</b><br />Most customers notice a visible difference within 2 weeks of daily use.</div>
                </div>
              )},
            ].map((t) => (
              <div key={t.key}>
                <button onClick={() => setOpenTab(openTab === t.key ? null : t.key)} className="w-full py-4 flex items-center justify-between text-left">
                  <span className="font-medium">{t.title}</span>
                  <ChevronDown className={`h-4 w-4 transition ${openTab === t.key ? "rotate-180" : ""}`} />
                </button>
                {openTab === t.key && <div className="pb-4">{t.content}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl md:text-3xl mb-6">You may also love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
