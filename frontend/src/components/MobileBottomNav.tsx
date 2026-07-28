import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react';
import useCartStore from '../store/cartStore';

const MobileBottomNav = () => {
  const { cartItems, setIsOpen } = useCartStore();
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between z-50 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
        <Home size={22} className="mb-1" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">Home</span>
      </NavLink>

      <button 
        onClick={() => {
          import('../store/searchStore').then(module => module.default.getState().setIsOpen(true));
        }}
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-black"
      >
        <Search size={22} className="mb-1" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">Search</span>
      </button>

      <button onClick={() => setIsOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-black relative">
        <div className="relative mb-1">
          <ShoppingBag size={22} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">Bag</span>
      </button>

      <NavLink to="/wishlist" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
        <Heart size={22} className="mb-1" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">Wishlist</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
        <User size={22} className="mb-1" />
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider">Account</span>
      </NavLink>
    </div>
  );
};

export default MobileBottomNav;
