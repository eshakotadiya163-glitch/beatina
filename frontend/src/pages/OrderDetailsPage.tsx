import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Download, ChevronLeft, MapPin, CreditCard, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import AccountLayout from '../components/AccountLayout';
import api from '../api/axios';

const OrderDetailsPage = () => {
  const { id } = useParams();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <AccountLayout title="Order Details">
        <div className="flex justify-center items-center py-14">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      </AccountLayout>
    );
  }

  if (error || !order) {
    return (
      <AccountLayout title="Order Details">
        <div className="bg-red-50 text-red-500 p-6 text-center font-body rounded-sm border border-red-100">
          Failed to load order details.
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title={`Order #${order._id}`}>
      <div className="mb-6 flex justify-between items-center">
        <Link to="/orders" className="text-xs font-button uppercase tracking-widest text-gray-500 hover:text-brand-primary transition-colors flex items-center">
          <ChevronLeft size={14} className="mr-1" /> Back to Orders
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-white border border-gray-200 text-brand-dark px-4 py-2 font-button uppercase tracking-widest text-xs hover:border-brand-primary hover:text-brand-primary transition-colors flex items-center shadow-sm"
        >
          <Download size={14} className="mr-2" /> Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Tracking & Items */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order Status Tracking */}
          <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm rounded-sm">
            <h2 className="text-lg font-heading text-brand-dark mb-8">Order Status</h2>
            
            <div className="relative">
              <div className="absolute left-[15px] md:left-8 top-0 bottom-0 w-0.5 bg-gray-100"></div>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading text-brand-dark text-base">Order Placed</h3>
                    <p className="font-body text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6">
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading text-brand-dark text-base">Payment Confirmed</h3>
                    {order.isPaid ? (
                      <p className="font-body text-sm text-gray-500">{new Date(order.paidAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    ) : (
                      <p className="font-body text-sm text-yellow-600">Pending Payment</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6">
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${order.isDelivered ? 'bg-green-100 text-green-600' : (order.isPaid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400')}`}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading text-brand-dark text-base">Processing & Shipped</h3>
                    {order.isDelivered ? (
                      <p className="font-body text-sm text-gray-500">Shipped successfully</p>
                    ) : order.isPaid ? (
                      <p className="font-body text-sm text-blue-600">Currently processing your items</p>
                    ) : (
                      <p className="font-body text-sm text-gray-400">Waiting for payment</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6">
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${order.isDelivered ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading text-brand-dark text-base">Delivered</h3>
                    {order.isDelivered ? (
                      <p className="font-body text-sm text-gray-500">{new Date(order.deliveredAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    ) : (
                      <p className="font-body text-sm text-gray-400">Estimated delivery within 3-5 business days</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm rounded-sm">
            <h2 className="text-lg font-heading text-brand-dark mb-6">Items Ordered ({order.orderItems.length})</h2>
            <div className="space-y-6">
              {order.orderItems.map((item: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="w-20 md:w-24 aspect-[3/4] bg-gray-50 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <Link to={`/product/${item.product}`} className="font-heading text-brand-dark hover:text-brand-primary transition-colors text-sm md:text-base line-clamp-2 mb-1">
                      {item.name}
                    </Link>
                    <p className="font-body text-gray-500 text-xs md:text-sm">Qty: {item.qty}</p>
                    <p className="font-body font-medium text-brand-dark mt-2">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Info */}
        <div className="space-y-8">
          
          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h2 className="text-lg font-heading text-brand-dark mb-6">Order Summary</h2>
            <div className="space-y-3 font-body text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{order.taxPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between font-heading font-semibold text-brand-dark text-lg">
                <span>Total</span>
                <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            {!order.isPaid && (
               <div className="bg-yellow-50 text-yellow-700 p-4 rounded-sm text-sm font-body border border-yellow-100 text-center">
                  Payment is pending for this order.
               </div>
            )}
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h2 className="text-lg font-heading text-brand-dark mb-6">Shipping Address</h2>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-gray-400 shrink-0 mt-0.5" />
              <div className="font-body text-sm text-gray-600 space-y-1">
                <p className="font-medium text-brand-dark">{order.user.firstName} {order.user.lastName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h2 className="text-lg font-heading text-brand-dark mb-6">Payment Method</h2>
            <div className="flex items-start gap-3">
              <CreditCard size={20} className="text-gray-400 shrink-0 mt-0.5" />
              <div className="font-body text-sm text-gray-600">
                <p className="font-medium text-brand-dark">{order.paymentMethod}</p>
                <p className="mt-1">{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not paid yet'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AccountLayout>
  );
};

export default OrderDetailsPage;
