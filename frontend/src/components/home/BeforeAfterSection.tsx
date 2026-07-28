import { useState, useRef } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { motion } from 'framer-motion';

const BeforeAfterSection = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (e.buttons !== 1) return; // Only if left mouse button is pressed
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section className="bg-white py-12 md:py-16 overflow-hidden border-y border-gray-100">
      <div className="mx-auto max-w-[1550px] px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-14"
        >
          <div className="font-body text-[13px] md:text-[15px] font-[400] text-gray-500 mb-4">
            Wear it four way
          </div>
          
          <h3 className="font-serif text-[28px] md:text-[36px] lg:text-[42px] text-[#111111] font-[400] mb-4 leading-tight">
            The balance of high-performance
          </h3>
          
          <p className="font-sans text-gray-500 max-w-3xl mx-auto text-[14px] md:text-[15px] leading-relaxed font-light">
            Experience the perfect blend of advanced formulas and skin-loving ingredients, delivering powerful results while maintaining harmony for a healthy, radiant complexion.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          ref={containerRef}
          className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:max-w-[1200px] mx-auto overflow-hidden rounded-sm cursor-ew-resize select-none shadow-sm"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={(e) => handleMove(e.clientX)}
        >
          {/* After Image (Background) */}
          <img 
            src="/images/migrated/0_home-after_1.jpg" 
            alt="After" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            loading="lazy"
          />

          {/* Before Image (Foreground, clipped) */}
          <div 
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img 
              src="/images/migrated/1_home-before_1.jpg" 
              alt="Before" 
              className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-white cursor-ew-resize pointer-events-none transition-opacity duration-300"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-black">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" transform="translate(-4, 0)"/>
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" transform="translate(4, 0)"/>
              </svg>
            </div>
          </div>
          
          <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white px-3 py-1.5 font-sans text-[11px] md:text-[12px] tracking-wider uppercase font-medium text-black rounded-sm z-10 pointer-events-none shadow-sm">
            Before
          </div>
          <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white px-3 py-1.5 font-sans text-[11px] md:text-[12px] tracking-wider uppercase font-medium text-black rounded-sm z-10 pointer-events-none shadow-sm">
            After
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
