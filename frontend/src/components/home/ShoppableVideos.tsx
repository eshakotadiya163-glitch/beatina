import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

type Product = any;

interface ShoppableVideosProps {
  products?: Product[];
}

const shopVideos = [
  {
    videoSrc: "/assets/migrated/40_b11b019c831543709c9f0852c3d79b21.HD-1080p-3.3Mbps-77545356.mp4",
    poster: "/assets/migrated/41_b11b019c831543709c9f0852c3d79b21.thumbnail.0000000000_small.jpg",
  },
  {
    videoSrc: "/assets/migrated/42_788b041920114347915fb7d4a16de257.HD-1080p-7.2Mbps-77545360.mp4",
    poster: "/assets/migrated/43_788b041920114347915fb7d4a16de257.thumbnail.0000000000_small.jpg",
  },
  {
    videoSrc: "/assets/migrated/44_fb984906407f4fb9b5c5ceb14dd78350.HD-1080p-2.5Mbps-77626008.mp4",
    poster: "/assets/migrated/45_fb984906407f4fb9b5c5ceb14dd78350.thumbnail.0000000000_small.jpg",
  },
  {
    videoSrc: "/assets/migrated/46_4b2f2c0725434683af01f499b85d7b90.HD-1080p-4.8Mbps-77545359.mp4",
    poster: "/assets/migrated/47_4b2f2c0725434683af01f499b85d7b90.thumbnail.0000000000_small.jpg",
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
    <section className="bg-white py-16 md:py-24 relative px-4 max-w-[1600px] mx-auto border-y border-gray-100">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-10 md:mb-14 font-serif text-3xl md:text-[40px] text-[#111111] font-light"
      >
        Live Result
      </motion.h2>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative px-5 group"
      >
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
                  <div className="flex flex-col text-left px-3 pt-6 pb-4 relative z-5">
                    <div className="text-[12px] md:text-[13px] font-sans font-medium mb-1.5 text-[#111111] line-clamp-2 min-h-[36px] capitalize tracking-wide">
                      {product.title}
                    </div>
                    <div className="text-[13px] md:text-[14px] text-gray-500 font-sans mb-4">
                      {formatPrice(product.price)}
                    </div>
                    <button 
                      onClick={() => openModal(index)}
                      className="w-full bg-[#f8f8f8] text-[#111111] font-sans text-[11px] uppercase tracking-widest font-semibold p-3 rounded-none hover:bg-[#111111] hover:text-white transition-colors duration-300 border border-transparent hover:border-[#111111]"
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
        <button className="swiper-button-prev-video absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button className="swiper-button-next-video absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </motion.div>

      {/* Shoppable Modal Popup */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center backdrop-blur-sm p-4 md:p-10"
          >
            <button 
              onClick={closeModal}
              className="absolute top-5 right-5 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full z-[10005] cursor-pointer transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-[900px] bg-white rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-[10000]"
            >
              
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
              <div className="w-full md:w-1/2 p-6 md:p-12 bg-white flex flex-col justify-center overflow-y-auto max-h-[50vh] md:max-h-full">
                {shoppableProducts[activeVideoIndex % Math.max(shoppableProducts.length, 1)] && (
                  <div className="w-full max-w-sm mx-auto">
                    <h4 className="font-serif text-2xl font-light mb-8 pb-4 border-b border-gray-100 text-[#111111]">Featured Product</h4>
                    <ProductCard product={shoppableProducts[activeVideoIndex % Math.max(shoppableProducts.length, 1)]} />
                  </div>
                )}
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default ShoppableVideos;
