import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bundleProducts = [
  {
    id: 1,
    brand: 'MADARA',
    name: 'Eye Contour Cream',
    price: 'Rs. 3,000.00',
    image: '/images/products/deep-moisture-eye-contour-cream/main.png',
    hotspot: { top: 62, left: 28 },
    color: 'bg-blue-400'
  },
  {
    id: 2,
    brand: 'MADARA',
    name: 'Exfoliating Oil-To-Milk Scrub',
    price: 'Rs. 3,000.00',
    image: '/images/products/exfoliating-oil-to-milk-scrub/main-large.webp',
    hotspot: { top: 15, left: 63 }, 
    color: 'bg-red-400'
  },
  {
    id: 3,
    brand: 'MADARA',
    name: 'Boost',
    price: 'Rs. 4,200.00',
    image: '/images/products/boost-3-min-growth-boost-scalp-treatment/main.png',
    hotspot: { top: 48, left: 78 },
    color: 'bg-purple-400'
  }
];

const ShoppableImage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? bundleProducts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === bundleProducts.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-white border-t border-gray-100">
      <div className="flex flex-col lg:flex-row min-h-[600px] lg:h-[85vh]">
        
        {/* Left Side - Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative">
          
          <div className="text-center mb-12">
            <h4 className="font-sans text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-4">
              Product Bundle
            </h4>
            <h2 className="font-serif text-[36px] md:text-[48px] lg:text-[54px] leading-[1.1] text-[#111111] max-w-[400px] mx-auto">
              Favorite Skin & hair<br/>Grow
            </h2>
          </div>

          <div className="relative w-full max-w-[320px] aspect-[4/5] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#e5e5e5] rounded-[2px]"
              >
                <div className="w-[60%] h-[60%] relative mix-blend-multiply">
                  <img 
                    src={bundleProducts[activeIndex].image} 
                    alt={bundleProducts[activeIndex].name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10 text-gray-700"
              aria-label="Previous product"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10 text-gray-700"
              aria-label="Next product"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="font-sans text-[10px] uppercase tracking-widest text-gray-500 mb-2">
              {bundleProducts[activeIndex].brand}
            </p>
            <h3 className="font-sans text-[16px] text-[#111111] mb-2">
              {bundleProducts[activeIndex].name}
            </h3>
            <p className="font-sans text-[14px] text-gray-600">
              {bundleProducts[activeIndex].price}
            </p>
          </div>

        </div>

        {/* Right Side - Shoppable Image */}
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-full bg-[#f2f1ef]">
          <img 
            src="/images/migrated/48_ChatGPT_Image_Mar_11_2026_10_46_49_AM.png" 
            alt="Favorite Skin & Hair Grow Bundle"
            className="w-full h-full object-cover"
          />

          {/* Hotspots */}
          {bundleProducts.map((product, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={product.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                style={{ top: `${product.hotspot.top}%`, left: `${product.hotspot.left}%` }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Outer Ring */}
                <div 
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${product.color} ${isActive ? 'scale-[2.5] opacity-40' : 'scale-[2] opacity-0 group-hover:scale-[2.5] group-hover:opacity-30'}`}
                ></div>
                
                {/* Inner Dot */}
                <div 
                  className={`relative w-3.5 h-3.5 rounded-full transition-all duration-300 ${isActive ? 'bg-white shadow-lg scale-110' : `${product.color} scale-100 group-hover:scale-110`} shadow-sm`}
                ></div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ShoppableImage;
