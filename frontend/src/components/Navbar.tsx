import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const Navbar = () => {
  // Fetch real categories for the Mega Menu
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.filter((c: any) => c.slug !== 'all').slice(0, 5);
    }
  });

  // Fetch real products for Trending/Best Sellers
  const { data: productsData } = useQuery({
    queryKey: ['nav-products'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=10');
      return data.products;
    }
  });

  const trendingProducts = productsData?.slice(0, 5) || [];
  const bestSellers = productsData?.slice(5, 10) || [];

  const navLinks = [
    { label: 'Home', href: '/' },
    {
      label: 'Shop',
      href: '/shop',
      dropdown: true,
      mega: {
        categories: categories.map((c: any) => ({
          name: c.name,
          href: `/category/${c.slug}`,
          img: c.image || ''
        })),
        trending: trendingProducts.map((p: any) => ({
          name: p.name,
          href: `/product/${p.slug || p._id}`
        })),
        bestSellers: bestSellers.map((p: any) => ({
          name: p.name,
          href: `/product/${p.slug || p._id}`
        })),
        promoImg: '/assets/migrated/52_s2_1512x_98eb4d02-1fb4-4572-912e-640bff0b5a70.jpg',
      },
    },
    {
      label: 'Products',
      href: '/shop',
      dropdown: true,
      simple: [
        { name: 'All Products', href: '/shop' },
        { name: 'New Arrivals', href: '/shop?sort=newest' },
        { name: 'Best Sellers', href: '/shop?sort=rating' },
      ],
    },
    {
      label: 'Blog',
      href: '/blog',
      dropdown: true,
      simple: [
        { name: 'Skincare Tips', href: '/blog' },
        { name: 'Hair Care Guide', href: '/blog' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user } = useAuthStore();
  const { cartItems } = useCartStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header className={`sticky top-0 w-full z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-[0_0px_0px_1px_rgba(0,0,0,0.05)]' : 'shadow-[0_0px_0px_1px_rgba(0,0,0,0.05)]'}`}>
      <AnnouncementBar />

      <div className="bg-white">
        <div className="max-w-[1550px] mx-auto px-[15px]">
          <div className="py-4 flex items-center justify-between gap-4 relative">

            {/* Left: Search + Mobile Menu */}
            <div className="flex items-center gap-4 flex-1">
              <button className="md:hidden text-brand-dark" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Middle: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" className="flex items-center">
                <img 
                  src="/assets/migrated/53_Beautina_1.png" 
                  alt="Beautina" 
                  className="w-[170px] object-contain"
                />
              </Link>
            </div>

            {/* Right: Icons + Text */}
            <div className="flex items-center justify-end gap-5 flex-1 text-brand-dark">
              <button className="hidden lg:flex items-center group hover:text-gray-500 transition-colors">
                <span className="font-body text-[13px] uppercase mr-2" style={{letterSpacing: '0px'}}>Search</span>
                <svg aria-hidden="true" fill="none" focusable="false" width="24" viewBox="0 0 24 24">
                  <path d="M10.364 3a7.364 7.364 0 1 0 0 14.727 7.364 7.364 0 0 0 0-14.727Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                  <path d="M15.857 15.858 21 21.001" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"></path>
                </svg>
              </button>
              
              <Link to={user ? '/profile' : '/login'} className="hidden lg:flex items-center group hover:text-gray-500 transition-colors cursor-pointer">
                <span className="font-body text-[13px] uppercase mr-2" style={{letterSpacing: '0px'}}>Login</span>
                <svg aria-hidden="true" fill="none" focusable="false" width="24" viewBox="0 0 24 24">
                  <path d="M16.125 8.75c-.184 2.478-2.063 4.5-4.125 4.5s-3.944-2.021-4.125-4.5c-.187-2.578 1.64-4.5 4.125-4.5 2.484 0 4.313 1.969 4.125 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M3.017 20.747C3.783 16.5 7.922 14.25 12 14.25s8.217 2.25 8.984 6.497" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                </svg>
              </Link>

              <Link to="/wishlist" className="hidden lg:flex items-center group hover:text-gray-500 transition-colors relative">
                <span className="font-body text-[13px] uppercase mr-2" style={{letterSpacing: '0px'}}>Wishlist</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5429 4C13.4999 4 12 6.99984 12 6.99984C12 6.99984 10.5001 4 7.45712 4C4.98412 4 3.02579 6.06895 3.00048 8.53772C2.94892 13.6623 7.06573 17.3066 11.5782 20.3693C11.7026 20.4539 11.8495 20.4992 12 20.4992C12.1505 20.4992 12.2975 20.4539 12.4219 20.3693C16.9338 17.3066 21.0506 13.6623 20.9995 8.53772C20.9742 6.06895 19.0159 4 16.5429 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>

              <button 
                className="flex items-center group hover:text-gray-500 transition-colors relative"
                onClick={() => {}}
              >
                <span className="hidden lg:inline-block font-body text-[13px] uppercase mr-2" style={{letterSpacing: '0px'}}>Cart</span>
                <svg aria-hidden="true" fill="none" focusable="false" width="24" viewBox="0 0 24 24">
                  <path d="M10 7h13l-4 9H7.5L5 3H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <circle cx="9" cy="20" r="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                  <circle cx="17" cy="20" r="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                </svg>
                <span className="font-body text-[14px] ml-1">{cartItems.length}</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center flex-wrap pb-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
              
              return (
                <div
                  key={link.href + link.label}
                  className="relative h-full mx-2"
                  onMouseEnter={() => link.dropdown ? handleMouseEnter(link.label) : undefined}
                  onMouseLeave={link.dropdown ? handleMouseLeave : undefined}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-[12px] py-[15px] font-body text-[14px] font-semibold text-brand-dark hover:text-brand-dark/70 transition-colors relative group ${openDropdown === link.label ? 'opacity-70' : ''}`}
                  >
                    {link.label}
                    {link.dropdown && <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />}
                    
                    {/* Active Route Underline */}
                    <span className={`absolute bottom-[10px] left-[12px] w-[calc(100%-24px)] h-[2px] bg-brand-dark transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </Link>

                  {/* Mega Menu (Shop) */}
                  {link.mega && openDropdown === link.label && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white border border-brand-border shadow-xl z-50 p-8"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="grid grid-cols-4 gap-8">
                        {/* Categories */}
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-muted mb-4">Category</p>
                          <div className="flex flex-col gap-3">
                            {link.mega.categories.map((cat: any) => (
                              <Link
                                key={cat.name}
                                to={cat.href}
                                className="flex items-center gap-3 group/cat"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <div className="w-10 h-12 overflow-hidden bg-brand-light flex-shrink-0">
                                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <span className="font-body text-sm text-brand-dark group-hover/cat:text-brand-accent transition-colors">{cat.name}</span>
                              </Link>
                            ))}
                            <Link to="/shop" className="font-body text-xs text-brand-dark underline mt-1" onClick={() => setOpenDropdown(null)}>
                              Shop all
                            </Link>
                          </div>
                        </div>

                        {/* Trending Now */}
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-muted mb-4">Trending Now</p>
                          <div className="flex flex-col gap-3">
                            {link.mega.trending.map((item: any) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="font-body text-sm text-brand-dark hover:text-brand-accent transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Best Sellers */}
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-muted mb-4">Best Sellers</p>
                          <div className="flex flex-col gap-3">
                            {link.mega.bestSellers.map((item: any) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="font-body text-sm text-brand-accent hover:underline transition-colors"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Promo Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
                          <img
                            src={link.mega.promoImg}
                            alt="Shop 20%"
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-white/80 py-2 text-center">
                            <span className="font-body text-xs uppercase tracking-[0.2em] text-brand-dark">Shop 20%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Simple dropdown (Products, Blog) */}
                  {link.simple && openDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 min-w-[180px] bg-white border border-brand-border shadow-lg z-50 py-2"
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {link.simple.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-5 py-2.5 font-body text-sm text-brand-dark hover:bg-brand-light transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-brand-border z-50 max-h-screen overflow-y-auto">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                to={link.href}
                className="px-6 py-4 border-b border-brand-border font-body text-xs uppercase tracking-[0.15em] text-brand-dark hover:bg-brand-light transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={user ? '/profile' : '/login'}
              className="px-6 py-4 font-body text-xs uppercase tracking-[0.15em] text-brand-dark hover:bg-brand-light transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
