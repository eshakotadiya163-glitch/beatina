import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SummerSpecialGrid = () => {
  return (
    <section className="py-[40px] md:py-[50px] bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] md:gap-[30px]">
          {/* Banner 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative overflow-hidden bg-brand-light h-[450px] md:h-[630px] flex flex-col justify-end items-center text-center p-8 md:p-14"
          >
            <img 
              src="/assets/migrated/49_b12_720x_301f00ae-898e-41d1-b635-14ec61052c17.webp" 
              alt="Focus On Summer Special Care" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              loading="lazy"
            />
            {/* Linear gradient overlay matching the original CSS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 text-white flex flex-col items-center max-w-[90%] md:max-w-md">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.25em] mb-4 text-white/90"
              >
                NEW ARRIVALS
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-serif text-[32px] md:text-[40px] lg:text-[46px] mb-4 leading-[1.1] font-light"
              >
                Focus On Summer Special Care
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-sans text-[14px] md:text-[15px] text-white/80 mb-6 leading-relaxed font-light"
              >
                Discover the power of nature with our new collection, crafted to bring out your skin's natural radiance.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-2"
              >
                <Link to="/category/skincare" className="group/link inline-flex items-center gap-2 font-sans text-[12px] md:text-[13px] uppercase tracking-[0.15em] font-medium text-white transition-all">
                  <span className="relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-white after:origin-right after:transition-transform after:duration-300 group-hover/link:after:origin-left group-hover/link:after:scale-x-0">
                    Shop Now
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Banner 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative overflow-hidden bg-brand-light h-[450px] md:h-[630px] flex flex-col justify-end items-center text-center p-8 md:p-14"
          >
            <img 
              src="/assets/migrated/50_about-img-2.webp" 
              alt="For Naturally Resilient Skin" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              loading="lazy"
            />
            {/* Linear gradient overlay matching the original CSS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 text-white flex flex-col items-center max-w-[90%] md:max-w-md">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.25em] mb-4 text-white/90"
              >
                New COLLECTION
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-serif text-[32px] md:text-[40px] lg:text-[46px] mb-4 leading-[1.1] font-light"
              >
                For Naturally Resilient Skin
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="font-sans text-[14px] md:text-[15px] text-white/80 mb-6 leading-relaxed font-light"
              >
                Discover the power of nature with our new collection, crafted to bring out your skin's natural radiance.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="pt-2"
              >
                <Link to="/category/skincare" className="group/link inline-flex items-center gap-2 font-sans text-[12px] md:text-[13px] uppercase tracking-[0.15em] font-medium text-white transition-all">
                  <span className="relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-white after:origin-right after:transition-transform after:duration-300 group-hover/link:after:origin-left group-hover/link:after:scale-x-0">
                    Shop Now
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SummerSpecialGrid;
