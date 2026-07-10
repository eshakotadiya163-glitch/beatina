import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const items = [
  {
    bgImage: '/assets/migrated/19_gallery-image-7.webp',
    productImage: '/assets/migrated/8_4-replenishing-night-cream-A3062.jpg',
    title: 'Day Cream',
    link: '/product/moisture-day-cream'
  },
  {
    bgImage: '/assets/migrated/18_gallery-2-v2.webp',
    productImage: '/assets/migrated/26_luminous-perfecting-concealer_1.jpg',
    title: 'Luminous Perfecting Concealer',
    link: '/product/luminous-perfecting-concealer'
  },
  {
    bgImage: '/assets/migrated/20_gallery-image-1.jpg',
    productImage: '/assets/migrated/27_intense-glow-concentrate.jpg',
    title: 'Intense Glow Concentrate',
    link: '/product/intense-glow-concentrate'
  },
  {
    bgImage: '/assets/migrated/21_about-img-3.webp',
    productImage: '/assets/migrated/28_superseed-age-recovery-organic-facial-oil.jpg',
    title: 'Age Recovery Facial Oil',
    link: '/product/superseed-age-recovery-organic-facial-oil'
  }
];

const LifestyleGrid = () => {
  return (
    <section className="relative py-16 bg-white overflow-hidden">
      
      {/* Vertical Text on the left edge */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-12 -rotate-180" style={{ writingMode: 'vertical-rl' }}>
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-brand-dark flex items-center gap-4">
          <span className="w-px h-8 bg-brand-dark/20 inline-block"></span>
          GET 15% OFF
        </span>
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-brand-dark flex items-center gap-2">
          COMPARE <span className="w-4 h-4 rounded-full bg-brand-dark text-white flex items-center justify-center text-[8px]">0</span>
        </span>
      </div>

      <div className="max-w-[1600px] ml-auto pl-12 pr-4 xl:pr-12">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
          {items.map((item, i) => (
            <div key={i} className="relative min-w-[280px] md:min-w-[320px] lg:min-w-[380px] aspect-[4/5] rounded-lg overflow-hidden group snap-start flex-shrink-0">
              
              {/* Main Lifestyle Image */}
              <img 
                src={item.bgImage} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Product Mini Card (Bottom Left) */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="w-16 h-20 bg-white rounded-md shadow-lg overflow-hidden p-2 mb-3">
                    <img src={item.productImage} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <h4 className="font-heading text-white text-lg drop-shadow-md">{item.title}</h4>
                </div>
              </div>

              {/* Hover Overlay Button */}
              <Link 
                to={item.link}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity duration-300 flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                  <ArrowRight size={20} className="text-brand-dark" />
                </div>
              </Link>
            </div>
          ))}
          
          {/* Arrow navigation placeholder if it was a carousel, mapping screenshot button on bottom right */}
          <div className="absolute bottom-4 right-12 z-10 hidden lg:flex items-center gap-2">
            <button className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center bg-white hover:bg-brand-dark hover:text-white transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LifestyleGrid;
