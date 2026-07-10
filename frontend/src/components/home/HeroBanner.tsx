import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
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
              <div className="absolute inset-0 z-20 flex flex-col justify-center items-center w-full" style={{ padding: '0 50px' }}>
                <div className="w-full flex flex-col items-center text-center">
                  <ul className="list-none p-0 m-0">
                    <li style={{ marginBottom: '16px' }}>
                      <p className="m-0 uppercase" style={{ 
                        color: '#ffffff', 
                        fontFamily: 'var(--g-font-2)', 
                        fontSize: '13px', 
                        fontWeight: 500, 
                        letterSpacing: '0.2em' 
                      }}>
                        {slide.label}
                      </p>
                    </li>
                    <li style={{ marginBottom: '24px' }}>
                      <h2 className="m-0 whitespace-pre-line" style={{ 
                        color: '#ffffff', 
                        fontFamily: 'var(--g-font-1)', 
                        fontSize: '60px', 
                        fontWeight: 400, 
                        lineHeight: 1.1 
                      }}>
                        {slide.title}
                      </h2>
                    </li>
                  </ul>
                  <div className="flex justify-center" style={{ paddingBottom: '4px' }}>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center justify-center transition-colors duration-400"
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        fontFamily: 'var(--g-font-2)',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        padding: '13px 40px',
                        border: '1px solid #ffffff',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#000000';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.borderColor = '#000000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#000000';
                        e.currentTarget.style.borderColor = '#ffffff';
                      }}
                    >
                      {slide.cta}
                    </Link>
                  </div>
                </div>
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
