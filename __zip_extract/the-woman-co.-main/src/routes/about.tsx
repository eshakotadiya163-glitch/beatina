import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — The Woman Company" },
      { name: "description", content: "Our story: clean, considered beauty & body care for the woman who chooses herself first." },
    ],
  }),
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Our story</div>
      <h1 className="font-display text-4xl md:text-5xl mt-2">Beauty, but softer.</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        The Woman Company is a home for considered beauty, body and period care —
        crafted with clean ingredients, quiet packaging, and a deep respect for the rituals that make a day feel like yours.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        {[
          { title: "Clean", body: "Free of parabens, sulphates and needless nasties." },
          { title: "Kind", body: "Cruelty-free, gentle formulas, gynaecologist-tested." },
          { title: "Considered", body: "Designed slowly, small batches, seasonal edits." },
        ].map((v) => (
          <div key={v.title} className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="font-display text-xl">{v.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
