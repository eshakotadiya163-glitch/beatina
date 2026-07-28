import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import ProductsMegaMenu from './ProductsMegaMenu';
import BlogMegaMenu from './BlogMegaMenu';
import ShopMegaMenu from './ShopMegaMenu';

import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const Navbar = () => {
  const { user } = useAuthStore();
  const { cartItems, setIsOpen } = useCartStore();
  const location = useLocation();
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

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await api.get('/wishlist');
      return data;
    },
    enabled: !!user
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
        promoImg: '/images/migrated/52_s2_1512x_98eb4d02-1fb4-4572-912e-640bff0b5a70.jpg',
      },
    },
    {
      label: 'Products',
      href: '/shop',
      dropdown: true,
      productsMega: true,
    },
    {
      label: 'Blog',
      href: '/blog',
      dropdown: true,
      blogMega: true,
    },
    { label: 'Contact', href: '/contact' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
              {/* Mobile Hamburger */}
              <button className="lg:hidden text-brand-dark flex items-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <svg aria-hidden="true" fill="none" focusable="false" width="24" className="icon icon-close" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                ) : (
                  <svg aria-hidden="true" fill="none" focusable="false" width="24" className="icon icon-hamburger" viewBox="0 0 24 24">
                    <path d="M1 19h22M1 12h22M1 5h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"></path>
                  </svg>
                )}
              </button>

              {/* Mobile Search Icon */}
              <button 
                className="lg:hidden text-brand-dark flex items-center"
                onClick={() => {
                  import('../store/searchStore').then(module => module.default.getState().setIsOpen(true));
                }}
              >
                <svg aria-hidden="true" fill="none" focusable="false" width="24" viewBox="0 0 24 24">
                  <path d="M10.364 3a7.364 7.364 0 1 0 0 14.727 7.364 7.364 0 0 0 0-14.727Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                  <path d="M15.857 15.858 21 21.001" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"></path>
                </svg>
              </button>
              
              {/* Desktop Search */}
              <button 
                className="hidden lg:flex items-center gap-2 group hover:text-gray-500 transition-colors font-body text-sm font-medium tracking-wide uppercase"
                onClick={() => {
                  import('../store/searchStore').then(module => module.default.getState().setIsOpen(true));
                }}
              >
                <span>Search</span>
                <svg aria-hidden="true" fill="none" focusable="false" width="24" viewBox="0 0 24 24">
                  <path d="M10.364 3a7.364 7.364 0 1 0 0 14.727 7.364 7.364 0 0 0 0-14.727Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                  <path d="M15.857 15.858 21 21.001" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"></path>
                </svg>
              </button>
            </div>

            {/* Middle: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" className="flex items-center gap-3">
                {/* Small Logo Placeholder - Using an elegant floral SVG as a fallback if twc-logo.png isn't saved */}
                <div className="w-[45px] h-[45px] rounded-full bg-[#fcf9f5] border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  <img 
                    src="/images/twc-logo.png" 
                    alt="TWC" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to SVG if image is missing
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <svg className="hidden w-6 h-6 text-[#111111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 1.2-4 6-9 6s-9-4.8-9-6c0-1.2 4-6 9-6s9 4.8 9 6Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <span className="font-serif text-[20px] md:text-[24px] text-[#000000] tracking-wide m-0 leading-none mt-1 whitespace-nowrap">
                  The Woman Company
                </span>
              </Link>
            </div>

            {/* Right: Icons + Text */}
            <div className="flex items-center justify-end gap-[18px] flex-1 text-brand-dark">
              
              <Link to={user ? '/profile' : '/login'} className="hidden lg:flex items-center group hover:text-gray-500 transition-colors cursor-pointer">
                <svg aria-hidden="true" fill="none" focusable="false" width="24" viewBox="0 0 24 24">
                  <path d="M16.125 8.75c-.184 2.478-2.063 4.5-4.125 4.5s-3.944-2.021-4.125-4.5c-.187-2.578 1.64-4.5 4.125-4.5 2.484 0 4.313 1.969 4.125 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M3.017 20.747C3.783 16.5 7.922 14.25 12 14.25s8.217 2.25 8.984 6.497" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                </svg>
              </Link>

              <Link to="/wishlist" className="hidden lg:flex items-center group hover:text-gray-500 transition-colors relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5429 4C13.4999 4 12 6.99984 12 6.99984C12 6.99984 10.5001 4 7.45712 4C4.98412 4 3.02579 6.06895 3.00048 8.53772C2.94892 13.6623 7.06573 17.3066 11.5782 20.3693C11.7026 20.4539 11.8495 20.4992 12 20.4992C12.1505 20.4992 12.2975 20.4539 12.4219 20.3693C16.9338 17.3066 21.0506 13.6623 20.9995 8.53772C20.9742 6.06895 19.0159 4 16.5429 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -top-[6px] -right-[8px] bg-black text-white text-[10px] w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">{wishlist.length}</span>
              </Link>

              <button 
                className="flex items-center group hover:text-gray-500 transition-colors relative gap-[6px]"
                onClick={() => setIsOpen(true)}
              >
                <span className="font-body text-[14px] font-medium tracking-wide uppercase hidden lg:block">Cart</span>
                <div className="relative flex items-center">
                  <svg aria-hidden="true" fill="none" focusable="false" width="24" viewBox="0 0 24 24">
                    <path d="M10 7h13l-4 9H7.5L5 3H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <circle cx="9" cy="20" r="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                    <circle cx="17" cy="20" r="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                  </svg>
                  <span className="absolute -top-[6px] -right-[10px] bg-black text-white text-[10px] w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none">{cartItems.length}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex justify-center flex-wrap pb-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
              
              return (
                <div
                  key={link.href + link.label}
                  className="static h-full mx-[14px]"
                  onMouseEnter={() => link.dropdown ? handleMouseEnter(link.label) : undefined}
                  onMouseLeave={link.dropdown ? handleMouseLeave : undefined}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-[8px] py-[8px] font-body text-[13px] uppercase tracking-wider text-black hover:opacity-70 transition-opacity relative group`}
                  >
                    {link.label}
                    {link.dropdown && <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />}
                    
                    {/* Active Route Underline */}
                    <span className={`absolute bottom-0 left-[8px] w-[calc(100%-16px)] h-[1px] bg-black transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </Link>

                  {/* Mega Menu (Shop) */}
                  {link.mega && openDropdown === link.label && (
                    <ShopMegaMenu onClose={() => setOpenDropdown(null)} initialCategories={categories} />
                  )}

                  {/* Products Mega Menu */}
                  {link.productsMega && openDropdown === link.label && (
                    <ProductsMegaMenu onClose={() => setOpenDropdown(null)} />
                  )}

                  {/* Blog Mega Menu */}
                  {link.blogMega && openDropdown === link.label && (
                    <BlogMegaMenu onClose={() => setOpenDropdown(null)} />
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
