import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const InteractiveImage = () => {
  const containerRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      imagesRef.current.forEach((img) => {
        if (!img) return;
        const speed = parseFloat(img.getAttribute('data-speed') || '0');
        const xOffset = (rect.width - img.offsetWidth) / 2;
        const yOffset = (rect.height - img.offsetHeight) / 2;
        const xMovement = ((x - xOffset) * speed) / 10;
        const yMovement = ((y - yOffset) * speed) / 10;
        
        img.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[500px] lg:min-h-screen bg-white overflow-hidden flex justify-center items-center"
    >
      {/* Centered Text */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-20 text-center px-4 max-w-[90%] lg:max-w-[34vw] mx-auto flex flex-col items-center"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.25em] mb-4 text-gray-800"
        >
          Our Hand-picked
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-serif text-[40px] md:text-5xl lg:text-[64px] leading-[1.1] text-[#111111] mb-6 font-light"
        >
          Designed to make you feel good.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-sans text-[14px] md:text-[15px] text-gray-500 mb-8 leading-relaxed max-w-md font-light"
        >
          Our thoughtfully curated beauty essentials are designed to enhance your natural glow, boost confidence, and make every day feel special.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link 
            to="/shop" 
            className="group inline-flex items-center justify-center bg-[#111111] text-white font-sans text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-semibold px-10 py-[15px] border border-[#111111] transition-all duration-300 hover:bg-white hover:text-[#111111]"
          >
            discover now
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Parallax Images */}
      <img
        ref={(el) => { imagesRef.current[1] = el; }}
        src="/images/migrated/22_gallery-5-v2.webp"
        alt=""
        data-speed="0.1"
        className="absolute top-[18vw] left-[7vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[2] = el; }}
        src="/images/migrated/49_b12_720x_301f00ae-898e-41d1-b635-14ec61052c17.webp"
        alt=""
        data-speed="0.15"
        className="absolute bottom-[10vw] right-[5vw] w-[35vw] h-[25vw] md:w-[22vw] md:h-[15vw] object-cover transition-transform duration-75 ease-out z-10 opacity-60 md:opacity-100"
      />
      
      {/* Absolute image container to limit bounds of the main image */}
      <div className="absolute inset-4 md:inset-[5vw] lg:inset-[8vw] z-0 pointer-events-none rounded-[40px] overflow-hidden">
        {/* Main Background Image - Now placed absolutely */}
        <img 
          ref={(el) => { imagesRef.current[0] = el; }}
          src="/images/migrated/50_about-img-2.webp"
          alt="Beauty routine" 
          className="absolute inset-0 w-full h-full object-cover rounded-none md:rounded-[40px] scale-110"
          data-speed="0.2"
        />
      </div>
      <img
        ref={(el) => { imagesRef.current[3] = el; }}
        src="/images/migrated/24_3.11_a206c225-bd03-40da-8e5f-e3a3e160e25a.webp"
        alt=""
        data-speed="0.2"
        className="absolute bottom-[-10vw] left-[45vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[4] = el; }}
        src="/images/migrated/18_gallery-2-v2.webp"
        alt=""
        data-speed="0.25"
        className="absolute top-[24vw] right-[9vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[5] = el; }}
        src="/images/migrated/19_gallery-image-7.webp"
        alt=""
        data-speed="0.3"
        className="absolute top-[15vw] right-[0vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[6] = el; }}
        src="/images/migrated/25_gallery-image-5.webp"
        alt=""
        data-speed="0.35"
        className="absolute top-[-10vw] right-[22vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
    </section>
  );
};

export default InteractiveImage;
