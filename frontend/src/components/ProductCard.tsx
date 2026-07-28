import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useCompareStore from '../store/compareStore';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

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
  const { addItem: addCompareItem } = useCompareStore();
  const queryClient = useQueryClient();

  const primaryImage = product.images?.[0]?.url || product.image?.src || (typeof product.image === 'string' ? product.image : '');
  const hoverImage = product.images?.[1]?.url || primaryImage;
  const price = product.price ?? 0;
  const compareAtPrice = product.compareAtPrice && product.compareAtPrice > price ? product.compareAtPrice : null;

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.post(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: () => {
      toast.error('Failed to add to wishlist. Please login.');
    }
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { cartItems, addItem, setIsOpen } = useCartStore.getState();
    const existingItem = cartItems.find((x) => x._id === product._id);
    const newQty = existingItem ? existingItem.qty + 1 : 1;
    
    if (product.countInStock && newQty > product.countInStock) {
      toast.error('Not enough stock');
      return;
    }

    addItem({
      _id: product._id,
      name: product.name,
      image: primaryImage || '/placeholder.png',
      price: product.price,
      qty: newQty,
      countInStock: product.countInStock || 0
    });
    toast.success('Added to bag');
    setIsOpen(true);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addCompareItem({
      _id: product._id,
      name: product.name,
      image: primaryImage || '/placeholder.png',
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      brand: product.brand || product.vendor || '',
      category: product.category,
      rating: product.rating || 0,
      numReviews: product.numReviews || 0,
    });
    toast.success('Added to compare');
  };

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
            onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
          />
          {/* Hover image */}
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out opacity-0 group-hover:opacity-100"
            loading="lazy"
            onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
          />
        </Link>
        
        {/* Quick actions (Right side) */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button 
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-sm"
            aria-label="Add to Wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToWishlistMutation.mutate(product._id);
            }}
          >
            <HeartIcon />
          </button>
          <button 
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-sm"
            aria-label="Compare"
            onClick={handleCompare}
          >
            <CompareIcon />
          </button>
          <button 
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              if (onQuickView) onQuickView(product);
            }}
            aria-label="Quick View"
          >
            <EyeIcon />
          </button>
        </div>

        {/* Quickshop / Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 flex">
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (onQuickView) onQuickView(product);
            }}
            className="flex-1 bg-black text-white font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-widest py-3.5 hover:bg-[#222] transition-colors text-center border-r border-[#333]"
          >
            Quickshop
          </button>
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-widest py-3.5 hover:bg-[#222] transition-colors text-center"
          >
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
