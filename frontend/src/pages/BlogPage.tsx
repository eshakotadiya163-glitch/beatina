import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BlogPage = () => {
  const posts = [
    { id: 1, title: "The Art of Skin Minimalism", category: "Skincare", img: "/images/migrated/18_gallery-2-v2.webp", date: "Oct 12, 2023", excerpt: "Discover the secrets to effortless beauty with our comprehensive guide to stripping back your routine." },
    { id: 2, title: "Discover Our Anti-Age Recovery Ritual", category: "Rituals", img: "/images/migrated/1_home-before_1.jpg", date: "Sep 28, 2023", excerpt: "Gentle yet effective. Learn how our signature recovery treatment is taking the beauty world by storm." },
    { id: 3, title: "A Guide to Sustainable Beauty", category: "Sustainability", img: "/images/migrated/19_gallery-image-7.webp", date: "Sep 15, 2023", excerpt: "How to build an eco-friendly vanity without compromising on luxury or efficacy." },
    { id: 4, title: "Essential Hydration for Every Season", category: "Skincare", img: "/images/migrated/21_about-img-3.webp", date: "Aug 02, 2023", excerpt: "Stay protected while glowing. Our top picks for lightweight, non-greasy hydration." },
    { id: 5, title: "Mastering the Night Cleansing Ritual", category: "Rituals", img: "/images/migrated/20_gallery-image-1.jpg", date: "Jul 18, 2023", excerpt: "Why washing your face once might not be enough. Mastering the ultimate cleansing ritual." },
    { id: 6, title: "The Science Behind Superseed Oil", category: "Ingredients", img: "/images/migrated/57_1-superseed-age-recovery-oil-30ml-A2603.jpg", date: "Jun 05, 2023", excerpt: "Navigate the world of botanical oils to find a treatment that perfectly balances your skin." },
  ];

  return (
    <div className="pt-32 pb-20 bg-brand-light min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-body uppercase tracking-[0.2em] text-brand-muted mb-4">The Journal</h2>
          <h1 className="text-4xl md:text-5xl font-heading text-brand-dark mb-6">Beauty & Wellness</h1>
          <p className="font-body text-brand-muted max-w-2xl mx-auto">
            Expert advice, ingredient deep-dives, and rituals to elevate your everyday life.
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-8 mb-16 overflow-x-auto no-scrollbar py-2">
          {['All', 'Skincare', 'Ingredients', 'Rituals', 'Sustainability', 'Fragrance'].map((cat) => (
            <button key={cat} className={`font-body uppercase tracking-widest text-[10px] pb-2 border-b transition-colors ${cat === 'All' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-20">
          <Link to={`/blog/${posts[0].id}`} className="group block relative overflow-hidden bg-white border border-brand-border">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 overflow-hidden bg-brand-light">
                <img src={posts[0].img} alt={posts[0].title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 aspect-[4/3] md:aspect-auto" />
              </div>
              <div className="w-full md:w-2/5 p-8 md:p-16 flex flex-col justify-center">
                <p className="text-[10px] text-brand-muted uppercase tracking-[0.2em] mb-4 font-body">{posts[0].category} • {posts[0].date}</p>
                <h3 className="font-heading text-3xl mb-4 group-hover:text-brand-accent transition-colors text-brand-dark leading-tight">{posts[0].title}</h3>
                <p className="font-body text-brand-muted mb-8 font-light leading-relaxed">{posts[0].excerpt}</p>
                <span className="inline-flex items-center text-xs font-body uppercase tracking-[0.2em] text-brand-dark">Read Article <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" /></span>
              </div>
            </div>
          </Link>
        </div>

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group flex flex-col bg-white border border-brand-border h-full">
              <div className="aspect-[4/3] overflow-hidden bg-brand-light">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-[10px] text-brand-muted uppercase tracking-[0.2em] mb-3 font-body">{post.category} • {post.date}</p>
                <h3 className="font-heading text-xl mb-3 group-hover:text-brand-accent transition-colors text-brand-dark">{post.title}</h3>
                <p className="font-body text-brand-muted mb-6 font-light text-sm line-clamp-2 flex-grow">{post.excerpt}</p>
                <span className="inline-flex items-center text-[10px] font-body uppercase tracking-[0.2em] text-brand-dark mt-auto">Read <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" /></span>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-20">
           <button className="bg-transparent border border-brand-dark text-brand-dark px-10 py-4 font-body uppercase tracking-[0.2em] text-xs hover:bg-brand-dark hover:text-white transition-colors">
             Load More Articles
           </button>
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
