import React, { useState } from 'react';
import { 
  ImageIcon, Layout, Plus, Search, Calendar, Edit3, Eye, Copy, Monitor, 
  Smartphone, UploadCloud, Sparkles, TrendingUp, MousePointerClick, 
  IndianRupee, Activity, CheckCircle, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Input } from '../../components/ui/input';

// MOCK DATA
const performanceData = [
  { name: 'Mon', views: 45000, clicks: 1200, ctr: 2.6, conversions: 120 },
  { name: 'Tue', views: 52000, clicks: 1500, ctr: 2.8, conversions: 150 },
  { name: 'Wed', views: 48000, clicks: 1400, ctr: 2.9, conversions: 140 },
  { name: 'Thu', views: 61000, clicks: 1900, ctr: 3.1, conversions: 190 },
  { name: 'Fri', views: 59000, clicks: 1700, ctr: 2.8, conversions: 170 },
  { name: 'Sat', views: 75000, clicks: 2400, ctr: 3.2, conversions: 240 },
  { name: 'Sun', views: 89000, clicks: 3100, ctr: 3.5, conversions: 310 },
];

const banners = [
  { id: 1, name: 'Summer Glow Hero', position: 'Hero Banner', device: 'All', status: 'Active', views: '245.2K', clicks: '14.5K', ctr: '5.9%', start: 'Jul 01', end: 'Aug 30', preview: 'https://images.unsplash.com/photo-1571781537158-6932f91eb70f?q=80&w=400&h=200&fit=crop' },
  { id: 2, name: 'Vit C Launch Bar', position: 'Announcement Bar', device: 'Desktop', status: 'Scheduled', views: '-', clicks: '-', ctr: '-', start: 'Aug 05', end: 'Aug 15', preview: null },
  { id: 3, name: 'Monsoon Sale Collection', position: 'Collection Banner', device: 'Mobile', status: 'Active', views: '112.4K', clicks: '8.2K', ctr: '7.2%', start: 'Jul 15', end: 'Aug 15', preview: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&h=200&fit=crop' },
  { id: 4, name: 'Free Shipping Promo', position: 'Footer Banner', device: 'All', status: 'Completed', views: '580.1K', clicks: '21.4K', ctr: '3.6%', start: 'May 01', end: 'May 31', preview: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&h=200&fit=crop' },
];

const AdminAppearancePage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, create, analytics
  const [searchTerm, setSearchTerm] = useState('');
  const [devicePreview, setDevicePreview] = useState('desktop');

  const kpis = [
    { title: 'Total Banners', value: '24', icon: <Layout size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Active Banners', value: '4', icon: <CheckCircle size={18} />, color: 'text-twc-sage', bg: 'bg-twc-sage/20' },
    { title: 'Scheduled Banners', value: '3', icon: <Clock size={18} />, color: 'text-twc-gold', bg: 'bg-twc-gold/10' },
    { title: 'Avg. CTR', value: '4.8%', icon: <MousePointerClick size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Banner Revenue', value: '₹4.2L', icon: <IndianRupee size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
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
                 {entry.name}: {entry.value.toLocaleString()}{entry.name === 'CTR' ? '%' : ''}
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
      
      {/* Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-twc-beige/50 dark:bg-zinc-800/50 p-1 rounded-[16px]">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted hover:text-twc-text dark:hover:text-twc-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted hover:text-twc-text dark:hover:text-twc-white'}`}
            >
              Create Banner
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted hover:text-twc-text dark:hover:text-twc-white'}`}
            >
              Analytics
            </button>
          </div>
          <button onClick={() => setActiveTab('create')} className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-5 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md ml-2">
            <Plus size={14} /> New Banner
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* AI Banner Suggestions */}
          <div className="bg-gradient-to-r from-twc-beige/50 via-twc-nude/30 to-twc-gold/10 dark:from-zinc-900 dark:via-zinc-800 dark:to-twc-gold/5 backdrop-blur-xl rounded-[24px] p-6 shadow-sm border border-twc-gold/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-twc-gold/10 rounded-full blur-3xl group-hover:bg-twc-gold/20 transition-colors duration-1000"></div>
            <div className="flex items-start gap-4 relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-zinc-800/50 flex items-center justify-center text-twc-gold shadow-sm border border-twc-gold/30">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-twc-text dark:text-twc-white">AI Banner Suggestions</h3>
                <p className="text-[12px] text-twc-muted mt-0.5">Optimized for high CTR</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 relative z-10 w-full md:w-auto justify-start md:justify-end">
              <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm">
                🎯 Best CTA: "Shop Now" & "Discover"
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm">
                📏 Optimal Hero Size: 1920x800px
              </span>
              <span className="flex items-center gap-1.5 bg-twc-gold/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-gold border border-twc-gold/20 shadow-sm">
                💡 "Monsoon Sale" CTR is up 15%
              </span>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[20px] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                    {kpi.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-twc-text dark:text-twc-white">{kpi.value}</h3>
                  <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1 truncate">{kpi.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Management Table */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 overflow-hidden">
            <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-zinc-900/40">
              <div>
                <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Active & Scheduled Banners</h3>
                <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Manage all display positions</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:max-w-xs group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-twc-muted dark:text-zinc-500 group-focus-within:text-twc-gold transition-colors" size={16} />
                  <Input 
                    type="text" 
                    placeholder="Search banners..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl bg-white/60 dark:bg-zinc-800/60 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/70 focus:outline-none focus:border-twc-gold focus:ring-2 focus:ring-twc-gold/20 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-twc-beige/30 dark:bg-zinc-950/30 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold border-b border-twc-nude/30 dark:border-zinc-800/50">
                    <th className="py-4 pl-6">Preview</th>
                    <th className="py-4">Name / Position</th>
                    <th className="py-4">Device</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Views</th>
                    <th className="py-4">CTR</th>
                    <th className="py-4">Duration</th>
                    <th className="py-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner, idx) => (
                    <tr key={idx} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-4 pl-6">
                        <div className="w-20 h-10 rounded-lg bg-twc-beige dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-twc-nude/50 dark:border-zinc-700/50">
                          {banner.preview ? (
                            <img src={banner.preview} alt={banner.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={16} className="text-twc-muted" />
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-[13px] text-twc-text dark:text-twc-white group-hover:text-twc-gold transition-colors">{banner.name}</p>
                        <p className="text-[11px] font-semibold text-twc-muted mt-0.5">{banner.position}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-[12px] font-bold text-twc-text dark:text-twc-white flex items-center gap-1.5">
                          {banner.device === 'All' ? <><Monitor size={12}/> <Smartphone size={12}/></> : (banner.device === 'Desktop' ? <Monitor size={12}/> : <Smartphone size={12}/>)}
                          {banner.device}
                        </p>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border ${getStatusBadge(banner.status)}`}>
                          {banner.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{banner.views}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{banner.ctr}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-[12px] font-semibold text-twc-text dark:text-zinc-300">{banner.start} - {banner.end}</p>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-twc-muted hover:text-twc-text dark:hover:text-twc-white transition-colors" title="Preview"><Eye size={16}/></button>
                          <button className="p-1.5 text-twc-muted hover:text-twc-text dark:hover:text-twc-white transition-colors" title="Duplicate"><Copy size={16}/></button>
                          <button className="p-1.5 text-twc-muted hover:text-twc-gold transition-colors" title="Edit"><Edit3 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-6">Banner Details</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Banner Title (Internal)</label>
                  <Input type="text" placeholder="e.g. Summer Flash Sale Hero" className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50 focus:border-twc-gold" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Heading</label>
                    <Input type="text" placeholder="Summer Glow Collection" className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50 focus:border-twc-gold" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Sub-heading</label>
                    <Input type="text" placeholder="Up to 30% Off on bestsellers" className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50 focus:border-twc-gold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Button Text</label>
                    <Input type="text" placeholder="Shop Now" className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50 focus:border-twc-gold" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Button Link URL</label>
                    <Input type="text" placeholder="/shop/summer-collection" className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50 focus:border-twc-gold" />
                  </div>
                </div>

                <div className="pt-4 border-t border-twc-nude/30 dark:border-zinc-800/50">
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-3">Upload Assets</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Desktop Upload */}
                    <div className="border-2 border-dashed border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-twc-beige/20 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-twc-beige dark:bg-zinc-800 rounded-full flex items-center justify-center text-twc-gold mb-3">
                        <Monitor size={20} />
                      </div>
                      <p className="text-[13px] font-bold text-twc-text dark:text-twc-white mb-1">Desktop Image</p>
                      <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest">Recommended: 1920x800px</p>
                      <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest">Max 2MB (JPG, PNG, WebP)</p>
                      <button className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-twc-gold border border-twc-gold/30 px-4 py-2 rounded-xl">
                        <UploadCloud size={14}/> Browse Files
                      </button>
                    </div>

                    {/* Mobile Upload */}
                    <div className="border-2 border-dashed border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-twc-beige/20 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-twc-beige dark:bg-zinc-800 rounded-full flex items-center justify-center text-twc-gold mb-3">
                        <Smartphone size={20} />
                      </div>
                      <p className="text-[13px] font-bold text-twc-text dark:text-twc-white mb-1">Mobile Image</p>
                      <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest">Recommended: 800x1000px</p>
                      <p className="text-[10px] font-bold text-twc-muted uppercase tracking-widest">Max 1.5MB (JPG, PNG, WebP)</p>
                      <button className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-twc-gold border border-twc-gold/30 px-4 py-2 rounded-xl">
                        <UploadCloud size={14}/> Browse Files
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Visual Preview Mode */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Live Preview</h3>
                 <div className="flex bg-twc-beige/50 dark:bg-zinc-800/50 p-1 rounded-[12px]">
                   <button 
                     onClick={() => setDevicePreview('desktop')}
                     className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${devicePreview === 'desktop' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted'}`}
                   >
                     <Monitor size={12}/> Desktop
                   </button>
                   <button 
                     onClick={() => setDevicePreview('mobile')}
                     className={`px-3 py-1.5 rounded-[8px] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 ${devicePreview === 'mobile' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted'}`}
                   >
                     <Smartphone size={12}/> Mobile
                   </button>
                 </div>
              </div>
              <div className={`w-full bg-twc-nude/20 dark:bg-zinc-950 rounded-xl flex items-center justify-center p-6 border border-twc-nude/50 dark:border-zinc-800/50 transition-all duration-500 ${devicePreview === 'mobile' ? 'max-w-sm mx-auto h-[400px]' : 'h-[300px]'}`}>
                 <div className="text-center space-y-4">
                   <h2 className="text-3xl font-serif text-twc-text dark:text-twc-white">Summer Glow Collection</h2>
                   <p className="text-sm font-body text-twc-muted dark:text-zinc-400">Up to 30% Off on bestsellers</p>
                   <button className="bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-widest shadow-md">
                     Shop Now
                   </button>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <h3 className="font-serif font-bold text-twc-text dark:text-twc-white mb-6">Display Settings</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Banner Position</label>
                  <select className="w-full appearance-none bg-white/80 dark:bg-zinc-800/80 border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-xl text-[12px] font-bold focus:outline-none focus:border-twc-gold transition-colors">
                    <option>Hero Banner (Homepage)</option>
                    <option>Announcement Bar (Top)</option>
                    <option>Collection Page Header</option>
                    <option>Product Page Promo</option>
                    <option>Footer Banner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Display Device</label>
                  <select className="w-full appearance-none bg-white/80 dark:bg-zinc-800/80 border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-xl text-[12px] font-bold focus:outline-none focus:border-twc-gold transition-colors">
                    <option>All Devices</option>
                    <option>Desktop Only</option>
                    <option>Mobile Only</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-twc-nude/50 dark:border-zinc-700/50 space-y-4">
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest">Scheduling</label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-twc-muted uppercase tracking-widest mb-1">Start Date</label>
                      <div className="relative">
                        <Input type="text" placeholder="DD/MM/YYYY" className="w-full pl-8 border-twc-nude/50 text-[12px]" />
                        <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-twc-muted" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-twc-muted uppercase tracking-widest mb-1">End Date</label>
                      <div className="relative">
                        <Input type="text" placeholder="DD/MM/YYYY" className="w-full pl-8 border-twc-nude/50 text-[12px]" />
                        <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-twc-muted" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-twc-nude/50 dark:border-zinc-700/50 space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-4 py-3 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md">
                    <CheckCircle size={16} /> Publish Banner
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-twc-text dark:text-twc-white px-4 py-3 rounded-[14px] text-[11px] font-bold uppercase tracking-widest border border-twc-nude/50 dark:border-zinc-700/50 hover:bg-twc-beige dark:hover:bg-zinc-700 transition-all shadow-sm">
                    <Clock size={16} /> Save as Draft
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-twc-gold/10 backdrop-blur-xl rounded-[24px] p-6 border border-twc-gold/20">
               <div className="flex items-center gap-2 text-twc-gold mb-2">
                 <Layout size={16}/>
                 <h4 className="font-serif font-bold text-[14px]">Banner Templates</h4>
               </div>
               <p className="text-[12px] text-twc-text/80 dark:text-zinc-300 mb-4">Need inspiration? Use a pre-built template.</p>
               <div className="grid grid-cols-2 gap-2">
                 <button className="bg-white/60 dark:bg-zinc-800/60 py-2 rounded-lg text-[10px] font-bold text-twc-text dark:text-twc-white uppercase tracking-widest border border-twc-gold/20 hover:bg-white dark:hover:bg-zinc-700 transition-colors">
                   Flash Sale
                 </button>
                 <button className="bg-white/60 dark:bg-zinc-800/60 py-2 rounded-lg text-[10px] font-bold text-twc-text dark:text-twc-white uppercase tracking-widest border border-twc-gold/20 hover:bg-white dark:hover:bg-zinc-700 transition-colors">
                   New Arrival
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
           
           <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Banner Performance (Weekly)</h3>
                  <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Views vs Clicks Engagement</p>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#C8A96A" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#88b070" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#88b070" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} tickFormatter={(val) => `${val/1000}k`} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area yAxisId="left" type="monotone" dataKey="views" name="Views" stroke="#C8A96A" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                    <Area yAxisId="right" type="monotone" dataKey="clicks" name="Clicks" stroke="#88b070" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CTR Chart */}
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">CTR Trend</h3>
                    <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Click-through Rate %</p>
                  </div>
                </div>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} tickFormatter={(val) => `${val}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="ctr" name="CTR" stroke="#3f3f46" strokeWidth={3} dot={{r: 4, fill: '#3f3f46', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion Chart */}
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Attributed Conversions</h3>
                    <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Sales from banner clicks</p>
                  </div>
                </div>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--color-twc-beige)', opacity: 0.4}} />
                      <Bar dataKey="conversions" name="Conversions" fill="#C8A96A" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
           </div>

        </div>
      )}

    </div>
  );
};

export default AdminAppearancePage;
