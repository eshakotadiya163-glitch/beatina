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
  const [newAddressData, setNewAddressData] = useState<AddressFormValues | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const { user } = useAuthStore();
  const { cartItems, clearCart } = useCartStore();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data;
    },
    enabled: !!user,
  });

  const { data: myOrders } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/mine');
      return data;
    },
    enabled: !!user,
  });

  const getSelectedAddress = () => {
    if (newAddressData) {
      return newAddressData;
    }
    return profile?.addresses?.find((a: any) => a._id === selectedAddressId);
  };

  const selectedAddr = getSelectedAddress();
  const stateStr = selectedAddr?.state?.toLowerCase() || '';

  // Ensure myOrders is loaded before assuming it's the first order, 
  // but default to false if not logged in to be safe
  const isFirstOrder = myOrders ? myOrders.length === 0 : false;
  
  let shippingCost = 100; // Default to moderate
  
  if (isFirstOrder) {
    shippingCost = 0;
  } else if (stateStr) {
    const nearStates = ['gujarat', 'maharashtra', 'rajasthan', 'madhya pradesh'];
    const farStates = ['jammu', 'kashmir', 'assam', 'meghalaya', 'nagaland', 'manipur', 'mizoram', 'tripura', 'arunachal', 'sikkim', 'kerala', 'tamil nadu'];
    
    if (nearStates.some(s => stateStr.includes(s))) {
      shippingCost = 50;
    } else if (farStates.some(s => stateStr.includes(s))) {
      shippingCost = 150;
    }
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal + shippingCost;



  useEffect(() => {
    if (profile?.addresses?.length > 0 && !selectedAddressId) {
      const defaultAddr = profile.addresses.find((a: any) => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr._id : profile.addresses[0]._id);
    }
  }, [profile, selectedAddressId]);

  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmitNewAddress = async (data: AddressFormValues) => {
    setNewAddressData(data);
    setStep(2);
  };

  const handleProceedToPayment = () => {
    if (!isAddingNew && !selectedAddressId) return;
    setStep(2);
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
      
      if (paymentMethod === 'COD') {
        const orderPayload = {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: getSelectedAddress(),
          paymentMethod: 'COD',
          itemsPrice: subtotal,
          shippingPrice: shippingCost,
          totalPrice: total,
          isPaid: false, // COD is unpaid until delivery
        };

        const { data: finalOrder } = await api.post('/orders', orderPayload);
        clearCart();
        setPlacedOrderId(finalOrder._id);
        setShowSuccessPopup(true);
        return;
      }

      // Razorpay Flow
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
            setPlacedOrderId(finalOrder._id);
            setShowSuccessPopup(true);
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
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Something went wrong during order initialization.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !showSuccessPopup) {
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
    <>
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center max-w-[380px] w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* The Custom SVG Illustration */}
            <div className="relative mb-4 mt-2">
              {/* Sparkles / Stars */}
              <div className="absolute top-4 -left-6 w-2.5 h-2.5 bg-green-400 rounded-full" />
              <div className="absolute top-10 -right-6 w-2 h-2 bg-green-400 rounded-full" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-400 rounded-full" />
              <div className="absolute bottom-6 -left-8 text-green-500 scale-75">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              </div>
              <div className="absolute bottom-12 -right-8 text-green-500 scale-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              </div>

              {/* Shopping Bag SVG */}
              <svg width="140" height="150" viewBox="0 0 140 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Back handle */}
                <path d="M50 45V20C50 11.7157 56.7157 5 65 5H75C83.2843 5 90 11.7157 90 20V45" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
                
                {/* Bag shadow/side */}
                <path d="M30 40L35 140H115L120 40H30Z" fill="#3b82f6" />
                <path d="M120 45L125 130L115 140H120L130 40H120Z" fill="#2563eb" />
                
                {/* Front handle */}
                <path d="M40 45V30C40 18.9543 48.9543 10 60 10H80C91.0457 10 100 18.9543 100 30V45" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />

                {/* Bag Front panel */}
                <path d="M20 45L25 145H105L110 45H20Z" fill="#60a5fa" />
                
                {/* White Circle */}
                <circle cx="65" cy="95" r="32" fill="white" />
                
                {/* Green Checkmark */}
                <path d="M48 95L58 105L82 81" stroke="#4ade80" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              
              {/* Bag shadow on floor */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/10 rounded-[100%] blur-sm"></div>
            </div>
            
            <h2 className="text-[28px] font-extrabold text-black mb-3 text-center tracking-tight" style={{ fontFamily: 'sans-serif' }}>
              Order Placed
            </h2>
            
            <p className="text-[15px] text-gray-500 font-medium text-center mb-8 leading-[1.4]" style={{ fontFamily: 'sans-serif' }}>
              Your order has been placed<br/>successfully.
            </p>
            
            <button 
              onClick={() => navigate(`/order/${placedOrderId}`)}
              className="w-full bg-gradient-to-b from-[#5c8aff] to-[#3a6bf5] text-white font-semibold py-3.5 rounded-[12px] hover:brightness-110 transition-all shadow-[0_4px_14px_0_rgba(58,107,245,0.39)] text-[17px]"
              style={{ fontFamily: 'sans-serif' }}
            >
              View Order
            </button>
          </div>
        </div>
      )}
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
                              onClick={() => { setIsAddingNew(false); setNewAddressData(null); }}
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
                    <div className={`p-6 border ${paymentMethod === 'Razorpay' ? 'border-brand-dark bg-brand-light' : 'border-gray-200'} mb-4 transition-colors`}>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="payment" checked={paymentMethod === 'Razorpay'} onChange={() => setPaymentMethod('Razorpay')} className="mr-4 accent-brand-dark w-4 h-4" />
                        <span className="font-body font-medium text-brand-dark uppercase tracking-widest text-xs">Pay via Razorpay (Cards, UPI, NetBanking)</span>
                      </label>
                    </div>
                    <div className={`p-6 border ${paymentMethod === 'COD' ? 'border-brand-dark bg-brand-light' : 'border-gray-200'} mb-8 transition-colors`}>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="mr-4 accent-brand-dark w-4 h-4" />
                        <span className="font-body font-medium text-brand-dark uppercase tracking-widest text-xs">Cash on Delivery</span>
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
                  <div className="text-right">
                    <span className={shippingCost === 0 ? "text-brand-accent uppercase tracking-widest text-[10px]" : "text-brand-dark"}>
                      {shippingCost === 0 ? 'Complimentary' : `₹${shippingCost.toLocaleString()}`}
                    </span>
                    {shippingCost === 0 && <p className="text-[9px] text-brand-muted mt-1 uppercase tracking-widest">First Order Free!</p>}
                    {shippingCost > 0 && <p className="text-[9px] text-brand-muted mt-1 uppercase tracking-widest">Area-based Charge</p>}
                  </div>
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
    </>
  );
};

export default CheckoutPage;
