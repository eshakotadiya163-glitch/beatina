import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, Filter, Download, Plus, AlertCircle, TrendingUp, 
  Package, Boxes, DollarSign, IndianRupee, ArrowUpRight, Activity, MapPin, 
  History, Clock, CheckCircle2, AlertTriangle, ArrowRight, Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import api from '../../api/axios';
import { Input } from '../../components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../../components/ui/table';
import { toast } from 'sonner';

// Mock Data for Analytics & Timeline
const mockInventoryHistory = [
  { name: 'Jan', value: 125000 },
  { name: 'Feb', value: 142000 },
  { name: 'Mar', value: 135000 },
  { name: 'Apr', value: 158000 },
  { name: 'May', value: 149000 },
  { name: 'Jun', value: 184000 },
  { name: 'Jul', value: 192000 },
];

const mockActivity = [
  { id: 1, action: 'Restocked', item: 'ACNE Spot Roll-On', qty: '+500', time: '2 hours ago', type: 'positive' },
  { id: 2, action: 'Low Stock Alert', item: 'Vitamin C Serum', qty: '12 left', time: '5 hours ago', type: 'warning' },
  { id: 3, action: 'New Product Added', item: 'Hydrating Night Cream', qty: '+100', time: 'Yesterday', type: 'neutral' },
  { id: 4, action: 'Out of Stock', item: 'Exfoliating Scrub', qty: '0 left', time: 'Yesterday', type: 'negative' },
];

const AdminInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Fetch Dashboard Stats (for some KPIs)
  const { data: dashboardData } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard');
      return response.data;
    }
  });

  // Fetch Products (for Table & Value calculation)
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['adminInventoryProducts', searchTerm],
    queryFn: async () => {
      const response = await api.get(`/products?limit=50&keyword=${searchTerm}`);
      return response.data;
    }
  });

  const products = productsData?.products || [];
  
  // Calculate specific KPIs from loaded products if dashboardData is missing details
  const totalProductsCount = dashboardData?.inventory?.total || products.length;
  const outOfStockCount = products.filter((p: any) => p.countInStock === 0).length;
  const lowStockCount = products.filter((p: any) => p.countInStock > 0 && p.countInStock < 10).length;
  const inStockCount = totalProductsCount - outOfStockCount;
  
  // Generate real activity from products
  const generatedActivity = products.slice(0, 4).map((p: any) => {
    if (p.countInStock === 0) {
      return { id: p._id, action: 'Out of Stock', item: p.name, qty: '0 left', time: 'Recently', type: 'negative' };
    } else if (p.countInStock < 10) {
      return { id: p._id, action: 'Low Stock Alert', item: p.name, qty: `${p.countInStock} left`, time: 'Recently', type: 'warning' };
    } else {
      return { id: p._id, action: 'In Stock', item: p.name, qty: `${p.countInStock} available`, time: 'Active', type: 'positive' };
    }
  });
  const activityToShow = generatedActivity.length > 0 ? generatedActivity : mockActivity;
  
  // Estimate Inventory Value (Sum of Price * Stock)
  const inventoryValue = products.reduce((sum: number, p: any) => sum + (p.price * p.countInStock), 0);

  const getStockStatus = (count: number) => {
    if (count === 0) return { label: 'Out of Stock', color: 'text-[#e53e3e]', bg: 'bg-[#e53e3e]/10', border: 'border-[#e53e3e]/20' };
    if (count < 10) return { label: 'Low Stock', color: 'text-twc-gold', bg: 'bg-twc-gold/10', border: 'border-twc-gold/20' };
    return { label: 'In Stock', color: 'text-twc-sage', bg: 'bg-twc-sage/20', border: 'border-twc-sage/30' };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl shadow-lg">
          <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest mb-1">{label}</p>
          <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 font-body">
      
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => toast.success('Importing products...')}
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-beige dark:hover:bg-zinc-800 transition-colors border border-twc-nude/50 dark:border-zinc-700/50 shadow-sm"
          >
            <Upload size={14} /> Import
          </button>
          <button 
            onClick={() => toast.success('Exporting inventory to CSV...')}
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-beige dark:hover:bg-zinc-800 transition-colors border border-twc-nude/50 dark:border-zinc-700/50 shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
          <Link to="/admin/products/new">
            <button className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-5 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md">
              <Plus size={14} /> Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-twc-beige dark:bg-zinc-800 flex items-center justify-center text-twc-text dark:text-twc-white">
              <Package size={18} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-twc-text dark:text-twc-white">{totalProductsCount}</h3>
            <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest mt-1">Total Products</p>
          </div>
        </div>

        {/* In Stock */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-twc-sage/20 dark:bg-[#88b070]/10 flex items-center justify-center text-[#4a6b38] dark:text-[#88b070]">
              <CheckCircle2 size={18} />
            </div>
            <span className="text-[10px] font-bold text-[#4a6b38] dark:text-[#88b070] bg-twc-sage/20 px-2 py-0.5 rounded-md">Healthy</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-twc-text dark:text-twc-white">{inStockCount}</h3>
            <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest mt-1">In Stock</p>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-twc-gold/20 dark:bg-twc-gold/10 flex items-center justify-center text-twc-gold">
              <AlertTriangle size={18} />
            </div>
            {lowStockCount > 0 && <span className="w-2 h-2 rounded-full bg-twc-gold animate-pulse"></span>}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-twc-text dark:text-twc-white">{lowStockCount}</h3>
            <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest mt-1">Low Stock</p>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#e53e3e]/10 dark:bg-[#e53e3e]/10 flex items-center justify-center text-[#e53e3e]">
              <AlertCircle size={18} />
            </div>
             {outOfStockCount > 0 && <span className="text-[10px] font-bold text-[#e53e3e] bg-[#e53e3e]/10 px-2 py-0.5 rounded-md">Action Req</span>}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-twc-text dark:text-twc-white">{outOfStockCount}</h3>
            <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest mt-1">Out of Stock</p>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="bg-twc-text dark:bg-twc-gold/10 backdrop-blur-xl rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-twc-text/50 dark:border-twc-gold/20 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-twc-gold/20 flex items-center justify-center text-white dark:text-twc-gold">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white dark:text-twc-gold">₹{(inventoryValue || 0).toLocaleString()}</h3>
            <p className="text-[10px] font-bold text-white/70 dark:text-twc-gold/70 uppercase tracking-widest mt-1">Est. Value</p>
          </div>
        </div>
      </div>

      {/* Analytics & Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 shadow-sm border border-white/50 dark:border-zinc-800/50">
           <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Inventory Value History</h3>
              <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Last 7 Months</p>
            </div>
            <button className="text-twc-muted hover:text-twc-gold transition-colors">
              <Download size={18} />
            </button>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockInventoryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C8A96A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-twc-gold)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#C8A96A" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 shadow-sm border border-white/50 dark:border-zinc-800/50 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Recent Activity</h3>
            <button className="text-twc-muted hover:text-twc-gold transition-colors">
              <History size={16} />
            </button>
          </div>
          
          <div className="flex-grow space-y-6">
            {activityToShow.map((activity: any, index: number) => (
              <div key={activity.id || index} className="relative flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 border-white dark:border-zinc-900 shadow-sm
                  ${activity.type === 'positive' ? 'bg-twc-sage text-[#4a6b38]' : 
                    activity.type === 'warning' ? 'bg-twc-gold text-white' : 
                    activity.type === 'negative' ? 'bg-[#e53e3e] text-white' : 'bg-twc-beige text-twc-text'}`}
                >
                  {activity.type === 'positive' ? <ArrowUpRight size={14} /> : 
                   activity.type === 'warning' ? <AlertTriangle size={14} /> : 
                   activity.type === 'negative' ? <AlertCircle size={14} /> : <Plus size={14} />}
                </div>
                <div className="flex-1 min-w-0 bg-white/50 dark:bg-zinc-800/50 rounded-xl p-3 border border-twc-nude/30 dark:border-zinc-700/30">
                  <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{activity.action}</p>
                  <p className="text-[12px] font-semibold text-twc-muted dark:text-zinc-400 mt-0.5 truncate">{activity.item}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${activity.type === 'positive' ? 'bg-twc-sage/20 text-[#4a6b38]' : 'bg-twc-beige dark:bg-zinc-700 text-twc-muted'}`}>
                      {activity.qty}
                    </span>
                    <span className="text-[10px] font-bold text-twc-muted flex items-center gap-1">
                      <Clock size={10} /> {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 overflow-hidden mt-8">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-zinc-900/40">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-twc-muted dark:text-zinc-500 group-focus-within:text-twc-gold transition-colors" size={16} />
            <Input 
              type="text" 
              placeholder="Search products, SKU..." 
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl bg-white/60 dark:bg-zinc-800/60 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/70 focus:outline-none focus:border-twc-gold focus:ring-2 focus:ring-twc-gold/20 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-[13px] text-twc-text dark:text-twc-white focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors font-medium cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Skincare">Skincare</option>
                <option value="Haircare">Haircare</option>
                <option value="Body">Body</option>
              </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-twc-nude/30 dark:border-zinc-800/50 bg-twc-beige/30 dark:bg-zinc-950/30">
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-5 pl-6">Product</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-5">SKU & Category</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-5">Stock</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-5">Price</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-5">Status</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-5 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                     <div className="w-8 h-8 border-2 border-twc-gold/20 border-t-twc-gold rounded-full animate-spin mx-auto mb-3"></div>
                     <p className="text-sm font-semibold text-twc-muted">Loading inventory...</p>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                     <div className="w-16 h-16 bg-twc-beige dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-twc-nude/50 dark:border-zinc-700/50">
                        <Package size={24} className="text-twc-muted" />
                     </div>
                     <p className="text-sm font-bold text-twc-text dark:text-twc-white mb-1">No products found</p>
                     <p className="text-[11px] font-semibold uppercase tracking-widest text-twc-muted">Try adjusting your search filters</p>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => {
                  const status = getStockStatus(product.countInStock);
                  const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : '';
                  
                  return (
                    <TableRow key={product._id} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-[14px] bg-twc-beige dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-twc-nude/50 dark:border-zinc-700/50">
                            {imageUrl ? (
                              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <Package size={20} className="text-twc-muted/50" />
                            )}
                          </div>
                          <div className="max-w-[200px]">
                            <p className="font-bold text-[13px] text-twc-text dark:text-twc-white truncate group-hover:text-twc-gold transition-colors">{product.name}</p>
                            <p className="text-[11px] font-semibold text-twc-muted truncate mt-0.5">{product.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-[12px] font-bold font-mono text-twc-text dark:text-zinc-300">{product.sku || 'N/A'}</p>
                        <p className="text-[11px] font-semibold tracking-wide text-twc-muted mt-1 uppercase">{product.category?.name || 'Skincare'}</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-[14px] font-bold text-twc-text dark:text-twc-white">{product.countInStock}</p>
                        <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest mt-0.5">Units</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">₹{product.price}</p>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border ${status.bg} ${status.color} ${status.border}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <div className="flex justify-end items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="h-8 w-8 rounded-lg flex items-center justify-center text-twc-muted hover:text-twc-gold hover:bg-twc-gold/10 transition-colors" title="Restock">
                            <Plus size={16} />
                          </button>
                          <Link to={`/admin/products/${product._id}/edit`}>
                            <button className="h-8 px-3 rounded-lg flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-twc-text dark:text-twc-white bg-twc-beige dark:bg-zinc-800 hover:bg-twc-nude dark:hover:bg-zinc-700 transition-colors" title="Edit Product">
                              Edit
                            </button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryPage;
