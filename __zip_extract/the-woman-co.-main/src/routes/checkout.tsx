import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — The Woman Company" }] }),
});

function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pay, setPay] = useState<"card" | "upi" | "cod">("card");
  const shipping = cart.subtotal > 799 ? 0 : 49;
  const tax = Math.round(cart.subtotal * 0.05);
  const total = cart.subtotal + shipping + tax;

  if (cart.detailed.length === 0 && step !== 3) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-center text-muted-foreground">Your bag is empty.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl md:text-4xl mb-8">Checkout</h1>

      <div className="flex items-center gap-2 mb-8 text-sm">
        {["Address", "Payment", "Confirmation"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${step > i ? "gradient-primary text-primary-foreground" : "bg-muted"}`}>{i + 1}</div>
            <span className={step === i + 1 ? "font-medium" : "text-muted-foreground"}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
              <div className="font-display text-xl inline-flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Shipping address</div>
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="Full name" required />
                <Input label="Phone" required />
                <Input label="Email" type="email" required className="md:col-span-2" />
                <Input label="Address line 1" required className="md:col-span-2" />
                <Input label="City" required />
                <Input label="State" required />
                <Input label="Pincode" required />
                <Input label="Country" defaultValue="India" />
              </div>
              <button type="submit" className="btn-luxury btn-luxury-hover">Continue to payment</button>
            </form>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="font-display text-xl inline-flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Payment</div>
              <div className="grid gap-3">
                {[
                  { id: "card", label: "Card (Stripe)", desc: "Visa, Mastercard, Amex" },
                  { id: "upi", label: "UPI / Razorpay", desc: "GPay, PhonePe, Paytm" },
                  { id: "cod", label: "Cash on delivery", desc: "Pay when you receive" },
                ].map((o) => (
                  <label key={o.id} className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${pay === o.id ? "border-primary bg-accent/30" : "border-border"}`}>
                    <input type="radio" name="pay" checked={pay === o.id} onChange={() => setPay(o.id as typeof pay)} className="accent-primary" />
                    <div>
                      <div className="font-medium text-sm">{o.label}</div>
                      <div className="text-xs text-muted-foreground">{o.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={() => { setStep(3); cart.clear(); toast.success("Order placed"); }} className="btn-luxury btn-luxury-hover">Place order · ₹{total.toLocaleString()}</button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-10">
              <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
              <h2 className="font-display text-2xl mt-4">Thank you</h2>
              <p className="text-muted-foreground mt-2">Your order is on its way. A confirmation email is on its way to your inbox.</p>
              <div className="mt-6 flex gap-2 justify-center">
                <button onClick={() => navigate({ to: "/track" })} className="btn-luxury btn-luxury-hover">Track order</button>
                <button onClick={() => navigate({ to: "/" })} className="px-5 py-3 rounded-full border border-border">Continue shopping</button>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-2xl bg-card border border-border p-6 shadow-soft h-fit">
          <div className="font-display text-lg mb-3">Order summary</div>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.detailed.map(({ product, qty }) => (
              <div key={product.slug} className="flex gap-3 text-sm">
                <img src={product.images[0]} alt="" className="h-12 w-12 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{product.name}</div>
                  <div className="text-muted-foreground text-xs">Qty {qty}</div>
                </div>
                <div>₹{(product.price * qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{cart.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping ? `₹${shipping}` : "Free"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-display text-lg pt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Input({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs text-muted-foreground mb-1">{label}</span>
      <input {...rest} className="w-full h-11 rounded-xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
    </label>
  );
}
