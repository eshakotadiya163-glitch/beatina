import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, ShoppingBag, Users, IndianRupee, Package, Star } from "lucide-react";
import { PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — The Woman Company" }, { name: "robots", content: "noindex" }] }),
});

function Admin() {
  const stats = [
    { label: "Revenue (30d)", value: "₹8,42,910", delta: "+12.4%", icon: IndianRupee },
    { label: "Orders", value: "1,284", delta: "+6.1%", icon: ShoppingBag },
    { label: "Customers", value: "4,921", delta: "+9.8%", icon: Users },
    { label: "Avg rating", value: "4.8", delta: "+0.1", icon: Star },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Admin</div>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of orders, customers and inventory.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="font-display text-2xl mt-2">{s.value}</div>
            <div className="text-xs text-primary mt-1 inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> {s.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="rounded-2xl bg-card border border-border p-3 shadow-soft h-fit">
          <nav className="space-y-1 text-sm">
            {["Dashboard", "Orders", "Customers", "Products", "Categories", "Inventory", "Coupons", "Banners", "Reviews", "Users", "Reports", "Settings"].map((n, i) => (
              <button key={n} className={`w-full text-left px-3 py-2 rounded-xl transition ${i === 0 ? "gradient-primary text-primary-foreground" : "hover:bg-accent/40"}`}>{n}</button>
            ))}
          </nav>
        </aside>
        <section>
          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <h2 className="font-display text-xl mb-4 inline-flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Recent products</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-widest text-muted-foreground">
                  <tr className="text-left">
                    <th className="py-2">Product</th><th>Brand</th><th>Category</th><th>Price</th><th>Rating</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.slice(0, 8).map((p) => (
                    <tr key={p.slug} className="border-t border-border">
                      <td className="py-3 flex items-center gap-3"><img src={p.images[0]} alt="" className="h-9 w-9 rounded-md object-cover" /><span>{p.name}</span></td>
                      <td>{p.brand}</td>
                      <td className="capitalize">{p.category.replace(/-/g, " ")}</td>
                      <td>₹{p.price}</td>
                      <td>{p.rating}</td>
                      <td><span className="text-xs px-2 py-0.5 rounded-full bg-accent/60 text-accent-foreground">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
