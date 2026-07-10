import { Link } from 'react-router-dom';

// Icons
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:scale-110">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const CompareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:scale-110">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform group-hover:scale-110">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface ProductCardProps {
  product: any;
  onQuickView?: (product: any) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const primaryImage = product.images?.[0]?.url || product.image?.src || '';
  const hoverImage = product.images?.[1]?.url || primaryImage;
  const price = product.price ?? 0;
  const compareAtPrice = product.compareAtPrice && product.compareAtPrice > price ? product.compareAtPrice : null;

  return (
    <div className="group flex flex-col relative w-full h-full text-left">
      {/* Image container */}
      <div className="relative overflow-hidden mb-3 cursor-pointer w-full" style={{ paddingTop: '125.03%' }}>
        <Link to={`/product/${product.slug || product._id}`} aria-label={product.name} className="absolute inset-0 w-full h-full block">
          {/* Primary image */}
          <img
            src={primaryImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out group-hover:opacity-0"
            loading="lazy"
          />
          {/* Hover image */}
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out opacity-0 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>
        
        {/* Quick actions (Right side) */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button 
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-sm"
            aria-label="Add to Wishlist"
          >
            <HeartIcon />
          </button>
          <button 
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-sm"
            aria-label="Compare"
          >
            <CompareIcon />
          </button>
          <button 
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-sm"
            onClick={() => onQuickView && onQuickView(product)}
            aria-label="Quick View"
          >
            <EyeIcon />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button className="w-full bg-white text-[#111111] font-sans text-[12px] font-semibold uppercase tracking-widest py-3 hover:bg-[#111111] hover:text-white transition-colors text-center border border-transparent shadow-sm">
            Add to cart
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="pt-3 flex flex-col items-center text-center">
        {/* Name */}
        <Link to={`/product/${product.slug || product._id}`} className="block mb-1.5">
          <h3 className="font-serif text-[16px] font-medium text-[#111111] capitalize leading-[1.3] transition-colors hover:text-gray-500">
            {product.name}
          </h3>
        </Link>
        {/* Price */}
        <div className="flex items-center justify-center gap-3">
          {compareAtPrice ? (
            <>
              <span className="font-sans text-[15px] font-medium text-[#111111]">
                Rs. {price.toLocaleString('en-IN')}.00
              </span>
              <span className="font-sans text-[15px] text-gray-400 line-through">
                Rs. {compareAtPrice.toLocaleString('en-IN')}.00
              </span>
            </>
          ) : (
            <span className="font-sans text-[15px] font-medium text-[#111111]">
              Rs. {price.toLocaleString('en-IN')}.00
            </span>
          )}
        </div>
        </div>
      </div>
  );
};

export default ProductCard;
