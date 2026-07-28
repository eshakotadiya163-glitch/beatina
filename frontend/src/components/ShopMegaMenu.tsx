import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../api/axios';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  images?: { url: string }[];
}



const ShopMegaMenu = ({ onClose, initialCategories }: { onClose: () => void, initialCategories: Category[] }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(initialCategories.length > 0 ? initialCategories[0] : null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialCategories.length) return;
    if (!activeCategory) {
      setActiveCategory(initialCategories[0]);
    }
  }, [initialCategories]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!activeCategory) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/products/category/${activeCategory.slug}?limit=10`);
        setCategoryProducts(data.products || []);
      } catch (error) {
        console.error(`Error fetching products for ${activeCategory.slug}:`, error);
        setCategoryProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [activeCategory]);

  const trendingProducts = categoryProducts.slice(0, 5);
  const bestSellers = categoryProducts.slice(5, 10);

  return (
    <div className="absolute top-full left-0 w-full bg-white border-t border-[#eee] shadow-[0_15px_30px_rgba(0,0,0,0.05)] z-50 py-[50px] cursor-default font-body">
      <div className="max-w-[1300px] mx-auto grid grid-cols-[200px_200px_200px_1fr] gap-x-[60px] px-[20px]">
        
        {/* Column 1: Categories */}
        <div className="flex flex-col">
          <h5 className="font-heading text-[11px] font-bold tracking-[0.2em] uppercase mb-[30px] text-[#A0765E]">CATEGORY</h5>
          <ul className="flex flex-col gap-[20px] p-0 m-0 list-none">
            {[{name: 'SkinCare', slug: 'skincare', image: '/images/migrated/51_1-age-pro-intense-wrinkle-serum-A3340.jpg'},
              {name: 'Serum & Cream', slug: 'serum-cream', image: '/images/migrated/18_gallery-2-v2.webp'},
              {name: 'Moisture Cream', slug: 'moisture-cream', image: '/images/migrated/7_2-anti-age-recovery-treatment-A2603.jpg'},
              {name: 'Hair Care', slug: 'hair-care', image: '/images/migrated/31_2-nourish-and-repair-hair-care-A4051.jpg'},
              {name: 'Accessories', slug: 'accessories', image: '/images/migrated/8_4-replenishing-night-cream-A3062.jpg'}].map((cat) => (
              <li key={cat.slug} className="flex items-center group cursor-pointer" onMouseEnter={() => setActiveCategory(cat as any)}>
                <Link
                  to={`/shop/category/${cat.slug}`}
                  onClick={onClose}
                  className="w-[32px] h-[32px] rounded-full overflow-hidden mr-[16px] shrink-0 border border-[#eee] flex items-center justify-center bg-[#f9f9f9]"
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                </Link>
                <Link
                  to={`/shop/category/${cat.slug}`}
                  onClick={onClose}
                  className="text-[12px] font-body text-[#111111] relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-[#111111] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left transition-colors duration-300"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link to="/shop/category/all" className="text-[12px] font-body text-[#111111] underline hover:opacity-80 transition-opacity font-bold" onClick={onClose}>
                Shop all
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Trending Now */}
        <div className="flex flex-col">
          <h5 className="font-heading text-[11px] font-bold tracking-[0.2em] uppercase mb-[30px] text-[#A0765E]">TRENDING NOW</h5>
          <ul className="flex flex-col gap-[20px] p-0 m-0 list-none">
            {loading ? (
              <div className="flex justify-center py-[20px]"><Loader2 className="animate-spin text-[#999]" size={20} /></div>
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((p) => (
                <li key={p._id}>
                  <Link
                    to={`/product/${p.slug || p._id}`}
                    onClick={onClose}
                    className="text-[12px] font-body text-[#111111] hover:text-[#A0765E] transition-colors duration-300"
                  >
                    {p.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-[12px] text-[#999]">No products found.</li>
            )}
          </ul>
        </div>

        {/* Column 3: Best Sellers */}
        <div className="flex flex-col">
          <h5 className="font-heading text-[11px] font-bold tracking-[0.2em] uppercase mb-[30px] text-[#A0765E]">BEST SELLERS</h5>
          <ul className="flex flex-col gap-[20px] p-0 m-0 list-none">
            {loading ? (
              <div className="flex justify-center py-[20px]"><Loader2 className="animate-spin text-[#999]" size={20} /></div>
            ) : bestSellers.length > 0 ? (
              bestSellers.map((p) => (
                <li key={p._id}>
                  <Link
                    to={`/product/${p.slug || p._id}`}
                    onClick={onClose}
                    className="text-[12px] font-body text-[#111111] hover:text-[#A0765E] transition-colors duration-300"
                  >
                    {p.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-[12px] text-[#999]">No products found.</li>
            )}
          </ul>
        </div>

        {/* Column 4: Promotional Banner */}
        <div className="flex flex-col">
          <Link to="/shop/category/all" onClick={onClose} className="block w-full group">
            <div className="w-full relative overflow-hidden bg-[#e8cdca] rounded-md aspect-[16/9] mb-[15px]">
              <img 
                src="/images/migrated/52_s2_1512x_98eb4d02-1fb4-4572-912e-640bff0b5a70.jpg" 
                alt="Promo Banner" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="text-center mt-[10px]">
              <span className="font-heading text-[10px] tracking-[0.1em] uppercase text-[#777] group-hover:text-[#111111] transition-colors inline-block">
                SHOP 20%
              </span>
            </div>
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default ShopMegaMenu;
