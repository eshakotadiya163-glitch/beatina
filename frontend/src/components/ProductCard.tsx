import { Link } from 'react-router-dom';

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:scale-110">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const CompareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:scale-110">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:scale-110">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface ProductCardProps {
  product: any;
  onQuickView?: (product: any) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const primaryImage = product.images?.[0]?.url || '';
  const hoverImage = product.images?.[1]?.url || primaryImage;
  const price = product.price ?? 0;
  const compareAtPrice = product.compareAtPrice && product.compareAtPrice > price ? product.compareAtPrice : null;
  const isSale = compareAtPrice !== null;
  
  const rating = product.rating || 0;
  const numReviews = product.numReviews || 0;

  return (
    <div className="group flex flex-col relative w-full h-full text-center">
      {/* Image container (Points 13, 14, 15, 16, 17) */}
      <div className="relative overflow-hidden mb-5 cursor-pointer w-full aspect-[3/4] group/image bg-[#f8f8f8]">
        {/* Sale Badge (Point 22) */}
        {isSale && (
          <div className="absolute top-4 left-4 z-30 bg-[#ff6b6b] text-white text-[12px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            Sale
          </div>
        )}
        
        <Link to={`/product/${product.slug || product._id}`} aria-label={product.name} className="absolute inset-0 w-full h-full block">
          {/* Primary image */}
          {primaryImage && (
            <img
              src={primaryImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
              loading="lazy"
            />
          )}
          {/* Hover image */}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
              loading="lazy"
            />
          )}
        </Link>
        
        {/* Quick actions (Right side) - Points 18, 19, 20 */}
        <div className="absolute right-4 top-4 flex flex-col gap-3 translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-[#ffb6c1] hover:text-white transition-colors shadow-lg"
            aria-label="Add to Wishlist"
          >
            <HeartIcon />
          </button>
          <button 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-[#ffb6c1] hover:text-white transition-colors shadow-lg"
            aria-label="Compare"
          >
            <CompareIcon />
          </button>
          <button 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-[#ffb6c1] hover:text-white transition-colors shadow-lg"
            aria-label="Quick View"
            onClick={(e) => {
              e.preventDefault();
              if(onQuickView) onQuickView(product);
            }}
          >
            <EyeIcon />
          </button>
        </div>

        {/* Action Buttons Overlay - Point 21 */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button className="w-full bg-[#111] text-white font-body text-[13px] font-bold uppercase tracking-widest py-4 hover:bg-[#ffb6c1] transition-colors text-center">
            Add to cart
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-col items-center text-center px-2">
        {/* Rating - Point 23 */}
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-[#f5a623]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-[12px] text-gray-500 ml-1">({numReviews})</span>
        </div>

        {/* Name - Point 25 */}
        <Link to={`/product/${product.slug || product._id}`} className="block mb-2 w-full">
          <h3 className="font-serif text-[18px] font-medium text-gray-900 capitalize leading-[1.3] transition-colors hover:text-[#ffb6c1] line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Price - Point 24 */}
        <div className="flex items-center justify-center gap-3">
          {compareAtPrice ? (
            <>
              <span className="font-sans text-[16px] font-semibold text-[#e02b2b]">
                ₹{price.toLocaleString('en-IN')}.00
              </span>
              <span className="font-sans text-[15px] text-gray-400 line-through">
                ₹{compareAtPrice.toLocaleString('en-IN')}.00
              </span>
            </>
          ) : (
            <span className="font-sans text-[16px] font-semibold text-gray-900">
              ₹{price.toLocaleString('en-IN')}.00
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
