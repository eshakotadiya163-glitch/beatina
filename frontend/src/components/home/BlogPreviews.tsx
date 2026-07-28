// Real blog article images from The Woman Company Shopify storefront
const blogPosts = [
  {
    image: '/images/migrated/2_b2_1_96db18e7-8cd1-4ac2-95aa-f203226fc675.webp',
    title: 'Must-Have Beauty Accessories for Your Daily Routine',
    date: 'April 2025',
    excerpt: 'Discover the essential beauty accessories that can elevate your daily skincare and beauty routine.',
    link: '#',
  },
  {
    image: '/images/migrated/3_home-after_4fcfbfed-535d-4e65-8f9f-1fe66b041eff.jpg',
    title: 'Why Face Serums Are a Must-Have in Your Skincare Routine',
    date: 'March 2025',
    excerpt: 'Face serums deliver potent active ingredients deep into the skin for visible, targeted results.',
    link: '#',
  },
  {
    image: '/images/migrated/4_gallery-image-8_11d220c1-ae96-4a4b-9528-eaf7e7947e95.webp',
    title: 'How Face Creams Help Keep Your Skin Soft and Hydrated',
    date: 'February 2025',
    excerpt: 'Learn how to choose the right face cream for your skin type and build an effective moisture barrier.',
    link: '#',
  },
];

const BlogPreviews = () => {
  return (
    <section className="py-12 md:py-14 bg-white">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="font-body text-[13px] md:text-[15px] text-gray-500 font-[400] mb-2">
            Sub Title Top
          </div>
          <h3 className="font-serif text-[28px] md:text-[36px] lg:text-[42px] text-[#111111] font-[400] mb-2 leading-tight">
            <span>Journal</span>
          </h3>
          <div className="font-body text-[15px] md:text-[16px] text-gray-500 font-[400]">
            Subscribe for latest news and blog updates from our editor.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-[30px]">
          {blogPosts.map((post, i) => (
            <a key={i} href={post.link} className="group block mb-0">
              {/* Image */}
              <div className="relative w-full bg-brand-light mb-4 overflow-hidden" style={{ paddingTop: '70%' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              {/* Title */}
              <h4 className="font-serif text-[20px] md:text-[22px] font-[400] text-[#111111] mb-4 transition-colors leading-[1.3]">
                {post.title}
              </h4>
              {/* Meta */}
              <p className="font-body text-[14px] text-gray-500 mb-4 flex items-center gap-2">
                <span className="pr-2 border-r border-gray-300">
                  <time>{post.date}</time>
                </span>
                <span>0 comments</span>
              </p>
              {/* Excerpt */}
              <div className="font-body text-[15px] text-gray-500 leading-relaxed line-clamp-2 mb-4 hidden lg:block">
                {post.excerpt}
              </div>
              {/* Button */}
              <div className="inline-block bg-[#111111] text-white font-body text-[11px] font-[500] uppercase tracking-[1px] px-[20px] py-[8px] hover:bg-brand-accent transition-colors mt-auto">
                More Details
              </div>
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
