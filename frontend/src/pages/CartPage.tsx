import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const { cartItems, removeItem, addItem } = useCartStore();

  const handleQtyChange = (item: any, newQty: number) => {
    if (newQty < 1) return;
    if (newQty > item.countInStock) return;
    addItem({ ...item, qty: newQty });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const isFreeShipping = subtotal >= 500 || subtotal === 0;
  const shippingCost = (isFreeShipping || subtotal === 0) ? 0 : 20;
  const taxCost = subtotal * 0.15; // 15% tax
  const total = subtotal + shippingCost + taxCost;

  return (
    <div className="pt-24 pb-32 bg-white min-h-screen">
      
      {/* Page Header */}
      <div className="bg-brand-light py-12 mb-12 text-center border-b border-brand-border">
        <h1 className="font-heading text-4xl text-brand-dark tracking-wide uppercase">Your Cart</h1>
        <div className="mt-4 flex items-center justify-center gap-2 font-body text-xs text-brand-muted uppercase tracking-widest">
          <Link to="/" className="hover:text-brand-dark transition-colors">Home</Link>
          <span>/</span>
          <span className="text-brand-dark">Cart</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-brand-light border border-brand-border flex flex-col items-center justify-center rounded-sm"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ShoppingBag size={32} className="text-brand-muted" />
            </div>
            <h2 className="font-heading text-2xl text-brand-dark mb-4 uppercase tracking-widest">Your cart is empty</h2>
            <p className="font-body text-brand-muted mb-8 text-sm">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="inline-flex items-center gap-3 bg-brand-dark text-white font-body uppercase tracking-[0.2em] text-xs px-10 py-4 hover:bg-black transition-colors rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items Area */}
            <div className="w-full lg:w-2/3">
              <div className="bg-brand-light border border-brand-border p-6 mb-8">
                 <h3 className="font-heading text-lg mb-4 text-brand-dark uppercase tracking-widest flex items-center gap-2">
                   <Tag size={16} className="text-brand-dark" />
                   Available Offers
                 </h3>
                 <p className="text-sm font-body text-brand-muted mb-2">Free shipping on orders above ₹500.</p>
                 <p className="text-sm font-body text-brand-muted">Complimentary samples included with every order.</p>
              </div>

              <div className="border-t border-brand-border">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item._id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      className="flex gap-6 py-8 border-b border-brand-border group"
                    >
                      <Link to={`/product/${item._id}`} className="w-24 md:w-32 flex-shrink-0 block bg-brand-light border border-brand-border/50 aspect-[3/4] overflow-hidden rounded-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] text-brand-muted uppercase tracking-widest font-body mb-2">Beautina</p>
                              <Link to={`/product/${item._id}`} className="font-heading text-lg text-brand-dark hover:text-brand-muted transition-colors line-clamp-2 pr-4">{item.name}</Link>
                            </div>
                            <button 
                              onClick={() => removeItem(item._id)}
                              className="text-brand-muted hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="font-body text-brand-dark">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-6">
                          <div className="flex items-center border border-brand-border bg-white w-28 rounded-sm overflow-hidden shadow-sm">
                            <button onClick={() => handleQtyChange(item, item.qty - 1)} className="flex-1 py-2 text-brand-dark hover:bg-brand-light flex justify-center items-center transition-colors"><Minus size={12} /></button>
                            <span className="flex-1 py-2 text-sm font-body text-brand-dark border-l border-r border-brand-border flex justify-center items-center">{item.qty}</span>
                            <button onClick={() => handleQtyChange(item, item.qty + 1)} className="flex-1 py-2 text-brand-dark hover:bg-brand-light flex justify-center items-center transition-colors"><Plus size={12} /></button>
                          </div>
                          <span className="font-body font-semibold text-brand-dark text-lg">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary Area */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-border p-8 sticky top-32 rounded-sm">
                <h2 className="font-heading text-2xl mb-8 text-brand-dark uppercase tracking-widest border-b border-brand-border pb-4">Order Summary</h2>
                
                <div className="space-y-6 font-body text-sm text-brand-muted mb-8 border-b border-brand-border pb-8">
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                    <span className="text-brand-dark font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-brand-dark font-medium">{isFreeShipping ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  {!isFreeShipping && (
                    <div className="text-[11px] text-brand-dark/70 italic mt-[-10px] bg-brand-light p-2 rounded-sm">
                      Add ${(500 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Tax (15%)</span>
                    <span className="text-brand-dark font-medium">${taxCost.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-10">
                  <span className="font-heading text-xl text-brand-dark uppercase tracking-widest">Total</span>
                  <span className="font-body text-3xl text-brand-dark">${total.toFixed(2)}</span>
                </div>
                
                <Link to="/checkout" className="w-full bg-brand-dark text-white text-center py-4 font-body uppercase tracking-[0.2em] text-xs hover:bg-black transition-all block rounded-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
                  Proceed to Checkout
                </Link>

                <div className="flex items-center justify-center gap-4 mt-6 text-brand-muted">
                   <ShieldCheck size={16} /> <span className="text-[10px] font-body uppercase tracking-widest">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
