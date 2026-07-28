import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Check, Loader2 } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const addressSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthStore();
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const isFreeShipping = subtotal > 500;
  const shippingCost = isFreeShipping ? 0 : 50;
  const total = subtotal + shippingCost;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile?.addresses?.length > 0 && !selectedAddressId) {
      const defaultAddr = profile.addresses.find((a: any) => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr._id : profile.addresses[0]._id);
    }
  }, [profile, selectedAddressId]);

  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmitNewAddress = async () => {
    setStep(2);
  };

  const handleProceedToPayment = () => {
    if (!isAddingNew && !selectedAddressId) return;
    setStep(2);
  };

  const getSelectedAddress = () => {
    return profile?.addresses?.find((a: any) => a._id === selectedAddressId);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const res = await loadRazorpayScript();

      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // Create Order
      const { data: orderData } = await api.post('/payment/razorpay', {
        amount: total,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummykey123',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The Women Company',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify Payment
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            await api.post('/payment/razorpay/verify', verificationData);

            // Create Order in DB
            const orderPayload = {
              orderItems: cartItems.map((item) => ({
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price,
                product: item._id,
              })),
              shippingAddress: getSelectedAddress(),
              paymentMethod: 'Razorpay',
              itemsPrice: subtotal,
              shippingPrice: shippingCost,
              totalPrice: total,
              isPaid: true,
              paidAt: new Date().toISOString(),
              paymentResult: {
                id: response.razorpay_payment_id,
                status: 'completed',
                update_time: new Date().toISOString(),
                email_address: user?.email,
              },
            };

            const { data: finalOrder } = await api.post('/orders', orderPayload);
            clearCart();
            navigate(`/order/${finalOrder._id}`);
          } catch (error) {
            console.error('Verification/Order Creation failed:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email,
        },
        theme: {
          color: '#1a1a1a',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong during payment initialization.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-[116px] pb-14 bg-brand-light min-h-[85vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-brand-border">
          <h2 className="text-2xl font-heading text-brand-dark mb-4">Your cart is empty</h2>
          <p className="text-sm font-body text-brand-muted mb-8 uppercase tracking-widest">Add items to proceed to checkout</p>
          <Link to="/shop" className="bg-[#111111] text-white px-[30px] py-[15px] font-body uppercase tracking-[1px] text-[11px] hover:bg-[#ffb6c1] transition-colors inline-block mt-8">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[116px] pb-14 bg-brand-light min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl py-8">
        
        <div className="text-center border-b border-brand-border pb-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-heading text-brand-dark uppercase tracking-wide">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Checkout Area */}
          <div className="w-full lg:w-3/5">
            
            {/* Address Step */}
            <div className={`bg-white border border-brand-border p-8 mb-6 ${step > 1 ? 'opacity-60 grayscale' : ''}`}>
               <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                 <h2 className="font-heading text-2xl flex items-center text-brand-dark">
                   <span className="w-8 h-8 rounded-none bg-brand-dark text-white flex items-center justify-center text-sm mr-4 font-body">1</span>
                   Shipping Address
                 </h2>
                 {step > 1 && <button onClick={() => setStep(1)} className="text-[10px] text-brand-dark font-body uppercase tracking-[0.2em] hover:text-brand-muted transition-colors">Edit</button>}
               </div>
               
               {step === 1 && (
                 <div>
                   {isLoading ? (
                     <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-dark" /></div>
                   ) : profile?.addresses?.length > 0 && !isAddingNew ? (
                     <div className="space-y-6">
                       <h3 className="font-body text-xs text-brand-muted mb-2 uppercase tracking-[0.2em]">Select Address</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {profile.addresses.map((addr: any) => (
                           <div 
                             key={addr._id}
                             onClick={() => setSelectedAddressId(addr._id)}
                             className={`p-6 border cursor-pointer transition-colors relative ${selectedAddressId === addr._id ? 'border-brand-dark bg-brand-light/50' : 'border-gray-200 hover:border-gray-300'}`}
                           >
                             {selectedAddressId === addr._id && (
                               <div className="absolute top-4 right-4 text-brand-dark">
                                 <Check size={18} />
                               </div>
                             )}
                             <p className="font-body text-sm font-semibold text-brand-dark mb-2 uppercase tracking-wide">{user?.firstName} {user?.lastName}</p>
                             <p className="font-body text-xs text-gray-600 mb-1">{addr.street}</p>
                             <p className="font-body text-xs text-gray-600 mb-1">{addr.city}, {addr.state} {addr.postalCode}</p>
                             <p className="font-body text-xs text-gray-600">{addr.country}</p>
                           </div>
                         ))}
                       </div>
                       <button 
                         onClick={() => setIsAddingNew(true)}
                         className="flex items-center text-xs font-body uppercase tracking-[0.2em] text-brand-dark hover:text-brand-muted transition-colors mt-6 border-b border-brand-dark pb-1"
                       >
                         <Plus size={14} className="mr-2" /> Add New Address
                       </button>
                       <button 
                         type="button" 
                         onClick={handleProceedToPayment}
                         disabled={!selectedAddressId}
                         className="w-full md:w-auto bg-[#111111] text-white px-[30px] py-[15px] font-body uppercase tracking-[1px] text-[11px] hover:bg-[#ffb6c1] transition-colors mt-8 disabled:opacity-50"
                       >
                         Deliver Here
                       </button>
                     </div>
                   ) : (
                     <form onSubmit={handleSubmit(onSubmitNewAddress)} className="space-y-6 font-body text-sm">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">First Name</label>
                            <input type="text" defaultValue={user?.firstName} className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark" readOnly />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Last Name</label>
                            <input type="text" defaultValue={user?.lastName} className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark" readOnly />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Street Address</label>
                          <input type="text" {...register('street')} className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark" />
                          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">City</label>
                            <input type="text" {...register('city')} className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark" />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">State</label>
                            <input type="text" {...register('state')} className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark" />
                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Postal Code</label>
                            <input type="text" {...register('postalCode')} className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark" />
                            {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-brand-muted mb-2 font-medium">Country</label>
                            <input type="text" {...register('country')} className="w-full border border-brand-border bg-brand-light/30 rounded-none p-3.5 focus:border-brand-dark focus:outline-none transition-colors text-sm text-brand-dark" />
                            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 mt-8">
                          <button 
                            type="submit"
                            className="bg-[#111111] text-white px-[30px] py-[15px] font-body uppercase tracking-[1px] text-[11px] hover:bg-[#ffb6c1] transition-colors"
                          >
                            Deliver Here
                          </button>
                          {profile?.addresses?.length > 0 && (
                            <button 
                              type="button" 
                              onClick={() => setIsAddingNew(false)}
                              className="text-xs font-body uppercase tracking-[0.2em] text-brand-muted hover:text-brand-dark transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                     </form>
                   )}
                 </div>
               )}
               {step > 1 && (
                 <div className="pl-12 font-body text-sm text-gray-600">
                   <p className="font-semibold text-brand-dark mb-1 uppercase tracking-wide">{user?.firstName} {user?.lastName}</p>
                   {getSelectedAddress() ? (
                     <>
                       <p>{getSelectedAddress()?.street}</p>
                       <p>{getSelectedAddress()?.city}, {getSelectedAddress()?.state} {getSelectedAddress()?.postalCode}</p>
                       <p>{getSelectedAddress()?.country}</p>
                     </>
                   ) : (
                     <p className="italic">New address selected</p>
                   )}
                 </div>
               )}
            </div>

            {/* Payment Step */}
            <div className={`bg-white border border-brand-border p-8 ${step < 2 ? 'opacity-50' : ''}`}>
               <h2 className="font-heading text-2xl flex items-center mb-8 border-b border-gray-100 pb-4 text-brand-dark">
                 <span className={`w-8 h-8 rounded-none flex items-center justify-center text-sm mr-4 font-body ${step === 2 ? 'bg-brand-dark text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
                 Payment Method
               </h2>

               {step === 2 && (
                 <div>
                    <div className="p-6 border border-brand-dark bg-brand-light mb-6">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="payment" defaultChecked className="mr-4 accent-brand-dark w-4 h-4" />
                        <span className="font-body font-medium text-brand-dark uppercase tracking-widest text-xs">Pay via Razorpay (Cards, UPI, NetBanking)</span>
                      </label>
                    </div>
                    <div className="p-6 border border-gray-200 mb-8 opacity-60">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="payment" disabled className="mr-4 w-4 h-4" />
                        <span className="font-body font-medium text-gray-500 uppercase tracking-widest text-xs">Cash on Delivery (Unavailable)</span>
                      </label>
                    </div>

                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-[#111111] text-white py-[15px] px-[30px] font-body uppercase tracking-[1px] text-[11px] hover:bg-[#ffb6c1] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isProcessing ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                      {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString()} Securely`}
                    </button>
                    <p className="text-center text-[10px] text-brand-muted font-body mt-6 uppercase tracking-widest">Safe and secure payments. 100% Authentic products.</p>
                 </div>
               )}
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white border border-brand-border p-8 sticky top-32">
              <h2 className="font-heading text-2xl mb-8 text-brand-dark border-b border-brand-border pb-4 uppercase tracking-wide">Order Summary</h2>
              
              <div className="space-y-6 mb-8 border-b border-brand-border pb-8">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-6">
                    <div className="w-20 h-24 border border-brand-border p-1 bg-brand-light flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-base mb-1 line-clamp-2 text-brand-dark pr-4">{item.name}</h3>
                      <p className="font-body text-[10px] text-brand-muted mb-2 uppercase tracking-widest">Qty: {item.qty}</p>
                      <p className="font-body text-sm font-semibold text-brand-dark">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 font-body text-sm text-gray-600 mb-8 border-b border-brand-border pb-8">
                <div className="flex justify-between">
                  <span className="uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-brand-dark">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-widest text-xs">Shipping</span>
                  <span className={isFreeShipping ? "text-brand-accent uppercase tracking-widest text-[10px]" : "text-brand-dark"}>
                    {isFreeShipping ? 'Complimentary' : `₹${shippingCost.toLocaleString()}`}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between font-heading text-2xl mb-2 text-brand-dark">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <p className="text-right text-[10px] font-body text-brand-muted uppercase tracking-widest">Including Taxes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
