import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageHelper';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  rating: number;
  images: { url: string }[];
}

const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsCache, setProductsCache] = useState<Record<string, Product[]>>({});
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = async (categorySlug: string) => {
    setActiveMenu(categorySlug);
    
    // Only fetch if not cached
    if (!productsCache[categorySlug]) {
      setLoadingCategory(categorySlug);
      try {
        const { data } = await api.get(`/products/category/${categorySlug}?limit=4`);
        setProductsCache(prev => ({
          ...prev,
          [categorySlug]: data.products
        }));
      } catch (error) {
        console.error(`Error fetching products for ${categorySlug}:`, error);
        setProductsCache(prev => ({
          ...prev,
          [categorySlug]: []
        }));
      } finally {
        setLoadingCategory(null);
      }
    }
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div className="w-full bg-white border-b border-gray-100 relative shadow-sm z-40">
      <div className="container mx-auto px-4 md:px-8">
        <ul className="flex items-center justify-between space-x-6 text-sm font-body font-medium text-brand-dark overflow-x-auto no-scrollbar py-3">
          {categories.map((category) => (
            <li 
              key={category._id}
              className="flex-shrink-0 cursor-pointer hover:text-brand-primary transition-colors py-2 group"
              onMouseEnter={() => handleMouseEnter(category.slug)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center">
                <Link to={`/shop/category/${category.slug}`}>{category.name}</Link>
                <ChevronDown size={14} className="ml-1 opacity-50 group-hover:opacity-100" />
              </div>

              {/* Mega Dropdown */}
              {activeMenu === category.slug && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 p-8 z-50 min-h-[300px]">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
                    <h4 className="font-heading text-2xl text-brand-dark">{category.name} Products</h4>
                    <Link to={`/shop/category/${category.slug}`} className="text-sm font-body text-brand-primary hover:underline">
                      View All {category.name}
                    </Link>
                  </div>
                  
                  {loadingCategory === category.slug ? (
                    <div className="flex justify-center items-center h-48 w-full">
                      <Loader2 className="animate-spin text-brand-primary" size={32} />
                    </div>
                  ) : productsCache[category.slug]?.length === 0 ? (
                    <div className="flex justify-center items-center h-48 w-full font-body text-gray-500">
                      No Products Found
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-6">
                      {productsCache[category.slug]?.map(product => (
                        <Link to={`/product/${product.slug}`} key={product._id} className="group block">
                          <div className="relative aspect-square bg-[#f7f6f3] rounded overflow-hidden mb-3">
                            <img 
                              src={getImageUrl(product)} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <h5 className="font-body text-sm text-brand-dark group-hover:text-brand-primary line-clamp-1">{product.name}</h5>
                          <span className="font-heading text-brand-primary block mt-1">Rs. {product.price.toFixed(2)}</span>
                        </Link>
                      ))}
                    </div>
                  )}
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
