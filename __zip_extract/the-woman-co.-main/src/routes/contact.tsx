import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — The Woman Company" },
      { name: "description", content: "Talk to us about products, orders, or press. We answer in one business day." },
    ],
  }),
});

function Contact() {
  const [busy, setBusy] = useState(false);
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 grid md:grid-cols-2 gap-10">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Say hello</div>
        <h1 className="font-display text-4xl mt-1">We're listening</h1>
        <p className="mt-4 text-muted-foreground">
          Questions about products, orders or wholesale? Send us a note — we usually reply within a business day.
        </p>
        <div className="mt-8 space-y-3 text-sm">
          <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> hello@thewomancompany.com</div>
          <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +91 90000 12345</div>
          <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Bengaluru · Mumbai · Online</div>
        </div>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); toast.success("Thanks — we'll be in touch."); (e.target as HTMLFormElement).reset(); }, 600); }}
        className="rounded-2xl bg-card border border-border p-6 shadow-soft space-y-3"
      >
        <input required placeholder="Full name" className="w-full h-11 rounded-xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        <input required type="email" placeholder="Email" className="w-full h-11 rounded-xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        <input placeholder="Subject" className="w-full h-11 rounded-xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        <textarea required placeholder="Your message" rows={5} maxLength={1000} className="w-full rounded-xl bg-muted p-4 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        <button disabled={busy} className="btn-luxury btn-luxury-hover w-full">{busy ? "Sending…" : "Send message"}</button>
      </form>
    </div>
  );
}
