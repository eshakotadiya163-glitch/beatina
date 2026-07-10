import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Loader2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data } = await api.put(`/orders/${id}/status`, { status, comment: 'Updated by Admin' });
      return data;
    },
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  });

  const handleStatusChange = (orderId: string, currentStatus: string) => {
    // Simple state machine for demo
    const statuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex > -1 && currentIndex < statuses.length - 1) {
      updateStatusMutation.mutate({ id: orderId, status: statuses[currentIndex + 1] });
    }
  };

  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading text-brand-dark">Orders</h1>
          <p className="text-sm text-gray-500 font-body mt-1">Manage and track customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center gap-4 bg-gray-50/50">
          <div className="relative w-full max-w-sm flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ID or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-sm focus:border-brand-primary focus:outline-none font-body"
            />
          </div>
          <div className="w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 py-2 px-3 text-sm border border-gray-200 rounded-sm focus:border-brand-primary focus:outline-none font-body bg-white text-gray-600"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-body border border-dashed border-gray-200 mx-4 my-8 rounded-sm">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-medium text-brand-primary">#{order._id.substring(order._id.length - 6)}</span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-brand-dark">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="p-4 font-medium text-brand-dark">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-sm text-[10px] uppercase font-button tracking-widest ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button 
                          onClick={() => handleStatusChange(order._id, order.status)}
                          disabled={updateStatusMutation.isPending}
                          className="text-xs font-button uppercase tracking-widest text-brand-primary hover:text-brand-dark transition-colors mr-4"
                        >
                          Advance Status
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-brand-dark transition-colors" title="View Details">
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
    </div>
  );
};

export default AdminOrdersPage;
