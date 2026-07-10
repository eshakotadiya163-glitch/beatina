import { motion } from 'framer-motion';

const pressLogos = [
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-martha-stewart.webp?v=1773124923&width=200",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-bustle.webp?v=1773124923&width=200",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-elite-daily.webp?v=1773124922&width=200",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-elle.webp?v=1773124922&width=200",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-vogue.webp?v=1773124922&width=200"
];

const PressTestimonials = () => {
  return (
    <section className="bg-white py-16 md:py-24 border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h3 className="font-serif text-3xl md:text-[40px] text-brand-dark font-light">
            Our Press
          </h3>
        </motion.div>

        {/* Quote Wrapper */}
        <div className="flex flex-col items-center text-center">
          
          {/* Stars */}
          <motion.ul 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="flex justify-center gap-1.5 mb-6"
          >
            {[...Array(5)].map((_, i) => (
              <motion.li 
                key={i} 
                variants={{
                  hidden: { opacity: 0, scale: 0.5 },
                  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300 } }
                }}
                className="text-[#f7d50e]"
              >
                <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </motion.li>
            ))}
          </motion.ul>

          {/* Quote Text */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="py-2 mb-10 md:mb-14"
          >
            <h4 className="font-serif text-xl md:text-3xl lg:text-[32px] text-gray-800 leading-snug max-w-3xl mx-auto font-light italic">
              “Glow naturally with skincare that nourishes,<br className="hidden md:block" /> protects, and enhances your beauty.”
            </h4>
          </motion.div>

          {/* Logos Row */}
          <div className="w-full lg:w-3/4 overflow-hidden mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
              }}
              className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-16"
            >
              {pressLogos.map((logo, idx) => (
                <motion.div 
                  key={idx} 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex-shrink-0 w-20 md:w-28 flex justify-center items-center opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  <img 
                    src={logo} 
                    alt="Press Logo" 
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default PressTestimonials;
