import { motion } from 'framer-motion';

const ImageTextPromo = () => {
  return (
    <section className="bg-[#feedff] py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-[800px] mx-auto font-serif text-[32px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-light leading-[1.3] text-[#111111]"
        >
          <span className="inline-flex items-center justify-center gap-3 md:gap-5 align-middle flex-wrap">
            <span>Make you feel</span>
            <motion.img 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              src="/assets/migrated/15_highlight-icon-1.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block drop-shadow-sm" 
            />
            <span>and appear</span>
          </span>
          
          <br className="hidden md:block" />
          
          <span className="inline-flex items-center justify-center gap-3 md:gap-5 align-middle flex-wrap mt-3 md:mt-4">
            <span className="italic font-light text-gray-800">glowing</span>
            <motion.img 
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              src="/assets/migrated/16_highlight-icon-2.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block drop-shadow-sm" 
            />
            <span className="italic font-light text-gray-800">healthy</span>
            <motion.img 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              src="/assets/migrated/17_highlight-icon-3.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block drop-shadow-sm" 
            />
            <span className="italic font-light text-gray-800">and balanced</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ImageTextPromo;
