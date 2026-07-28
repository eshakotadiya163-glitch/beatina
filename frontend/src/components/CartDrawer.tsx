import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import useCartStore from '../store/cartStore';

const CartDrawer = () => {
  const { cartItems, isOpen, setIsOpen, addItem, removeItem } = useCartStore();
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const freeShippingThreshold = 500;
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - total, 0);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[60] shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-heading text-xl font-semibold flex items-center">
            <ShoppingBag size={20} className="mr-2" />
            Your Bag ({cartItems.length})
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-brand-dark transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-6 bg-brand-secondary/30 border-b border-gray-100">
          <p className="text-sm font-body text-brand-dark mb-2 font-medium">
            {remaining > 0 
              ? `You are ₹${remaining.toLocaleString('en-IN')} away from Free Shipping!` 
              : '✨ You got Free Express Shipping!'}
          </p>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-dark h-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag size={48} className="text-gray-300" />
              <p className="font-body text-gray-500">Your bag is empty.</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-sm font-button uppercase tracking-widest text-brand-dark underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, idx) => (
                <div key={`${item._id}-${item.variantKey || idx}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-50 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/product/${item._id}`} onClick={() => setIsOpen(false)} className="font-heading text-sm font-medium hover:text-brand-primary line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="font-body text-brand-dark font-medium mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <button onClick={() => removeItem(item._id, item.variantKey)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center border border-gray-200 rounded-sm w-max">
                      <button 
                        onClick={() => addItem({...item, qty: Math.max(1, item.qty - 1)})}
                        disabled={item.qty <= 1}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 text-xs font-body font-medium">{item.qty}</span>
                      <button 
                        onClick={() => addItem({...item, qty: Math.min(item.countInStock, item.qty + 1)})}
                        disabled={item.qty >= item.countInStock}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-[18px] text-[#111] font-[400]">Total:</span>
              <span className="font-body text-[18px] text-[#111] font-semibold">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <p className="font-body text-[14px] text-[#555] mb-4 text-center">
              Taxes and shipping calculated at checkout
            </p>
            <div className="flex flex-col w-full gap-4">
              <div className="flex items-start gap-2 mb-2">
                <input type="checkbox" id="agree_checkout" className="mt-1" />
                <label htmlFor="agree_checkout" className="font-body text-[14px] text-[#555]">
                  I agree with the <a href="#" className="underline">terms and conditions</a>
                </label>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#111111] text-white py-[12px] px-[20px] font-body text-[11px] uppercase tracking-[1px] hover:bg-[#ffb6c1] transition-colors"
              >
                Check Out
              </button>
              <div className="text-center">
                <Link to="/cart" onClick={() => setIsOpen(false)} className="font-body text-[14px] text-[#111] underline hover:text-[#ffb6c1] transition-colors">
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
