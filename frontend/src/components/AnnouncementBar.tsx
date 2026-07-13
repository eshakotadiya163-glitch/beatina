import { Link } from 'react-router-dom';

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-[#b8c2f2] py-[0.6rem]">
      <div className="max-w-[1550px] mx-auto px-[15px]">
        <div className="flex items-center justify-between">
          
          {/* Left: Social Icons (Hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-[1.5rem] flex-1">
            <a href="https://www.facebook.com/shopify" aria-label="Facebook" className="hover:text-black/70 transition-colors text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-current" viewBox="0 0 512 512"><path d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z" fillRule="evenodd"></path></svg>
            </a>
            <a href="https://www.pinterest.com/shopify" aria-label="Pinterest" className="hover:text-black/70 transition-colors text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-current" viewBox="0 0 512 512"><path d="M256.05 32c-123.7 0-224 100.3-224 224 0 91.7 55.2 170.5 134.1 205.2-.6-15.6-.1-34.4 3.9-51.4 4.3-18.2 28.8-122.1 28.8-122.1s-7.2-14.3-7.2-35.4c0-33.2 19.2-58 43.2-58 20.4 0 30.2 15.3 30.2 33.6 0 20.5-13.1 51.1-19.8 79.5-5.6 23.8 11.9 43.1 35.4 43.1 42.4 0 71-54.5 71-119.1 0-49.1-33.1-85.8-93.2-85.8-67.9 0-110.3 50.7-110.3 107.3 0 19.5 5.8 33.3 14.8 43.9 4.1 4.9 4.7 6.9 3.2 12.5-1.1 4.1-3.5 14-4.6 18-1.5 5.7-6.1 7.7-11.2 5.6-31.3-12.8-45.9-47-45.9-85.6 0-63.6 53.7-139.9 160.1-139.9 85.5 0 141.8 61.9 141.8 128.3 0 87.9-48.9 153.5-120.9 153.5-24.2 0-46.9-13.1-54.7-27.9 0 0-13 51.6-15.8 61.6-4.7 17.3-14 34.5-22.5 48a225.13 225.13 0 0063.5 9.2c123.7 0 224-100.3 224-224S379.75 32 256.05 32z"></path></svg>
            </a>
            <a href="https://instagram.com/shopify" aria-label="Instagram" className="hover:text-black/70 transition-colors text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-current" viewBox="0 0 512 512"><path d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z"></path><path d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z"></path></svg>
            </a>
            <a href="https://www.youtube.com/user/shopify" aria-label="Youtube" className="hover:text-black/70 transition-colors text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-current" viewBox="0 0 512 512"><path d="M508.64 148.79c0-45-33.1-81.2-74-81.2C379.24 65 322.74 64 265 64h-18c-57.6 0-114.2 1-169.6 3.6C36.6 67.6 3.5 104 3.5 149 1 184.59-.06 220.19 0 255.79q-.15 53.4 3.4 106.9c0 45 33.1 81.5 73.9 81.5 58.2 2.7 117.9 3.9 178.6 3.8q91.2.3 178.6-3.8c40.9 0 74-36.5 74-81.5 2.4-35.7 3.5-71.3 3.4-107q.34-53.4-3.26-106.9zM207 353.89v-196.5l145 98.2z"></path></svg>
            </a>
          </div>

          {/* Center: Message */}
          <div className="flex-1 flex justify-center items-center gap-1">
            <span className="font-body text-[14px] text-[#000000]">
              ✌🏼 Free Express Shipping on orders ₹970.05!
            </span>
            <Link to="/collections/all" className="font-body text-[14px] text-[#000000] underline hover:opacity-80 transition-opacity ml-1">
              Shop now
            </Link>
          </div>

          {/* Right: Selectors (Hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-end gap-5 flex-1 font-body text-[13px] text-brand-dark">
            <div className="flex items-center gap-1 cursor-pointer hover:text-brand-accent transition-colors">
              <span>English</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-brand-accent transition-colors">
              <span>India (INR ₹)</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
