import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: any;
  onQuickView?: (product: any) => void;
}

const ProductCard = ({ product }: ProductCardProps) => {
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
        
        {/* Quickshop Overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 px-4">
          <button className="flex-1 bg-white text-black font-body text-[11px] font-semibold uppercase tracking-widest py-3 hover:bg-black hover:text-white transition-colors text-center border border-transparent shadow-sm">
            Quickshop
          </button>
          <button className="flex-1 bg-white text-black font-body text-[11px] font-semibold uppercase tracking-widest py-3 hover:bg-black hover:text-white transition-colors text-center border border-transparent shadow-sm">
            Add to cart
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="pt-2">
        {/* Name */}
        <Link to={`/product/${product.slug || product._id}`} className="block mb-1">
          <h3 className="font-body text-[14px] font-medium text-black capitalize leading-[1.3] transition-colors hover:opacity-70">
            {product.name}
          </h3>
        </Link>
        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {compareAtPrice ? (
            <>
              <span className="font-body text-[14px] text-[#222222]">
                Rs. {price.toLocaleString('en-IN')}.00
              </span>
              <span className="font-body text-[14px] text-gray-400 line-through">
                Rs. {compareAtPrice.toLocaleString('en-IN')}.00
              </span>
            </>
          ) : (
            <span className="font-body text-[14px] text-[#222222]">
              Rs. {price.toLocaleString('en-IN')}.00
            </span>
          )}
        </div>
        </div>
      </div>
  );
};

export default ProductCard;
