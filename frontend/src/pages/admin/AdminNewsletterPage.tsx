import { useState } from 'react';
import { 
  Mail, Users, MousePointerClick, UserMinus, Sparkles, Send, 
  Clock, LayoutTemplate, Image as ImageIcon, Type, ArrowUpRight,
  TrendingUp, Download, Plus, Search
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Input } from '../../components/ui/input';

// MOCK DATA
const subscriberGrowthData = [
  { name: 'Jan', subscribers: 12000 },
  { name: 'Feb', subscribers: 14500 },
  { name: 'Mar', subscribers: 18000 },
  { name: 'Apr', subscribers: 22000 },
  { name: 'May', subscribers: 28500 },
  { name: 'Jun', subscribers: 35000 },
  { name: 'Jul', subscribers: 45200 },
];

const emailPerformanceData = [
  { name: 'Welcome', open: 68, click: 12 },
  { name: 'Newsletter', open: 42, click: 8 },
  { name: 'Promo', open: 55, click: 15 },
  { name: 'Cart', open: 45, click: 22 },
  { name: 'Winback', open: 30, click: 5 },
];

const campaigns = [
  { id: 1, name: 'Summer Sale Announce', subject: 'Get ready to glow this summer ✨', status: 'Sent', recipients: '45.2K', openRate: '58.4%', ctr: '12.1%', date: 'Jul 28, 2026' },
  { id: 2, name: 'New Vit C Serum Launch', subject: 'Your new skincare holy grail is here!', status: 'Scheduled', recipients: '45.2K', openRate: '-', ctr: '-', date: 'Aug 05, 2026' },
  { id: 3, name: 'Weekly Newsletter #42', subject: '5 Tips for Hydrated Skin 💧', status: 'Sent', recipients: '44.8K', openRate: '42.1%', ctr: '6.8%', date: 'Jul 21, 2026' },
  { id: 4, name: 'Flash Sale Reminder', subject: 'Only 4 hours left to save 20%', status: 'Sent', recipients: '22.1K', openRate: '61.2%', ctr: '18.4%', date: 'Jul 15, 2026' },
];

const subscribers = [
  { id: 1, name: 'Ananya Sharma', email: 'ananya.s@example.com', country: 'India', date: 'Jul 28, 2026', status: 'Active', lastActivity: 'Opened 2 hrs ago' },
  { id: 2, name: 'Priya Patel', email: 'priya99@example.com', country: 'India', date: 'Jul 27, 2026', status: 'Active', lastActivity: 'Clicked link yesterday' },
  { id: 3, name: 'Sarah Jenkins', email: 'sarah.j@example.com', country: 'USA', date: 'Jul 25, 2026', status: 'Inactive', lastActivity: 'No activity 30 days' },
  { id: 4, name: 'Neha Gupta', email: 'neha.g@example.com', country: 'India', date: 'Jul 22, 2026', status: 'Active', lastActivity: 'Opened today' },
];

