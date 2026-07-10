import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

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
      <div className="relative z-20 text-center px-4 max-w-[90%] lg:max-w-[34vw] mx-auto">
        <div className="font-body text-[11px] uppercase tracking-[0.2em] mb-4 text-brand-dark">
          Our Hand-picked
        </div>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-brand-dark mb-4">
          Designed to make you feel good.
        </h2>
        <p className="font-body text-sm md:text-base text-gray-600 mb-8 leading-relaxed">
          Our thoughtfully curated beauty essentials are designed to enhance your natural glow, boost confidence, and make every day feel special.
        </p>
        <Link 
          to="/shop" 
          className="inline-block bg-brand-dark text-white font-body text-[13px] uppercase tracking-[0.2em] px-10 py-4 hover:bg-black transition-colors"
        >
          discover now
        </Link>
      </div>

      {/* Floating Parallax Images */}
      <img
        ref={(el) => { imagesRef.current[0] = el; }}
        src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-image-1.jpg?v=1773124923&width=600"
        alt=""
        data-speed="0.15"
        className="absolute top-[7vw] left-[4vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[1] = el; }}
        src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-5-v2.webp?v=1773124923&width=600"
        alt=""
        data-speed="0.1"
        className="absolute top-[18vw] left-[7vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[2] = el; }}
        src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/fleur-kaan-w4Dj3MshHQ0-unsplash.jpg?v=1773124926&width=600"
        alt=""
        data-speed="0.15"
        className="absolute bottom-[-4vw] left-[-3vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[3] = el; }}
        src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/3.11_a206c225-bd03-40da-8e5f-e3a3e160e25a.webp?v=1773124923&width=600"
        alt=""
        data-speed="0.2"
        className="absolute bottom-[-10vw] left-[45vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[4] = el; }}
        src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-2-v2.webp?v=1773124923&width=600"
        alt=""
        data-speed="0.25"
        className="absolute top-[24vw] right-[9vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[5] = el; }}
        src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-image-7.webp?v=1773124923&width=600"
        alt=""
        data-speed="0.3"
        className="absolute top-[15vw] right-[0vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
      <img
        ref={(el) => { imagesRef.current[6] = el; }}
        src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-image-5.webp?v=1773124923&width=600"
        alt=""
        data-speed="0.35"
        className="absolute top-[-10vw] right-[22vw] w-[25vw] h-[30vw] md:w-[16vw] md:h-[20vw] object-cover transition-transform duration-75 ease-out z-10 opacity-70 md:opacity-100"
      />
    </section>
  );
};

export default InteractiveImage;
