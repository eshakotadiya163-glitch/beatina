import { createFileRoute, Link } from "@tanstack/react-router";
import { useWishlist } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Wishlist — The Woman Company" }] }),
});

function WishlistPage() {
  const wish = useWishlist();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl md:text-4xl">Your wishlist</h1>
      <p className="text-muted-foreground mt-2">Save the pieces you love for later.</p>
      {wish.items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-4 inline-flex btn-luxury btn-luxury-hover">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wish.items.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
