import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const articleStyle = searchParams.get('articleStyle') || 'standard';

  // Mock data to match BlogPage
  const posts = [
    { id: 1, title: "The Art of Skin Minimalism", category: "Skincare", img: "/images/migrated/18_gallery-2-v2.webp", date: "Oct 12, 2023", excerpt: "Discover the secrets to effortless beauty with our comprehensive guide to stripping back your routine.", content: "Skin minimalism, or 'skinimalism', is all about stripping back your skincare and makeup routines to the essentials. Instead of a 10-step routine, it focuses on a few high-quality, multitasking products that nourish the skin while letting its natural texture shine through.\n\nBy reducing the number of products you use, you also reduce the risk of irritation and barrier damage. Focus on a gentle cleanser, a hydrating serum, a reliable moisturizer, and of course, SPF for the day." },
    { id: 2, title: "Discover Our Anti-Age Recovery Ritual", category: "Rituals", img: "/images/migrated/1_home-before_1.jpg", date: "Sep 28, 2023", excerpt: "Gentle yet effective. Learn how our signature recovery treatment is taking the beauty world by storm.", content: "Aging is a natural privilege, but how our skin ages can be supported with the right ingredients and rituals. Our Anti-Age Recovery Ritual focuses on deep hydration, barrier repair, and cellular turnover.\n\nStart with a double cleanse to ensure the skin is perfectly prepped. Follow with a vitamin C serum to brighten, and seal it all in with a ceramide-rich cream." },
    { id: 3, title: "A Guide to Sustainable Beauty", category: "Sustainability", img: "/images/migrated/19_gallery-image-7.webp", date: "Sep 15, 2023", excerpt: "How to build an eco-friendly vanity without compromising on luxury or efficacy.", content: "Sustainability in beauty is no longer a trend; it's a necessity. Building an eco-friendly vanity starts with examining the packaging and the sourcing of ingredients.\n\nLook for glass or aluminum packaging, which are infinitely recyclable, and brands that offer refillable options. Support companies that are transparent about their supply chain and environmental impact." },
    { id: 4, title: "Essential Hydration for Every Season", category: "Skincare", img: "/images/migrated/21_about-img-3.webp", date: "Aug 02, 2023", excerpt: "Stay protected while glowing. Our top picks for lightweight, non-greasy hydration.", content: "Hydration is the foundation of healthy skin, regardless of your skin type. Even oily skin needs hydration—when it's dehydrated, it can overcompensate by producing more oil.\n\nIn the summer, opt for lightweight gel-creams or hydrating essences. In the winter, you may need a richer cream with occlusives like shea butter or squalane to lock in moisture." },
    { id: 5, title: "Mastering the Night Cleansing Ritual", category: "Rituals", img: "/images/migrated/20_gallery-image-1.jpg", date: "Jul 18, 2023", excerpt: "Why washing your face once might not be enough. Mastering the ultimate cleansing ritual.", content: "If you wear makeup or SPF, a single cleanse at the end of the day is rarely enough. Enter the double cleanse: a ritual that ensures your skin is truly clean and ready to absorb your nighttime products.\n\nStart with an oil-based cleanser or balm to melt away makeup, sunscreen, and excess sebum. Follow with a water-based gel or cream cleanser to clean the skin itself." },
    { id: 6, title: "The Science Behind Superseed Oil", category: "Ingredients", img: "/images/migrated/57_1-superseed-age-recovery-oil-30ml-A2603.jpg", date: "Jun 05, 2023", excerpt: "Navigate the world of botanical oils to find a treatment that perfectly balances your skin.", content: "Facial oils can be transformative for the skin, provided you choose the right one. Superseed oils, derived from nutrient-dense seeds like rosehip, chia, or hemp, are packed with essential fatty acids and antioxidants.\n\nThey help repair the skin barrier, reduce inflammation, and lock in hydration. For best results, press a few drops into the skin as the final step of your nighttime routine." },
  ];

  const post = posts.find(p => p.id === Number(id)) || posts[0];

  return (
    <div className="pt-24 pb-14 bg-white min-h-screen">
      <div className={`max-w-4xl mx-auto px-4 md:px-8 flex ${articleStyle === 'sidebar-left' ? 'flex-row-reverse gap-12' : articleStyle === 'sidebar-right' ? 'flex-row gap-12' : 'flex-col'}`}>
        
        {/* Sidebar conditionally rendered */}
        {(articleStyle === 'sidebar-left' || articleStyle === 'sidebar-right') && (
          <div className="w-[280px] hidden lg:block shrink-0 pt-14">
            <h3 className="font-heading text-lg text-[#111111] mb-6 uppercase tracking-wider border-b border-gray-100 pb-4">Recent Articles</h3>
            <div className="text-sm font-body text-gray-500">Sidebar content here...</div>
          </div>
        )}

        <div className="flex-1">
          <Link to="/blog" className="inline-flex items-center text-sm font-body text-gray-500 hover:text-[#111111] mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to News
          </Link>
          
          {/* Title and Image logic */}
          {articleStyle === 'overlay' ? (
            <div className="aspect-[16/9] w-full relative overflow-hidden rounded-md mb-12 flex items-center justify-center">
              <img src={post.img} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative text-center z-10 px-6">
                <div className="flex items-center justify-center gap-2 text-xs font-body text-white/80 uppercase tracking-widest mb-4">
                  <span>{post.category}</span><span>•</span><span>{post.date}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-heading text-white mb-6 leading-tight">{post.title}</h1>
              </div>
            </div>
          ) : articleStyle === 'title-above' ? (
            <>
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 text-xs font-body text-gray-400 uppercase tracking-widest mb-4">
                  <span>{post.category}</span><span>•</span><span>{post.date}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading text-[#111111] mb-6 leading-tight">{post.title}</h1>
              </div>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-md mb-12">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </>
          ) : articleStyle === 'title-below' ? (
            <>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-md mb-12">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 text-xs font-body text-gray-400 uppercase tracking-widest mb-4">
                  <span>{post.category}</span><span>•</span><span>{post.date}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading text-[#111111] mb-6 leading-tight">{post.title}</h1>
              </div>
            </>
          ) : articleStyle === 'centered' ? (
            <>
              <div className="text-center mb-10 max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-heading text-[#111111] mb-6 leading-tight">{post.title}</h1>
              </div>
              <div className="aspect-[4/3] max-w-2xl mx-auto w-full overflow-hidden rounded-md mb-12">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </>
          ) : articleStyle === 'video' ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-heading text-[#111111] mb-6 leading-tight">{post.title} (Video Layout)</h1>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-md mb-12 bg-black flex items-center justify-center">
                <div className="text-white text-xl">Video Player Placeholder</div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 text-xs font-body text-gray-400 uppercase tracking-widest mb-4">
                  <span>{post.category}</span><span>•</span><span>{post.date}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading text-[#111111] mb-6 leading-tight">{post.title}</h1>
              </div>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-md mb-12">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </>
          )}

        <div className="prose prose-lg mx-auto font-body text-gray-600">
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
