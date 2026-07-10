import { Link } from 'react-router-dom';

const SummerSpecialGrid = () => {
  return (
    <section className="py-[40px] md:py-[50px] bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] md:gap-[30px]">
          {/* Banner 1 */}
          <div className="group relative overflow-hidden bg-brand-light h-[400px] md:h-[630px] flex flex-col justify-end items-center text-center p-6 md:p-12">
            <img 
              src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/b12_720x_301f00ae-898e-41d1-b635-14ec61052c17.webp?v=1773124923&width=1066" 
              alt="Focus On Summer Special Care" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Linear gradient overlay matching the original CSS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
            
            <div className="relative z-10 text-white flex flex-col items-center max-w-[85%] md:max-w-md">
              <div className="font-body text-[11px] uppercase tracking-[0.2em] mb-3">
                NEW ARRIVALS
              </div>
              <h3 className="font-heading text-[26px] md:text-[32px] lg:text-[36px] mb-3 leading-tight">
                Focus On Summer Special Care
              </h3>
              <p className="font-body text-[14px] md:text-[15px] text-white/90 mb-4 leading-[1.6]">
                Discover the power of nature with our new collection, crafted to bring out your skin's natural radiance.
              </p>
              <div className="pt-1">
                <Link to="/category/skincare" className="inline-block border-b border-white pb-[2px] font-body text-[14px] font-medium hover:opacity-70 transition-opacity">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="group relative overflow-hidden bg-brand-light h-[400px] md:h-[630px] flex flex-col justify-end items-center text-center p-6 md:p-12">
            <img 
              src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/about-img-2.webp?v=1773124923&width=1066" 
              alt="For Naturally Resilient Skin" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Linear gradient overlay matching the original CSS */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
            
            <div className="relative z-10 text-white flex flex-col items-center max-w-[85%] md:max-w-md">
              <div className="font-body text-[11px] uppercase tracking-[0.2em] mb-3">
                New COLLECTION
              </div>
              <h3 className="font-heading text-[26px] md:text-[32px] lg:text-[36px] mb-3 leading-tight">
                For Naturally Resilient Skin
              </h3>
              <p className="font-body text-[14px] md:text-[15px] text-white/90 mb-4 leading-[1.6]">
                Discover the power of nature with our new collection, crafted to bring out your skin's natural radiance.
              </p>
              <div className="pt-1">
                <Link to="/category/skincare" className="inline-block border-b border-white pb-[2px] font-body text-[14px] font-medium hover:opacity-70 transition-opacity">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummerSpecialGrid;
