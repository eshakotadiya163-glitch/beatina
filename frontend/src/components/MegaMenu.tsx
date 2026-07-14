import { useState } from 'react';
import { Link } from 'react-router-dom';
// Removed unused motion import
import { ChevronDown } from 'lucide-react';

const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const categories = [
    { name: 'Makeup', id: 'makeup', hasMega: true },
    { name: 'Skin', id: 'skin', hasMega: true },
    { name: 'Hair', id: 'hair', hasMega: true },
    { name: 'Bath & Body', id: 'bath-body', hasMega: true },
    { name: 'Natural', id: 'natural', hasMega: false },
    { name: 'Fragrance', id: 'fragrance', hasMega: true },
    { name: 'Health & Wellness', id: 'health', hasMega: false },
    { name: 'Pop Ups', id: 'popups', hasMega: false },
  ];

  const megaMenuContent = {
    makeup: {
      left: ['Face', 'Eyes', 'Lips', 'Nails', 'Tools & Brushes', 'Top Brands'],
      rightImage: '/images/products/product-28/main.png',
      rightText: 'New Arrivals in Makeup'
    },
    skin: {
      left: ['Cleansers', 'Moisturizers', 'Serums & Essences', 'Masks', 'Eye Care', 'Sun Care'],
      rightImage: '/images/products/niacinamide-alternative-serum/main.png',
      rightText: 'Discover Skin Minimalism'
    }
    // ... add others as needed
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 relative shadow-sm z-40">
      <div className="container mx-auto px-4 md:px-8">
        <ul className="flex items-center justify-between space-x-6 text-sm font-body font-medium text-brand-dark overflow-x-auto no-scrollbar py-3">
          {categories.map((category) => (
            <li 
              key={category.id}
              className="flex-shrink-0 cursor-pointer hover:text-brand-primary transition-colors py-2 group"
              onMouseEnter={() => setActiveMenu(category.hasMega ? category.id : null)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="flex items-center">
                <Link to={`/category/${category.id}`}>{category.name}</Link>
                {category.hasMega && <ChevronDown size={14} className="ml-1 opacity-50 group-hover:opacity-100" />}
              </div>

              {/* Mega Dropdown */}
              {category.hasMega && activeMenu === category.id && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 p-8 grid grid-cols-4 gap-8 z-50">
                  <div className="col-span-1">
                    <h4 className="font-heading text-lg mb-4 text-brand-primary">Shop by Category</h4>
                    <ul className="space-y-3 font-body text-sm text-gray-600">
                      {megaMenuContent[category.id as keyof typeof megaMenuContent]?.left.map(item => (
                        <li key={item}><Link to="/shop" className="hover:text-brand-primary hover:underline">{item}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-1">
                    <h4 className="font-heading text-lg mb-4 text-brand-primary">Top Brands</h4>
                    <ul className="space-y-3 font-body text-sm text-gray-600">
                      <li><Link to="/shop" className="hover:text-brand-primary hover:underline">M.A.C</Link></li>
                      <li><Link to="/shop" className="hover:text-brand-primary hover:underline">Estée Lauder</Link></li>
                      <li><Link to="/shop" className="hover:text-brand-primary hover:underline">Clinique</Link></li>
                      <li><Link to="/shop" className="hover:text-brand-primary hover:underline">Bobbi Brown</Link></li>
                      <li><Link to="/shop" className="hover:text-brand-primary hover:underline">Huda Beauty</Link></li>
                    </ul>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Link to="/shop" className="relative group block w-full max-w-sm overflow-hidden rounded">
                       <img 
                        src={megaMenuContent[category.id as keyof typeof megaMenuContent]?.rightImage || '/images/products/product-29/main.png'}
                        alt="Promo" 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                       <div className="absolute bottom-4 left-4 text-white">
                         <h5 className="font-heading text-xl">{megaMenuContent[category.id as keyof typeof megaMenuContent]?.rightText || 'Explore Now'}</h5>
                         <span className="text-xs font-button uppercase tracking-widest mt-2 block group-hover:underline">Shop Collection</span>
                       </div>
                    </Link>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MegaMenu;
