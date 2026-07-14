import { Link } from 'react-router-dom';

// Real Beautina banner image from Shopify CDN
const FullWidthBanner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Two-column split banner matching Beautina layout */}
      <div className="flex flex-col md:flex-row">
        {/* Left panel - Hair Care banner */}
        <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[500px] overflow-hidden group">
          <img
            src="/images/migrated/5_custom-banner-2.jpg"
            alt="Hair Care"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <span className="section-label text-white/80 mb-2">Collection</span>
            <h3 className="font-heading text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
              Hair Care
            </h3>
            <Link
              to="/category/hair-care"
              className="bg-white text-brand-dark font-body text-xs uppercase tracking-[0.15em] px-8 py-3 hover:bg-brand-dark hover:text-white transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Right panel - SkinCare banner */}
        <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[500px] overflow-hidden group">
          <img
            src="/images/migrated/7_2-anti-age-recovery-treatment-A2603.jpg"
            alt="SkinCare"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <span className="section-label text-white/80 mb-2">Collection</span>
            <h3 className="font-heading text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
              SkinCare
            </h3>
            <Link
              to="/category/skincare"
              className="bg-white text-brand-dark font-body text-xs uppercase tracking-[0.15em] px-8 py-3 hover:bg-brand-dark hover:text-white transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullWidthBanner;
