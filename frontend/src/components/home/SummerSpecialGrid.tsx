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
            className="group relative overflow-hidden bg-brand-light h-[450px] md:h-[630px] flex flex-col justify-end items-center text-center p-8 md:p-14 cursor-pointer"
          >
            <img 
              src="/images/migrated/49_b12_720x_301f00ae-898e-41d1-b635-14ec61052c17.webp" 
              alt="Focus On Summer Special Care" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-110 filter grayscale-[20%] hover:grayscale-0"
              loading="lazy"
            />
            {/* Linear gradient overlay matching the original CSS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-100 z-[1]"></div>
            
            <div className="relative z-10 text-white flex flex-col items-center max-w-[90%] md:max-w-[70%]">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-body text-[12px] md:text-[14px] font-[500] uppercase tracking-[0.2em] mb-4 text-white"
              >
                NEW ARRIVALS
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-serif text-[28px] md:text-[36px] lg:text-[42px] mb-4 leading-[1.2] font-[600]"
              >
                Focus On Summer Special Care
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-body text-[14px] md:text-[16px] text-white/90 mb-6 leading-relaxed"
              >
                Discover the power of nature with our new collection, crafted to bring out your skin's natural radiance.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-2"
              >
                <Link to="/shop/category/skin-care" className="group/link inline-flex items-center gap-2 font-body text-[12px] md:text-[14px] uppercase tracking-[0.1em] font-[600] text-white transition-all">
                  <span className="relative pb-1 border-b-[2px] border-white hover:border-transparent transition-colors duration-300">
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
            className="group relative overflow-hidden bg-brand-light h-[450px] md:h-[630px] flex flex-col justify-end items-center text-center p-8 md:p-14 cursor-pointer"
          >
            <img 
              src="/images/migrated/50_about-img-2.webp" 
              alt="For Naturally Resilient Skin" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-110 filter grayscale-[20%] hover:grayscale-0"
              loading="lazy"
            />
            {/* Linear gradient overlay matching the original CSS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-100 z-[1]"></div>
            
            <div className="relative z-10 text-white flex flex-col items-center max-w-[90%] md:max-w-[70%]">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-body text-[12px] md:text-[14px] font-[500] uppercase tracking-[0.2em] mb-4 text-white"
              >
                NEW COLLECTION
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-serif text-[28px] md:text-[36px] lg:text-[42px] mb-4 leading-[1.2] font-[600]"
              >
                For Naturally Resilient Skin
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="font-body text-[14px] md:text-[16px] text-white/90 mb-6 leading-relaxed"
              >
                Discover the power of nature with our new collection, crafted to bring out your skin's natural radiance.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="pt-2"
              >
                <Link to="/shop/category/serum-cream" className="group/link inline-flex items-center gap-2 font-body text-[12px] md:text-[14px] uppercase tracking-[0.1em] font-[600] text-white transition-all">
                  <span className="relative pb-1 border-b-[2px] border-white hover:border-transparent transition-colors duration-300">
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
