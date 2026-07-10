// Real blog article images from Beautina Shopify storefront
const blogPosts = [
  {
    image: '/assets/migrated/2_b2_1_96db18e7-8cd1-4ac2-95aa-f203226fc675.webp',
    title: 'Must-Have Beauty Accessories for Your Daily Routine',
    date: 'April 2025',
    excerpt: 'Discover the essential beauty accessories that can elevate your daily skincare and beauty routine.',
    link: '#',
  },
  {
    image: '/assets/migrated/3_home-after_4fcfbfed-535d-4e65-8f9f-1fe66b041eff.jpg',
    title: 'Why Face Serums Are a Must-Have in Your Skincare Routine',
    date: 'March 2025',
    excerpt: 'Face serums deliver potent active ingredients deep into the skin for visible, targeted results.',
    link: '#',
  },
  {
    image: '/assets/migrated/4_gallery-image-8_11d220c1-ae96-4a4b-9528-eaf7e7947e95.webp',
    title: 'How Face Creams Help Keep Your Skin Soft and Hydrated',
    date: 'February 2025',
    excerpt: 'Learn how to choose the right face cream for your skin type and build an effective moisture barrier.',
    link: '#',
  },
];

const BlogPreviews = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="font-body text-[11px] uppercase tracking-[0.2em] text-brand-dark mb-2">Sub Title Top</div>
          <h3 className="font-heading text-3xl md:text-4xl text-brand-dark mb-2">
            <span>Journal</span>
          </h3>
          <div className="font-body text-brand-muted text-[15px]">
            Subscribe for latest news and blog updates from our editor.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post, i) => (
            <a key={i} href={post.link} className="group block">
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-brand-light mb-5">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              {/* Meta */}
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-muted block mb-2">
                {post.date}
              </span>
              {/* Title */}
              <h3 className="font-heading text-xl font-light text-brand-dark mb-3 group-hover:text-brand-accent transition-colors leading-snug">
                {post.title}
              </h3>
              {/* Excerpt */}
              <p className="font-body text-sm text-brand-muted leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </a>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <a href="#" className="btn-outline">View All Posts</a>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviews;
