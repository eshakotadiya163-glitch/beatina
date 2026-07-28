const items = [
  "Fast Delivery",
  "Secure Payment",
  "30 Days Free Returns"
];

const TextMarquee = () => {
  return (
    <section className="w-full overflow-hidden bg-[#f5deff] py-[40px] md:py-[20px] text-black">
      <div className="relative flex overflow-x-hidden">
        <div 
          className="animate-marquee whitespace-nowrap flex items-center"
          style={{ animationDuration: '30s' }}
        >
          {/* We repeat the items a few times to ensure seamless infinite scrolling */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              {items.map((item, index) => (
                <span 
                  key={index} 
                  className="px-[4rem] font-serif text-[32px] md:text-[40px] font-bold uppercase m-0 flex items-center tracking-wide"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TextMarquee;
