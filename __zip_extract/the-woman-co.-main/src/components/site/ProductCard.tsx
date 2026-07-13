import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/catalog";
import { useCart, useWishlist } from "@/lib/store";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const cart = useCart();
  const wish = useWishlist();
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-luxury transition-all"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full gradient-primary text-primary-foreground shadow-soft">
            {product.badge}
          </span>
        )}
        {off > 0 && (
          <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full bg-card/90 backdrop-blur border border-border">
            {off}% OFF
          </span>
        )}
      </Link>

      <button
        onClick={() => {
          wish.toggle(product.slug);
          toast.success(wish.has(product.slug) ? "Removed from wishlist" : "Added to wishlist");
        }}
        className="absolute top-2 right-2 md:top-3 md:right-3 opacity-0 group-hover:opacity-100 focus:opacity-100 transition p-2 rounded-full glass shadow-soft"
        aria-label="Wishlist"
      >
        <Heart className={`h-4 w-4 ${wish.has(product.slug) ? "fill-primary text-primary" : ""}`} />
      </button>

      <div className="p-4">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.brand}</div>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <h3 className="mt-1 text-sm font-medium line-clamp-2 min-h-10 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
            )}
          </div>
          <button
            onClick={() => {
              cart.add(product.slug);
              toast.success("Added to bag");
            }}
            className="p-2 rounded-full gradient-primary text-primary-foreground shadow-soft hover:shadow-luxury transition"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
