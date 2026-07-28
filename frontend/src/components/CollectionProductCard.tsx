import { Link } from 'react-router-dom';
import useCompareStore from '../store/compareStore';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

interface CollectionProductCardProps {
  product: any;
}

const CollectionProductCard = ({ product }: CollectionProductCardProps) => {
  const { addItem: addCompareItem } = useCompareStore();
  const queryClient = useQueryClient();

  const primaryImage = product.images?.[0]?.url || product.image?.src || '';
  const hoverImage = product.images?.[1]?.url || primaryImage;
  const price = product.price ?? 0;
  const compareAtPrice = product.compareAtPrice && product.compareAtPrice > price ? product.compareAtPrice : null;
  // Try to get a vendor/brand name; fall back to category name or nothing
  const vendor = product.brand || product.vendor || product.category?.name || '';

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

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addCompareItem({
      _id: product._id,
      name: product.name,
      image: primaryImage || '/placeholder.png',
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      brand: vendor,
      category: product.category,
      rating: product.rating || 0,
      numReviews: product.numReviews || 0,
    });
    toast.success('Added to compare');
  };

  return (
    <div className="group flex flex-col relative w-full text-left">
      {/* Image container — 4:5 ratio matching The Woman Company (125.03%) */}
      <div className="relative overflow-hidden cursor-pointer w-full" style={{ paddingTop: '125.03%' }}>
        <Link
          to={`/product/${product.slug || product._id}`}
          aria-label={product.name}
          className="absolute inset-0 w-full h-full block"
        >
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

        {/* Hover icons — top right, only on hover */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Wishlist */}
          <button
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToWishlistMutation.mutate(product._id);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          {/* Compare */}
          <button
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Compare"
            onClick={handleCompare}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 3l4 4-4 4M8 21l-4-4 4-4M20 7H4M20 17H4"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="pt-3 flex flex-col text-left">
        {/* Vendor / Brand — ALL CAPS, small grey */}
        {vendor && (
          <span className="font-body text-[11px] uppercase tracking-widest text-gray-400 mb-1">
            {vendor}
          </span>
        )}

        {/* Name */}
        <Link to={`/product/${product.slug || product._id}`} className="block mb-1">
          <h3 className="font-serif text-[15px] font-normal text-[#111111] leading-[1.3] transition-colors hover:text-gray-500">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-start gap-2 mb-1.5">
          {compareAtPrice ? (
            <>
              <span className="font-body text-[14px] text-[#111111]">
                From Rs. {price.toLocaleString('en-IN')}.00
              </span>
              <span className="font-body text-[13px] text-gray-400 line-through">
                Rs. {compareAtPrice.toLocaleString('en-IN')}.00
              </span>
            </>
          ) : (
            <span className="font-body text-[14px] text-[#111111]">
              From Rs. {price.toLocaleString('en-IN')}.00
            </span>
          )}
        </div>

        {/* Add to cart link */}
        <button className="relative cursor-pointer text-[13px] font-body text-[#111111] hover:text-gray-500 transition-colors bg-transparent border-0 p-0 m-0 text-left w-fit">
          + Add to cart
        </button>
      </div>
    </div>
  );
};

export default CollectionProductCard;
