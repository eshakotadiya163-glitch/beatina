import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react';
import useCartStore from '../store/cartStore';

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { cartItems, setIsOpen } = useCartStore();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 z-50 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-brand-dark' : 'text-gray-400'}`}>
        <Home size={22} className="mb-1" />
        <span className="text-[9px] font-button uppercase font-semibold">Home</span>
      </Link>
      
      <Link to="/shop" className={`flex flex-col items-center ${isActive('/shop') ? 'text-brand-dark' : 'text-gray-400'}`}>
        <Search size={22} className="mb-1" />
        <span className="text-[9px] font-button uppercase font-semibold">Shop</span>
      </Link>
      
      <Link to="/wishlist" className={`flex flex-col items-center relative ${isActive('/wishlist') ? 'text-brand-dark' : 'text-gray-400'}`}>
        <Heart size={22} className="mb-1" />
        <span className="text-[9px] font-button uppercase font-semibold">Wishlist</span>
      </Link>
      
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex flex-col items-center text-gray-400 hover:text-brand-dark relative"
      >
        <ShoppingBag size={22} className="mb-1" />
        <span className="text-[9px] font-button uppercase font-semibold">Cart</span>
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-brand-dark text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-body">
            {cartItems.length}
          </span>
        )}
      </button>

      <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-brand-dark' : 'text-gray-400'}`}>
        <User size={22} className="mb-1" />
        <span className="text-[9px] font-button uppercase font-semibold">Account</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