const AdminNewsletterPage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, composer, subscribers
  const [searchTerm, setSearchTerm] = useState('');

  const kpis = [
    { title: 'Total Subscribers', value: '45.2K', growth: '+12.5%', icon: <Users size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'New (This Month)', value: '3,842', growth: '+18.1%', icon: <TrendingUp size={18} />, color: 'text-twc-sage', bg: 'bg-twc-sage/20' },
    { title: 'Active Subscribers', value: '38.5K', growth: '+5.4%', icon: <Sparkles size={18} />, color: 'text-twc-gold', bg: 'bg-twc-gold/10' },
    { title: 'Avg. Open Rate', value: '48.2%', growth: '+2.1%', icon: <Mail size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Avg. Click Rate', value: '9.4%', growth: '+0.8%', icon: <MousePointerClick size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Unsubscribe Rate', value: '0.8%', growth: '-0.2%', icon: <UserMinus size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
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
                 {entry.name}: {entry.value.toLocaleString()}{entry.name !== 'Subscribers' ? '%' : ''}
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
      case 'Sent': return 'bg-twc-sage/10 text-twc-sage border-twc-sage/20';
      case 'Scheduled': return 'bg-twc-gold/10 text-twc-gold border-twc-gold/20';
      case 'Draft': return 'bg-twc-muted/10 text-twc-muted border-twc-muted/20';
      case 'Active': return 'bg-twc-sage/10 text-twc-sage border-twc-sage/20';
      case 'Inactive': return 'bg-[#e53e3e]/10 text-[#e53e3e] border-[#e53e3e]/20';
      default: return 'bg-twc-muted/10 text-twc-muted border-twc-muted/20';
    }
  };

  return (
    <div className="space-y-8 font-body pb-10">
      
      {/* Header & Quick Actions */}
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
              onClick={() => setActiveTab('composer')}
              className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'composer' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted hover:text-twc-text dark:hover:text-twc-white'}`}
            >
              Composer
            </button>
            <button 
              onClick={() => setActiveTab('subscribers')}
              className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'subscribers' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted hover:text-twc-text dark:hover:text-twc-white'}`}
            >
              Subscribers
            </button>
          </div>
          <button onClick={() => setActiveTab('composer')} className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-5 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md ml-2">
            <Plus size={14} /> Create Email
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* AI Email Insights */}
          <div className="bg-gradient-to-r from-twc-beige/50 via-twc-nude/30 to-twc-gold/10 dark:from-zinc-900 dark:via-zinc-800 dark:to-twc-gold/5 backdrop-blur-xl rounded-[24px] p-6 shadow-sm border border-twc-gold/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-twc-gold/10 rounded-full blur-3xl group-hover:bg-twc-gold/20 transition-colors duration-1000"></div>
            <div className="flex items-start gap-4 relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-zinc-800/50 flex items-center justify-center text-twc-gold shadow-sm border border-twc-gold/30">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-twc-text dark:text-twc-white">AI Email Insights</h3>
                <p className="text-[12px] text-twc-muted mt-0.5">Optimization recommendations</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 relative z-10 w-full md:w-auto justify-start md:justify-end">
              <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm">
                🕒 Best sending time: Thursday 10:00 AM
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm">
                ✨ Use emojis in subjects for +12% open rate
              </span>
              <span className="flex items-center gap-1.5 bg-twc-gold/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-gold border border-twc-gold/20 shadow-sm">
                🔥 Recommend Vitamin C Bundle
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
                    <span className={`text-[9px] font-bold ${kpi.growth.startsWith('+') ? (kpi.title.includes('Unsubscribe') ? 'text-[#e53e3e]' : 'text-twc-sage') : (kpi.title.includes('Unsubscribe') ? 'text-twc-sage' : 'text-[#e53e3e]')}`}>{kpi.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Subscriber Growth Chart */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Audience Growth</h3>
                  <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Total Subscribers</p>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={subscriberGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#C8A96A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="subscribers" name="Subscribers" stroke="#C8A96A" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Email Performance Bar Chart */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Email Performance</h3>
                  <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Open & Click Rates</p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-twc-gold"></div> Open</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-twc-sage"></div> Click</div>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emailPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} tickFormatter={(val) => `${val}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--color-twc-beige)', opacity: 0.4}} />
                    <Bar dataKey="open" name="Open Rate" fill="#C8A96A" radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey="click" name="Click Rate" fill="#88b070" radius={[4, 4, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Campaign Table */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 overflow-hidden">
            <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-zinc-900/40">
              <div>
                <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Recent Campaigns</h3>
                <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Track newsletter performance</p>
              </div>
              <button className="text-[11px] font-bold text-twc-text dark:text-twc-white bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl border border-twc-nude/50 dark:border-zinc-700/50 shadow-sm flex items-center gap-2 hover:bg-twc-beige dark:hover:bg-zinc-700 transition-colors">
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-twc-beige/30 dark:bg-zinc-950/30 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold border-b border-twc-nude/30 dark:border-zinc-800/50">
                    <th className="py-4 pl-6">Campaign</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Recipients</th>
                    <th className="py-4">Open Rate</th>
                    <th className="py-4">CTR</th>
                    <th className="py-4 pr-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((camp, idx) => (
                    <tr key={idx} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-4 pl-6">
                        <p className="font-bold text-[13px] text-twc-text dark:text-twc-white group-hover:text-twc-gold transition-colors">{camp.name}</p>
                        <p className="text-[11px] font-semibold text-twc-muted mt-0.5 truncate max-w-[200px]">{camp.subject}</p>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border ${getStatusBadge(camp.status)}`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{camp.recipients}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{camp.openRate}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{camp.ctr}</p>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <p className="text-[12px] font-semibold text-twc-text dark:text-zinc-300">{camp.date}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-6">Compose Newsletter</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Campaign Name</label>
                  <Input type="text" placeholder="e.g. Summer Flash Sale" className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50 focus:border-twc-gold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Subject Line</label>
                  <Input type="text" placeholder="Get 20% off your skincare favorites!" className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50 focus:border-twc-gold" />
                  <p className="text-[10px] text-twc-gold font-bold mt-1.5 flex items-center gap-1"><Sparkles size={12}/> AI Suggests: "Glow up this summer with 20% off ✨"</p>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Email Content</label>
                  <div className="border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl overflow-hidden">
                    <div className="bg-twc-beige/30 dark:bg-zinc-800/30 p-2 flex items-center gap-2 border-b border-twc-nude/50 dark:border-zinc-700/50">
                      <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-twc-muted hover:text-twc-text"><Type size={14}/></button>
                      <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-twc-muted hover:text-twc-text"><ImageIcon size={14}/></button>
                      <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-twc-muted hover:text-twc-text"><LayoutTemplate size={14}/></button>
                    </div>
                    <textarea 
                      className="w-full h-64 p-4 bg-white dark:bg-zinc-900 text-[13px] text-twc-text dark:text-twc-white resize-none focus:outline-none"
                      placeholder="Write your email content here..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <h3 className="font-serif font-bold text-twc-text dark:text-twc-white mb-6">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Audience Segment</label>
                  <select className="w-full appearance-none bg-white/80 dark:bg-zinc-800/80 border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-xl text-[12px] font-bold focus:outline-none focus:border-twc-gold transition-colors">
                    <option>All Subscribers (45.2K)</option>
                    <option>VIP Customers (3.2K)</option>
                    <option>New Customers (1.5K)</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-twc-nude/50 dark:border-zinc-700/50 space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-4 py-3 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md">
                    <Send size={16} /> Send Now
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-twc-text dark:text-twc-white px-4 py-3 rounded-[14px] text-[11px] font-bold uppercase tracking-widest border border-twc-nude/50 dark:border-zinc-700/50 hover:bg-twc-beige dark:hover:bg-zinc-700 transition-all shadow-sm">
                    <Clock size={16} /> Schedule
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 text-twc-muted hover:text-twc-text dark:hover:text-twc-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all mt-2">
                    <Mail size={14} /> Send Test Email
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-twc-gold/10 backdrop-blur-xl rounded-[24px] p-6 border border-twc-gold/20">
               <div className="flex items-center gap-2 text-twc-gold mb-2">
                 <Sparkles size={16}/>
                 <h4 className="font-serif font-bold text-[14px]">Templates</h4>
               </div>
               <p className="text-[12px] text-twc-text/80 dark:text-zinc-300 mb-4">Start quickly with our premium converting templates.</p>
               <button className="w-full text-center bg-white/60 dark:bg-zinc-800/60 py-2 rounded-xl text-[11px] font-bold text-twc-text dark:text-twc-white uppercase tracking-widest border border-twc-gold/20 hover:bg-white dark:hover:bg-zinc-700 transition-colors">
                 Browse Templates
               </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-zinc-900/40">
            <div>
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Subscribers List</h3>
              <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Manage audience segments</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:max-w-xs group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-twc-muted dark:text-zinc-500 group-focus-within:text-twc-gold transition-colors" size={16} />
                <Input 
                  type="text" 
                  placeholder="Search email or name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl bg-white/60 dark:bg-zinc-800/60 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/70 focus:outline-none focus:border-twc-gold focus:ring-2 focus:ring-twc-gold/20 transition-all shadow-sm"
                />
              </div>
              <button className="p-2 rounded-xl border border-twc-nude/50 bg-white hover:bg-twc-beige text-twc-text transition-colors dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:text-twc-white shadow-sm">
                <Download size={16}/>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-twc-beige/30 dark:bg-zinc-950/30 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold border-b border-twc-nude/30 dark:border-zinc-800/50">
                  <th className="py-4 pl-6">Profile</th>
                  <th className="py-4">Country</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Subscription Date</th>
                  <th className="py-4">Last Activity</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, idx) => (
                  <tr key={idx} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-twc-beige dark:bg-zinc-800 flex items-center justify-center text-twc-gold font-bold font-serif border border-twc-nude/50 dark:border-zinc-700/50">
                          {sub.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[13px] text-twc-text dark:text-twc-white group-hover:text-twc-gold transition-colors">{sub.name}</p>
                          <p className="text-[11px] font-semibold text-twc-muted mt-0.5">{sub.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{sub.country}</p>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="text-[12px] font-semibold text-twc-text dark:text-zinc-300">{sub.date}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-[12px] font-semibold text-twc-text dark:text-zinc-300">{sub.lastActivity}</p>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <button className="text-[11px] font-bold text-twc-text dark:text-twc-white bg-twc-beige dark:bg-zinc-800 px-3 py-1.5 rounded-lg hover:bg-twc-nude dark:hover:bg-zinc-700 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminNewsletterPage;
