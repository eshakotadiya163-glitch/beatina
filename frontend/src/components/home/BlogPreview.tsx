import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const articles = [
  {
    title: 'Must-Have Beauty Accessories for Your Daily Routine',
    date: '03-10-2026',
    comments: 0,
    excerpt: 'Beauty accessories play a vital role in enhancing your skincare and makeup routine. The right tools help you apply products...',
    image: '/images/migrated/2_b2_1_96db18e7-8cd1-4ac2-95aa-f203226fc675.webp',
    link: '/blog/must-have-beauty-accessories'
  },
  {
    title: 'Why Face Serums Are a Must-Have in Your Skincare Routine',
    date: '03-10-2026',
    comments: 0,
    excerpt: 'Face serums are powerful skincare products designed to deliver concentrated active ingredients directly into the skin. Benefits of Using Serums...',
    image: '/images/migrated/3_home-after_4fcfbfed-535d-4e65-8f9f-1fe66b041eff.jpg',
    link: '/blog/why-face-serums'
  },
  {
    title: 'How Face Creams Help Keep Your Skin Soft and Hydrated',
    date: '03-10-2026',
    comments: 0,
    excerpt: 'Face creams are an essential part of skincare. They help maintain hydration, improve skin texture, and protect the skin barrier....',
    image: '/images/migrated/4_gallery-image-8_11d220c1-ae96-4a4b-9528-eaf7e7947e95.webp',
    link: '/blog/how-face-creams-help'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const BlogPreview = () => {
  return (
    <section className="bg-white py-12 md:py-16 border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="font-body text-[13px] md:text-[15px] font-[400] text-gray-500 mb-2">
            Sub Title Top
          </div>
          <h3 className="font-serif text-[28px] md:text-[36px] lg:text-[42px] text-[#111111] font-[400] mb-2 leading-tight">
            <span>Journal</span>
          </h3>
          <div className="font-body text-[15px] md:text-[16px] text-gray-500 font-[400]">
            Subscribe for latest news and blog updates from our editor.
          </div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
        >
          {articles.map((article, index) => (
            <motion.div key={index} variants={itemVariants} className="group cursor-pointer flex flex-col h-full">
              <div className="relative overflow-hidden mb-6 aspect-[4/3] rounded-sm">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex items-center text-[12px] md:text-[13px] text-gray-500 mb-3 font-sans tracking-wide">
                  <span>{article.date}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span>{article.comments} comments</span>
                </div>
                <h3 className="font-serif text-xl md:text-[22px] font-medium text-[#111111] mb-3 group-hover:text-gray-500 transition-colors leading-[1.3] line-clamp-2">
                  <Link to={article.link}>{article.title}</Link>
                </h3>
                <p className="font-sans text-[14px] md:text-[15px] text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-2">
                  <Link to={article.link} className="inline-block border-b border-[#111111] pb-1 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#111111] hover:text-gray-500 hover:border-gray-500 transition-colors duration-300">
                    More Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;
