import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Tag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your Bag — The Woman Company" }] }),
});

function CartPage() {
  const cart = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gift, setGift] = useState(false);
  const shipping = cart.subtotal > 799 || cart.subtotal === 0 ? 0 : 49;
  const giftFee = gift ? 99 : 0;
  const tax = Math.round(cart.subtotal * 0.05);
  const total = Math.max(0, cart.subtotal - discount + shipping + giftFee + tax);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "WOMAN10") { setDiscount(Math.round(cart.subtotal * 0.1)); toast.success("Coupon applied — 10% off"); }
    else toast.error("Invalid coupon");
  };

  if (cart.detailed.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Your bag is quiet</h1>
        <p className="mt-2 text-muted-foreground">Let's find your next ritual.</p>
        <Link to="/shop" className="mt-6 inline-flex btn-luxury btn-luxury-hover">Discover the edit</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl md:text-4xl mb-8">Your bag</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-4">
          {cart.detailed.map(({ product, qty }) => (
            <div key={product.slug} className="flex gap-4 rounded-2xl bg-card border border-border p-4 shadow-soft">
              <img src={product.images[0]} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.brand}</div>
                <Link to="/product/$slug" params={{ slug: product.slug }} className="text-sm font-medium hover:text-primary line-clamp-1">{product.name}</Link>
                <div className="mt-1 text-sm font-semibold">₹{product.price}</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full bg-muted p-1">
                    <button onClick={() => cart.setQty(product.slug, qty - 1)} className="h-8 w-8 rounded-full hover:bg-card"><Minus className="h-3.5 w-3.5 mx-auto" /></button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button onClick={() => cart.setQty(product.slug, qty + 1)} className="h-8 w-8 rounded-full hover:bg-card"><Plus className="h-3.5 w-3.5 mx-auto" /></button>
                  </div>
                  <button onClick={() => cart.remove(product.slug)} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-medium">₹{(product.price * qty).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <aside className="space-y-4 h-fit">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft space-y-3">
            <h2 className="font-display text-xl">Order summary</h2>
            <Row label="Subtotal" value={`₹${cart.subtotal.toLocaleString()}`} />
            {discount > 0 && <Row label="Discount" value={`−₹${discount.toLocaleString()}`} accent />}
            <Row label="Shipping" value={shipping ? `₹${shipping}` : "Free"} />
            {gift && <Row label="Gift wrap" value={`₹${giftFee}`} />}
            <Row label="Tax (est.)" value={`₹${tax.toLocaleString()}`} />
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-lg">₹{total.toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="btn-luxury btn-luxury-hover w-full mt-2">Checkout</Link>
            <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="accent-primary" />
              Add luxury gift wrap · ₹99
            </label>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="text-sm font-medium mb-2 inline-flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> Have a coupon?</div>
            <div className="flex gap-2">
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="WOMAN10" className="flex-1 h-10 rounded-full bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <button onClick={applyCoupon} className="px-4 rounded-full bg-foreground text-background text-sm">Apply</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-primary font-medium" : ""}>{value}</span>
    </div>
  );
}
