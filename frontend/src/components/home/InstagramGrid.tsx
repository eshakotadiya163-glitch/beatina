const Instagram = (props: any) => <svg width={props.size || 24} height={props.size || 24} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={props.strokeWidth || 2} className={props.className} {...props}><rect x='2' y='2' width='20' height='20' rx='5' ry='5'/><path d='M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z'/><line x1='17.5' y1='6.5' x2='17.51' y2='6.5'/></svg>;

const images = [
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/b17_540x_aa6b96c0-cd33-460e-8da7-208e8c30f82e.webp?v=1773124923&width=600",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/custom-banner-2.jpg?v=1773124923&width=600",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-2-v2.webp?v=1773124923&width=600",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-image-7.webp?v=1773124923&width=600",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-image-1.jpg?v=1773124923&width=600",
  "https://beautina-cosmetic.myshopify.com/cdn/shop/files/about-img-3.webp?v=1773124923&width=600"
];

const InstagramGrid = () => {
  return (
    <section className="py-16 bg-[#F8F7F5] border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8 mb-8 text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-brand-dark flex items-center justify-center gap-3">
          <Instagram size={32} strokeWidth={1.5} />
          @Beautina
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
        {images.map((src, index) => (
          <a 
            key={index} 
            href="https://instagram.com/beautina" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden"
          >
            <img 
              src={src} 
              alt={`Instagram ${index + 1}`} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram className="text-white w-8 h-8" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramGrid;
