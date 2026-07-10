import React from 'react';

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
    <section className="w-full overflow-hidden" style={{ backgroundColor: '#ffffff', padding: '20px 0', margin: 0 }}>
      <div className="flex w-full overflow-hidden">
        <div
          className="flex w-max animate-marquee"
          style={{ animationDuration: '20s', gap: '35px' }}
        >
          {allItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex-shrink-0 text-center"
              style={{ minWidth: '140px', textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="inline-flex items-center justify-center"
                style={{
                  padding: '1px',
                  borderRadius: '50%',
                }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="object-cover rounded-full"
                  style={{ width: '100px', height: '100px', display: 'block' }}
                  loading="lazy"
                />
              </div>
              <h6
                style={{
                  color: '#000000',
                  paddingTop: '8px',
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 400
                }}
              >
                {item.label}
              </h6>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
