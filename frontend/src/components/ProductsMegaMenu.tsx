import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageHelper';

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
  price: number;
  brand: string;
  images: { url: string; altText: string }[];
}

const ProductsMegaMenu = ({ onClose }: { onClose: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        const cats = data.filter((c: any) => c.slug !== 'all').slice(0, 4);
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategory(cats[0]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!activeCategory) return;
      setLoadingProducts(true);
      try {
        const { data } = await api.get(`/products/category/${activeCategory.slug}?limit=3`);
        setCategoryProducts(data.products || []);
      } catch (error) {
        console.error(`Error fetching products for ${activeCategory.slug}:`, error);
        setCategoryProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchCategoryProducts();
  }, [activeCategory]);

  return (
    <div 
      className="absolute top-full left-1/2 -translate-x-1/2 w-[1000px] bg-white border border-gray-100 shadow-xl z-[60] cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full px-8 py-8">
        <div className="flex gap-8 h-[400px]">
          
          {/* Left Column: Collections */}
          <div className="w-[20%] flex flex-col justify-between border-r border-gray-100 pr-6">
            <div>
              <h4 className="font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6">Collections</h4>
              <ul className="flex flex-col gap-4">
                {categories.map((cat) => (
                  <li 
                    key={cat._id}
                    className="group flex items-center justify-between cursor-pointer"
                    onMouseEnter={() => setActiveCategory(cat)}
                  >
                    <Link to={`/shop/category/${cat.slug}`} onClick={onClose} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 transition-all ${activeCategory?._id === cat._id ? 'ring-2 ring-brand-dark ring-offset-2' : 'grayscale group-hover:grayscale-0'}`}>
                        <img 
                          src={cat.image || '/placeholder.png'} 
                          alt={cat.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                        />
                      </div>
                      <span className={`font-body text-[15px] transition-colors ${activeCategory?._id === cat._id ? 'text-brand-dark font-medium' : 'text-gray-500 group-hover:text-brand-dark'}`}>
                        {cat.name}
                      </span>
                    </Link>
                    {activeCategory?._id === cat._id && (
                      <ArrowUpRight size={16} className="text-gray-400" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <Link 
              to="/shop/category/all" 
              onClick={onClose}
              className="block w-full py-4 bg-[#0a1f24] text-white text-center font-body text-[11px] uppercase tracking-widest hover:bg-black transition-colors"
            >
              All Products
            </Link>
          </div>

          {/* Middle Column: Featured Image */}
          <div className="w-[30%] relative group overflow-hidden">
            <img 
              src={activeCategory?.image || '/placeholder.png'} 
              alt={activeCategory?.name} 
              className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
              onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-10 left-10 text-white">
              <p className="font-body text-[10px] uppercase tracking-widest mb-2 opacity-80">{activeCategory?.name}</p>
              <h3 className="font-heading text-4xl font-light mb-6">{activeCategory?.name}</h3>
              <Link 
                to={`/shop/category/${activeCategory?.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 font-body text-[11px] uppercase tracking-widest hover:bg-gray-100 transition-colors"
              >
                Shop Now <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Best Selling */}
          <div className="w-[50%] flex flex-col pl-4">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400">Best Selling</h4>
              <Link 
                to={`/shop/category/${activeCategory?.slug}`}
                onClick={onClose}
                className="flex items-center gap-1 font-body text-[11px] uppercase tracking-widest text-brand-dark hover:text-gray-500 transition-colors"
              >
                {activeCategory?.name} (11) <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="flex-1 flex gap-4">
              {loadingProducts ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-gray-300" size={32} />
                </div>
              ) : categoryProducts.length > 0 ? (
                categoryProducts.map((product) => (
                  <div key={product._id} className="flex-1 group">
                    <Link to={`/product/${product.slug}`} onClick={onClose} className="block mb-3 h-[240px] bg-[#f0f0f0] overflow-hidden">
                      <img 
                        src={getImageUrl(product) || '/placeholder.png'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                      />
                    </Link>
                    <p className="font-body text-[10px] uppercase tracking-widest text-gray-400 mb-1">{product.brand || 'THE WOMAN COMPANY'}</p>
                    <Link to={`/product/${product.slug}`} onClick={onClose}>
                      <h5 className="font-body text-[15px] text-brand-dark mb-1 group-hover:underline underline-offset-4 line-clamp-1">{product.name}</h5>
                    </Link>
                    <p className="font-body text-[13px] text-brand-dark">Rs. {product.price.toLocaleString('en-IN')}.00</p>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center font-body text-gray-400 text-sm">
                  No products found for this category.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductsMegaMenu;
