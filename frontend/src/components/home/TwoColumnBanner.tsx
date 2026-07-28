import { Link } from 'react-router-dom';

// Real The Woman Company Moisture Cream collection banner
const TwoColumnBanner = () => {
  return (
    <section className="py-12 md:py-14 bg-white">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          {/* Left: Text block */}
          <div className="w-full md:w-5/12 flex flex-col justify-center py-8 md:py-12">
            <span className="section-label">Featured</span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-brand-dark mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Moisture Cream
            </h2>
            <p className="font-body text-brand-muted text-sm leading-relaxed mb-8 max-w-sm">
              Deeply nourishing moisture creams powered by organic botanicals to restore skin's natural barrier, leaving it soft, supple and radiant.
            </p>
            <div className="flex gap-4">
              <Link to="/shop/category/skin-care" className="btn-primary">
                Shop Collection
              </Link>
            </div>
          </div>

          {/* Right: Images staggered grid */}
          <div className="w-full md:w-7/12 grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] overflow-hidden bg-brand-light">
              <img
                src="/images/migrated/8_4-replenishing-night-cream-A3062.jpg"
                alt="Moisture Cream"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-brand-light mt-8">
              <img
                src="/images/migrated/51_1-age-pro-intense-wrinkle-serum-A3340.jpg"
                alt="Intense Wrinkle Serum"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoColumnBanner;
