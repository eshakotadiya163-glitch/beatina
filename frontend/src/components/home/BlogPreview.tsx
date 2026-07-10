import { Link } from 'react-router-dom';

const articles = [
  {
    title: 'Must-Have Beauty Accessories for Your Daily Routine',
    date: '03-10-2026',
    comments: 0,
    excerpt: 'Beauty accessories play a vital role in enhancing your skincare and makeup routine. The right tools help you apply products...',
    image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/articles/b2_1_96db18e7-8cd1-4ac2-95aa-f203226fc675.webp?v=1773147608&width=800',
    link: '/blog/must-have-beauty-accessories'
  },
  {
    title: 'Why Face Serums Are a Must-Have in Your Skincare Routine',
    date: '03-10-2026',
    comments: 0,
    excerpt: 'Face serums are powerful skincare products designed to deliver concentrated active ingredients directly into the skin. Benefits of Using Serums...',
    image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/articles/home-after_4fcfbfed-535d-4e65-8f9f-1fe66b041eff.jpg?v=1773147551&width=800',
    link: '/blog/why-face-serums'
  },
  {
    title: 'How Face Creams Help Keep Your Skin Soft and Hydrated',
    date: '03-10-2026',
    comments: 0,
    excerpt: 'Face creams are an essential part of skincare. They help maintain hydration, improve skin texture, and protect the skin barrier....',
    image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/articles/gallery-image-8_11d220c1-ae96-4a4b-9528-eaf7e7947e95.webp?v=1773147561&width=800',
    link: '/blog/how-face-creams-help'
  }
];

const BlogPreview = () => {
  return (
    <section className="py-[40px] md:py-[50px] bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="subtop text-center text-xs text-brand-muted uppercase tracking-[0.2em] mb-2">
          Sub Title Top
        </div>
        <h2 className="font-heading text-3xl md:text-[40px] text-brand-dark mb-12 text-center">
          Journal
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
          {articles.map((article, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-6 aspect-square md:aspect-[4/3]">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center text-xs text-brand-muted mb-3 font-body">
                <span>{article.date}</span>
                <span className="mx-2">•</span>
                <span>{article.comments} comments</span>
              </div>
              <h3 className="font-heading text-xl md:text-2xl text-brand-dark mb-3 group-hover:text-gray-600 transition-colors">
                <Link to={article.link}>{article.title}</Link>
              </h3>
              <p className="font-body text-sm text-brand-muted mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <Link to={article.link} className="inline-block border-b border-brand-dark pb-1 text-xs uppercase tracking-widest font-semibold hover:text-gray-500 hover:border-gray-500 transition-colors">
                More Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
