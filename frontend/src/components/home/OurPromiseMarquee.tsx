// Real promise icons from The Woman Company (from zest-cosmo CDN which they use)
const promises = [
  {
    icon: '/images/migrated/15_highlight-icon-1.webp',
    title: 'Fast Delivery',
    desc: 'Orders shipped within 24 hours',
  },
  {
    icon: '/images/migrated/16_highlight-icon-2.webp',
    title: 'Secure Payment',
    desc: '100% secure and encrypted checkout',
  },
  {
    icon: '/images/migrated/17_highlight-icon-3.webp',
    title: '30 Days Free Returns',
    desc: 'Hassle-free returns within 30 days',
  },
  {
    icon: '/images/migrated/34_highlight-icon-4.webp',
    title: '100% Natural',
    desc: 'Certified organic ingredients',
  },
];

// Marquee text matching The Woman Company's "Time To Achieve More With Less"
const marqueeText = [
  'TIME TO ACHIEVE MORE WITH LESS',
  '✦',
  'ORGANIC & NATURAL',
  '✦',
  'CERTIFIED INGREDIENTS',
  '✦',
  'TIME TO ACHIEVE MORE WITH LESS',
  '✦',
  'CRUELTY FREE',
  '✦',
  'SUSTAINABLE BEAUTY',
  '✦',
];

const OurPromiseMarquee = () => {
  return (
    <section className="bg-white border-y border-brand-border">
      {/* Promise icons */}
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-14 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {promises.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback icons if CDN fails
                    const icons = ['🚚', '🔒', '↩️', '🌿'];
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.innerText = icons[i];
                  }}
                />
              </div>
              <h4 className="font-body text-sm font-semibold text-brand-dark mb-1 uppercase tracking-wide">
                {item.title}
              </h4>
              <p className="font-body text-xs text-brand-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling Marquee - matches The Woman Company's "TIME TO ACHIEVE MORE WITH LESS" */}
      <div className="overflow-hidden border-t border-brand-border py-5 bg-brand-light">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
          {[...marqueeText, ...marqueeText].map((text, i) => (
            <span
              key={i}
              className="font-heading text-2xl md:text-3xl italic text-brand-dark/20 mx-6 flex-none"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPromiseMarquee;
