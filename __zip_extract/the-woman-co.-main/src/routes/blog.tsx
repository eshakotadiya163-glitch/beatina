import { createFileRoute } from "@tanstack/react-router";

const POSTS = [
  { title: "The 5-step rose ritual", excerpt: "A slow, sensory routine to wind the week down.", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1000&q=80", date: "Jun 12, 2026" },
  { title: "Reading serum labels", excerpt: "What really deserves a spot on your vanity.", img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&q=80", date: "May 28, 2026" },
  { title: "Period care, reimagined", excerpt: "Comfort, kindness, and clean formulas.", img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=1000&q=80", date: "May 3, 2026" },
  { title: "Notes on quiet luxury", excerpt: "Why less packaging is more feeling.", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1000&q=80", date: "Apr 18, 2026" },
];

export const Route = createFileRoute("/blog")({
  component: Blog,
  head: () => ({
    meta: [
      { title: "Journal — The Woman Company" },
      { name: "description", content: "Slow beauty notes, rituals and stories from The Woman Company." },
    ],
  }),
});

function Blog() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Journal</div>
      <h1 className="font-display text-4xl md:text-5xl mt-2">Notes on beauty & living</h1>
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {POSTS.map((p) => (
          <article key={p.title} className="rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-luxury transition group">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={p.img} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="text-xs text-muted-foreground">{p.date}</div>
              <h2 className="font-display text-2xl mt-1">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
