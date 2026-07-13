import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Leaf, Instagram, Star } from "lucide-react";
import { CATEGORIES, PRODUCTS, BRANDS } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "The Woman Company — Premium Beauty & Body Care" },
      { name: "description", content: "Luxury body, face, hair, intimate care & fragrance. Shop bestsellers, new launches, and curated gift sets." },
    ],
  }),
});

function Home() {
  return (
    <div>
      <Hero />
      <TrustStrip />
      <TrendingCategories />
      <ShopByConcern />
      <BestSellers />
      <FeaturedBanner />
      <NewLaunches />
      <FeaturedBrands />
      <FlashSale />
      <BeautyTips />
      <Reviews />
      <InstaGallery />
      <Newsletter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/60 px-3 py-1 text-xs tracking-wider uppercase text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" /> The Rose Ritual — new edit
            </div>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl leading-tight">
              Beauty that <span className="text-gradient-primary">chooses you</span> back.
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg">
              Considered body, face, hair, intimate & fragrance rituals — crafted with clean ingredients and quiet luxury.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-luxury btn-luxury-hover">
                Shop the edit <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/category/gift-sets" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent/40 transition">
                Explore gift sets
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div><span className="text-lg font-display text-foreground">4.9</span>/5 · 12k+ reviews</div>
              <div className="h-6 w-px bg-border" />
              <div>Dermatologist tested</div>
              <div className="h-6 w-px bg-border" />
              <div>Cruelty-free</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&q=80"
                alt="Rose ritual beauty flatlay"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -left-4 sm:-left-8 glass rounded-2xl p-4 w-56 shadow-luxury"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Bestseller</div>
              <div className="text-sm font-medium mt-1">Rose Glow Body Wash</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" /> 4.7 · 1.2k
                </div>
                <div className="text-sm font-semibold">₹499</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="absolute -top-4 -right-2 sm:-right-6 glass rounded-2xl px-4 py-3 shadow-luxury"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Complimentary</div>
              <div className="text-sm font-medium">Shipping over ₹799</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: Truck, label: "Free shipping over ₹799" },
    { icon: ShieldCheck, label: "100% Authentic" },
    { icon: Leaf, label: "Cruelty-free & clean" },
    { icon: Sparkles, label: "Loved by 500k+ women" },
  ];
  return (
    <section className="border-y border-border bg-card/70">
      <div className="mx-auto max-w-7xl px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-3 text-sm">
            <div className="h-9 w-9 rounded-full bg-accent/60 flex items-center justify-center text-primary">
              <i.icon className="h-4 w-4" />
            </div>
            <span className="text-foreground/90">{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, cta }: { eyebrow?: string; title: string; cta?: { to: string; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{eyebrow}</div>}
        <h2 className="font-display text-2xl md:text-3xl mt-1">{title}</h2>
      </div>
      {cta && (
        <Link to={cta.to} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function TrendingCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Explore" title="Trending categories" cta={{ to: "/shop", label: "View all" }} />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {CATEGORIES.slice(0, 12).map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.05 }}
          >
            <Link to="/category/$slug" params={{ slug: c.slug }} className="block group">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-soft group-hover:shadow-luxury transition">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="mt-2 text-sm font-medium text-center group-hover:text-primary transition">{c.name}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ShopByConcern() {
  const concerns = [
    { name: "Glow & radiance", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80" },
    { name: "Hydration", img: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=800&q=80" },
    { name: "Anti-frizz hair", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
    { name: "Period care", img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <SectionHeader eyebrow="Personalised" title="Shop by concern" />
      <div className="grid md:grid-cols-4 gap-4">
        {concerns.map((c) => (
          <Link key={c.name} to="/shop" className="relative aspect-[4/5] rounded-2xl overflow-hidden group shadow-soft hover:shadow-luxury transition">
            <img src={c.img} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
              <div className="font-display text-lg">{c.name}</div>
              <div className="text-xs opacity-90 mt-1 inline-flex items-center gap-1">Shop now <ArrowRight className="h-3.5 w-3.5" /></div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BestSellers() {
  const items = PRODUCTS.filter((p) => p.badge === "Bestseller").slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Loved by many" title="Bestsellers" cta={{ to: "/shop", label: "Shop all" }} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
      </div>
    </section>
  );
}

function FeaturedBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <div className="relative overflow-hidden rounded-3xl shadow-luxury">
        <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1800&q=80" alt="Luxury beauty edit" className="h-64 md:h-96 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-16 max-w-xl text-primary-foreground">
            <div className="text-xs uppercase tracking-[0.3em] opacity-90">The Self-Love Ritual</div>
            <h3 className="font-display text-3xl md:text-5xl mt-2">A weekend of quiet luxury</h3>
            <p className="mt-3 opacity-90">Body butter, rose mist, hand cream — in a keepsake box.</p>
            <Link to="/product/$slug" params={{ slug: "self-care-gift-set" }} className="mt-6 inline-flex btn-luxury btn-luxury-hover">
              Discover the set <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewLaunches() {
  const items = PRODUCTS.filter((p) => p.badge === "New" || p.badge === "Limited").slice(0, 4);
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Fresh in" title="New launches" cta={{ to: "/shop?sort=new", label: "See new" }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
      </div>
    </section>
  );
}

function FeaturedBrands() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <SectionHeader eyebrow="Curated" title="Featured brands" cta={{ to: "/brands", label: "All brands" }} />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {BRANDS.map((b) => (
          <div key={b} className="rounded-2xl border border-border bg-card p-4 h-20 flex items-center justify-center text-center text-sm font-display hover:shadow-soft transition">
            {b}
          </div>
        ))}
      </div>
    </section>
  );
}

function FlashSale() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="rounded-3xl gradient-primary text-primary-foreground p-8 md:p-12 shadow-luxury">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] opacity-90">48-hour edit</div>
            <h3 className="font-display text-3xl md:text-4xl mt-2">Up to 40% off the beauty essentials</h3>
            <p className="mt-3 opacity-90 max-w-md">A short story of savings on our best-loved rituals. Ends soon.</p>
          </div>
          <div className="flex md:justify-end gap-3">
            {["12", "48", "22"].map((n, i) => (
              <div key={i} className="glass rounded-2xl px-5 py-4 text-center min-w-20">
                <div className="font-display text-3xl">{n}</div>
                <div className="text-[10px] uppercase tracking-widest opacity-80">{["Hours", "Minutes", "Seconds"][i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BeautyTips() {
  const tips = [
    { title: "The 5-step rose ritual", excerpt: "A slow, sensory routine to wind the week down.", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80" },
    { title: "Reading serum labels", excerpt: "What really deserves a spot on your vanity.", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" },
    { title: "Period care, reimagined", excerpt: "Comfort, kindness, and clean formulas.", img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Journal" title="Beauty tips & rituals" cta={{ to: "/blog", label: "Read the journal" }} />
      <div className="grid md:grid-cols-3 gap-6">
        {tips.map((t) => (
          <article key={t.title} className="rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-luxury transition group">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={t.img} alt={t.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <h4 className="font-display text-xl">{t.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{t.excerpt}</p>
              <Link to="/blog" className="mt-3 inline-flex items-center gap-1 text-sm text-primary">Read more <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { name: "Ananya S.", quote: "The rose body wash is like a spa in my shower. Skin feels velvety.", rating: 5 },
    { name: "Meera R.", quote: "Finally an intimate wash that's actually gentle. Loyal customer.", rating: 5 },
    { name: "Ishita K.", quote: "The gift set turned into a weekly self-care ritual. Obsessed.", rating: 5 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="Kind words" title="Loved by our community" />
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <figure key={r.name} className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="flex gap-0.5 text-gold mb-3">
              {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold" />)}
            </div>
            <blockquote className="font-display text-lg leading-snug">"{r.quote}"</blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">— {r.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function InstaGallery() {
  const imgs = [
    "photo-1596462502278-27bfdc403348","photo-1620916566398-39f1143ab7be","photo-1541643600914-78b084683601",
    "photo-1522337660859-02fbefca4702","photo-1570194065650-d99fb4bedf0a","photo-1586495777744-4413f21062fa",
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <SectionHeader eyebrow="@thewomancompany" title="From our world" />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {imgs.map((id) => (
          <a key={id} href="#" className="group relative aspect-square overflow-hidden rounded-xl bg-muted">
            <img src={`https://images.unsplash.com/${id}?w=600&q=80`} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Instagram className="h-6 w-6 text-primary-foreground" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-14 shadow-soft text-center">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Join the ritual</div>
        <h3 className="font-display text-3xl md:text-4xl mt-2">10% off your first order</h3>
        <p className="mt-2 text-muted-foreground">Slow beauty notes, launches & members-only offers. No noise.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); if (!email) return; toast.success("Welcome to the ritual — check your inbox."); setEmail(""); }}
          className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 h-12 rounded-full bg-muted px-5 outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button type="submit" className="btn-luxury btn-luxury-hover h-12">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
