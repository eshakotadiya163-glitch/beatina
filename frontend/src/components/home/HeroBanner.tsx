import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const slides = [
  {
    id: 'slide-1',
    image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/2.png?v=1773203940&width=2000',
    mobileImage: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/s31_900x_8f09b4d4-6d08-410a-b6c2-5f291c6eb648.webp?v=1773134590&width=1100',
    bgColor: '#3190ae',
    label: 'New Skincare Arrival',
    title: "Skin's Natural\nRadiance.",
    cta: 'Shop Skin Care',
    link: '/collections/skincare',
    textColor: 'text-white',
  },
  {
    id: 'slide-2',
    image: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/1.png?v=1773203940&width=2000',
    mobileImage: 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/s32_900x_8acd0d58-b6ff-42e4-9796-69f7e92d8ef7.jpg?v=1773124923&width=1100',
    bgColor: '#858961',
    label: 'Nighttime Ritual',
    title: 'Glow While\nYou Sleep.',
    cta: 'Shop Serums',
    link: '/collections/serum-cream',
    textColor: 'text-white',
  },
];

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[500px] md:h-[650px] overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        autoplay={false}
        navigation={{ nextEl: '.swiper-next-hero', prevEl: '.swiper-prev-hero' }}
        loop={false}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} style={{ backgroundColor: slide.bgColor }}>
            <div className="relative w-full h-full">
              {/* Solid Overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
              {/* Background Images */}
              <picture className="absolute inset-0 w-full h-full z-0">
                <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
                <img
                  src={slide.image}
                  alt={slide.title.replace('\n', ' ')}
                  className="w-full h-full object-cover object-center scale-in"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </picture>

              {/* Content Container */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-center w-full px-4 md:px-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full flex flex-col items-center text-center max-w-4xl mx-auto"
                >
                  <ul className="list-none p-0 m-0 w-full flex flex-col items-center">
                    <motion.li 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                      className="mb-3 md:mb-5"
                    >
                      <p className="m-0 uppercase tracking-[0.2em] text-xs md:text-sm font-medium text-white/90 font-sans">
                        {slide.label}
                      </p>
                    </motion.li>
                    <motion.li 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      className="mb-8 md:mb-10"
                    >
                      <h2 className="m-0 whitespace-pre-line text-[42px] md:text-[64px] lg:text-[76px] leading-[1.05] font-serif font-light text-white drop-shadow-sm">
                        {slide.title}
                      </h2>
                    </motion.li>
                  </ul>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                    className="flex justify-center"
                  >
                    <Link
                      to={slide.link}
                      className="inline-flex items-center justify-center bg-white text-black text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] px-8 md:px-10 py-[14px] border border-white transition-all duration-500 ease-in-out hover:bg-black hover:text-white hover:border-black"
                    >
                      {slide.cta}
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Custom Nav Arrows */}
        <button className="swiper-prev-hero absolute left-[15px] top-1/2 -translate-y-1/2 z-30 w-[40px] h-[40px] flex items-center justify-center bg-transparent cursor-pointer border-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button className="swiper-next-hero absolute right-[15px] top-1/2 -translate-y-1/2 z-30 w-[40px] h-[40px] flex items-center justify-center bg-transparent cursor-pointer border-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
        </button>
      </Swiper>
    </section>
  );
};

export default HeroBanner;
