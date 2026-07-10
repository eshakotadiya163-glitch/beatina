const ImageTextPromo = () => {
  return (
    <section className="bg-[#feedff] py-[40px] md:py-[50px]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-[780px] mx-auto font-heading text-[32px] md:text-[34px] lg:text-[42px] font-semibold leading-[1.5] md:leading-[1.4] text-[#111111]">
          <span className="inline-flex items-center justify-center gap-2 md:gap-3 align-middle flex-wrap">
            <span>Make you feel</span>
            <img 
              src="https://zest-cosmo.myshopify.com/cdn/shop/files/highlight-icon-1.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block transition-transform duration-300 hover:scale-110" 
            />
            <span>and appear</span>
          </span>
          
          <br className="hidden md:block" />
          
          <span className="inline-flex items-center justify-center gap-2 md:gap-3 align-middle flex-wrap mt-2 md:mt-0">
            <span className="italic font-light">glowing</span>
            <img 
              src="https://zest-cosmo.myshopify.com/cdn/shop/files/highlight-icon-2.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block transition-transform duration-300 hover:scale-110" 
            />
            <span className="italic font-light">healthy</span>
            <img 
              src="https://zest-cosmo.myshopify.com/cdn/shop/files/highlight-icon-3.webp" 
              alt="" 
              className="w-[50px] md:w-[70px] lg:w-[90px] h-auto block transition-transform duration-300 hover:scale-110" 
            />
            <span className="italic font-light">and balanced</span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default ImageTextPromo;
