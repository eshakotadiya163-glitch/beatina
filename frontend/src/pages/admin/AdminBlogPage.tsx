import React, { useState } from 'react';
import { 
  FileText, Edit3, Image as ImageIcon, Eye, Clock, MessageSquare, 
  ThumbsUp, Share2, Sparkles, Plus, Search, Calendar, CheckCircle, 
  MoreHorizontal, Type, LayoutTemplate, Trash2, ArrowUpRight, 
  BarChart2, Globe
} from 'lucide-react';
import { 
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Input } from '../../components/ui/input';

// MOCK DATA
const viewsData = [
  { name: 'Mon', views: 1200 },
  { name: 'Tue', views: 1500 },
  { name: 'Wed', views: 1400 },
  { name: 'Thu', views: 1900 },
  { name: 'Fri', views: 1700 },
  { name: 'Sat', views: 2400 },
  { name: 'Sun', views: 3100 },
];

const trafficData = [
  { name: 'Organic Search', value: 45, color: '#C8A96A' },
  { name: 'Social Media', value: 30, color: '#88b070' },
  { name: 'Direct', value: 15, color: '#3f3f46' },
  { name: 'Referral', value: 10, color: '#a1a1aa' },
];

const blogs = [
  { id: 1, title: '5 Essential Steps for Hydrated Summer Skin', category: 'Skincare Tips', author: 'Dr. Neha Patel', status: 'Published', views: '12.4K', date: 'Jul 28, 2026', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=150&h=150&fit=crop' },
  { id: 2, title: 'The Science Behind Vitamin C Serums', category: 'Ingredients', author: 'TWC Editorial', status: 'Published', views: '8.2K', date: 'Jul 24, 2026', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=150&h=150&fit=crop' },
  { id: 3, title: 'Morning vs Night Routine: What\'s the Difference?', category: 'Beauty Routine', author: 'Riya Singh', status: 'Draft', views: '-', date: 'Aug 02, 2026', image: null },
  { id: 4, title: 'Why You Need Niacinamide in 2026', category: 'Ingredients', author: 'TWC Editorial', status: 'Scheduled', views: '-', date: 'Aug 05, 2026', image: 'https://images.unsplash.com/photo-1571781537158-6932f91eb70f?q=80&w=150&h=150&fit=crop' },
];

const comments = [
  { id: 1, author: 'Sanya K.', text: 'This was so helpful! I always struggled with dry skin in AC environments. Will try the squalane oil recommendation.', post: '5 Essential Steps for Hydrated...', date: '2 hours ago', status: 'Pending' },
  { id: 2, author: 'Priya', text: 'Does this serum contain artificial fragrance?', post: 'The Science Behind Vitamin C...', date: 'Yesterday', status: 'Pending' },
  { id: 3, author: 'Anonymous', text: 'Buy cheap followers here www.spam.com', post: 'The Science Behind Vitamin C...', date: 'Yesterday', status: 'Spam' },
];

const AdminBlogPage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, editor, comments, analytics
  const [searchTerm, setSearchTerm] = useState('');
  
  // Editor States
  const [seoTitle, setSeoTitle] = useState('5 Essential Steps for Hydrated Summer Skin | TWC');
  const [seoDesc, setSeoDesc] = useState('Discover the ultimate summer skincare routine. Learn how to keep your skin hydrated, glowing, and protected during the hot summer months.');

  const kpis = [
    { title: 'Total Blogs', value: '42', icon: <FileText size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Published', value: '38', icon: <CheckCircle size={18} />, color: 'text-twc-sage', bg: 'bg-twc-sage/20' },
    { title: 'Drafts', value: '4', icon: <Edit3 size={18} />, color: 'text-twc-gold', bg: 'bg-twc-gold/10' },
    { title: 'Total Views', value: '124.5K', icon: <Eye size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Comments', value: '1,284', icon: <MessageSquare size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
    { title: 'Avg. Read Time', value: '4m 12s', icon: <Clock size={18} />, color: 'text-twc-text dark:text-twc-white', bg: 'bg-twc-nude/30 dark:bg-zinc-800' },
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
                 {entry.name}: {entry.value.toLocaleString()}{entry.name === 'Organic Search' ? '%' : ''}
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
      case 'Published': return 'bg-twc-sage/10 text-twc-sage border-twc-sage/20';
      case 'Scheduled': return 'bg-twc-gold/10 text-twc-gold border-twc-gold/20';
      case 'Draft': return 'bg-twc-muted/10 text-twc-muted border-twc-muted/20';
      case 'Pending': return 'bg-twc-gold/10 text-twc-gold border-twc-gold/20';
      case 'Spam': return 'bg-[#e53e3e]/10 text-[#e53e3e] border-[#e53e3e]/20';
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
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted hover:text-twc-text dark:hover:text-twc-white'}`}
            >
              Editor
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${activeTab === 'comments' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted hover:text-twc-text dark:hover:text-twc-white'}`}
            >
              Comments <span className="bg-twc-gold text-white text-[9px] px-1.5 py-0.5 rounded-md">2</span>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-[12px] text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white shadow-sm' : 'text-twc-muted hover:text-twc-text dark:hover:text-twc-white'}`}
            >
              Analytics
            </button>
          </div>
          <button onClick={() => setActiveTab('editor')} className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-5 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md ml-2">
            <Plus size={14} /> New Post
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* AI Blog Assistant */}
          <div className="bg-gradient-to-r from-twc-beige/50 via-twc-nude/30 to-twc-gold/10 dark:from-zinc-900 dark:via-zinc-800 dark:to-twc-gold/5 backdrop-blur-xl rounded-[24px] p-6 shadow-sm border border-twc-gold/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-twc-gold/10 rounded-full blur-3xl group-hover:bg-twc-gold/20 transition-colors duration-1000"></div>
            <div className="flex items-start gap-4 relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-zinc-800/50 flex items-center justify-center text-twc-gold shadow-sm border border-twc-gold/30">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-twc-text dark:text-twc-white">AI Blog Assistant</h3>
                <p className="text-[12px] text-twc-muted mt-0.5">Content & SEO optimizations</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 relative z-10 w-full md:w-auto justify-start md:justify-end">
              <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm cursor-pointer hover:bg-white transition-colors">
                ✍️ Generate Draft
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-text dark:text-zinc-200 border border-white/50 dark:border-zinc-700/50 shadow-sm cursor-pointer hover:bg-white transition-colors">
                🔍 Generate SEO Title
              </span>
              <span className="flex items-center gap-1.5 bg-twc-gold/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-twc-gold border border-twc-gold/20 shadow-sm cursor-pointer hover:bg-twc-gold/20 transition-colors">
                ✨ Suggest Keywords
              </span>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[20px] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                    {kpi.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-twc-text dark:text-twc-white">{kpi.value}</h3>
                  <p className="text-[9px] font-bold text-twc-muted uppercase tracking-widest mt-1 truncate">{kpi.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Blog Table */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 overflow-hidden">
            <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-zinc-900/40">
              <div>
                <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">All Posts</h3>
                <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Manage your journal entries</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:max-w-xs group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-twc-muted dark:text-zinc-500 group-focus-within:text-twc-gold transition-colors" size={16} />
                  <Input 
                    type="text" 
                    placeholder="Search posts..." 
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
                    <th className="py-4 pl-6">Post</th>
                    <th className="py-4">Category</th>
                    <th className="py-4">Status</th>
                    <th className="py-4">Views</th>
                    <th className="py-4">Date</th>
                    <th className="py-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, idx) => (
                    <tr key={idx} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-twc-beige dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-twc-nude/50 dark:border-zinc-700/50 shrink-0">
                            {blog.image ? (
                              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={16} className="text-twc-muted" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[13px] text-twc-text dark:text-twc-white group-hover:text-twc-gold transition-colors line-clamp-1">{blog.title}</p>
                            <p className="text-[11px] font-semibold text-twc-muted mt-0.5">By {blog.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-[12px] font-bold text-twc-text dark:text-twc-white bg-twc-nude/20 dark:bg-zinc-800 px-2 py-1 rounded-md">{blog.category}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border ${getStatusBadge(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{blog.views}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-[12px] font-semibold text-twc-text dark:text-zinc-300">{blog.date}</p>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-twc-muted hover:text-twc-text dark:hover:text-twc-white transition-colors" title="View"><Eye size={16}/></button>
                          <button className="p-1.5 text-twc-muted hover:text-twc-gold transition-colors" title="Edit"><Edit3 size={16}/></button>
                          <button className="p-1.5 text-twc-muted hover:text-[#e53e3e] transition-colors" title="Delete"><Trash2 size={16}/></button>
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

      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-6">Write Blog Post</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Post Title</label>
                  <Input type="text" placeholder="e.g. 5 Essential Steps for Hydrated Summer Skin" className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50 focus:border-twc-gold text-lg font-serif" />
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Content</label>
                  <div className="border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl overflow-hidden">
                    <div className="bg-twc-beige/30 dark:bg-zinc-800/30 p-2 flex items-center gap-2 border-b border-twc-nude/50 dark:border-zinc-700/50">
                      <select className="bg-white dark:bg-zinc-700 text-twc-text dark:text-twc-white text-[12px] px-2 py-1 rounded border-none focus:outline-none">
                        <option>Paragraph</option>
                        <option>Heading 2</option>
                        <option>Heading 3</option>
                      </select>
                      <div className="w-px h-4 bg-twc-nude/50 dark:bg-zinc-700/50 mx-1"></div>
                      <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-twc-text dark:text-twc-white font-bold">B</button>
                      <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-twc-text dark:text-twc-white italic">I</button>
                      <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-twc-text dark:text-twc-white underline">U</button>
                      <div className="w-px h-4 bg-twc-nude/50 dark:bg-zinc-700/50 mx-1"></div>
                      <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-twc-muted hover:text-twc-text"><ImageIcon size={14}/></button>
                      <button className="p-1.5 rounded hover:bg-white dark:hover:bg-zinc-700 text-twc-muted hover:text-twc-text"><Globe size={14}/></button>
                    </div>
                    <textarea 
                      className="w-full h-[400px] p-6 bg-white dark:bg-zinc-900 text-[14px] leading-relaxed text-twc-text dark:text-twc-white resize-none focus:outline-none font-body"
                      placeholder="Start writing your amazing post here..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Panel */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">SEO Settings</h3>
                 <span className="bg-twc-sage/10 text-twc-sage px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-twc-sage/20 flex items-center gap-1">
                   <Sparkles size={10}/> Score: 92/100
                 </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex justify-between items-center text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">
                      SEO Title <span>{seoTitle.length}/60</span>
                    </label>
                    <Input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full border-twc-nude/50 text-[13px]" />
                  </div>
                  <div>
                    <label className="flex justify-between items-center text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">
                      Meta Description <span>{seoDesc.length}/160</span>
                    </label>
                    <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="w-full h-24 p-3 border border-twc-nude/50 rounded-xl bg-transparent text-[13px] resize-none focus:outline-none focus:border-twc-gold text-twc-text dark:text-twc-white"></textarea>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Focus Keyword</label>
                    <Input type="text" placeholder="e.g. summer skincare routine" className="w-full border-twc-nude/50 text-[13px]" />
                  </div>
                </div>

                {/* Google Search Preview */}
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Google Search Preview</label>
                  <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-twc-nude/50 dark:border-zinc-800/50 shadow-sm">
                    <p className="text-[12px] text-zinc-500 mb-1 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-twc-beige flex items-center justify-center text-[10px] font-serif text-twc-text">TWC</span>
                      https://thetwc.com/blogs/news
                    </p>
                    <h4 className="text-[18px] text-[#1a0dab] dark:text-[#8ab4f8] font-normal hover:underline cursor-pointer mb-1 line-clamp-1">{seoTitle || 'Your SEO Title Here'}</h4>
                    <p className="text-[13px] text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-snug">{seoDesc || 'Your meta description will appear here. Make it compelling to increase CTR.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <h3 className="font-serif font-bold text-twc-text dark:text-twc-white mb-6">Publish</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Status</label>
                  <select className="w-full appearance-none bg-white/80 dark:bg-zinc-800/80 border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-xl text-[12px] font-bold focus:outline-none focus:border-twc-gold transition-colors">
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[9px] font-bold text-twc-muted uppercase tracking-widest mb-1">Publish Date</label>
                  <div className="relative">
                    <Input type="text" placeholder="Immediately" className="w-full pl-8 border-twc-nude/50 text-[12px]" />
                    <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-twc-muted" />
                  </div>
                </div>

                <div className="pt-4 border-t border-twc-nude/50 dark:border-zinc-700/50 space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-4 py-3 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md">
                    <CheckCircle size={16} /> Save & Publish
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-twc-text dark:text-twc-white px-4 py-3 rounded-[14px] text-[11px] font-bold uppercase tracking-widest border border-twc-nude/50 dark:border-zinc-700/50 hover:bg-twc-beige dark:hover:bg-zinc-700 transition-all shadow-sm">
                    <Eye size={16} /> Preview Post
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
              <h3 className="font-serif font-bold text-twc-text dark:text-twc-white mb-6">Organization</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Featured Image</label>
                  <div className="border-2 border-dashed border-twc-nude/50 dark:border-zinc-700/50 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-twc-beige/20 transition-colors cursor-pointer">
                    <ImageIcon size={20} className="text-twc-gold mb-2" />
                    <p className="text-[11px] font-bold text-twc-text dark:text-twc-white">Upload Image</p>
                    <p className="text-[9px] text-twc-muted uppercase tracking-widest mt-1">1200x630px recommended</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Category</label>
                  <select className="w-full appearance-none bg-white/80 dark:bg-zinc-800/80 border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-xl text-[12px] font-bold focus:outline-none focus:border-twc-gold transition-colors">
                    <option>Skincare Tips</option>
                    <option>Ingredients</option>
                    <option>Beauty Routine</option>
                    <option>Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Author</label>
                  <select className="w-full appearance-none bg-white/80 dark:bg-zinc-800/80 border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-xl text-[12px] font-bold focus:outline-none focus:border-twc-gold transition-colors">
                    <option>TWC Editorial</option>
                    <option>Dr. Neha Patel</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-zinc-900/40">
            <div>
              <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Comments Moderation</h3>
              <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Review and reply to readers</p>
            </div>
            <div className="flex items-center gap-2">
               <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-twc-text text-white">Pending</button>
               <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-twc-muted hover:bg-twc-nude/30 dark:hover:bg-zinc-800">Approved</button>
               <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-twc-muted hover:bg-twc-nude/30 dark:hover:bg-zinc-800">Spam</button>
            </div>
          </div>
          
          <div className="divide-y divide-twc-nude/30 dark:divide-zinc-800/50">
             {comments.map(comment => (
               <div key={comment.id} className="p-6 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors flex flex-col md:flex-row gap-4 md:items-center justify-between">
                 <div className="max-w-2xl">
                   <div className="flex items-center gap-2 mb-2">
                     <p className="text-[13px] font-bold text-twc-text dark:text-twc-white">{comment.author}</p>
                     <span className="text-[10px] text-twc-muted">•</span>
                     <p className="text-[11px] text-twc-muted">{comment.date}</p>
                     <span className={`ml-2 inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest border ${getStatusBadge(comment.status)}`}>
                        {comment.status}
                      </span>
                   </div>
                   <p className="text-[13px] text-twc-text/90 dark:text-zinc-300 leading-relaxed mb-2">"{comment.text}"</p>
                   <p className="text-[11px] font-semibold text-twc-gold hover:underline cursor-pointer">On: {comment.post}</p>
                 </div>
                 
                 <div className="flex items-center gap-2 shrink-0">
                   <button className="bg-twc-sage/10 text-twc-sage px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-twc-sage/20 transition-colors border border-twc-sage/20">
                     Approve
                   </button>
                   <button className="bg-white dark:bg-zinc-800 text-twc-text dark:text-twc-white border border-twc-nude/50 dark:border-zinc-700/50 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-twc-beige dark:hover:bg-zinc-700 transition-colors">
                     Reply
                   </button>
                   <button className="bg-[#e53e3e]/10 text-[#e53e3e] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#e53e3e]/20 transition-colors border border-[#e53e3e]/20">
                     Spam
                   </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Blog Traffic</h3>
                    <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Total page views</p>
                  </div>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBlogViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C8A96A" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#C8A96A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-twc-nude)" strokeOpacity={0.4} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-twc-muted)', fontWeight: 600 }} tickFormatter={(val) => `${val/1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="views" name="Views" stroke="#C8A96A" strokeWidth={3} fillOpacity={1} fill="url(#colorBlogViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white">Traffic Sources</h3>
                    <p className="text-[11px] font-bold text-twc-muted uppercase tracking-widest mt-1">Where readers come from</p>
                  </div>
                </div>
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {trafficData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-twc-text dark:text-twc-white">100%</span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {trafficData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[12px] font-bold text-twc-text dark:text-twc-white">{item.name}</span>
                      </div>
                      <span className="text-[12px] font-bold text-twc-muted">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default AdminBlogPage;
