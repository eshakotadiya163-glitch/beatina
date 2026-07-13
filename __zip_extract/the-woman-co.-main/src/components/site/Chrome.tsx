import { Link } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { useCart, useWishlist } from "@/lib/store";
import { useAuth } from "@/lib/auth";

const NAV = [
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/shop", mega: true },
  { label: "Brands", to: "/brands" },
  { label: "Offers", to: "/offers" },
  { label: "New", to: "/shop?sort=new" },
  { label: "Best Sellers", to: "/shop?sort=best" },
  { label: "Blog", to: "/blog" },
];

export function AnnouncementBar() {
  const messages = [
    "Complimentary shipping on orders over ₹799",
    "Use code WOMAN10 for 10% off your first order",
    "New in: The Rose Ritual — shop the edit",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % messages.length), 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, []);
  return (
    <div className="gradient-primary text-primary-foreground text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-2 h-9 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="tracking-wide"
          >
            {messages[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const cart = useCart();
  const wish = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term)).slice(0, 6);
  }, [q]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "glass border-b border-border shadow-soft" : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center gap-3">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setMobile(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 mr-4 shrink-0">
            <div className="h-8 w-8 rounded-full gradient-primary shadow-luxury" />
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">The Woman Company</div>
              <div className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase -mt-1">Beauty · Body · Care</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV.map((n) => (
              <div key={n.label} className="group relative">
                <Link
                  to={n.to}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  {n.label}
                  {n.mega && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
                {n.mega && (
                  <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[720px]">
                    <div className="glass rounded-2xl p-6 shadow-luxury border border-border">
                      <div className="grid grid-cols-4 gap-4">
                        {(["Body", "Face", "Hair", "Intimate & Period", "Fragrance", "Gifting"] as const).map((g) => (
                          <div key={g}>
                            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{g}</div>
                            <ul className="space-y-1.5">
                              {CATEGORIES.filter((c) => c.group === g).map((c) => (
                                <li key={c.slug}>
                                  <Link
                                    to="/category/$slug"
                                    params={{ slug: c.slug }}
                                    className="text-sm text-foreground/85 hover:text-primary"
                                  >
                                    {c.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex-1" />

          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 150)}
              placeholder="Search rose, serum, gift set…"
              className="w-full h-10 pl-9 pr-3 rounded-full bg-muted/70 border border-transparent focus:border-primary focus:bg-card outline-none text-sm transition"
            />
            {showSearch && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full glass rounded-xl shadow-luxury border border-border overflow-hidden">
                {suggestions.map((p) => (
                  <Link
                    key={p.slug}
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-accent/40"
                  >
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.brand}</div>
                    </div>
                    <div className="text-sm font-medium">₹{p.price}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Link to="/wishlist" className="relative p-2 hover:text-primary" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wish.slugs.length > 0 && <Badge n={wish.slugs.length} />}
            </Link>
            <Link to="/cart" className="relative p-2 hover:text-primary" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cart.count > 0 && <Badge n={cart.count} />}
            </Link>
            <Link to={user ? "/profile" : "/auth"} className="p-2 hover:text-primary" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 22 }}
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card z-[60] shadow-luxury p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="font-display text-lg">Menu</div>
              <button onClick={() => setMobile(false)} className="p-1"><X className="h-5 w-5" /></button>
            </div>
            <nav className="space-y-1">
              {NAV.map((n) => (
                <Link key={n.label} to={n.to} onClick={() => setMobile(false)} className="block px-3 py-2 rounded-lg hover:bg-accent/40">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Shop by category</div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.slice(0, 12).map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setMobile(false)}
                  className="text-sm px-3 py-2 rounded-lg bg-muted hover:bg-accent/40"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full gradient-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
      {n}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full gradient-primary" />
            <div className="font-display text-lg">The Woman Company</div>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Considered beauty & body care, crafted for the woman who chooses herself first.
          </p>
        </div>
        {[
          { title: "Shop", links: [["Bestsellers", "/shop"], ["New arrivals", "/shop"], ["Gift sets", "/category/gift-sets"], ["Offers", "/offers"]] },
          { title: "Care", links: [["Contact", "/contact"], ["Track order", "/track"], ["Returns", "/profile"], ["FAQs", "/contact"]] },
          { title: "Company", links: [["About", "/about"], ["Journal", "/blog"], ["Careers", "/about"], ["Sustainability", "/about"]] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold mb-3">{col.title}</div>
            <ul className="space-y-2">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-muted-foreground hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} The Woman Company. All rights reserved.</div>
          <div>Made with love, for you.</div>
        </div>
      </div>
    </footer>
  );
}
