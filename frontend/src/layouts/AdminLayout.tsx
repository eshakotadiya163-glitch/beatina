import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Ticket, Settings, LogOut, MessageSquare } from 'lucide-react';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tag size={20} /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <Ticket size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={20} /> },
  ];

  if (!user || !user.isAdmin) {
    return (
      <div className="pt-32 pb-20 min-h-[80vh] flex items-center justify-center bg-brand-bg">
        <div className="text-center p-8 bg-white border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-heading text-brand-dark mb-4">Access Denied</h2>
          <p className="text-gray-500 font-body mb-6">You do not have permission to view this page.</p>
          <Link to="/" className="btn-primary inline-block">Return to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex pt-[80px]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading text-lg text-brand-dark font-semibold tracking-wider uppercase">Admin Portal</h2>
          <p className="text-xs text-gray-400 font-body mt-1">Welcome back, {user?.firstName}</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-sm transition-colors font-body text-sm ${
                location.pathname === item.path 
                  ? 'bg-brand-primary/10 text-brand-primary font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
              }`}
            >
              <span className={location.pathname === item.path ? 'text-brand-primary' : 'text-gray-400'}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            to="/profile"
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-brand-dark rounded-sm transition-colors font-body text-sm w-full"
          >
            <Settings size={20} className="text-gray-400" />
            <span>Store Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-sm transition-colors font-body text-sm w-full mt-2"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-8 bg-gray-50 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
