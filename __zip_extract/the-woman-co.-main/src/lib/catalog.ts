// Static premium catalog for THE WOMAN COMPANY.
// Images: royalty-free Unsplash placeholders. Replace with your own CDN later.

export type Category = {
  slug: string;
  name: string;
  group: "Body" | "Face" | "Hair" | "Intimate & Period" | "Fragrance" | "Gifting";
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string; // category slug
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  badge?: "Bestseller" | "New" | "Limited" | "Sale";
  concerns: string[];
  skinType?: string[];
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  description: string;
  images: string[];
};

export const CATEGORIES: Category[] = [
  { slug: "body-wash", name: "Body Wash", group: "Body", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80" },
  { slug: "body-lotion", name: "Body Lotion", group: "Body", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80" },
  { slug: "body-butter", name: "Body Butter", group: "Body", image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&q=80" },
  { slug: "body-scrub", name: "Body Scrub", group: "Body", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80" },
  { slug: "face-wash", name: "Face Wash", group: "Face", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" },
  { slug: "face-serum", name: "Face Serum", group: "Face", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80" },
  { slug: "moisturizer", name: "Moisturizer", group: "Face", image: "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=800&q=80" },
  { slug: "lip-care", name: "Lip Care", group: "Face", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80" },
  { slug: "hand-cream", name: "Hand Cream", group: "Body", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
  { slug: "foot-care", name: "Foot Care", group: "Body", image: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800&q=80" },
  { slug: "intimate-wash", name: "Intimate Wash", group: "Intimate & Period", image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80" },
  { slug: "sanitary-pads", name: "Sanitary Pads", group: "Intimate & Period", image: "https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?w=800&q=80" },
  { slug: "tampons", name: "Tampons", group: "Intimate & Period", image: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800&q=80" },
  { slug: "menstrual-cup", name: "Menstrual Cup", group: "Intimate & Period", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80" },
  { slug: "hair-oil", name: "Hair Oil", group: "Hair", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80" },
  { slug: "shampoo", name: "Shampoo", group: "Hair", image: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80" },
  { slug: "conditioner", name: "Conditioner", group: "Hair", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80" },
  { slug: "hair-mask", name: "Hair Mask", group: "Hair", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" },
  { slug: "hair-serum", name: "Hair Serum", group: "Hair", image: "https://images.unsplash.com/photo-1620916297893-3d3f3c6c0e17?w=800&q=80" },
  { slug: "perfume", name: "Perfume", group: "Fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" },
  { slug: "mist", name: "Body Mist", group: "Fragrance", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80" },
  { slug: "gift-sets", name: "Gift Sets", group: "Gifting", image: "https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=800&q=80" },
];

export const BRANDS = [
  "TWC Signature", "Rose Atelier", "Petal & Poise", "Aurea", "Mira Bloom",
  "Luxe Botanica", "Velvet Bloom", "Maison Fleur",
];

const img = (id: string) => `https://images.unsplash.com/${id}?w=1000&q=80`;

export const PRODUCTS: Product[] = [
  {
    slug: "rose-glow-body-wash",
    name: "Rose Glow Nourishing Body Wash",
    brand: "TWC Signature",
    category: "body-wash",
    price: 499, mrp: 699, rating: 4.7, reviews: 1284, badge: "Bestseller",
    concerns: ["Dryness", "Dullness"], skinType: ["All", "Dry"],
    ingredients: ["Damask Rose Water", "Glycerin", "Vitamin E", "Aloe Vera"],
    benefits: ["Deep hydration", "Soft, glowing skin", "Delicate rose fragrance"],
    howToUse: "Apply on wet skin, lather gently, rinse. Use daily.",
    description: "A luxurious rose-infused body wash that cleanses without stripping, leaving skin veiled in a soft floral halo.",
    images: [img("photo-1556228578-8c89e6adf883"), img("photo-1570194065650-d99fb4bedf0a"), img("photo-1608248543803-ba4f8c70ae0b")],
  },
  {
    slug: "velvet-body-butter",
    name: "Velvet Shea Body Butter",
    brand: "Velvet Bloom",
    category: "body-butter",
    price: 799, mrp: 1099, rating: 4.8, reviews: 942, badge: "Bestseller",
    concerns: ["Dryness", "Stretch marks"], skinType: ["Dry", "Normal"],
    ingredients: ["Raw Shea Butter", "Cocoa Butter", "Jojoba Oil", "Vitamin E"],
    benefits: ["48hr hydration", "Improves elasticity", "Non-greasy velvet finish"],
    howToUse: "Massage a small amount onto clean skin, focusing on dry areas.",
    description: "A whipped shea butter that melts into skin — rich, cushiony, and enveloping.",
    images: [img("photo-1570194065650-d99fb4bedf0a"), img("photo-1596462502278-27bfdc403348")],
  },
  {
    slug: "hydra-glow-serum",
    name: "Hydra Glow Hyaluronic Serum",
    brand: "Aurea",
    category: "face-serum",
    price: 1299, mrp: 1799, rating: 4.9, reviews: 2103, badge: "New",
    concerns: ["Dehydration", "Fine lines", "Dullness"], skinType: ["All"],
    ingredients: ["Hyaluronic Acid", "Niacinamide 5%", "Vitamin B5", "Rose Extract"],
    benefits: ["Plump, dewy skin", "Fades dullness", "Multi-weight hydration"],
    howToUse: "Apply 3–4 drops on cleansed face morning and night. Follow with moisturizer.",
    description: "Three molecular weights of hyaluronic acid drench skin with hydration for a lit-from-within glow.",
    images: [img("photo-1620916566398-39f1143ab7be"), img("photo-1556228720-195a672e8a03")],
  },
  {
    slug: "petal-face-wash",
    name: "Petal Purity Gentle Face Wash",
    brand: "Petal & Poise",
    category: "face-wash",
    price: 449, mrp: 599, rating: 4.6, reviews: 810,
    concerns: ["Acne", "Oiliness"], skinType: ["Oily", "Combination"],
    ingredients: ["Salicylic Acid 0.5%", "Rose Petal Extract", "Green Tea"],
    benefits: ["Unclogs pores", "Balances oil", "Skin barrier safe"],
    howToUse: "Massage onto damp skin, rinse thoroughly. Use morning and night.",
    description: "A soft-foam cleanser that clears without stripping the delicate skin barrier.",
    images: [img("photo-1556228720-195a672e8a03"), img("photo-1620916566398-39f1143ab7be")],
  },
  {
    slug: "moonlight-moisturizer",
    name: "Moonlight Overnight Moisturizer",
    brand: "Maison Fleur",
    category: "moisturizer",
    price: 999, mrp: 1399, rating: 4.8, reviews: 1567, badge: "Bestseller",
    concerns: ["Dryness", "Fine lines"], skinType: ["All"],
    ingredients: ["Squalane", "Ceramides", "Peptides", "Chamomile"],
    benefits: ["Overnight repair", "Restores barrier", "Wake up glowing"],
    howToUse: "Apply as the last step of your night routine.",
    description: "A cloud-soft cream that works while you sleep, rebuilding skin's barrier and glow.",
    images: [img("photo-1631730359585-38a4935cbec4"), img("photo-1620916566398-39f1143ab7be")],
  },
  {
    slug: "rose-lip-balm",
    name: "Rose Petal Lip Balm",
    brand: "TWC Signature",
    category: "lip-care",
    price: 299, mrp: 399, rating: 4.7, reviews: 2201, badge: "Bestseller",
    concerns: ["Chapped lips"], skinType: ["All"],
    ingredients: ["Rose Wax", "Shea Butter", "Vitamin E"],
    benefits: ["Long-lasting balm", "Soft rose tint", "Non-sticky"],
    howToUse: "Apply as often as needed.",
    description: "A tender rose-tinted balm that leaves lips soft, plush, and kissable.",
    images: [img("photo-1586495777744-4413f21062fa")],
  },
  {
    slug: "silk-hand-cream",
    name: "Silk Softening Hand Cream",
    brand: "Mira Bloom",
    category: "hand-cream",
    price: 349, mrp: 499, rating: 4.6, reviews: 623,
    concerns: ["Dryness"], skinType: ["All"],
    ingredients: ["Silk Proteins", "Almond Oil", "Glycerin"],
    benefits: ["Fast-absorbing", "Non-greasy", "Delicate scent"],
    howToUse: "Massage into hands whenever needed.",
    description: "Silk-soft hydration that disappears into skin, leaving hands elegant and cared-for.",
    images: [img("photo-1522337360788-8b13dee7a37e")],
  },
  {
    slug: "intimate-daily-wash",
    name: "Daily Intimate Wash — pH 3.5",
    brand: "TWC Signature",
    category: "intimate-wash",
    price: 349, mrp: 449, rating: 4.8, reviews: 3120, badge: "Bestseller",
    concerns: ["Irritation", "Odour"],
    ingredients: ["Lactic Acid", "Sea Buckthorn", "Tea Tree"],
    benefits: ["Maintains natural pH", "Gentle daily use", "Gynaecologist-tested"],
    howToUse: "Use externally as a daily cleanser.",
    description: "A gentle daily wash formulated with your body's natural pH in mind.",
    images: [img("photo-1611080626919-7cf5a9dbab5b")],
  },
  {
    slug: "ultra-soft-pads",
    name: "Ultra-Soft Rash-Free Pads (Pack of 20)",
    brand: "TWC Signature",
    category: "sanitary-pads",
    price: 299, mrp: 399, rating: 4.7, reviews: 1840,
    concerns: ["Rashes", "Leakage"],
    ingredients: ["Organic cotton top sheet", "Anion strip"],
    benefits: ["12hr protection", "Rash-free", "Biodegradable core"],
    howToUse: "Use as needed during period.",
    description: "Ultra-soft, ultra-thin pads engineered for comfort and confidence.",
    images: [img("photo-1615397587950-3cbb55f95b77")],
  },
  {
    slug: "reusable-menstrual-cup",
    name: "Reusable Medical-Grade Menstrual Cup",
    brand: "TWC Signature",
    category: "menstrual-cup",
    price: 599, mrp: 899, rating: 4.6, reviews: 512, badge: "New",
    concerns: ["Sustainability"],
    ingredients: ["Medical-grade silicone"],
    benefits: ["Up to 12hr use", "Reusable for 10 years", "Zero waste"],
    howToUse: "Sterilise before first use. See guide inside.",
    description: "A comfortable, sustainable period companion designed for real bodies.",
    images: [img("photo-1585386959984-a4155224a1ad")],
  },
  {
    slug: "argan-hair-oil",
    name: "Golden Argan Hair Nectar",
    brand: "Luxe Botanica",
    category: "hair-oil",
    price: 699, mrp: 999, rating: 4.8, reviews: 1755, badge: "Bestseller",
    concerns: ["Frizz", "Damage"],
    ingredients: ["Argan Oil", "Sweet Almond", "Rosemary", "Vitamin E"],
    benefits: ["Tames frizz", "Adds mirror shine", "Nourishes scalp"],
    howToUse: "Massage into scalp and lengths. Leave 30 min or overnight, then shampoo.",
    description: "A weightless golden oil that turns dull, tired hair into a glossy cascade.",
    images: [img("photo-1608248543803-ba4f8c70ae0b")],
  },
  {
    slug: "silk-shampoo",
    name: "Silk Repair Sulphate-Free Shampoo",
    brand: "Rose Atelier",
    category: "shampoo",
    price: 549, mrp: 749, rating: 4.7, reviews: 902,
    concerns: ["Damage", "Dryness"],
    ingredients: ["Silk Amino Acids", "Argan", "Panthenol"],
    benefits: ["Repairs damage", "Colour-safe", "Adds shine"],
    howToUse: "Massage into wet hair, lather, rinse thoroughly.",
    description: "A sulphate-free formula that treats hair like the fine textile it is.",
    images: [img("photo-1526045478516-99145907023c")],
  },
  {
    slug: "silk-conditioner",
    name: "Silk Repair Deep Conditioner",
    brand: "Rose Atelier",
    category: "conditioner",
    price: 599, mrp: 799, rating: 4.7, reviews: 730,
    concerns: ["Damage", "Dryness"],
    ingredients: ["Silk Amino Acids", "Shea", "Panthenol"],
    benefits: ["Detangles", "Softens", "Restores bounce"],
    howToUse: "After shampoo, apply to lengths, rinse after 3 minutes.",
    description: "A creamy conditioner that leaves hair melting-soft and mirror-smooth.",
    images: [img("photo-1535585209827-a15fcdbc4c2d")],
  },
  {
    slug: "midnight-perfume",
    name: "Midnight Peony Eau de Parfum",
    brand: "Maison Fleur",
    category: "perfume",
    price: 2499, mrp: 3299, rating: 4.9, reviews: 421, badge: "Limited",
    concerns: [],
    ingredients: ["Peony", "White Musk", "Bergamot", "Vanilla"],
    benefits: ["Long-lasting", "Signature floral", "Luxury bottle"],
    howToUse: "Spritz on pulse points.",
    description: "A modern floral built around a heart of dark peony — soft, magnetic, unforgettable.",
    images: [img("photo-1541643600914-78b084683601")],
  },
  {
    slug: "rose-body-mist",
    name: "Rose Cloud Body Mist",
    brand: "Petal & Poise",
    category: "mist",
    price: 449, mrp: 599, rating: 4.6, reviews: 1200,
    concerns: [],
    ingredients: ["Rose Water", "Bergamot", "Musk"],
    benefits: ["Fresh, all-day scent", "Skin-friendly"],
    howToUse: "Mist onto skin and hair.",
    description: "A cloud of soft rose you can wear every single day.",
    images: [img("photo-1592945403244-b3fbafd7f539")],
  },
  {
    slug: "self-care-gift-set",
    name: "The Self-Love Ritual Gift Set",
    brand: "TWC Signature",
    category: "gift-sets",
    price: 1999, mrp: 2799, rating: 4.9, reviews: 380, badge: "Bestseller",
    concerns: [],
    ingredients: ["Body wash", "Body butter", "Hand cream", "Rose mist"],
    benefits: ["Curated ritual", "Premium gift box", "Ready to gift"],
    howToUse: "A complete self-care ritual — day or night.",
    description: "A curated ritual in a keepsake box — the loveliest way to say I see you.",
    images: [img("photo-1549007953-2f2dc0b24019")],
  },
];

export const CONCERNS = [
  "Dryness", "Acne", "Dullness", "Fine lines", "Frizz", "Damage", "Oiliness", "Sensitivity", "Rashes",
];

export function findProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
export function productsInCategory(slug: string) {
  return PRODUCTS.filter((p) => p.category === slug);
}
