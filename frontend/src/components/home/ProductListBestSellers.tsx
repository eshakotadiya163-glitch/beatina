import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

type Product = any;

interface ProductListBestSellersProps {
  products: Product[];
}

const ProductListBestSellers: React.FC<ProductListBestSellersProps> = ({ products }) => {
    const bestSellers = products.filter(p => p.tabCategory === 'Best Sellers');
  return (
    <section className="bg-white py-[40px] md:py-0 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Authentic Section Headings */}
        <div className="font-body text-xs text-brand-muted uppercase tracking-[0.2em] mb-2 text-center">
          best Sellers
        </div>
        <h3 className="font-heading text-3xl md:text-[40px] text-brand-dark mb-10 md:mb-12 text-center">
          <span>The Elegance of Effortless Beauty</span>
        </h3>
        
        {/* Slider */}
        <div className="w-full relative group pb-10">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.swiper-button-next-bestsellers',
              prevEl: '.swiper-button-prev-bestsellers',
            }}
            spaceBetween={30}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="w-full"
          >
            {bestSellers.map((product) => (
              <SwiperSlide key={product._id} className="h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Arrows (hidden on mobile, visible on hover on desktop) */}
          <button className="swiper-button-prev-bestsellers absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button className="swiper-button-next-bestsellers absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProductListBestSellers;
