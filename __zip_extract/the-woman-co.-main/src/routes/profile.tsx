import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User as UserIcon, MapPin, Package, RotateCcw, Wallet, Ticket, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "My account — The Woman Company" }] }),
});

const TABS = [
  { id: "info", label: "Personal", icon: UserIcon },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "orders", label: "Orders", icon: Package },
  { id: "returns", label: "Returns", icon: RotateCcw },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "coupons", label: "Coupons", icon: Ticket },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("info");

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [loading, user, nav]);

  if (!user) return null;

  const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Beautiful";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <header className="mb-8 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-display text-xl">
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Welcome back</div>
          <h1 className="font-display text-2xl">{name}</h1>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <aside className="rounded-2xl bg-card border border-border p-3 shadow-soft h-fit">
          <nav className="space-y-1">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition ${tab === t.id ? "gradient-primary text-primary-foreground" : "hover:bg-accent/40"}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
            <button onClick={() => signOut().then(() => nav({ to: "/" }))} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>

        <section className="rounded-2xl bg-card border border-border p-6 shadow-soft min-h-[400px]">
          {tab === "info" && (
            <div>
              <h2 className="font-display text-xl mb-4">Personal details</h2>
              <dl className="grid md:grid-cols-2 gap-3 text-sm">
                <Row label="Name" value={name} />
                <Row label="Email" value={user.email ?? "—"} />
                <Row label="Member since" value={new Date(user.created_at).toLocaleDateString()} />
                <Row label="Loyalty tier" value="Rose · 340 pts" />
              </dl>
            </div>
          )}
          {tab === "orders" && (
            <div>
              <h2 className="font-display text-xl mb-4">Recent orders</h2>
              <div className="text-sm text-muted-foreground">
                No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping</Link>.
              </div>
            </div>
          )}
          {["addresses", "returns", "wallet", "coupons", "notifications"].includes(tab) && (
            <div>
              <h2 className="font-display text-xl mb-2 capitalize">{tab}</h2>
              <p className="text-sm text-muted-foreground">Nothing here yet. This area will fill as you shop.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-4">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
