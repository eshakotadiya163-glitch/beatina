import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, 
  Settings, LogOut, ShieldAlert,
  Search, Bell, Menu, Package, Grid, ShoppingBag, 
  Sun, Moon,
  ArrowLeft
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: notifications = [] } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data;
    },
    refetchInterval: 30000,
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.put('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    }
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  const hasUnread = unreadCount > 0;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'staff' && !user.isAdmin)) {
    return (
      <div className="h-screen flex items-center justify-center bg-twc-beige dark:bg-zinc-950">
        <div className="text-center p-8 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-[24px] shadow-lg border border-white/50 dark:border-zinc-800/50 max-w-md w-full">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-twc-text dark:text-twc-white mb-2">Access Denied</h2>
          <p className="text-twc-muted dark:text-zinc-400 mb-6 font-body">You do not have permission to view the Admin Dashboard.</p>
          <Link to="/" className="inline-flex h-12 items-center justify-center rounded-[18px] bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-8 text-sm font-bold uppercase tracking-widest transition-all hover:bg-twc-gold hover:text-white">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} />, permission: 'read_dashboard' }
      ]
    },
    {
      title: 'STORE',
      items: [
        { name: 'Products', path: '/admin/products', icon: <Package size={18} />, permission: 'manage_products' },
        { name: 'Categories', path: '/admin/categories', icon: <Grid size={18} />, permission: 'manage_categories' }
      ]
    },
    {
      title: 'SALES & CUSTOMERS',
      items: [
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} />, permission: 'manage_orders' },
        { name: 'Customers', path: '/admin/users', icon: <Users size={18} />, permission: 'manage_customers' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} />, permission: 'manage_settings' }
      ]
    }
  ];

  const isVisible = (permission: string) => {
    if (user.role === 'superadmin' || user.role === 'admin' || user.isAdmin) return true;
    return user.permissions?.includes(permission);
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Dashboard Overview';
    const activeItem = navSections.flatMap(s => s.items).find(i => location.pathname.startsWith(i.path) && i.path !== '/admin');
    return activeItem ? activeItem.name : 'Dashboard Overview';
  };

  const isSettingsPage = location.pathname.startsWith('/admin/settings');

  return (
    <div className="min-h-screen bg-[#F8F5F2] dark:bg-zinc-950 flex font-body text-twc-text dark:text-twc-white transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-twc-text/20 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm transition-all" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Elegant Glass Sidebar */}
      {!isSettingsPage && (
        <aside className={`
          fixed inset-y-4 left-4 z-50 w-[280px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-white/50 dark:border-zinc-800/50 rounded-[24px]
          transform transition-all duration-300 ease-in-out flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'} 
          md:translate-x-0 md:sticky md:top-4 md:ml-4 md:flex md:h-[calc(100vh-2rem)] self-start
        `}>
          {/* Luxury Logo Area */}
        <div className="h-24 flex flex-col justify-center px-8 border-b border-twc-nude/30 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-twc-text dark:bg-twc-gold rounded-xl flex items-center justify-center text-twc-white dark:text-twc-text shadow-md">
               <span className="font-serif font-bold text-xl leading-none">T</span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-[22px] tracking-tight leading-tight text-twc-text dark:text-twc-white">TWC</h2>
              <p className="text-[10px] text-twc-gold font-bold uppercase tracking-[0.2em] mt-0.5">Admin Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-7 overflow-y-auto no-scrollbar">
          {navSections.map((section, idx) => {
            const visibleItems = section.items.filter(item => isVisible(item.permission));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1.5">
                {section.title !== 'MAIN' && (
                  <p className="px-4 text-[10px] font-bold text-twc-muted dark:text-zinc-500 uppercase tracking-[0.15em] mb-3">
                    {section.title}
                  </p>
                )}
                {visibleItems.map((item) => {
                  const isActive = item.path === '/admin' 
                    ? location.pathname === '/admin' 
                    : location.pathname.startsWith(item.path);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-[16px] transition-all duration-300 text-[13px] font-semibold ${
                        isActive 
                          ? 'bg-white dark:bg-zinc-800 text-twc-text dark:text-twc-gold shadow-sm border border-twc-nude/50 dark:border-zinc-700/50' 
                          : 'text-twc-muted dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/30 hover:text-twc-text dark:hover:text-twc-white'
                      }`}
                    >
                      <span className={isActive ? 'text-twc-gold' : 'text-twc-muted/70 dark:text-zinc-500'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            );
          })}
        </nav>

        {/* Profile / Bottom Area */}
        <div className="p-4 mt-auto border-t border-twc-nude/30 dark:border-zinc-800/50">
          <Link to="/" className="flex items-center justify-center space-x-2 w-full px-4 py-3.5 text-[12px] uppercase tracking-widest font-bold text-twc-text dark:text-twc-white bg-transparent border border-twc-text/10 dark:border-twc-white/10 hover:bg-twc-text hover:text-white dark:hover:bg-twc-white dark:hover:text-twc-text rounded-[16px] transition-all duration-300">
            <span>View Storefront</span>
          </Link>
        </div>
      </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-28 flex items-center justify-between px-8 z-30 transition-colors duration-300">
          <div className="flex items-center flex-1 min-w-0">
            {isSettingsPage && (
              <button 
                onClick={() => navigate('/admin')} 
                className="mr-5 w-10 h-10 rounded-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-white/50 dark:border-zinc-800/50 flex items-center justify-center text-twc-text dark:text-twc-white hover:text-twc-gold hover:border-twc-gold/50 transition-all shadow-sm"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            {!isSettingsPage && (
              <button 
                className="md:hidden mr-4 text-twc-text dark:text-twc-white hover:text-twc-gold focus:outline-none bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white/50 dark:border-zinc-800/50"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
            )}
            <div className="hidden sm:block">
               <h1 className="text-3xl font-serif font-bold text-twc-text dark:text-twc-white tracking-tight">{getPageTitle()}</h1>
               <p className="text-sm text-twc-muted dark:text-zinc-400 mt-1 font-body">Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}, {user.firstName}! Here's your store overview.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Elegant Search Bar */}
            <div className="hidden lg:flex items-center relative w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-twc-muted dark:text-zinc-500 group-focus-within:text-twc-gold transition-colors z-10 pointer-events-none" size={16} />
              <input 
                type="text" 
                placeholder="Search orders, products..." 
                className="w-full pl-11 pr-10 py-3 border border-white/50 dark:border-zinc-800/50 rounded-[18px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/70 focus:outline-none focus:border-twc-gold focus:ring-4 focus:ring-twc-gold/10 transition-all shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value.trim();
                    if (val) {
                      if (val.toLowerCase().includes('ord') || !isNaN(Number(val))) {
                        navigate(`/admin/orders?search=${encodeURIComponent(val)}`);
                      } else {
                        navigate(`/admin/products?search=${encodeURIComponent(val)}`);
                      }
                    }
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center bg-twc-text/5 dark:bg-white/10 rounded-md text-[10px] font-bold text-twc-muted dark:text-zinc-400 px-2 py-1 pointer-events-none">
                ⌘K
              </div>
            </div>

            <div className="flex items-center space-x-3 pl-4 relative">
               {/* Notifications */}
               <div className="relative">
                 <button 
                   onClick={() => setShowNotifications(!showNotifications)}
                   className={`relative w-12 h-12 rounded-[18px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border ${showNotifications ? 'border-twc-gold text-twc-gold' : 'border-white/50 dark:border-zinc-800/50 text-twc-text dark:text-twc-white'} flex items-center justify-center hover:text-twc-gold hover:border-twc-gold/50 transition-all shadow-sm`}
                 >
                   <Bell size={18} />
                   {hasUnread && (
                     <span className="absolute top-2 right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-[#e53e3e] text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-zinc-900">
                       {unreadCount}
                     </span>
                   )}
                 </button>
                                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                      <div className="absolute right-0 mt-3 w-80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 dark:border-zinc-800/50 overflow-hidden z-50">
                        <div className="px-5 py-4 border-b border-twc-nude/30 dark:border-zinc-800/50 flex justify-between items-center">
                          <h3 className="font-serif font-bold text-twc-text dark:text-twc-white">Notifications</h3>
                           {hasUnread && (
                             <span 
                               onClick={() => markAllReadMutation.mutate()}
                               className="text-[11px] text-twc-gold font-bold uppercase tracking-widest cursor-pointer hover:opacity-80"
                             >
                               Mark Read
                             </span>
                           )}
                        </div>
                        <div className={`overflow-y-auto transition-all duration-300 ${showAllNotifications ? 'max-h-[65vh]' : 'max-h-[300px]'}`}>
                          {notifications.length === 0 ? (
                            <div className="px-5 py-8 text-center">
                              <p className="text-sm text-twc-muted font-medium">No notifications yet</p>
                            </div>
                          ) : (
                            <>
                              {(showAllNotifications ? notifications : notifications.slice(0, 5)).map((notification: any) => (
                                <div key={notification._id} className={`px-5 py-4 border-b border-twc-nude/20 dark:border-zinc-800/30 hover:bg-white dark:hover:bg-zinc-800 cursor-pointer transition-colors ${!notification.isRead ? 'bg-twc-gold/5 dark:bg-twc-gold/10' : ''}`}>
                                  <p className="text-sm text-twc-text dark:text-twc-white font-medium">{notification.title}</p>
                                  <p className="text-[11px] text-twc-muted mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                       <div className="p-3 bg-twc-beige/30 dark:bg-zinc-950/50 border-t border-twc-nude/30 dark:border-zinc-800/50">
                         <button 
                           onClick={() => setShowAllNotifications(!showAllNotifications)}
                           className="w-full text-center text-[11px] font-bold text-twc-text dark:text-twc-white uppercase tracking-widest hover:text-twc-gold transition-colors py-2"
                         >
                           {showAllNotifications ? 'Show Less' : 'Show More'}
                         </button>
                       </div>
                     </div>
                   </>
                 )}
               </div>

               {/* Theme Toggle */}
               <button 
                 onClick={toggleTheme}
                 className="w-12 h-12 rounded-[18px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-white/50 dark:border-zinc-800/50 flex items-center justify-center text-twc-text dark:text-twc-white hover:text-twc-gold hover:border-twc-gold/50 transition-all shadow-sm"
               >
                 {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
               </button>

               {/* Profile Dropdown */}
               <div className="relative ml-2">
                 <div 
                   onClick={() => setShowProfileMenu(!showProfileMenu)}
                   className={`h-12 px-2 pr-4 rounded-[18px] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border ${showProfileMenu ? 'border-twc-gold' : 'border-white/50 dark:border-zinc-800/50'} flex items-center justify-center hover:border-twc-gold/50 transition-all shadow-sm cursor-pointer gap-3`}
                 >
                   <div className="w-8 h-8 rounded-xl bg-twc-text dark:bg-twc-white flex items-center justify-center text-twc-white dark:text-twc-text text-sm font-bold shadow-sm">
                      {user.firstName[0]}
                   </div>
                   <div className="hidden md:block text-left">
                     <p className="text-[13px] font-bold text-twc-text dark:text-twc-white leading-tight">{user.firstName}</p>
                     <p className="text-[10px] text-twc-muted leading-tight uppercase tracking-widest">{user.role}</p>
                   </div>
                 </div>
                 
                 {showProfileMenu && (
                   <>
                     <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                     <div className="absolute right-0 mt-3 w-56 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 dark:border-zinc-800/50 overflow-hidden z-50 p-2">
                       <div className="px-4 py-3 border-b border-twc-nude/30 dark:border-zinc-800/50 mb-2">
                         <p className="text-sm font-bold text-twc-text dark:text-twc-white">{user.firstName} {user.lastName}</p>
                         <p className="text-[11px] text-twc-muted mt-0.5 truncate">{user.email}</p>
                       </div>
                       <Link to="/admin/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-twc-text dark:text-twc-white hover:bg-twc-beige dark:hover:bg-zinc-800 rounded-xl transition-colors">
                         <Settings size={16} className="text-twc-muted" /> Store Settings
                       </Link>
                       <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-[#e53e3e] hover:bg-[#e53e3e]/10 rounded-xl transition-colors text-left mt-1">
                         <LogOut size={16} /> Logout
                       </button>
                     </div>
                   </>
                 )}
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 transition-colors duration-300">
          <div className="w-full h-full max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
