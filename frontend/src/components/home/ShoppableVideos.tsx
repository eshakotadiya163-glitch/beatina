import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

type Product = any;

interface ShoppableVideosProps {
  products?: Product[];
}

const shopVideos = [
  {
    videoSrc: "https://beautina-cosmetic.myshopify.com/cdn/shop/videos/c/vp/b11b019c831543709c9f0852c3d79b21/b11b019c831543709c9f0852c3d79b21.HD-1080p-3.3Mbps-77545356.mp4?v=0",
    poster: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/preview_images/b11b019c831543709c9f0852c3d79b21.thumbnail.0000000000_small.jpg?v=1773130279",
  },
  {
    videoSrc: "https://beautina-cosmetic.myshopify.com/cdn/shop/videos/c/vp/788b041920114347915fb7d4a16de257/788b041920114347915fb7d4a16de257.HD-1080p-7.2Mbps-77545360.mp4?v=0",
    poster: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/preview_images/788b041920114347915fb7d4a16de257.thumbnail.0000000000_small.jpg?v=1773130277",
  },
  {
    videoSrc: "https://beautina-cosmetic.myshopify.com/cdn/shop/videos/c/vp/fb984906407f4fb9b5c5ceb14dd78350/fb984906407f4fb9b5c5ceb14dd78350.HD-1080p-2.5Mbps-77626008.mp4?v=0",
    poster: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/preview_images/fb984906407f4fb9b5c5ceb14dd78350.thumbnail.0000000000_small.jpg?v=1773206918",
  },
  {
    videoSrc: "https://beautina-cosmetic.myshopify.com/cdn/shop/videos/c/vp/4b2f2c0725434683af01f499b85d7b90/4b2f2c0725434683af01f499b85d7b90.HD-1080p-4.8Mbps-77545359.mp4?v=0",
    poster: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/preview_images/4b2f2c0725434683af01f499b85d7b90.thumbnail.0000000000_small.jpg?v=1773130279",
  }
];

const ShoppableVideos: React.FC<ShoppableVideosProps> = ({ products = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const shoppableProductsRaw = products.filter(p => p.tabCategory === 'Shoppable Videos');
  const shoppableProducts = shoppableProductsRaw.length > 0 ? shoppableProductsRaw : products.slice(0, shopVideos.length);

  const handleVideoChange = (swiper: any) => {
    setActiveVideoIndex(swiper.realIndex);
    
    // Attempt to pause all videos
    document.querySelectorAll('.shoppable-video').forEach((vid: any) => {
      vid.pause();
    });
  };

  const openModal = (index: number) => {
    setActiveVideoIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="bg-transparent pt-0 pb-[60px] relative px-4 max-w-[1600px] mx-auto">
      <h2 className="text-center mb-10 text-[28px] md:text-[36px] font-medium tracking-[-0.02em] text-black">
        Live Result
      </h2>
      
      <div className="relative px-5 group">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.swiper-button-next-video',
            prevEl: '.swiper-button-prev-video',
          }}
          onSlideChange={handleVideoChange}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}
          className="w-full"
        >
          {shopVideos.map((video, index) => {
            const product = shoppableProducts[index % Math.max(shoppableProducts.length, 1)];
            if (!product) return null;

            return (
              <SwiperSlide key={index} className="h-auto">
                <div className="flex flex-col h-full bg-white rounded-[14px] overflow-hidden border border-[#eee] p-1 cursor-default">
                  
                  {/* Video Wrapper */}
                  <div 
                    className="relative pb-[155.55%] h-0 bg-[#f4f4f4] rounded-[12px] overflow-visible mb-3 z-10 cursor-pointer"
                    onClick={() => openModal(index)}
                  >
                    <video 
                      src={video.videoSrc} 
                      poster={video.poster} 
                      className="shoppable-video absolute top-0 left-0 w-full h-full object-cover rounded-t-[14px]" 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                    />
                    
                    {/* Floating Product Badge */}
                    <div className="absolute bottom-3 left-[10px] translate-y-1/2 w-[68px] h-[74px] rounded-[6px] z-20 shadow-sm border border-white bg-white">
                      <img 
                        src={product.images?.[0] || video.poster} 
                        className="w-full h-full object-cover rounded-[4px]" 
                        alt={product.title}
                      />
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex flex-col text-left px-2.5 pt-[30px] pb-[15px] relative z-5">
                    <div className="text-[13px] font-normal mb-2 text-black line-clamp-2 min-h-[36px] capitalize tracking-[0.5px]">
                      {product.title}
                    </div>
                    <div className="text-[14px] text-black font-semibold mb-3">
                      {formatPrice(product.price)}
                    </div>
                    <button 
                      onClick={() => openModal(index)}
                      className="bg-[#b8c2f2] text-black text-center p-3 rounded-[6px] text-[13px] font-semibold hover:bg-black hover:text-white transition-colors border-none cursor-pointer"
                    >
                      Shop now
                    </button>
                  </div>

                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="swiper-button-prev-video absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-black">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button className="swiper-button-next-video absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center text-black">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Shoppable Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center backdrop-blur-sm p-4 md:p-10 transition-opacity">
          
          <button 
            onClick={closeModal}
            className="absolute top-5 right-5 md:right-8 w-[50px] h-[50px] flex items-center justify-center bg-white/40 text-white text-[36px] rounded-[14px] z-[10005] cursor-pointer hover:bg-white/60 transition-colors"
          >
            &times;
          </button>
          
          <div className="w-full max-w-[900px] bg-white rounded-[20px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-[10000] animate-in fade-in zoom-in-95 duration-300">
            
            {/* Modal Video (Left side) */}
            <div className="w-full md:w-1/2 relative bg-black flex items-center justify-center aspect-[9/16] md:aspect-auto md:h-[600px]">
              <video 
                src={shopVideos[activeVideoIndex]?.videoSrc} 
                poster={shopVideos[activeVideoIndex]?.poster} 
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay 
                muted 
                loop 
                playsInline 
              />
            </div>

            {/* Modal Product (Right side) */}
            <div className="w-full md:w-1/2 p-6 md:p-10 bg-white flex flex-col justify-center overflow-y-auto max-h-[50vh] md:max-h-full">
              {shoppableProducts[activeVideoIndex % Math.max(shoppableProducts.length, 1)] && (
                <div className="w-full max-w-sm mx-auto">
                  <h4 className="text-2xl font-heading mb-6 border-b pb-4">Featured Product</h4>
                  <ProductCard product={shoppableProducts[activeVideoIndex % Math.max(shoppableProducts.length, 1)]} />
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

    </section>
  );
};

export default ShoppableVideos;
