import { useQuery } from '@tanstack/react-query';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const COLORS = ['#2C3E50', '#E74C3C', '#F39C12', '#27AE60', '#8E44AD', '#3498DB'];

const AdminDashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  const { summary, salesData, categoryData, recentOrders, lowStockProducts } = data;

  const stats = [
    { title: 'Total Revenue', value: `₹${summary.totalSales.toLocaleString()}`, icon: <DollarSign size={24} />, trend: '+12.5%' },
    { title: 'Total Orders', value: summary.totalOrders.toLocaleString(), icon: <ShoppingBag size={24} />, trend: '+5.2%' },
    { title: 'Total Customers', value: summary.totalUsers.toLocaleString(), icon: <Users size={24} />, trend: '+18.1%' },
    { title: 'Total Products', value: summary.totalProducts.toLocaleString(), icon: <Package size={24} />, trend: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading text-brand-dark">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 font-body mt-1">Here is what's happening with your store today.</p>
        </div>
        <button className="flex items-center space-x-2 bg-brand-primary text-white px-4 py-2 text-sm font-button uppercase tracking-widest rounded-sm hover:bg-brand-dark transition-colors">
          <TrendingUp size={16} />
          <span>Download Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 font-button uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-2xl font-heading text-brand-dark">{stat.value}</h3>
              <p className="text-xs text-green-600 font-body font-medium mt-2">{stat.trend} from last month</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-full text-brand-primary">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <h3 className="text-sm font-heading font-semibold text-brand-dark mb-6">Revenue Analytics (Last 30 Days)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C3E50" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2C3E50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(val) => `₹${val}`} />
                <CartesianGrid vertical={false} stroke="#F3F4F6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '2px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#2C3E50" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <h3 className="text-sm font-heading font-semibold text-brand-dark mb-6">Sales by Category</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [value, 'Products']} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'inherit' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-heading font-semibold text-brand-dark">Recent Orders</h3>
            <button className="text-xs font-button uppercase text-brand-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-brand-primary font-medium">#{order._id.substring(order._id.length - 6)}</td>
                    <td className="p-4">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-sm text-[10px] uppercase font-button tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium">₹{order.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-heading font-semibold text-brand-dark">Low Stock Alerts</h3>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product: any) => (
              <div key={product._id} className="flex items-center p-3 border border-red-100 bg-red-50/30 rounded-sm">
                <img src={product.images[0]?.url || '/assets/migrated/9_b17_540x_aa6b96c0-cd33-460e-8da7-208e8c30f82e.webp'} alt={product.name} className="w-10 h-12 object-cover mr-3 bg-white" />
                <div className="flex-1">
                  <h4 className="text-sm font-heading line-clamp-1">{product.name}</h4>
                  <p className="text-xs font-body text-red-600 font-medium">{product.countInStock} items left</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="text-center p-6 text-gray-500 font-body text-sm border border-dashed border-gray-200 rounded-sm">
                All products have sufficient stock.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
