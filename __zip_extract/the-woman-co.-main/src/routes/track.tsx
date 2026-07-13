import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Truck, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/track")({
  component: Track,
  head: () => ({ meta: [{ title: "Track order — The Woman Company" }] }),
});

function Track() {
  const [id, setId] = useState("");
  const [shown, setShown] = useState(false);
  const steps = [
    { label: "Order placed", done: true, icon: CheckCircle2 },
    { label: "Packed with love", done: true, icon: Package },
    { label: "Out for delivery", done: true, icon: Truck },
    { label: "Delivered", done: false, icon: Circle },
  ];
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-3xl md:text-4xl">Track your order</h1>
      <form onSubmit={(e) => { e.preventDefault(); setShown(true); }} className="mt-6 flex gap-2">
        <input required value={id} onChange={(e) => setId(e.target.value)} placeholder="Order ID (e.g. TWC-24312)" className="flex-1 h-12 rounded-full bg-muted px-5 outline-none focus:ring-2 focus:ring-primary/40" />
        <button className="btn-luxury btn-luxury-hover">Track</button>
      </form>
      {shown && (
        <div className="mt-10 rounded-2xl bg-card border border-border p-6 shadow-soft">
          <div className="text-sm text-muted-foreground">Order</div>
          <div className="font-display text-xl">{id}</div>
          <ol className="mt-6 space-y-4">
            {steps.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <s.icon className={`h-5 w-5 ${s.done ? "text-primary" : "text-muted-foreground"}`} />
                <span className={s.done ? "" : "text-muted-foreground"}>{s.label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
