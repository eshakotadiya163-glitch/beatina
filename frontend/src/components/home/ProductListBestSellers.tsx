import React, { useState } from 'react';
import ProductCard from '../ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Product = any;

interface ProductListBestSellersProps {
  products: Product[];
}

const CATEGORIES = [
  { 
    id: 'hair-care', 
    name: 'Hair Care', 
    thumb: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'accessories', 
    name: 'Accessories', 
    thumb: 'https://images.unsplash.com/photo-1599643478524-fb66f8515086?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1599643478524-fb66f8515086?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'skincare', 
    name: 'SkinCare', 
    thumb: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'moisture-cream', 
    name: 'Moisture Cream', 
    thumb: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=150&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop'
  },
];

const ProductListBestSellers: React.FC<ProductListBestSellersProps> = ({ products }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  // Try to match the active category, otherwise just fallback to all best sellers
  const bestSellers = products.filter(p => p.tabCategory === 'Best Sellers');
  const filteredProducts = bestSellers.filter(p => {
    const catName = typeof p.category === 'string' ? p.category : p.category?.name;
    return catName?.toLowerCase() === activeCategory.name.toLowerCase() || 
           catName?.toLowerCase() === activeCategory.id.replace('-', ' ');
  });
  
  // If no products match the exact category, just show generic best sellers (up to 3)
  const displayProducts = (filteredProducts.length > 0 ? filteredProducts : bestSellers).slice(0, 3);

  return (
    <section className="bg-white py-12 md:py-14 border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-[1440px]">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Column 1: Collections Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col justify-between">
            <div>
              <h4 className="font-heading text-xs tracking-[0.2em] uppercase text-brand-muted mb-8 pl-4">
                Collections
              </h4>
              <ul className="space-y-6">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory.id === cat.id;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full flex items-center justify-between px-4 py-2 group transition-colors ${
                          isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                            <img src={cat.thumb} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                          <span className={`font-heading text-lg ${isActive ? 'text-brand-dark' : 'text-brand-muted'}`}>
                            {cat.name}
                          </span>
                        </div>
                        {isActive && (
                          <ArrowUpRight className="w-5 h-5 text-brand-dark font-light" strokeWidth={1} />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="mt-12 px-4">
            <Link 
              to="/shop/category/all" 
              className="block w-full bg-brand-dark text-white text-center py-4 font-body text-[10px] tracking-[0.2em] uppercase hover:bg-black transition-colors"
            >
                All Products
              </Link>
            </div>
          </div>

          {/* Column 2: Featured Image */}
          <div className="w-full lg:w-1/4 relative group overflow-hidden">
            <div className="aspect-[3/4] w-full bg-gray-100 relative">
              <img 
                src={activeCategory.image} 
                alt={activeCategory.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="font-body text-xs text-white/80 tracking-widest uppercase mb-2 block">
                  {activeCategory.name}
                </span>
                <h3 className="font-heading text-4xl text-white mb-6">
                  {activeCategory.name}
                </h3>
                <Link 
                  to={`/shop?category=${activeCategory.id}`} 
                  className="inline-flex items-center gap-3 bg-white text-brand-dark px-6 py-3 font-body text-[10px] tracking-[0.2em] uppercase hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Column 3: Products Grid */}
          <div className="w-full lg:w-2/4 flex flex-col">
            <div className="flex justify-between items-center mb-8 px-2">
              <h4 className="font-heading text-xs tracking-[0.2em] uppercase text-brand-muted">
                Best Selling
              </h4>
              <Link 
                to={`/shop?category=${activeCategory.id}`} 
                className="font-body text-[10px] tracking-[0.2em] uppercase text-brand-dark hover:text-brand-muted transition-colors flex items-center gap-2"
              >
                {activeCategory.name.toUpperCase()} ({displayProducts.length}) →
              </Link>
            </div>
            
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayProducts.map((product) => (
                  <div key={product._id} className="h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] text-brand-muted font-body text-sm">
                No best selling products found in this category.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProductListBestSellers;
