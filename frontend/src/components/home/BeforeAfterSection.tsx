import { useState, useRef } from 'react';
import type { MouseEvent, TouchEvent } from 'react';

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
    <section className="bg-white py-[40px] md:py-[50px] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 text-center">
        
        {/* Section Heading exactly matching authentic structure */}
        <div className="font-body text-xs text-brand-muted uppercase tracking-[0.2em] mb-2">
          Wear it four way
        </div>
        
        <h3 className="font-heading text-3xl md:text-[40px] text-brand-dark mb-2">
          <span>The balance of high-performance</span>
        </h3>
        
        <div className="font-body text-brand-muted max-w-3xl mx-auto mb-10 text-[15px] leading-relaxed">
          Experience the perfect blend of advanced formulas and skin-loving ingredients, delivering powerful results while maintaining harmony for a healthy, radiant complexion.
        </div>

        <div 
          ref={containerRef}
          className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-sm cursor-ew-resize select-none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={(e) => handleMove(e.clientX)}
        >
          {/* After Image (Background) */}
          <img 
            src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/home-after_1.jpg?v=1773290459&width=1500" 
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
              src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/home-before_1.jpg?v=1773290460&width=1500" 
              alt="Before" 
              className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-black/50 cursor-ew-resize pointer-events-none transition-opacity duration-300"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="square" strokeLinejoin="miter" transform="translate(-4, 0)"/>
                <path d="M9 18l6-6-6-6" strokeLinecap="square" strokeLinejoin="miter" transform="translate(4, 0)"/>
              </svg>
            </div>
          </div>
          
          <div className="absolute top-6 left-6 bg-white/75 px-2 py-2 font-body text-[13px] leading-none text-black rounded-sm z-10 pointer-events-none">
            Before
          </div>
          <div className="absolute top-6 right-6 bg-white/75 px-2 py-2 font-body text-[13px] leading-none text-black rounded-sm z-10 pointer-events-none">
            After
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
