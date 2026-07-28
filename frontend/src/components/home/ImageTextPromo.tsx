import { motion } from 'framer-motion';

const ImageTextPromo = () => {
  return (
    <section className="bg-[#feedff] py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-[780px] mx-auto font-serif text-[32px] sm:text-[34px] lg:text-[42px] font-[600] leading-[1.4] text-[#111111]"
        >
          <span className="inline-flex items-center justify-center gap-[10px] align-middle flex-wrap">
            <span>Make you feel</span>
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "tween", duration: 0.3 }}
              src="/images/migrated/15_highlight-icon-1.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block" 
            />
            <span>and appear</span>
          </span>
          
          <br />
          
          <span className="inline-flex items-center justify-center gap-[10px] align-middle flex-wrap mt-[10px]">
            <span className="italic font-serif">glowing</span>
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "tween", duration: 0.3 }}
              src="/images/migrated/16_highlight-icon-2.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block" 
            />
            <span className="italic font-serif">healthy</span>
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "tween", duration: 0.3 }}
              src="/images/migrated/17_highlight-icon-3.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block" 
            />
            <span className="italic font-serif">and balanced</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ImageTextPromo;
