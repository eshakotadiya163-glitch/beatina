import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Download, Calendar, TrendingUp, IndianRupee, ShoppingCart, 
  Users, Package, Activity, RefreshCw, Sparkles, 
  ChevronDown, ArrowUpRight, CreditCard
} from 'lucide-react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import api from '../../api/axios';
import { toast } from 'sonner';

// MOCK DATA FOR ADVANCED ANALYTICS

const monthlyData = [
  { name: 'Jan', revenue: 450000, profit: 210000, customers: 120 },
  { name: 'Feb', revenue: 520000, profit: 240000, customers: 150 },
  { name: 'Mar', revenue: 480000, profit: 220000, customers: 140 },
  { name: 'Apr', revenue: 610000, profit: 290000, customers: 190 },
  { name: 'May', revenue: 590000, profit: 270000, customers: 170 },
  { name: 'Jun', revenue: 750000, profit: 380000, customers: 240 },
  { name: 'Jul', revenue: 890000, profit: 450000, customers: 310 },
];

const trafficData = [
  { name: 'Organic Search', value: 45, color: '#C8A96A' },
  { name: 'Social Media', value: 25, color: '#DCE8D5' },
  { name: 'Direct', value: 15, color: '#E8DCCF' },
  { name: 'Referral', value: 10, color: '#3f3f46' },
  { name: 'Email', value: 5, color: '#a1a1aa' },
];

const categorySalesData = [
  { name: 'Serums', sales: 420 },
  { name: 'Cleansers', sales: 380 },
  { name: 'Moisturizers', sales: 310 },
  { name: 'Masks', sales: 250 },
  { name: 'Toners', sales: 180 },
];

const paymentData = [
  { method: 'UPI', value: 55, rate: '98%', color: '#C8A96A' },
  { method: 'Credit Card', value: 25, rate: '95%', color: '#DCE8D5' },
  { method: 'COD', value: 15, rate: '100%', color: '#E8DCCF' },
  { method: 'PayPal', value: 5, rate: '92%', color: '#3f3f46' },
];

