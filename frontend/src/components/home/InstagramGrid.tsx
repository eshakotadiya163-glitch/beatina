import { motion } from 'framer-motion';

const Instagram = (props: any) => <svg width={props.size || 24} height={props.size || 24} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={props.strokeWidth || 2} className={props.className} {...props}><rect x='2' y='2' width='20' height='20' rx='5' ry='5'/><path d='M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z'/><line x1='17.5' y1='6.5' x2='17.51' y2='6.5'/></svg>;

const images = [
  "/images/migrated/18_gallery-2-v2.webp",
  "/images/migrated/19_gallery-image-7.webp",
  "/images/migrated/20_gallery-image-1.jpg",
  "/images/migrated/22_gallery-5-v2.webp",
  "/images/migrated/25_gallery-image-5.webp",
  "/images/migrated/6_gallery-3-v2.webp"
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const InstagramGrid = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 md:px-8 py-10 md:py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-3"
        >
          <Instagram size={28} strokeWidth={1.5} className="text-[#111111]" />
          <h2 className="font-serif text-2xl md:text-3xl text-[#111111] font-light">
            @Beautina
          </h2>
        </motion.div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full"
      >
        {images.map((src, index) => (
          <motion.a 
            key={index} 
            variants={itemVariants}
            href="https://instagram.com/beautina" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden"
          >
            <img 
              src={src} 
              alt={`Instagram ${index + 1}`} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram className="text-white w-8 h-8" />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default InstagramGrid;
