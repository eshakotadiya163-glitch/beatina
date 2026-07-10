import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ArrowRight } from 'lucide-react';
import useCartStore from '../store/cartStore';

const CartPage = () => {
  const { cartItems, removeItem, addItem } = useCartStore();

  const handleQtyChange = (item: any, newQty: number) => {
    if (newQty < 1) return;
    if (newQty > item.countInStock) return;
    addItem({ ...item, qty: newQty });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const isFreeShipping = subtotal >= 500;
  const shippingCost = isFreeShipping ? 0 : 20;
  const total = subtotal + shippingCost;

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
          <div className="text-center py-20 bg-brand-light border border-brand-border">
            <h2 className="font-heading text-2xl text-brand-dark mb-4 uppercase tracking-widest">Your cart is empty</h2>
            <p className="font-body text-brand-muted mb-8 text-sm">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="inline-flex items-center gap-3 bg-brand-dark text-white font-body uppercase tracking-[0.2em] text-xs px-10 py-4 hover:bg-black transition-colors">
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items Area */}
            <div className="w-full lg:w-2/3">
              <div className="bg-brand-light border border-brand-border p-6 mb-8">
                 <h3 className="font-heading text-lg mb-4 text-brand-dark uppercase tracking-widest flex items-center gap-2">
                   <Tag size={16} className="text-brand-dark" />
                   Available Offers
                 </h3>
                 <p className="text-sm font-body text-brand-muted mb-2">Free shipping on orders above $500.</p>
                 <p className="text-sm font-body text-brand-muted">Complimentary samples included with every order.</p>
              </div>

              <div className="border-t border-brand-border">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-6 py-8 border-b border-brand-border">
                    <Link to={`/product/${item._id}`} className="w-24 md:w-32 flex-shrink-0 block bg-brand-light border border-brand-border/50 aspect-[3/4]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
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
                            className="text-brand-muted hover:text-red-500 transition-colors"
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
                        <div className="flex items-center border border-brand-border bg-white w-28">
                          <button onClick={() => handleQtyChange(item, item.qty - 1)} className="flex-1 py-2 text-brand-dark hover:bg-brand-light flex justify-center items-center transition-colors"><Minus size={12} /></button>
                          <span className="flex-1 py-2 text-sm font-body text-brand-dark border-l border-r border-brand-border flex justify-center items-center">{item.qty}</span>
                          <button onClick={() => handleQtyChange(item, item.qty + 1)} className="flex-1 py-2 text-brand-dark hover:bg-brand-light flex justify-center items-center transition-colors"><Plus size={12} /></button>
                        </div>
                        <span className="font-body font-semibold text-brand-dark text-lg">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Area */}
            <div className="w-full lg:w-1/3">
              <div className="bg-brand-light border border-brand-border p-8 sticky top-32">
                <h2 className="font-heading text-2xl mb-8 text-brand-dark uppercase tracking-widest border-b border-brand-border pb-4">Order Summary</h2>
                
                <div className="space-y-6 font-body text-sm text-brand-muted mb-8 border-b border-brand-border pb-8">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                    <span className="text-brand-dark">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-brand-dark">{isFreeShipping ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  {!isFreeShipping && (
                    <div className="text-xs text-brand-muted italic mt-[-10px]">
                      Add ${(500 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-end mb-10">
                  <span className="font-heading text-xl text-brand-dark uppercase tracking-widest">Total</span>
                  <span className="font-body text-3xl text-brand-dark">${total.toFixed(2)}</span>
                </div>
                
                <Link to="/checkout" className="w-full bg-brand-dark text-white text-center py-4 font-body uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors block">
                  Checkout
                </Link>

                <p className="text-xs text-center font-body text-brand-muted mt-6">
                  Taxes calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
