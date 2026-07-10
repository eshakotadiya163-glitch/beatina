import { useState, useMemo } from 'react';
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
    <section className="bg-white overflow-hidden" style={{ padding: '50px 0px 50px 0px' }}>
      <div className="mx-auto" style={{ maxWidth: '1550px', padding: '0 15px' }}>
        
        {/* Centered Heading & Subtitle */}
        <h3 className="font-heading text-center" style={{ fontSize: '30px', fontWeight: 400, marginBottom: '8px', lineHeight: 1.2 }}>
          <span>New Arrivals</span>
        </h3>
        <div className="text-center" style={{ fontFamily: 'var(--g-font-2)', fontSize: '15px', color: '#777777', marginBottom: '48px' }}>
          Traditional divides between personal and professional space.
        </div>

        {/* Tabs */}
        <div className="text-center" style={{ marginTop: '-24px', marginBottom: '48px' }}>
          <div className="inline-flex justify-center" style={{ gap: '16px' }}>
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative transition-colors"
                style={{
                  fontSize: '20px',
                  fontWeight: 500,
                  padding: '8px 16px',
                  color: activeTab === tab ? '#000000' : '#777777',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-[16px] right-[16px] bottom-0" style={{ height: '2px', backgroundColor: '#000000' }}></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="w-full relative group">
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
          <button className="swiper-button-prev-arrivals absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button className="swiper-button-next-arrivals absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer">
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
