import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Loader2, Clock, CheckCircle2, Truck } from 'lucide-react';
import AccountLayout from '../components/AccountLayout';
import api from '../api/axios';

const OrderHistoryPage = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/mine');
      return data;
    },
  });

  const getStatusConfig = (order: any) => {
    if (!order.isPaid) {
      return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'Pending Payment' };
    }
    if (order.isDelivered) {
      return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', text: 'Delivered' };
    }
    return { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', text: 'Processing' };
  };

  return (
    <AccountLayout title="Order History">
      {isLoading ? (
        <div className="flex justify-center items-center py-14">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-6 text-center font-body rounded-sm border border-red-100">
          Failed to load orders. Please try again.
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="bg-white p-16 text-center border border-gray-100 shadow-sm rounded-sm">
          <Package size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-heading text-brand-dark mb-2">No orders found</h3>
          <p className="font-body text-gray-500 mb-8">You haven't placed any orders yet.</p>
          <Link
            to="/shop"
            className="bg-brand-dark text-white px-8 py-3 font-button uppercase tracking-widest text-xs hover:bg-brand-primary transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => {
            const status = getStatusConfig(order);
            const StatusIcon = status.icon;

            return (
              <div key={order._id} className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 flex-grow">
                    <div>
                      <p className="text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1">Order Placed</p>
                      <p className="font-body text-sm font-medium text-brand-dark">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1">Total</p>
                      <p className="font-body text-sm font-medium text-brand-dark">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1">Ship To</p>
                      <p className="font-body text-sm font-medium text-brand-dark">{order.shippingAddress.city}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1">Order #</p>
                      <p className="font-body text-sm font-medium text-brand-dark truncate pr-4">{order._id}</p>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-200 md:border-none">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color} ${status.border}`}>
                      <StatusIcon size={14} className="mr-1.5" />
                      {status.text}
                    </div>
                    <Link
                      to={`/order/${order._id}`}
                      className="text-xs font-button uppercase tracking-widest text-brand-primary hover:text-brand-dark transition-colors inline-flex items-center"
                    >
                      View Details <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex overflow-x-auto space-x-4 pb-2 no-scrollbar">
                    {order.orderItems.map((item: any) => (
                      <div key={item._id} className="flex-none w-20 group relative">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                          <span className="text-white text-xs font-medium">x{item.qty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountLayout>
  );
};

export default OrderHistoryPage;
