import { Link, useSearchParams } from 'react-router-dom';

const BlogPage = () => {
  const [searchParams] = useSearchParams();
  const layout = searchParams.get('layout') || 'list';
  const sidebar = searchParams.get('sidebar') || 'left';
  const style = searchParams.get('style') || 'standard'; // Just a visual mock for the style

  const posts = [
    { id: 1, title: "The Art of Skin Minimalism", category: "Skincare", img: "/images/migrated/18_gallery-2-v2.webp", date: "Oct 12, 2023", excerpt: "Discover the secrets to effortless beauty with our comprehensive guide to stripping back your routine." },
    { id: 2, title: "Discover Our Anti-Age Recovery Ritual", category: "Rituals", img: "/images/migrated/1_home-before_1.jpg", date: "Sep 28, 2023", excerpt: "Gentle yet effective. Learn how our signature recovery treatment is taking the beauty world by storm." },
    { id: 3, title: "A Guide to Sustainable Beauty", category: "Sustainability", img: "/images/migrated/19_gallery-image-7.webp", date: "Sep 15, 2023", excerpt: "How to build an eco-friendly vanity without compromising on luxury or efficacy." },
    { id: 4, title: "Essential Hydration for Every Season", category: "Skincare", img: "/images/migrated/21_about-img-3.webp", date: "Aug 02, 2023", excerpt: "Stay protected while glowing. Our top picks for lightweight, non-greasy hydration." },
    { id: 5, title: "Mastering the Night Cleansing Ritual", category: "Rituals", img: "/images/migrated/20_gallery-image-1.jpg", date: "Jul 18, 2023", excerpt: "Why washing your face once might not be enough. Mastering the ultimate cleansing ritual." },
    { id: 6, title: "The Science Behind Superseed Oil", category: "Ingredients", img: "/images/migrated/57_1-superseed-age-recovery-oil-30ml-A2603.jpg", date: "Jun 05, 2023", excerpt: "Navigate the world of botanical oils to find a treatment that perfectly balances your skin." },
  ];

  return (
    <div className="pt-24 pb-14 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-heading text-[#111111] mb-6 tracking-wide">
            News {style !== 'standard' && <span className="text-xl text-gray-400 capitalize">({style})</span>}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm font-body text-gray-500">
            <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111111]">News</span>
          </div>
        </div>

        <div className={`flex flex-col gap-12 lg:gap-12 ${sidebar === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
          
          {/* Sidebar */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            
            {/* Recent Articles */}
            <div className="mb-12">
              <h3 className="font-heading text-lg text-[#111111] mb-6 uppercase tracking-wider border-b border-gray-100 pb-4">Recent Articles</h3>
              <div className="flex flex-col gap-6">
                {posts.slice(0, 3).map((post) => (
                  <Link key={`recent-${post.id}`} to={`/blog/${post.id}`} className="group flex gap-4 items-center">
                    <div className="w-20 h-20 overflow-hidden bg-brand-light flex-shrink-0 rounded-sm">
                      <img src={post.img} alt={post.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm text-[#111111] group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug mb-1">{post.title}</h4>
                      <p className="text-[10px] text-gray-400 font-body">{post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories / Tags */}
            <div>
              <h3 className="font-heading text-lg text-[#111111] mb-6 uppercase tracking-wider border-b border-gray-100 pb-4">Tags</h3>
              <ul className="flex flex-col gap-3">
                {['Skincare', 'Ingredients', 'Rituals', 'Sustainability', 'Fragrance'].map((cat) => (
                  <li key={cat}>
                    <Link to="#" className="font-body text-sm text-gray-500 hover:text-[#111111] transition-colors">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'flex flex-col gap-12 md:gap-12'}>
              {posts.map((post) => (
                <article key={post.id} className={`group ${layout === 'grid' ? '' : 'border-b border-gray-100 pb-12 md:pb-12 last:border-0 last:pb-0'}`}>
                  <Link to={`/blog/${post.id}`} className="block relative overflow-hidden bg-brand-light mb-6">
                    <div className="aspect-[16/9] w-full">
                      <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  </Link>
                  <div className={`flex flex-col items-center text-center ${layout === 'grid' ? '' : 'max-w-3xl mx-auto'}`}>
                    <div className="flex items-center gap-2 text-xs font-body text-gray-400 uppercase tracking-widest mb-4">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl text-[#111111] mb-4 group-hover:text-brand-accent transition-colors">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p className={`font-body text-gray-500 mb-6 leading-relaxed ${layout === 'grid' ? 'line-clamp-3' : ''}`}>
                      {post.excerpt}
                    </p>
                    <Link to={`/blog/${post.id}`} className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#111111] border-b-2 border-brand-dark pb-1 hover:text-brand-accent hover:border-brand-accent transition-colors">
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination / Load More (Placeholder) */}
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
               <button className="bg-[#111111] text-white px-[30px] py-[15px] font-body uppercase tracking-[1px] text-[11px] hover:bg-[#ffb6c1] transition-colors">
                 Load More
               </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BlogPage;
