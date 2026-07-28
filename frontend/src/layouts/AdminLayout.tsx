import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCog, Calendar, Wrench, FileText, 
  CreditCard, MessageCircle, BarChart3, Settings, LogOut, ShieldAlert,
  Search, Bell, Menu, User as UserIcon
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} />, permission: 'read_dashboard' },
    { name: 'Leads', path: '/admin/leads', icon: <UserCog size={18} />, permission: 'manage_leads' },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={18} />, permission: 'manage_customers' },
    { name: 'Appointments', path: '/admin/appointments', icon: <Calendar size={18} />, permission: 'manage_appointments' },
    { name: 'Services', path: '/admin/services', icon: <Wrench size={18} />, permission: 'manage_services' },
    { name: 'Invoices', path: '/admin/invoices', icon: <FileText size={18} />, permission: 'manage_invoices' },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={18} />, permission: 'manage_payments' },
    { name: 'WhatsApp', path: '/admin/whatsapp', icon: <MessageCircle size={18} />, permission: 'manage_whatsapp' },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} />, permission: 'view_analytics' },
    { name: 'Staff', path: '/admin/staff', icon: <ShieldAlert size={18} />, permission: 'manage_staff' },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} />, permission: 'manage_settings' },
  ];

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'staff' && !user.isAdmin)) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-sm max-w-md w-full">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">403 Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You do not have permission to view the Admin Dashboard.</p>
          <Link to="/" className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Filter items based on RBAC (simplified for demo: if superadmin/admin, show all, else filter by permissions array)
  const visibleNavItems = navItems.filter(item => {
    if (user.role === 'superadmin' || user.role === 'admin' || user.isAdmin) return true;
    return user.permissions?.includes(item.permission);
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 
        transform transition-transform duration-200 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex
      `}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="font-bold text-xl text-zinc-900 dark:text-white tracking-tight">Admin<span className="text-blue-600">Pro</span></h2>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 mr-3">
              <UserIcon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-zinc-500 truncate capitalize">{user.role || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-md transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center flex-1">
            <button 
              className="md:hidden mr-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center max-w-md w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>
            {/* Theme Toggle placeholder */}
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 hidden sm:block"></div>
            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hidden sm:block">
              View Website
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
