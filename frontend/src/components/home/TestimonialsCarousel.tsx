import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const quotes = [
  {
    text: "Did I drink enough water? No. Does my skin feel hydrated? No, but it’s softer, plumper, and dewier than ever!",
    author: "Sophie JK.",
    imgSrc: "//beautina-cosmetic.myshopify.com/cdn/shop/files/fleur-kaan-w4Dj3MshHQ0-unsplash.jpg?v=1773124926&width=720"
  },
  {
    text: "My skin has never felt this soft! Was it magic? No. Did it work wonders? No, but I’m glowing like never before!",
    author: "Jane Smith",
    imgSrc: "//beautina-cosmetic.myshopify.com/cdn/shop/files/home-after.jpg?v=1773124924&width=720"
  },
  {
    text: "Did I apply a filter? No. Does my skin look flawless? No, but this glow is giving effortlessly airbrushed vibes!",
    author: "Mike Johnson",
    imgSrc: "//beautina-cosmetic.myshopify.com/cdn/shop/files/after-image.jpg?v=1773124923&width=720"
  },
  {
    text: "Great product and excellent customer service.",
    author: "Mike Johnson",
    imgSrc: "//beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-5-v2.webp?v=1773124923&width=720"
  }
];

const StarRating = () => (
  <ul className="flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <li key={i} className="text-[#fad305]">
        <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      </li>
    ))}
  </ul>
);

const TestimonialsCarousel = () => {
  return (
    <div className="bg-white py-16 md:py-24 border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-500 mb-4 font-sans">
            user review
          </div>
          <h3 className="text-3xl md:text-[40px] font-light text-[#111111] font-serif leading-tight">
            Real People, Real Results
          </h3>
        </motion.div>

        {/* Carousel Wrapper */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative px-0 md:px-8 max-w-5xl mx-auto group"
        >
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            navigation={{
              nextEl: '.swiper-button-next-quote',
              prevEl: '.swiper-button-prev-quote',
            }}
            pagination={{ 
              clickable: true,
              el: '.swiper-pagination-quote',
              bulletClass: 'swiper-pagination-bullet bg-black opacity-30 mx-1 w-2.5 h-2.5 rounded-full inline-block cursor-pointer transition-opacity',
              bulletActiveClass: '!opacity-100',
            }}
            className="w-full"
          >
            {quotes.map((quote, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col-reverse md:flex-row items-center w-full">
                  
                  {/* Left: Text Content */}
                  <div className="w-full md:w-1/2 pt-8 pb-12 md:py-12 md:pr-16 px-4 md:px-0 flex flex-col justify-center">
                    <div className="text-[11px] md:text-[12px] font-medium tracking-[0.2em] uppercase text-black pb-4 border-b border-gray-100 mb-6 font-sans">
                      Comment
                    </div>
                    
                    <div className="pb-6 text-black">
                      <StarRating />
                      <div className="text-xl md:text-2xl leading-relaxed font-light font-serif italic text-gray-800">
                        "{quote.text}"
                      </div>
                    </div>
                    
                    <div className="font-sans text-[13px] md:text-[14px] font-semibold uppercase tracking-widest text-[#111111]">
                      {quote.author}
                    </div>
                  </div>

                  {/* Right: Image */}
                  <div className="w-full md:w-1/2 md:pl-8">
                    <div className="relative w-full overflow-hidden rounded-md" style={{ paddingTop: '75%' }}>
                      <img 
                        src={quote.imgSrc} 
                        alt="Testimonial" 
                        className="absolute inset-0 w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button className="swiper-button-prev-quote absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hidden md:flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-transparent hover:border-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button className="swiper-button-next-quote absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 w-10 h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hidden md:flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-transparent hover:border-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>

          {/* Pagination */}
          <div className="swiper-pagination-quote absolute bottom-0 left-0 w-full text-center z-10 mt-4 h-6 flex justify-center items-center"></div>

        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
