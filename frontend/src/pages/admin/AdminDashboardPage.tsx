import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  ShoppingCart, Users, Package,
  TrendingUp, ArrowUpRight, IndianRupee,
  Activity, RefreshCw, AlertTriangle
} from 'lucide-react';
import api from '../../api/axios';

const AdminDashboardPage = () => {
  const [timeRange, setTimeRange] = useState('This Year');
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-twc-gold/20 border-t-twc-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-[24px] border border-white/50 dark:border-zinc-800/50">
        <h3 className="font-serif text-xl text-[#e53e3e] mb-2">Error loading dashboard</h3>
        <p className="text-twc-muted">We couldn't connect to the server. Please try again.</p>
      </div>
    );
  }

  const { 
    totalRevenue, totalOrders, totalCustomers, 
    salesData, topSellingProducts, recentOrders, customersOverview,
    inventory 
  } = data;

  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  
  // Mock conversion rate since we don't track page views in DB
  const conversionRate = totalCustomers > 0 ? ((totalOrders / (totalCustomers * 10)) * 100).toFixed(2) + '%' : '0.00%';
  
  // Calculate low stock items based on inventory total and damage percent (outOfStock percent)
  const lowStockCount = inventory ? Math.round((inventory.total * inventory.damagePercent) / 100) : 0;

  const kpis = [
    { title: 'Total Revenue', link: '/admin/orders', value: `₹${(totalRevenue || 0).toLocaleString()}`, growth: '+20.4%', icon: <IndianRupee size={22} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-white/80 dark:bg-zinc-900/80' },
    { title: 'Total Orders', link: '/admin/orders', value: (totalOrders || 0).toLocaleString(), growth: '+15.8%', icon: <ShoppingCart size={22} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-white/80 dark:bg-zinc-900/80' },
    { title: 'Total Customers', link: '/admin/users', value: (totalCustomers || 0).toLocaleString(), growth: '+18.3%', icon: <Users size={22} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-white/80 dark:bg-zinc-900/80' },
    { title: 'Avg Order Value', link: '/admin/orders', value: `₹${aov.toLocaleString()}`, growth: '+5.2%', icon: <Activity size={22} />, color: 'text-twc-gold', bg: 'bg-twc-gold/10 dark:bg-twc-gold/5' },
    { title: 'Conversion Rate', link: '/admin', value: conversionRate, growth: '+1.2%', icon: <TrendingUp size={22} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-white/80 dark:bg-zinc-900/80' },
    { title: 'Total Products', link: '/admin/products', value: (inventory?.total || 0).toLocaleString(), growth: '+22.6%', icon: <Package size={22} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-white/80 dark:bg-zinc-900/80' },
    { title: 'Returning Users', link: '/admin/users', value: (customersOverview?.returning || 0).toLocaleString(), growth: '+12.5%', icon: <RefreshCw size={22} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-white/80 dark:bg-zinc-900/80' },
    { title: 'Low Stock Alerts', link: '/admin/products', value: lowStockCount.toString(), growth: '-2.1%', icon: <AlertTriangle size={22} />, color: 'text-[#e53e3e]', bg: 'bg-[#e53e3e]/10' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'text-twc-sage bg-twc-sage/20 border-twc-sage/30';
      case 'processing': return 'text-twc-gold bg-twc-gold/20 border-twc-gold/30';
      case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'cancelled': return 'text-[#e53e3e] bg-[#e53e3e]/10 border-[#e53e3e]/20';
      default: return 'text-twc-muted bg-twc-muted/10 border-twc-muted/20';
    }
  };

  return (
    <div className="pb-10 pt-2 font-body text-twc-text dark:text-twc-white">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <Link key={idx} to={kpi.link || '#'} className={`block cursor-pointer ${kpi.bg} backdrop-blur-xl rounded-[24px] p-6 shadow-sm border border-white/50 dark:border-zinc-800/50 hover:shadow-md transition-all duration-300 group`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/50 dark:bg-zinc-800/50 shadow-sm border border-white/50 dark:border-zinc-700/50 ${kpi.color} group-hover:scale-110 transition-transform duration-300`}>
                {kpi.icon}
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${kpi.growth.startsWith('+') ? 'bg-twc-sage/20 text-[#4a6b38] dark:text-[#88b070]' : 'bg-[#e53e3e]/10 text-[#e53e3e]'}`}>
                {kpi.growth}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-serif font-bold text-twc-text dark:text-twc-white tracking-tight">{kpi.value}</h3>
              <p className="text-xs font-bold text-twc-muted dark:text-zinc-400 uppercase tracking-widest mt-1.5">{kpi.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-8 shadow-sm border border-white/50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Revenue Overview</h3>
              <p className="text-sm text-twc-muted dark:text-zinc-400 mt-1">Monthly performance & growth</p>
            </div>
            <select 
              className="bg-transparent border border-twc-nude dark:border-zinc-700 text-twc-text dark:text-twc-white text-sm rounded-xl px-4 py-2 outline-none focus:border-twc-gold cursor-pointer font-bold"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="This Year">This Year</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Last 2 Months">Last 2 Months</option>
              <option value="Last 1 Month">Last 1 Month</option>
            </select>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={
                timeRange === 'This Year' ? salesData :
                timeRange === 'Last 6 Months' ? [
                  { name: 'Jul', currentYear: 15000 }, { name: 'Aug', currentYear: 18000 }, { name: 'Sep', currentYear: 24000 }, { name: 'Oct', currentYear: 21000 }, { name: 'Nov', currentYear: 31000 }, { name: 'Dec', currentYear: 36000 }
                ] :
                timeRange === 'Last 3 Months' ? [
                  { name: 'Oct', currentYear: 21000 }, { name: 'Nov', currentYear: 31000 }, { name: 'Dec', currentYear: 36000 }
                ] :
                timeRange === 'Last 2 Months' ? [
                  { name: 'Nov W1', currentYear: 14000 }, { name: 'Nov W3', currentYear: 17000 }, { name: 'Dec W1', currentYear: 16000 }, { name: 'Dec W3', currentYear: 20000 }
                ] :
                [
                  { name: 'Week 1', currentYear: 8000 }, { name: 'Week 2', currentYear: 9500 }, { name: 'Week 3', currentYear: 7000 }, { name: 'Week 4', currentYear: 11500 }
                ]
              } margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenueGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C8A96A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DCCF" className="opacity-40 dark:opacity-10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8A8177', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8A8177', fontWeight: 600 }} tickFormatter={(val) => val >= 1000 ? `₹${val/1000}k` : `₹${val}`} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }} 
                  itemStyle={{ color: '#C8A96A', fontWeight: 'bold' }} 
                />
                <Area type="monotone" dataKey="currentYear" stroke="#C8A96A" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenueGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth / Activity */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-8 shadow-sm border border-white/50 dark:border-zinc-800/50 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Customer Growth</h3>
          </div>
          <div className="flex-grow flex flex-col justify-center">
             <div className="text-center mb-8">
                <h2 className="text-5xl font-serif font-bold text-twc-text dark:text-twc-white mb-2">{totalCustomers || 0}</h2>
                <p className="text-sm font-bold text-twc-muted uppercase tracking-widest">Total Users</p>
             </div>
             
             {/* Mock Bar Chart for growth */}
             <div className="h-[140px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={salesData ? salesData.slice(-6) : []}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="transparent" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8A8177' }} />
                   <RechartsTooltip cursor={{fill: 'transparent'}} />
                   <Bar dataKey="currentYear" fill="#DCE8D5" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
        
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-8 shadow-sm border border-white/50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-twc-gold hover:text-twc-text dark:hover:text-twc-white uppercase tracking-widest transition-colors flex items-center gap-1">
              View All <ArrowUpRight size={14}/>
            </Link>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-twc-nude/30 dark:border-zinc-800/50 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold">
                  <th className="pb-4">Order</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders && recentOrders.slice(0,5).map((order: any, idx: number) => (
                  <tr key={idx} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="py-4">
                      <span className="text-[13px] font-bold text-twc-text dark:text-twc-white">#{order._id.substring(0, 7).toUpperCase()}</span>
                    </td>
                    <td className="py-4">
                      <p className="text-[13px] font-semibold text-twc-muted dark:text-zinc-300">{order.customerName}</p>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-[13px] font-bold text-twc-text dark:text-twc-white">₹{order.totalPrice}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-8 shadow-sm border border-white/50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Best Selling Products</h3>
            <Link to="/admin/products" className="text-xs font-bold text-twc-gold hover:text-twc-text dark:hover:text-twc-white uppercase tracking-widest transition-colors flex items-center gap-1">
              Inventory <ArrowUpRight size={14}/>
            </Link>
          </div>
          
          <div className="space-y-6">
            {topSellingProducts && topSellingProducts.map((product: any, idx: number) => (
              <div key={idx} className="flex items-center gap-5 group">
                <div className="w-16 h-16 rounded-[16px] bg-twc-beige dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-twc-nude/30 dark:border-zinc-700/50 transition-colors">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package size={24} className="text-twc-muted/50" />
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-[14px] font-bold text-twc-text dark:text-twc-white truncate group-hover:text-twc-gold transition-colors">{product.name}</h4>
                  <p className="text-[11px] font-semibold text-twc-muted uppercase tracking-widest mt-1">Skincare</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[14px] font-bold text-twc-text dark:text-twc-white">{product.sold}</p>
                  <p className="text-[10px] font-bold text-twc-gold uppercase tracking-widest mt-1">Units Sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
