import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ProductCard from '../ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Product = any;

interface NewArrivalsTabProps {
  products: Product[];
}

const NewArrivalsTab: React.FC<NewArrivalsTabProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState('New Arrivals');
  const tabs = ['New Arrivals', 'Best Sellers', 'Trending'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.tabCategory === activeTab);
  }, [products, activeTab]);

  return (
    <section className="bg-white overflow-hidden py-[50px]">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Centered Heading & Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-[40px]"
        >
          <h3 className="font-serif text-[32px] md:text-[40px] font-bold text-[#000] mb-2">
            New Arrivals
          </h3>
          <p className="font-body text-[#777] text-[16px] max-w-2xl mx-auto">
            Traditional divides between personal and professional space.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="text-center mb-[40px] flex justify-center -mt-4">
          <div className="inline-flex justify-center gap-6 md:gap-10 border-b border-transparent">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-1 py-2 text-[14px] md:text-[16px] font-[500] transition-colors duration-300 ${
                  activeTab === tab ? 'text-[#000] border-b-2 border-[#000]' : 'text-[#777] hover:text-[#000]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="w-full relative group/slider">
          {/* We use a key based on activeTab to force Swiper to remount and reset position when tab changes */}
          <Swiper
            key={activeTab}
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next-arrivals',
              prevEl: '.swiper-button-prev-arrivals',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination-arrivals' }}
            spaceBetween={30}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="w-full !pb-12"
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product._id} className="h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
            {filteredProducts.length === 0 && (
              <div className="text-center text-brand-muted py-10">No products found for {activeTab}.</div>
            )}
          </Swiper>
          
          {/* Custom Navigation Arrows */}
          <button className="swiper-button-prev-arrivals absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-brand-dark opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button className="swiper-button-next-arrivals absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-brand-dark opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
          
          {/* Custom Pagination */}
          <div className="swiper-pagination-arrivals flex justify-center gap-2 absolute bottom-0 left-0 w-full z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsTab;
