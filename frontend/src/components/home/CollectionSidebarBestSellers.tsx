import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ProductCard from '../ProductCard';

const collections = [
  { name: 'Hair Care', handle: 'hair-care', img: '/images/migrated/5_custom-banner-2.jpg', count: 11 },
  { name: 'Accessories', handle: 'accessories', img: '/images/migrated/6_gallery-3-v2.webp', count: 8 },
  { name: 'SkinCare', handle: 'skincare', img: '/images/migrated/7_2-anti-age-recovery-treatment-A2603.jpg', count: 15 },
  { name: 'Moisture Cream', handle: 'moisture-cream', img: '/images/migrated/8_4-replenishing-night-cream-A3062.jpg', count: 6 },
];

const CollectionSidebarBestSellers = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCollection, setActiveCollection] = useState(collections[0]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products?category=${activeCollection.name}&limit=3`);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCollection]);

  return (
    <section className="py-12 bg-white border-t border-brand-border/40">
      <div className="max-w-[1600px] mx-auto px-4 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-heading text-[11px] uppercase tracking-[0.2em] text-brand-muted mb-6">Collections</h3>
            
            <div className="flex flex-col gap-5">
              {collections.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setActiveCollection(col)}
                  className="flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-light flex-shrink-0">
                      <img src={col.img} alt={col.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`font-heading text-xl transition-colors ${activeCollection.name === col.name ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'}`}>
                      {col.name}
                    </span>
                  </div>
                  {activeCollection.name === col.name && (
                    <ArrowUpRight size={18} className="text-brand-muted" />
                  )}
                </button>
              ))}
            </div>

            {/* Banner Image inside sidebar */}
            <div className="relative mt-8 group overflow-hidden bg-brand-dark h-[380px]">
              <img 
                src="/images/migrated/9_b17_540x_aa6b96c0-cd33-460e-8da7-208e8c30f82e.webp" 
                alt="Hair Care Banner"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent">
                <p className="font-heading text-xs tracking-widest text-white mb-2">{activeCollection.name}</p>
                <h4 className="font-heading text-3xl text-white mb-6">{activeCollection.name}</h4>
                <Link to={`/shop/category/${activeCollection.handle}`} className="inline-flex items-center gap-2 bg-white px-6 py-3 font-body text-xs uppercase tracking-wider text-brand-dark hover:bg-brand-light transition-colors w-fit">
                  Shop Now <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <Link to="/shop/category/all" className="block w-full bg-brand-dark text-white text-center py-4 font-body text-xs uppercase tracking-[0.15em] hover:bg-black transition-colors mt-4">
              All Products
            </Link>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-end mb-8 border-b border-brand-border/40 pb-4">
              <h3 className="font-heading text-[11px] uppercase tracking-[0.2em] text-brand-muted">Best Selling</h3>
              <Link to={`/shop/category/${activeCollection.handle}`} className="flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.1em] text-brand-dark hover:text-brand-accent transition-colors">
                {activeCollection.name} ({activeCollection.count}) <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-brand-light aspect-[3/4]"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CollectionSidebarBestSellers;
