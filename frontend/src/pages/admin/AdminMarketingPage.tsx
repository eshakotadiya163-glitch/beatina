import React, { useState } from 'react';
import { 
  Megaphone, Mail, BellRing, Tag, Plus, TrendingUp, IndianRupee, 
  Users, Target, Sparkles, Image as ImageIcon, Calendar, ChevronRight,
  Activity, ArrowUpRight, BarChart3, Filter, Search
} from 'lucide-react';
import { 
  AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/input';

// MOCK DATA
const performanceData = [
  { name: 'Jan', revenue: 120000, spend: 30000 },
  { name: 'Feb', revenue: 150000, spend: 35000 },
  { name: 'Mar', revenue: 180000, spend: 40000 },
  { name: 'Apr', revenue: 140000, spend: 38000 },
  { name: 'May', revenue: 220000, spend: 45000 },
  { name: 'Jun', revenue: 280000, spend: 50000 },
  { name: 'Jul', revenue: 350000, spend: 55000 },
];

const segmentData = [
  { name: 'VIP', value: 35, color: '#C8A96A' },
  { name: 'Loyal', value: 30, color: '#DCE8D5' },
  { name: 'At Risk', value: 20, color: '#E8DCCF' },
  { name: 'New', value: 15, color: '#3f3f46' },
];

const campaigns = [
  { id: 1, name: 'Summer Glow 2026', type: 'Email + Social', status: 'Active', budget: '₹55,000', revenue: '₹320,000', start: 'Jul 01, 2026', end: 'Aug 30, 2026' },
  { id: 2, name: 'Vit C Launch', type: 'Influencer', status: 'Active', budget: '₹120,000', revenue: '₹480,000', start: 'Jul 15, 2026', end: 'Jul 25, 2026' },
  { id: 3, name: 'Monsoon Care', type: 'Email', status: 'Scheduled', budget: '₹15,000', revenue: '-', start: 'Aug 05, 2026', end: 'Aug 15, 2026' },
  { id: 4, name: 'Mother\'s Day', type: 'Cross-channel', status: 'Completed', budget: '₹40,000', revenue: '₹210,000', start: 'May 01, 2026', end: 'May 10, 2026' },
];

const banners = [
  { title: 'Homepage Hero', status: 'Active', ctr: '4.2%' },
  { title: 'Summer Collection', status: 'Scheduled', ctr: '-' },
  { title: 'Mobile App Promo', status: 'Active', ctr: '6.8%' },
];

const emails = [
  { title: 'Welcome Series', openRate: '68%', ctr: '12%' },
  { type: 'Abandoned Cart', openRate: '45%', ctr: '22%' },
  { title: 'Monthly Newsletter', openRate: '32%', ctr: '4%' },
];

const AdminMarketingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const kpis = [
    { title: 'Active Campaigns', value: '12', growth: '+2', icon: <Megaphone size={18} />, color: 'text-twc-gold', bg: 'bg-twc-gold/10' },
    { title: 'Marketing Revenue', value: '₹12.4L', growth: '+18.5%', icon: <IndianRupee size={18} />, color: 'text-twc-sage', bg: 'bg-twc-sage/20' },
    { title: 'Email Subscribers', value: '45.2K', growth: '+1.2K', icon: <Mail size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Avg. ROAS', value: '4.2x', growth: '+0.5x', icon: <Target size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Coupon Usage', value: '2,845', growth: '+15%', icon: <Tag size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Push Open Rate', value: '18.4%', growth: '+2.1%', icon: <BellRing size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl shadow-xl z-50">
          <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center gap-3 mb-1">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
               <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">
                 {entry.name}: ₹{entry.value.toLocaleString()}
               </p>
             </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-twc-sage/10 text-twc-sage border-twc-sage/20';
      case 'Scheduled': return 'bg-twc-gold/10 text-twc-gold border-twc-gold/20';
      case 'Completed': return 'bg-twc-muted/10 text-twc-muted border-twc-muted/20';
      default: return 'bg-twc-muted/10 text-twc-muted border-twc-muted/20';
    }
  };

  return (
    <div className="space-y-8 font-body pb-10">
      
      {/* Quick Actions & Header */}
      <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-beige dark:hover:bg-zinc-800 transition-colors border border-twc-nude/50 dark:border-zinc-700/50 shadow-sm">
            <Mail size={14} /> Send Newsletter
          </button>
          <button className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-beige dark:hover:bg-zinc-800 transition-colors border border-twc-nude/50 dark:border-zinc-700/50 shadow-sm">
            <Tag size={14} /> Create Coupon
          </button>
          <button className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-5 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md">
            <Megaphone size={14} /> Create Campaign
          </button>
        </div>
      </div>

      {/* AI Marketing Insights */}
      <div className="bg-gradient-to-r from-twc-beige/50 via-twc-nude/30 to-twc-gold/10 dark:from-zinc-900 dark:via-zinc-800 dark:to-twc-gold/5 backdrop-blur-xl rounded-[24px] p-6 shadow-sm border border-twc-gold/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-twc-gold/10 rounded-full blur-3xl group-hover:bg-twc-gold/20 transition-colors duration-1000"></div>
        <div className="flex items-start gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-zinc-800/50 flex items-center justify-center text-twc-gold shadow-sm border border-twc-gold/30">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-twc-text dark:text-twc-white">AI Marketing Insights</h3>
            <p className="text-[12px] text-twc-muted mt-0.5">Optimization opportunities</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10 w-full md:w-auto justify-start md:justify-end">
          <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm">
            🎯 "Summer Glow" ROAS is up 12%
          </span>
          <span className="flex items-center gap-1.5 bg-twc-gold/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-gold border border-twc-gold/20 shadow-sm">
            💡 Increase budget for Vit C ads
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[20px] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-twc-text dark:text-twc-white">{kpi.value}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[9px] font-bold text-twc-muted uppercase tracking-widest truncate mr-1">{kpi.title}</p>
                <span className={`text-[9px] font-bold ${kpi.growth.startsWith('+') ? 'text-twc-sage' : 'text-[#e53e3e]'}`}>{kpi.growth}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaign Performance Chart */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Campaign Performance</h3>
              <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Revenue vs Ad Spend</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-twc-gold"></div> Revenue</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-twc-sage"></div> Spend</div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C8A96A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#88b070" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#88b070" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#C8A96A" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="spend" name="Spend" stroke="#88b070" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segmentation */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Customer Segments</h3>
            <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Based on LTV</p>
          </div>
          <div className="flex-grow flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={segmentData} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-twc-text dark:text-twc-white">35%</span>
              <span className="text-[10px] font-bold text-twc-gold uppercase tracking-widest mt-1">VIP</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-y-3">
             {segmentData.map((item, idx) => (
               <div key={idx} className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                 <span className="text-[11px] font-bold text-twc-text dark:text-zinc-300">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Modular Management Section (Emails, Banners, Push) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Banner Management */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-twc-text dark:text-twc-white">
              <ImageIcon size={18} />
              <h3 className="font-serif font-bold">Banners</h3>
            </div>
            <button className="text-twc-muted hover:text-twc-gold"><Plus size={16}/></button>
          </div>
          <div className="space-y-4">
            {banners.map((banner, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-twc-nude/30 dark:border-zinc-700/50">
                <div>
                  <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{banner.title}</p>
                  <p className="text-[10px] font-bold text-twc-muted mt-1 uppercase tracking-widest">CTR: {banner.ctr}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusBadge(banner.status)}`}>
                  {banner.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Email Marketing */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-twc-text dark:text-twc-white">
              <Mail size={18} />
              <h3 className="font-serif font-bold">Emails</h3>
            </div>
            <button className="text-twc-muted hover:text-twc-gold"><ArrowUpRight size={16}/></button>
          </div>
          <div className="space-y-4">
            {emails.map((email, idx) => (
              <div key={idx} className="flex flex-col p-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-twc-nude/30 dark:border-zinc-700/50">
                <p className="text-[13px] font-bold text-twc-text dark:text-twc-white mb-2">{email.title || email.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-twc-muted uppercase tracking-widest">Open: <span className="text-twc-text dark:text-twc-white">{email.openRate}</span></span>
                  <span className="text-[10px] font-bold text-twc-muted uppercase tracking-widest">CTR: <span className="text-twc-text dark:text-twc-white">{email.ctr}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupons & Promotions */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-twc-text dark:text-twc-white">
              <Tag size={18} />
              <h3 className="font-serif font-bold">Promotions</h3>
            </div>
            <button className="text-twc-muted hover:text-twc-gold"><Plus size={16}/></button>
          </div>
          <div className="space-y-3">
             <div className="p-3 rounded-xl bg-twc-gold/10 border border-twc-gold/20 flex items-center justify-between">
               <div>
                 <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">SUMMER20</p>
                 <p className="text-[10px] font-bold text-twc-muted mt-1 uppercase tracking-widest">20% OFF ALL ORDERS</p>
               </div>
               <span className="text-[10px] font-bold text-twc-sage bg-twc-sage/20 px-2 py-1 rounded border border-twc-sage/30">Active</span>
             </div>
             <div className="p-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-twc-nude/30 dark:border-zinc-700/50 flex items-center justify-between">
               <div>
                 <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">FREESHIP</p>
                 <p className="text-[10px] font-bold text-twc-muted mt-1 uppercase tracking-widest">ORDERS &gt; ₹1000</p>
               </div>
               <span className="text-[10px] font-bold text-twc-sage bg-twc-sage/20 px-2 py-1 rounded border border-twc-sage/30">Active</span>
             </div>
             <Link to="/admin/coupons" className="block text-center mt-2 text-[10px] font-bold text-twc-gold uppercase tracking-widest hover:underline">
               Manage all coupons
             </Link>
          </div>
        </div>

      </div>

      {/* Active Marketing Campaigns Table */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 overflow-hidden">
        <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-zinc-900/40">
          <div>
            <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Campaign Management</h3>
            <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Track ads and promos</p>
          </div>
          <div className="relative w-full sm:max-w-xs group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-twc-muted dark:text-zinc-500 group-focus-within:text-twc-gold transition-colors" size={16} />
            <Input 
              type="text" 
              placeholder="Search campaigns..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl bg-white/60 dark:bg-zinc-800/60 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/70 focus:outline-none focus:border-twc-gold focus:ring-2 focus:ring-twc-gold/20 transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-twc-beige/30 dark:bg-zinc-950/30 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold border-b border-twc-nude/30 dark:border-zinc-800/50">
                <th className="py-4 pl-6">Campaign</th>
                <th className="py-4">Budget</th>
                <th className="py-4">Revenue</th>
                <th className="py-4">Duration</th>
                <th className="py-4">Status</th>
                <th className="py-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp, idx) => (
                <tr key={idx} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <td className="py-4 pl-6">
                    <p className="font-bold text-[13px] text-twc-text dark:text-twc-white group-hover:text-twc-gold transition-colors">{camp.name}</p>
                    <p className="text-[11px] font-semibold text-twc-muted mt-0.5">{camp.type}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{camp.budget}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{camp.revenue}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-[12px] font-semibold text-twc-text dark:text-zinc-300">{camp.start}</p>
                    <p className="text-[10px] font-bold text-twc-muted mt-0.5 uppercase tracking-widest">to {camp.end}</p>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border ${getStatusBadge(camp.status)}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button className="text-[11px] font-bold text-twc-text dark:text-twc-white bg-twc-beige dark:bg-zinc-800 px-3 py-1.5 rounded-lg hover:bg-twc-nude dark:hover:bg-zinc-700 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminMarketingPage;
