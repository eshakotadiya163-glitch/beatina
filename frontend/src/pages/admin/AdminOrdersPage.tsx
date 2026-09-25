import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Loader2, Eye, X, Download, Truck, Package, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

const AdminOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
    },
  });

  // Keep state in sync if URL changes
  useEffect(() => {
    const search = searchParams.get('search');
    if (search !== null && search !== searchTerm) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data } = await api.put(`/orders/${id}/status`, { status, comment: 'Updated by Admin' });
      return data;
    },
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      if (selectedOrder) {
        setSelectedOrder(null);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  });

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    const statuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex > -1 && currentIndex < statuses.length - 1) {
      updateStatusMutation.mutate({ id: orderId, status: statuses[currentIndex + 1] });
    }
  };

  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const handleGenerateInvoice = () => {
    toast.success('Preparing invoice for printing...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-8 font-body pb-14 pt-4">

      {/* Main Container */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col md:flex-row items-center gap-4 bg-white/40 dark:bg-zinc-900/40">
          <div className="relative w-full md:w-96 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-twc-muted dark:text-zinc-500 group-focus-within:text-twc-gold transition-colors z-10 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by ID or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-white/50 dark:border-zinc-800/50 rounded-[18px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/70 focus:outline-none focus:border-twc-gold focus:ring-4 focus:ring-twc-gold/10 transition-all shadow-sm"
            />
          </div>
          <div className="w-full md:w-auto relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white pl-6 pr-10 py-3 rounded-[18px] text-[12px] font-bold uppercase tracking-widest focus:outline-none focus:border-twc-gold transition-colors cursor-pointer shadow-sm w-full md:w-48"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-twc-muted pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-twc-beige/30 dark:bg-zinc-800/30 text-twc-muted dark:text-zinc-400 uppercase text-[10px] tracking-widest border-b border-twc-nude/30 dark:border-zinc-700/50">
              <tr>
                <th className="p-5 font-bold">Order ID</th>
                <th className="p-5 font-bold">Date</th>
                <th className="p-5 font-bold">Customer</th>
                <th className="p-5 font-bold">Total</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-twc-nude/20 dark:divide-zinc-800/30">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-twc-gold mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-twc-muted dark:text-zinc-500 font-body">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-white/40 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-5">
                      <span className="font-bold text-twc-text dark:text-twc-white">#{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                    </td>
                    <td className="p-5 text-[13px] text-twc-muted dark:text-zinc-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-twc-text dark:text-twc-white">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-[11px] text-twc-muted dark:text-zinc-500 mt-0.5">{order.user?.email}</p>
                    </td>
                    <td className="p-5 font-bold text-twc-text dark:text-twc-white">
                      ₹{order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${
                        order.status === 'Delivered' ? 'bg-twc-sage/20 text-[#4a6b38]' :
                        order.status === 'Processing' ? 'bg-blue-500/10 text-blue-600' :
                        order.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-600' :
                        order.status === 'Pending' ? 'bg-twc-gold/20 text-twc-gold' :
                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-600' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-twc-muted hover:text-twc-gold bg-transparent hover:bg-twc-gold/10 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white dark:bg-zinc-900 rounded-[24px] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-twc-nude/50 dark:border-zinc-800 printable-modal">
            {/* Header */}
            <div className="px-8 py-5 border-b border-twc-nude/30 dark:border-zinc-800 flex justify-between items-center bg-twc-beige/20 dark:bg-zinc-800/20">
              <div>
                <h2 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Order #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}</h2>
                <p className="text-[11px] text-twc-muted font-bold tracking-widest uppercase mt-1">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-twc-muted hover:text-twc-text dark:hover:text-twc-white transition-colors bg-white dark:bg-zinc-800 rounded-full shadow-sm border border-twc-nude/50 dark:border-zinc-700 no-print">
                <X size={18} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-8 overflow-y-auto flex-1 font-body bg-white dark:bg-zinc-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-twc-muted mb-3">Customer Information</h3>
                    <div className="bg-twc-beige/30 dark:bg-zinc-800/30 p-4 rounded-2xl border border-twc-nude/30 dark:border-zinc-700/50">
                      <p className="font-bold text-twc-text dark:text-twc-white text-sm">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                      <p className="text-xs text-twc-muted mt-1">{selectedOrder.user?.email}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-twc-muted mb-3">Shipping Address</h3>
                    <div className="bg-twc-beige/30 dark:bg-zinc-800/30 p-4 rounded-2xl border border-twc-nude/30 dark:border-zinc-700/50 text-sm text-twc-text dark:text-zinc-300">
                      <p>{selectedOrder.shippingAddress?.street}</p>
                      <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                      <p>{selectedOrder.shippingAddress?.postalCode}, {selectedOrder.shippingAddress?.country}</p>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Status */}
                <div className="no-print">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-twc-muted mb-3">Fulfillment Status</h3>
                  <div className="bg-twc-beige/30 dark:bg-zinc-800/30 p-5 rounded-2xl border border-twc-nude/30 dark:border-zinc-700/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-twc-gold/20 flex items-center justify-center text-twc-gold">
                         <Package size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-twc-muted">Current Status</p>
                        <p className="font-bold text-twc-text dark:text-twc-white text-base">{selectedOrder.status}</p>
                      </div>
                    </div>
                    
                    {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                      <button 
                        onClick={() => handleStatusChange(selectedOrder._id, selectedOrder.status)}
                        disabled={updateStatusMutation.isPending}
                        className="w-full flex items-center justify-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md disabled:opacity-50"
                      >
                        {updateStatusMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                        Advance Status to Next Step
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-8">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-twc-muted mb-3">Order Items</h3>
                <div className="border border-twc-nude/30 dark:border-zinc-700/50 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-twc-beige/30 dark:bg-zinc-800/30 text-twc-muted dark:text-zinc-400">
                      <tr>
                        <th className="p-3 font-medium">Item</th>
                        <th className="p-3 font-medium">Qty</th>
                        <th className="p-3 font-medium text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-twc-nude/20 dark:divide-zinc-700/50">
                      {selectedOrder.orderItems?.map((item: any) => (
                        <tr key={item._id} className="dark:bg-zinc-800/10">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                              <span className="font-medium text-twc-text dark:text-twc-white">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-twc-muted">{item.qty}</td>
                          <td className="p-3 text-right font-medium text-twc-text dark:text-twc-white">₹{item.price?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-twc-beige/10 dark:bg-zinc-800/50 border-t border-twc-nude/30 dark:border-zinc-700/50">
                      <tr>
                        <td colSpan={2} className="p-3 text-right text-[11px] font-bold uppercase tracking-widest text-twc-muted">Subtotal</td>
                        <td className="p-3 text-right font-bold text-twc-text dark:text-twc-white">₹{selectedOrder.itemsPrice?.toFixed(2) || 0}</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="p-3 text-right text-[11px] font-bold uppercase tracking-widest text-twc-muted">Shipping</td>
                        <td className="p-3 text-right font-bold text-twc-text dark:text-twc-white">₹{selectedOrder.shippingPrice?.toFixed(2) || 0}</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="p-3 text-right text-[11px] font-bold uppercase tracking-widest text-twc-muted">Tax</td>
                        <td className="p-3 text-right font-bold text-twc-text dark:text-twc-white">₹{selectedOrder.taxPrice?.toFixed(2) || 0}</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="p-3 text-right text-[12px] font-bold uppercase tracking-widest text-twc-gold">Total</td>
                        <td className="p-3 text-right font-bold text-xl text-twc-gold">₹{selectedOrder.totalPrice?.toFixed(2) || 0}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-twc-nude/30 dark:border-zinc-800 bg-twc-beige/20 dark:bg-zinc-800/20 flex justify-end gap-3 no-print">
              <button 
                onClick={handleGenerateInvoice}
                className="flex items-center gap-2 bg-white dark:bg-zinc-800 text-twc-text dark:text-twc-white px-5 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-beige dark:hover:bg-zinc-700 transition-colors border border-twc-nude/50 dark:border-zinc-700 shadow-sm"
              >
                <Download size={14} /> Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
