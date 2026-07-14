import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import ProductCard from '../ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

type Product = any;

interface ShopTheLookProps {
  products?: Product[];
}

const ShopTheLook: React.FC<ShopTheLookProps> = ({ products = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const trendingProducts = products.filter(p => p.tabCategory === 'Trending');

  const handleHotspotClick = (index: number) => {
    setActiveIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Authentic Flex Row Reverse Layout */}
        <div className="flex flex-col lg:flex-row-reverse -mx-4 items-center gap-y-12">
          
          {/* Right Side (Image + Hotspots) - Visually on Right due to flex-row-reverse */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 px-4"
          >
            <div className="relative w-full aspect-square overflow-hidden bg-gray-50 max-w-[650px] mx-auto">
              <img 
                src="/images/migrated/48_ChatGPT_Image_Mar_11_2026_10_46_49_AM.png" 
                alt="Shop The Look" 
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Authentic Hotspots */}
              <ul className="absolute inset-0 m-0 p-0 list-none pointer-events-none">
                
                {/* Hotspot 1 (Red) */}
                <li 
                  className="absolute pointer-events-auto"
                  style={{ top: '13%', left: '47%' }}
                >
                  <button 
                    onClick={() => handleHotspotClick(0)}
                    className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${activeIndex === 0 ? 'scale-125' : ''}`}
                  >
                    <span className="absolute inset-0 rounded-full bg-[rgb(224,11,37)] opacity-40 animate-ping"></span>
                    <span className="relative w-2.5 h-2.5 rounded-full bg-[rgb(224,11,37)] shadow-sm"></span>
                  </button>
                </li>

                {/* Hotspot 2 (Purple) */}
                <li 
                  className="absolute pointer-events-auto"
                  style={{ top: '48%', left: '70%' }}
                >
                  <button 
                    onClick={() => handleHotspotClick(1)}
                    className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${activeIndex === 1 ? 'scale-125' : ''}`}
                  >
                    <span className="absolute inset-0 rounded-full bg-[rgb(229,206,255)] opacity-40 animate-ping" style={{ animationDelay: '0.2s' }}></span>
                    <span className="relative w-2.5 h-2.5 rounded-full bg-[rgb(229,206,255)] shadow-sm"></span>
                  </button>
                </li>

                {/* Hotspot 3 (Blue) */}
                <li 
                  className="absolute pointer-events-auto"
                  style={{ top: '58%', left: '26%' }}
                >
                  <button 
                    onClick={() => handleHotspotClick(2)}
                    className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${activeIndex === 2 ? 'scale-125' : ''}`}
                  >
                    <span className="absolute inset-0 rounded-full bg-[rgb(97,127,255)] opacity-40 animate-ping" style={{ animationDelay: '0.4s' }}></span>
                    <span className="relative w-2.5 h-2.5 rounded-full bg-[rgb(97,127,255)] shadow-sm"></span>
                  </button>
                </li>

              </ul>
            </div>
          </motion.div>
          
          {/* Left Side (Text + Slider) - Visually on Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 px-4 flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-md mx-auto lg:mr-16">
              
              <div className="text-center mb-12">
                <div className="font-sans text-[10px] md:text-[11px] font-semibold text-gray-500 uppercase tracking-[0.25em] mb-4">
                  product bundle
                </div>
                <h3 className="font-serif text-3xl md:text-[40px] text-[#111111] font-light leading-tight">
                  Favorite Skin & hair Grow
                </h3>
              </div>

              {/* Swiper Column */}
            <div className="w-full flex flex-col justify-center max-w-[350px] mx-auto relative group">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: '.shop-prev',
                  nextEl: '.shop-next',
                }}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.realIndex);
                }}
                className="w-full"
              >
                {trendingProducts.length > 0 ? (
                  trendingProducts.map((product, index) => (
                    <SwiperSlide key={product._id || index}>
                      <ProductCard product={product} />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="text-center py-10 text-gray-500">No trending products found.</div>
                  </SwiperSlide>
                )}
              </Swiper>
                
                {/* Custom Navigation Arrows */}
                <button className="shop-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button className="shop-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;