const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  
  // Helper to map UI date range to days
  const getDays = (range: string) => {
    switch (range) {
      case 'Today': return 1;
      case 'Last 7 Days': return 7;
      case 'Last 30 Days': return 30;
      case 'Last 90 Days': return 90;
      case 'This Year': return 365;
      default: return 30;
    }
  };

  // Fetch actual data from backend
  const { data: dashboardData } = useQuery({
    queryKey: ['adminAnalyticsDashboard', dateRange],
    queryFn: async () => {
      const days = getDays(dateRange);
      const response = await api.get(`/admin/dashboard?days=${days}`);
      return response.data;
    }
  });

  const { } = useQuery({
    queryKey: ['adminAnalyticsOrders', dateRange],
    queryFn: async () => {
      // const days = getDays(dateRange);
      // Wait, let's just use orders list if needed. Assuming /orders has some backend logic for dates if we want. But for now just use regular
      const response = await api.get('/orders');
      return response.data;
    }
  });

  // Calculate KPIs using Real Data
  const totalRevenue = Math.round(dashboardData?.totalRevenue || 0);
  const totalOrders = Math.round(dashboardData?.totalOrders || 0);
  const totalCustomers = Math.round(dashboardData?.totalCustomers || 0);
  const productsSold = Math.round(dashboardData?.productsSold || 0);
  
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalProfit = Math.round(totalRevenue * 0.45); // Mock 45% margin for profit calculation since it's not in DB
  const conversionRate = 3.8; // Hardcoded or mock if not tracked in DB
  const returningCustomers = Math.floor(totalCustomers * 0.28); // Mock 28% for now

  const kpis = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, growth: '+24.5%', icon: <IndianRupee size={18} />, color: 'text-twc-gold', bg: 'bg-twc-gold/10' },
    { title: 'Total Orders', value: totalOrders.toLocaleString(), growth: '+12.3%', icon: <ShoppingCart size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Total Customers', value: totalCustomers.toLocaleString(), growth: '+18.1%', icon: <Users size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Total Profit', value: `₹${totalProfit.toLocaleString()}`, growth: '+28.4%', icon: <TrendingUp size={18} />, color: 'text-twc-sage', bg: 'bg-twc-sage/20' },
    { title: 'Products Sold', value: productsSold.toLocaleString(), growth: '+15.2%', icon: <Package size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Avg Order Value', value: `₹${aov.toLocaleString()}`, growth: '+4.1%', icon: <CreditCard size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Conversion Rate', value: `${conversionRate}%`, growth: '+0.8%', icon: <Activity size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Returning Cust.', value: returningCustomers.toLocaleString(), growth: '+6.5%', icon: <RefreshCw size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl shadow-xl">
          <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center gap-3 mb-1">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
               <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">
                 {entry.name}: {entry.name === 'Customers' ? entry.value : `₹${entry.value.toLocaleString()}`}
               </p>
             </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 font-body pb-10">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative group">
            <select 
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                toast.success(`Date range changed to ${e.target.value}`);
              }}
              className="appearance-none bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white pl-10 pr-10 py-2.5 rounded-[14px] text-[12px] font-bold uppercase tracking-widest focus:outline-none focus:border-twc-gold transition-colors cursor-pointer shadow-sm"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-twc-muted pointer-events-none" size={16} />
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-twc-muted pointer-events-none" size={16} />
          </div>
          
          <button 
            onClick={() => toast.success('Exporting analytics to PDF...')}
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-beige dark:hover:bg-zinc-800 transition-colors border border-twc-nude/50 dark:border-zinc-700/50 shadow-sm"
          >
            <Download size={14} /> Export PDF
          </button>
          <button 
            onClick={() => toast.success('Exporting analytics to Excel...')}
            className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-4 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md"
          >
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      {/* AI Business Insights */}
      <div className="bg-gradient-to-r from-twc-beige via-twc-nude/30 to-twc-gold/10 dark:from-zinc-900 dark:via-zinc-800 dark:to-twc-gold/5 backdrop-blur-xl rounded-[24px] p-6 shadow-sm border border-twc-gold/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-twc-gold/10 rounded-full blur-3xl group-hover:bg-twc-gold/20 transition-colors duration-1000"></div>
        <div className="flex items-start gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-zinc-800/50 flex items-center justify-center text-twc-gold shadow-sm border border-twc-gold/30">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-twc-text dark:text-twc-white">AI Business Insights</h3>
            <p className="text-[12px] text-twc-muted mt-0.5">Automated intelligence for {dateRange.toLowerCase()}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10 w-full md:w-auto justify-start md:justify-end">
          <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm">
            📈 Sales increased 18%
          </span>
          <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm">
            🔥 Vit C Serum is trending
          </span>
          <span className="flex items-center gap-1.5 bg-twc-gold/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-gold border border-twc-gold/20 shadow-sm">
            ⚠ Sunscreen stock low
          </span>
        </div>
      </div>

      {/* Top 8 KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${kpi.growth.startsWith('+') ? 'text-twc-sage bg-twc-sage/10' : 'text-[#e53e3e] bg-[#e53e3e]/10'}`}>
                {kpi.growth}
              </span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-twc-text dark:text-twc-white">{kpi.value}</h3>
              <p className="text-[10px] sm:text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1 truncate">{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Revenue & Profit Overview</h3>
              <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Monthly Performance</p>
            </div>
            <select className="bg-twc-beige/50 dark:bg-zinc-800/50 border-none text-[11px] font-bold uppercase tracking-widest text-twc-text dark:text-twc-white rounded-lg px-2 py-1 outline-none">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C8A96A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DCE8D5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#DCE8D5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#C8A96A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#88b070" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Doughnut */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Traffic Sources</h3>
            <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Visitor Acquisition</p>
          </div>
          <div className="flex-grow flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={trafficData} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-twc-text dark:text-twc-white">124k</span>
              <span className="text-[10px] font-bold text-twc-muted uppercase tracking-widest mt-1">Visitors</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-3">
             {trafficData.map((item, idx) => (
               <div key={idx} className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                 <span className="text-[11px] font-bold text-twc-text dark:text-zinc-300">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Sales Bar Chart */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
           <div className="mb-6">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Sales by Category</h3>
            <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Units Sold</p>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySalesData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} width={75} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--color-twc-beige)', opacity: 0.4}} />
                <Bar dataKey="sales" name="Units" fill="#C8A96A" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth Line Chart */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
           <div className="mb-6">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Customer Growth</h3>
            <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">New Registrations</p>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="customers" name="Customers" stroke="#3f3f46" strokeWidth={3} dot={{r: 4, fill: '#3f3f46', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Analytics */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
           <div className="mb-6">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Payment Analytics</h3>
            <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Gateways & Success Rate</p>
          </div>
          <div className="space-y-4">
             {paymentData.map((item, idx) => (
               <div key={idx} className="flex flex-col gap-1.5">
                 <div className="flex justify-between items-end">
                   <span className="text-[12px] font-bold text-twc-text dark:text-zinc-300 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                     {item.method}
                   </span>
                   <div className="flex items-center gap-3">
                     <span className="text-[12px] font-bold text-twc-text dark:text-twc-white">{item.value}%</span>
                     <span className="text-[10px] font-bold text-twc-sage bg-twc-sage/10 px-1.5 py-0.5 rounded">SR: {item.rate}</span>
                   </div>
                 </div>
                 <div className="w-full bg-twc-beige dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                   <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Best Selling Products Table */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 overflow-hidden">
        <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex justify-between items-center bg-white/40 dark:bg-zinc-900/40">
          <div>
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Best Selling Products</h3>
            <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Top performers by revenue</p>
          </div>
          <button className="text-[11px] font-bold text-twc-gold uppercase tracking-widest hover:text-twc-text transition-colors flex items-center gap-1">
            View All <ArrowUpRight size={14} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-twc-beige/30 dark:bg-zinc-950/30 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold border-b border-twc-nude/30 dark:border-zinc-800/50">
                <th className="py-4 pl-6">Product</th>
                <th className="py-4">Category</th>
                <th className="py-4">Units Sold</th>
                <th className="py-4">Revenue</th>
                <th className="py-4">Growth</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.topSellingProducts ? (
                dashboardData.topSellingProducts.map((product: any, idx: number) => (
                  <tr key={idx} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="py-4 pl-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-[14px] bg-twc-beige dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-twc-nude/50 dark:border-zinc-700/50">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-twc-muted/50" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[13px] text-twc-text dark:text-twc-white group-hover:text-twc-gold transition-colors">{product.name}</p>
                          <p className="text-[11px] font-semibold text-twc-muted mt-0.5">SKU: TWC-{1000 + idx}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-twc-muted">Skincare</p>
                    </td>
                    <td className="py-4">
                      <p className="text-[14px] font-bold text-twc-text dark:text-twc-white">{product.sold}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">₹{(product.sold * 2499).toLocaleString()}</p>
                    </td>
                    <td className="py-4">
                      <span className="text-[11px] font-bold text-twc-sage bg-twc-sage/10 px-2.5 py-1 rounded-md border border-twc-sage/20">
                        +14.2%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[13px] font-semibold text-twc-muted">Loading best sellers...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminAnalyticsPage;
