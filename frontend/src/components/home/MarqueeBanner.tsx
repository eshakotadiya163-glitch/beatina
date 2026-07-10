import { Link } from 'react-router-dom';

const marqueeItems = [
  {
    image: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/5-omega-and-vitamin-e-oil-for-face-A2281.jpg?v=1773123679&width=200",
    label: "Skin Care",
    href: "/collections/skincare"
  },
  {
    image: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/5-madara-sos-skincare-A3021.jpg?v=1773123668&width=200",
    label: "Makeup",
    href: "/collections/moisture-cream"
  },
  {
    image: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-3-v2.webp?v=1773124923&width=200",
    label: "Best Sellers",
    href: "/collections/accessories"
  },
  {
    image: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/2-nourish-and-repair-hair-care-A4051.jpg?v=1773123684&width=200",
    label: "Body Care",
    href: "/collections/serum-cream"
  },
  {
    image: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/6-madara-his-collection-A5003.jpg?v=1773123669&width=200",
    label: "Face Care",
    href: "/collections/skincare"
  },
  {
    image: "https://beautina-cosmetic.myshopify.com/cdn/shop/files/4_madara-cosmetics-grow-volume-shampoo-conditioner-boost-scalp-treatment-set.jpg?v=1773123689&width=200",
    label: "Hair Care",
    href: "/collections/hair-care"
  },
];

// Duplicate for seamless scroll
const allItems = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

const MarqueeBanner = () => {
  return (
    <section className="w-full overflow-hidden bg-white py-8 md:py-12 border-b border-gray-100">
      <div className="flex w-full overflow-hidden group">
        <div
          className="flex w-max animate-marquee gap-8 md:gap-12 group-hover:[animation-play-state:paused] transition-all duration-300"
        >
          {allItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="flex-shrink-0 text-center flex flex-col items-center min-w-[120px] md:min-w-[140px] group/item"
            >
              <div
                className="inline-flex items-center justify-center p-1 rounded-full border border-transparent transition-all duration-300 group-hover/item:border-gray-200 group-hover/item:shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="object-cover rounded-full w-[90px] h-[90px] md:w-[110px] md:h-[110px] transition-transform duration-500 ease-out group-hover/item:scale-105"
                  loading="lazy"
                />
              </div>
              <h6
                className="text-black/80 pt-3 md:pt-4 text-xs md:text-sm font-medium tracking-wide transition-colors duration-300 group-hover/item:text-black"
              >
                {item.label}
              </h6>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
