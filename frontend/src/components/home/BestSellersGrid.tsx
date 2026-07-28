import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import ProductCard from '../ProductCard';
import { Loader2 } from 'lucide-react';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BestSellersGrid = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=12&sort=-rating');
      return data.products || data || [];
    },
  });

  const products = Array.isArray(data) ? data.slice(0, 8) : [];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="font-body text-[13px] md:text-[15px] font-[400] text-gray-500 mb-4 capitalize">
            Best Sellers
          </div>
          <h3 className="font-serif text-[28px] md:text-[36px] lg:text-[42px] text-[#111111] font-[400] leading-tight">
            The Elegance of Effortless Beauty
          </h3>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="animate-spin text-black w-8 h-8" />
          </div>
        ) : (
          <div className="w-full relative group/slider">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: '.swiper-button-next-bestsellers',
                prevEl: '.swiper-button-prev-bestsellers',
              }}
              pagination={{ clickable: true, el: '.swiper-pagination-bestsellers' }}
              spaceBetween={30}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="w-full !pb-12"
            >
              {products.map((product: any) => (
                <SwiperSlide key={product._id} className="h-auto">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Arrows */}
            <button className="swiper-button-prev-bestsellers absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-brand-dark opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button className="swiper-button-next-bestsellers absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-brand-dark opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
            
            {/* Custom Pagination */}
            <div className="swiper-pagination-bestsellers flex justify-center gap-2 absolute bottom-0 left-0 w-full z-10"></div>
          </div>
        )}

      </div>
    </section>
  );
};

export default BestSellersGrid;
