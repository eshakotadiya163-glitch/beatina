import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import api from '../../api/axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedCollections = () => {
  const { data: collections = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.filter((c: any) => c.slug !== 'all').slice(0, 5);
    }
  });

  return (
    <section className="py-[50px] bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-[40px] text-center">
          <p className="font-body text-[12px] md:text-[14px] text-[#555] uppercase tracking-[0.2em] mb-2 font-bold">
            Luxury Essentials
          </p>
          <h3 className="font-serif text-[32px] md:text-[40px] font-bold text-[#000] mb-2">
            Must-Have Beauty
          </h3>
          <p className="font-body text-[#777] text-[16px] max-w-2xl mx-auto">
            Elevate your beauty routine with our curated selection of premium skincare and makeup essentials.
          </p>
        </div>
        
        <div className="relative group w-full">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next-collections',
              prevEl: '.swiper-button-prev-collections',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination-collections' }}
            spaceBetween={30}
            slidesPerView={2}
            loop={true}
            breakpoints={{
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 5, spaceBetween: 30 },
            }}
            className="w-full !pb-12"
          >
            {collections.map((collection: any, index: number) => (
              <SwiperSlide key={index}>
                <div className="text-center group cursor-pointer">
                  <Link to={`/shop/category/${collection.slug}`} className="block mb-[20px]">
                    <div className="relative w-full overflow-hidden bg-brand-light" style={{ paddingTop: '125.03%' }}>
                      <img 
                        src={collection.image || '/placeholder.png'} 
                        alt={collection.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105 filter grayscale-[20%] hover:grayscale-0"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                  <h4 className="font-body text-[18px] md:text-[20px] text-[#000] mb-1 font-[600]">
                    <Link to={`/shop/category/${collection.slug}`} className="hover:text-brand-accent transition-colors">
                      {collection.name}
                    </Link>
                  </h4>
                  <p className="font-body text-[14px] text-[#999] mb-[40px]">10 Items</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <button className="swiper-button-prev-collections absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button className="swiper-button-next-collections absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
          
          {/* Custom Pagination */}
          <div className="swiper-pagination-collections flex justify-center gap-2 absolute bottom-0 left-0 w-full z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
