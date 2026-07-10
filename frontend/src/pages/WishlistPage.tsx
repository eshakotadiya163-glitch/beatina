import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Trash2, ShoppingBag, Heart, Loader2 } from 'lucide-react';
import AccountLayout from '../components/AccountLayout';
import api from '../api/axios';
import useCartStore from '../store/cartStore';

const WishlistPage = () => {
  const queryClient = useQueryClient();
  const { addItem } = useCartStore();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/wishlist');
      return data;
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/wishlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    }
  });

  const handleMoveToCart = (product: any) => {
    addItem({ ...product, qty: 1 });
    removeFromWishlistMutation.mutate(product._id);
    toast.success('Moved to bag');
  };

  return (
    <AccountLayout title="My Wishlist">
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      ) : !wishlist || wishlist.length === 0 ? (
        <div className="bg-white p-16 text-center border border-gray-100 shadow-sm rounded-sm">
          <Heart size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-heading text-brand-dark mb-2">Your wishlist is empty</h3>
          <p className="font-body text-gray-500 mb-8">Save items you love to build your perfect collection.</p>
          <Link
            to="/shop"
            className="border border-brand-dark px-8 py-3 font-button uppercase tracking-widest text-xs hover:bg-brand-dark hover:text-white transition-colors"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product: any) => (
            <div key={product._id} className="group bg-white border border-gray-100 shadow-sm rounded-sm flex flex-col relative overflow-hidden">
              <Link to={`/product/${product._id}`} className="relative aspect-[3/4] block overflow-hidden bg-gray-50">
                <img 
                  src={product.images[0]?.url} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </Link>
              
              <button
                onClick={() => removeFromWishlistMutation.mutate(product._id)}
                className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors z-10 shadow-sm"
                title="Remove from wishlist"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-body">{product.brand}</p>
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-heading text-sm text-brand-dark hover:text-brand-primary transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto">
                  <p className="font-body font-medium text-brand-dark mb-4">₹{product.price.toLocaleString('en-IN')}</p>
                  
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.countInStock === 0}
                    className="w-full border border-brand-dark text-brand-dark py-2.5 font-button text-[10px] uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={14} className="mr-2" />
                    {product.countInStock > 0 ? 'Move to Bag' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
};

export default WishlistPage;
