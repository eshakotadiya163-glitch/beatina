
const pressLogos = [
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-martha-stewart.webp?v=1773124923&width=200",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-bustle.webp?v=1773124923&width=200",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-elite-daily.webp?v=1773124922&width=200",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-elle.webp?v=1773124922&width=200",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/brand-vogue.webp?v=1773124922&width=200"
];

const PressTestimonials = () => {
  return (
    <section className="bg-white py-[60px] md:py-[50px]">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Heading */}
        <h3 className="font-heading text-3xl md:text-[40px] text-brand-dark mb-10 text-center">
          <span>Our Press</span>
        </h3>

        {/* Quote Wrapper */}
        <div className="flex flex-col items-center text-center">
          
          {/* Stars */}
          <ul className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="text-[#f7d50e]">
                <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </li>
            ))}
          </ul>

          {/* Quote Text */}
          <div className="py-2 mb-8">
            <h4 className="font-heading text-lg md:text-2xl text-brand-dark leading-snug max-w-2xl mx-auto">
              “Glow naturally with skincare that nourishes,<br className="hidden md:block" /> protects, and enhances your beauty.”
            </h4>
          </div>

          {/* Logos Row (Confined to ~50% width on desktop like original col-lg-6) */}
          <div className="w-full lg:w-1/2 overflow-hidden mx-auto">
            <div className="flex flex-nowrap justify-between items-center gap-2 md:gap-4 overflow-x-auto hide-scrollbar">
              {pressLogos.map((logo, idx) => (
                <div key={idx} className="flex-shrink-0 w-24 md:w-28 flex justify-center items-center px-1">
                  <div className="relative w-full aspect-[2.57] flex items-center justify-center">
                    <img 
                      src={logo} 
                      alt="Press Logo" 
                      className="max-w-full max-h-full object-contain" 
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default PressTestimonials;
