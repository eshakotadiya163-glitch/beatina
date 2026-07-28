import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, MapPin, Heart, Package, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

const AccountLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Address Book', path: '/addresses', icon: MapPin },
    { name: 'My Orders', path: '/orders', icon: Package },
    { name: 'Wishlist', path: '/wishlist', icon: Heart },
  ];

  if (!user) {
    return <div className="pt-[116px] min-h-screen flex items-center justify-center">Please login.</div>;
  }

  return (
    <div className="pt-[116px] pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-heading text-brand-dark mb-10 border-b border-gray-200 pb-6">{title}</h1>
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white border border-gray-100 p-6 shadow-sm rounded-sm sticky top-32">
              <div className="mb-8 text-center pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-heading mx-auto mb-3">
                  {user.firstName?.charAt(0) || 'U'}
                </div>
                <h2 className="font-heading text-lg text-brand-dark">{user.firstName} {user.lastName}</h2>
                <p className="text-xs font-body text-gray-500">{user.email}</p>
              </div>
              
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 text-sm font-button uppercase tracking-widest transition-colors rounded-sm ${
                        isActive 
                          ? 'bg-brand-secondary/30 text-brand-primary font-semibold' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-button uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors rounded-sm mt-4"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
