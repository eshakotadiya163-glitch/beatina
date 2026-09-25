import { useState } from 'react';
import { 
  Settings, User, Briefcase, CreditCard, Truck, Mail, MessageCircle, 
  Bell, Globe, Shield, Layout, Share2, FileText, Package, Sparkles, 
  Database, Image as ImageIcon, Save, Search, Download
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { toast } from 'react-hot-toast';

// Custom Toggle Switch Component
const Toggle = ({ active: initialActive }: { active: boolean }) => {
  const [active, setActive] = useState(initialActive);
  return (
    <div 
      onClick={() => setActive(!active)}
      className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer flex items-center shrink-0 ${active ? 'bg-green-500' : 'bg-red-500'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
  );
};

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  const settingsSections = [
    {
      title: 'GENERAL',
      items: [
        { id: 'general', label: 'General Settings', icon: <Settings size={18} /> },
        { id: 'profile', label: 'Admin Profile', icon: <User size={18} /> },
        { id: 'business', label: 'Business Info', icon: <Briefcase size={18} /> },
      ]
    },
    {
      title: 'COMMERCE',
      items: [
        { id: 'payment', label: 'Payment Settings', icon: <CreditCard size={18} /> },
        { id: 'shipping', label: 'Shipping Settings', icon: <Truck size={18} /> },
        { id: 'product', label: 'Product Settings', icon: <Package size={18} /> },
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { id: 'smtp', label: 'SMTP Email', icon: <Mail size={18} /> },
        { id: 'whatsapp', label: 'WhatsApp API', icon: <MessageCircle size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'social', label: 'Social Media', icon: <Share2 size={18} /> },
      ]
    },
    {
      title: 'SYSTEM & ADVANCED',
      items: [
        { id: 'appearance', label: 'Appearance', icon: <Layout size={18} /> },
        { id: 'seo', label: 'SEO Settings', icon: <Globe size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
        { id: 'legal', label: 'Legal Pages', icon: <FileText size={18} /> },
        { id: 'backup', label: 'Backup & Restore', icon: <Database size={18} /> },
        { id: 'ai', label: 'AI Features', icon: <Sparkles size={18} /> },
      ]
    }
  ];

  return (
    <div className="font-body pb-10">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.success('Settings saved successfully')}
            className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-6 py-2.5 rounded-[14px] text-[11px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Settings Sidebar Navigation */}
        <div className="w-full md:w-96 shrink-0 space-y-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 sticky top-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-twc-muted" size={14} />
            <Input type="text" placeholder="Search settings..." className="w-full pl-9 py-2 border-none bg-twc-beige/30 dark:bg-zinc-800/50 rounded-xl text-[12px]" />
          </div>
          <div className="h-[75vh] overflow-y-auto no-scrollbar pr-2 space-y-7 pb-4">
            {settingsSections.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <p className="px-4 text-[10px] font-bold text-twc-muted dark:text-zinc-500 uppercase tracking-[0.15em] mb-3">
                  {section.title}
                </p>
                {section.items.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left text-[14px] font-semibold transition-all duration-300 ${activeTab === tab.id ? 'bg-white dark:bg-zinc-800 text-twc-text dark:text-twc-gold shadow-sm border border-twc-nude/50 dark:border-zinc-700/50' : 'text-twc-muted dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/30 hover:text-twc-text dark:hover:text-twc-white'}`}
                  >
                    <span className={activeTab === tab.id ? 'text-twc-gold' : 'text-twc-muted/70 dark:text-zinc-500'}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-white/50 dark:border-zinc-800/50 animate-in fade-in slide-in-from-right-4 duration-500 min-h-[60vh]">
          
          {activeTab === 'general' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">General Settings</h3>
                <p className="text-[12px] text-twc-muted">Configure your basic store details.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Store Name</label>
                  <Input type="text" defaultValue="The Wellness Co." className="w-full border-twc-nude/50 bg-white dark:bg-zinc-800/50" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Logo Upload</label>
                    <div className="border-2 border-dashed border-twc-nude/50 dark:border-zinc-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-twc-beige/20 dark:hover:bg-zinc-800/30">
                      <ImageIcon size={24} className="text-twc-gold mb-2" />
                      <p className="text-[11px] font-bold text-twc-text dark:text-twc-white">Upload Logo</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Favicon</label>
                    <div className="border-2 border-dashed border-twc-nude/50 dark:border-zinc-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-twc-beige/20 dark:hover:bg-zinc-800/30">
                      <ImageIcon size={24} className="text-twc-gold mb-2" />
                      <p className="text-[11px] font-bold text-twc-text dark:text-twc-white">Upload Favicon</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Currency</label>
                    <select className="w-full appearance-none bg-white/80 dark:bg-zinc-800/80 border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-xl text-[13px] font-bold focus:outline-none focus:border-twc-gold">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Timezone</label>
                    <select className="w-full appearance-none bg-white/80 dark:bg-zinc-800/80 border border-twc-nude/50 dark:border-zinc-700/50 text-twc-text dark:text-twc-white px-4 py-2.5 rounded-xl text-[13px] font-bold focus:outline-none focus:border-twc-gold">
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New_York (EST)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Payment Gateways</h3>
                <p className="text-[12px] text-twc-muted">Configure how customers pay for orders.</p>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Razorpay', status: true, desc: 'Accept cards, UPI, and netbanking in India.' },
                  { name: 'Stripe', status: false, desc: 'Accept international credit cards.' },
                  { name: 'PayPal', status: false, desc: 'Accept payments globally via PayPal.' },
                  { name: 'Cash on Delivery (COD)', status: true, desc: 'Allow customers to pay upon delivery.' },
                  { name: 'Direct UPI', status: true, desc: 'Show UPI QR code at checkout.' },
                ].map((gateway, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl bg-white/50 dark:bg-zinc-800/30">
                    <div>
                      <p className="font-bold text-[13px] text-twc-text dark:text-twc-white">{gateway.name}</p>
                      <p className="text-[11px] text-twc-muted mt-0.5">{gateway.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {gateway.name !== 'Cash on Delivery (COD)' && gateway.name !== 'Direct UPI' && (
                        <button className="text-[10px] font-bold uppercase tracking-widest text-twc-gold hover:underline">Configure</button>
                      )}
                      <Toggle active={gateway.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1 flex items-center gap-2">AI Features <Sparkles size={20} className="text-twc-gold"/></h3>
                <p className="text-[12px] text-twc-muted">Enable artificial intelligence tools across your admin panel.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'AI Product Descriptions', status: true, desc: 'Auto-generate high-converting product descriptions.' },
                  { name: 'AI SEO Generator', status: true, desc: 'Automatically generate meta titles and descriptions.' },
                  { name: 'AI Blog Assistant', status: true, desc: 'Get content ideas and writing assistance for blogs.' },
                  { name: 'AI Email Writer', status: false, desc: 'Draft newsletters and marketing emails instantly.' },
                ].map((feature, idx) => (
                  <div key={idx} className="p-5 border border-twc-gold/20 rounded-[20px] bg-gradient-to-br from-twc-beige/30 to-twc-gold/5 dark:from-zinc-800/50 dark:to-zinc-900 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Sparkles size={16} className="text-twc-gold" />
                        <Toggle active={feature.status} />
                      </div>
                      <p className="font-bold text-[14px] text-twc-text dark:text-twc-white mb-1">{feature.name}</p>
                      <p className="text-[12px] text-twc-muted leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Security & Access</h3>
                <p className="text-[12px] text-twc-muted">Manage authentication and protect your store data.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl bg-white/50 dark:bg-zinc-800/30">
                  <div>
                    <p className="font-bold text-[14px] text-twc-text dark:text-twc-white">Two-Factor Authentication (2FA)</p>
                    <p className="text-[12px] text-twc-muted mt-0.5">Require an extra code when logging in.</p>
                  </div>
                  <Toggle active={true} />
                </div>

                <div>
                  <h4 className="text-[12px] font-bold text-twc-muted uppercase tracking-widest mb-3">Recent Login Activity</h4>
                  <div className="border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-twc-beige/30 dark:bg-zinc-950/30 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold border-b border-twc-nude/30 dark:border-zinc-800/50">
                          <th className="py-3 pl-4">Device</th>
                          <th className="py-3">Location</th>
                          <th className="py-3">Time</th>
                          <th className="py-3 pr-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-twc-nude/10 dark:border-zinc-800/30">
                          <td className="py-3 pl-4 text-[12px] font-bold text-twc-text dark:text-twc-white">Chrome on Mac OS</td>
                          <td className="py-3 text-[12px] text-twc-muted">Mumbai, India</td>
                          <td className="py-3 text-[12px] text-twc-muted">Just now</td>
                          <td className="py-3 pr-4 text-right"><span className="text-[10px] bg-twc-sage/10 text-twc-sage px-2 py-1 rounded font-bold uppercase tracking-widest">Active</span></td>
                        </tr>
                        <tr>
                          <td className="py-3 pl-4 text-[12px] font-bold text-twc-text dark:text-twc-white">Safari on iPhone</td>
                          <td className="py-3 text-[12px] text-twc-muted">Delhi, India</td>
                          <td className="py-3 text-[12px] text-twc-muted">2 days ago</td>
                          <td className="py-3 pr-4 text-right"><span className="text-[10px] text-twc-muted px-2 py-1 uppercase font-bold tracking-widest">Logged out</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Admin Profile</h3><p className="text-[12px] text-twc-muted">Manage your personal admin account details.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">First Name</label><Input type="text" defaultValue="Admin" className="w-full" /></div>
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Last Name</label><Input type="text" defaultValue="User" className="w-full" /></div>
                </div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Email Address</label><Input type="email" defaultValue="admin@thewellnessco.in" className="w-full" /></div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">New Password</label><Input type="password" placeholder="••••••••" className="w-full" /></div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Business Info</h3><p className="text-[12px] text-twc-muted">Update your company's registered information.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Company Name</label><Input type="text" defaultValue="Women's India Personal Care Pvt. Ltd." className="w-full" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">GST / Tax ID</label><Input type="text" placeholder="27XXXXX1234X1ZX" className="w-full" /></div>
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Support Phone</label><Input type="text" placeholder="+91 98765 43210" className="w-full" /></div>
                </div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Registered Address</label><Input type="text" defaultValue="First Floor, Local Shopping Complex, 7, Panchsheel Marg, Panchsheel Park North, Panchsheel Park, New Delhi, Delhi 110017" className="w-full" /></div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Shipping Settings</h3><p className="text-[12px] text-twc-muted">Set delivery rates and thresholds.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Standard Shipping Rate (₹)</label><Input type="number" defaultValue="50" className="w-full" /></div>
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Free Shipping Above (₹)</label><Input type="number" defaultValue="999" className="w-full" /></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-twc-nude/30 dark:border-zinc-700/50">
                   <p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Enable International Shipping</p>
                   <Toggle active={false} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">SMTP Email</h3><p className="text-[12px] text-twc-muted">Configure outgoing email server for notifications.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">SMTP Server</label><Input type="text" placeholder="smtp.gmail.com" className="w-full" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">SMTP Port</label><Input type="text" placeholder="587" className="w-full" /></div>
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">SMTP Username</label><Input type="text" placeholder="info@thewellnessco.in" className="w-full" /></div>
                </div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">SMTP Password</label><Input type="password" placeholder="••••••••••••••••" className="w-full" /></div>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">WhatsApp API</h3><p className="text-[12px] text-twc-muted">Integrate WhatsApp for order updates.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Access Token</label><Input type="password" placeholder="EAADX..." className="w-full" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Phone Number ID</label><Input type="text" placeholder="104..." className="w-full" /></div>
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Business Account ID</label><Input type="text" placeholder="112..." className="w-full" /></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-twc-nude/30 dark:border-zinc-700/50">
                   <p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Enable WhatsApp Notifications</p>
                   <Toggle active={true} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Notifications</h3><p className="text-[12px] text-twc-muted">Control which alerts are sent to customers and admins.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div className="flex items-center justify-between"><p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Order Confirmation Emails</p><Toggle active={true} /></div>
                <div className="flex items-center justify-between"><p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Shipping Updates (SMS)</p><Toggle active={true} /></div>
                <div className="flex items-center justify-between"><p className="font-bold text-[13px] text-twc-text dark:text-twc-white">New Review Alerts to Admin</p><Toggle active={false} /></div>
                <div className="flex items-center justify-between"><p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Low Stock Alerts</p><Toggle active={true} /></div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">SEO Settings</h3><p className="text-[12px] text-twc-muted">Optimize your store for search engines.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Default Meta Title</label><Input type="text" defaultValue="The Wellness Co. | Premium Skincare" className="w-full" /></div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Default Meta Description</label><textarea className="w-full border-twc-nude/50 bg-white dark:bg-zinc-900/50 rounded-xl p-3 text-sm focus:outline-none focus:border-twc-gold" rows={3} defaultValue="Discover premium skincare and wellness products tailored for you."></textarea></div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Google Analytics ID</label><Input type="text" placeholder="G-XXXXXXXXXX" className="w-full" /></div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Appearance</h3><p className="text-[12px] text-twc-muted">Customize the look and feel of your store.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Primary Brand Color</label><Input type="color" defaultValue="#D4AF37" className="w-full h-10 p-1 cursor-pointer" /></div>
                  <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Secondary Color</label><Input type="color" defaultValue="#4A6B38" className="w-full h-10 p-1 cursor-pointer" /></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-twc-nude/30 dark:border-zinc-700/50">
                   <p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Enable Dark Mode Toggle for Customers</p>
                   <Toggle active={true} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Social Media</h3><p className="text-[12px] text-twc-muted">Link your social profiles to the storefront footer.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Instagram URL</label><Input type="url" placeholder="https://instagram.com/thewellnessco" className="w-full" /></div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Facebook URL</label><Input type="url" placeholder="https://facebook.com/thewellnessco" className="w-full" /></div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Twitter/X URL</label><Input type="url" placeholder="https://twitter.com/thewellnessco" className="w-full" /></div>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Legal Pages</h3><p className="text-[12px] text-twc-muted">Manage policy links for checkout and footer.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Privacy Policy URL Path</label><Input type="text" defaultValue="/privacy-policy" className="w-full" /></div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Terms of Service URL Path</label><Input type="text" defaultValue="/terms" className="w-full" /></div>
                <div><label className="block text-[11px] font-bold text-twc-muted uppercase tracking-widest mb-2">Refund Policy URL Path</label><Input type="text" defaultValue="/refund-policy" className="w-full" /></div>
              </div>
            </div>
          )}

          {activeTab === 'product' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Product Settings</h3><p className="text-[12px] text-twc-muted">Configure how products are displayed.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div className="flex items-center justify-between"><p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Show Out of Stock Products</p><Toggle active={true} /></div>
                <div className="flex items-center justify-between"><p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Enable Product Reviews</p><Toggle active={true} /></div>
                <div className="flex items-center justify-between"><p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Auto-approve Reviews</p><Toggle active={false} /></div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-3xl">
              <div><h3 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-1">Backup & Restore</h3><p className="text-[12px] text-twc-muted">Keep your store data safe.</p></div>
              <div className="space-y-5 p-6 border border-twc-nude/50 dark:border-zinc-700/50 rounded-2xl bg-white/40 dark:bg-zinc-800/30">
                <div className="flex items-center justify-between"><p className="font-bold text-[13px] text-twc-text dark:text-twc-white">Enable Automated Daily Backups</p><Toggle active={true} /></div>
                <div className="pt-4 border-t border-twc-nude/30 dark:border-zinc-700/50">
                   <button 
                     onClick={() => {
                        const backupData = { status: "success", timestamp: new Date().toISOString(), data: "Store backup successful" };
                        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `database-backup-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        toast.success('Backup downloaded successfully');
                     }}
                     className="flex items-center justify-center w-full gap-2 bg-twc-gold/10 text-twc-gold px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[12px] hover:bg-twc-gold/20 transition-colors">
                     <Download size={16} /> Download Latest Database Backup
                   </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
