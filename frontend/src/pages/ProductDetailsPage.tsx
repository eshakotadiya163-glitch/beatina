import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useState, useEffect } from 'react';
import { Star, Truck, ShieldCheck, Plus, Minus, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howToUse'>('description');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { ref: addToCartRef, inView: isAddToCartVisible } = useInView({
    threshold: 0,
    rootMargin: "-100px 0px 0px 0px",
  });

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
  });

  // Track recently viewed
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  useEffect(() => {
    if (product?._id) {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updated = [product._id, ...stored.filter((x: string) => x !== product._id)].slice(0, 4);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      setRecentlyViewedIds(updated.filter(x => x !== product._id));
    }
  }, [product]);

  // Fetch Related Products (same category)
  const { data: relatedData } = useQuery({
    queryKey: ['products', 'related', product?.category],
    queryFn: async () => {
      const { data } = await api.get(`/products?category=${product?.category}`);
      return data;
    },
    enabled: !!product?.category,
  });

  // Fetch Recently Viewed Products
  const { data: recentlyViewedData } = useQuery({
    queryKey: ['products', 'recent', recentlyViewedIds],
    queryFn: async () => {
      const promises = recentlyViewedIds.map(rid => api.get(`/products/${rid}`).then(res => res.data).catch(() => null));
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    },
    enabled: recentlyViewedIds.length > 0,
  });

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center pt-20"><div className="w-8 h-8 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="min-h-screen bg-white flex items-center justify-center pt-20 text-brand-dark font-body">Error loading product</div>;
  if (!product) return null;

  const productImages = product.images?.map((i: any) => i.url) || [];
  
  return (
    <div className="pt-[116px] pb-32 bg-white min-h-screen">
      
      {/* Sticky Add To Cart Bar */}
      <AnimatePresence>
        {!isAddToCartVisible && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 w-full bg-white border-t border-brand-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-40 py-3"
          >
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={productImages[0]} alt={product.name} className="w-12 h-16 object-cover hidden sm:block bg-brand-light" />
                <div>
                  <h3 className="font-heading text-sm text-brand-dark line-clamp-1">{product.name}</h3>
                  <span className="font-body text-brand-muted text-sm">${product.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex border border-brand-border bg-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-brand-dark hover:bg-brand-light transition-colors"><Minus size={14} /></button>
                  <div className="px-3 py-2 font-body text-sm text-brand-dark border-l border-r border-brand-border flex items-center min-w-[40px] justify-center">{qty}</div>
                  <button onClick={() => setQty(Math.min(product.countInStock || 10, qty + 1))} className="px-3 py-2 text-brand-dark hover:bg-brand-light transition-colors"><Plus size={14} /></button>
                </div>
                <button className="bg-brand-dark text-white font-body uppercase tracking-[0.2em] text-xs px-8 py-3 hover:bg-black transition-colors">
                  Add to Bag
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Product Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 mt-4 md:mt-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-body text-xs text-brand-muted uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-brand-dark transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-dark transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-dark line-clamp-1">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-32 flex gap-4 h-[60vh] md:h-[75vh]">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-3 w-20 overflow-y-auto custom-scrollbar pr-1">
                {productImages.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`border ${activeImage === idx ? 'border-brand-dark' : 'border-transparent'} overflow-hidden aspect-[3/4] flex-shrink-0 transition-opacity bg-brand-light ${activeImage === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                  </button>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 bg-brand-light overflow-hidden relative group border border-brand-border/50">
                <InnerImageZoom 
                  src={productImages[activeImage] || ''} 
                  zoomSrc={productImages[activeImage] || ''} 
                  className="w-full h-full object-cover mix-blend-multiply"
                  zoomType="hover"
                  zoomPreload={true}
                  hideHint={true}
                />
              </div>
            </div>
            
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-3 overflow-x-auto mt-4 no-scrollbar">
              {productImages.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`border ${activeImage === idx ? 'border-brand-dark' : 'border-transparent'} w-20 aspect-[3/4] flex-shrink-0 bg-brand-light`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col py-4 lg:py-0">
            <h2 className="text-[10px] font-body uppercase tracking-[0.2em] text-brand-muted mb-4">{product.vendor || product.brand || 'Beautina'}</h2>
            <h1 className="text-3xl md:text-5xl font-heading mb-6 text-brand-dark leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-brand-dark text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'} strokeWidth={1.5} />
                ))}
              </div>
              <span className="font-body text-xs tracking-widest uppercase text-brand-muted cursor-pointer hover:text-brand-dark transition-colors">{product.numReviews || 0} Reviews</span>
            </div>

            <div className="mb-8 border-b border-brand-border pb-8">
               <div className="flex items-end gap-3 mb-2">
                 <span className="text-2xl font-body text-brand-dark">${product.price.toFixed(2)}</span>
                 {product.compareAtPrice && product.compareAtPrice > product.price && (
                   <span className="text-sm font-body text-brand-muted line-through mb-1">${product.compareAtPrice.toFixed(2)}</span>
                 )}
               </div>
               <p className="text-xs font-body text-brand-muted mt-2">
                 Taxes included. Free shipping on orders over $500.
               </p>
            </div>

            {/* Actions */}
            <div ref={addToCartRef} className="flex flex-col gap-4 mb-10">
              <div className="flex gap-4">
                <div className="flex border border-brand-border w-32 bg-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 py-3 text-brand-dark hover:bg-brand-light flex justify-center items-center transition-colors"><Minus size={14} /></button>
                  <div className="flex-1 py-3 font-body text-sm text-brand-dark border-l border-r border-brand-border flex justify-center items-center">{qty}</div>
                  <button onClick={() => setQty(Math.min(product.countInStock || 10, qty + 1))} className="flex-1 py-3 text-brand-dark hover:bg-brand-light flex justify-center items-center transition-colors"><Plus size={14} /></button>
                </div>
                <button className="flex-1 bg-brand-dark text-white font-body uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors">
                  Add to Bag
                </button>
              </div>
              <button className="w-full bg-brand-light border border-brand-border text-brand-dark py-4 font-body uppercase tracking-[0.2em] text-xs hover:bg-brand-border/50 transition-colors">
                Buy it now
              </button>
            </div>

            {/* Description Accordions */}
            <div className="border-t border-brand-border divide-y divide-brand-border">
              {/* Description */}
              <div className="py-2">
                <button className="flex justify-between items-center w-full text-left font-heading text-lg text-brand-dark py-4" onClick={() => setActiveTab(activeTab === 'description' ? '' as any : 'description')}>
                  Description
                  {activeTab === 'description' ? <Minus size={16} className="text-brand-muted" /> : <Plus size={16} className="text-brand-muted" />}
                </button>
                <AnimatePresence>
                  {activeTab === 'description' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div 
                        className="py-4 font-body text-sm text-brand-muted leading-relaxed prose prose-sm prose-p:mb-4 max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ingredients */}
              <div className="py-2">
                <button className="flex justify-between items-center w-full text-left font-heading text-lg text-brand-dark py-4" onClick={() => setActiveTab(activeTab === 'ingredients' ? '' as any : 'ingredients')}>
                  Ingredients
                  {activeTab === 'ingredients' ? <Minus size={16} className="text-brand-muted" /> : <Plus size={16} className="text-brand-muted" />}
                </button>
                <AnimatePresence>
                  {activeTab === 'ingredients' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="py-4 font-body text-sm text-brand-muted leading-relaxed">
                        <p>{product.ingredients || "Carefully sourced natural and organic ingredients. Formulated without parabens, phthalates, sulfates, or synthetic fragrances."}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* How to Use */}
              <div className="py-2">
                <button className="flex justify-between items-center w-full text-left font-heading text-lg text-brand-dark py-4" onClick={() => setActiveTab(activeTab === 'howToUse' ? '' as any : 'howToUse')}>
                  How to Use
                  {activeTab === 'howToUse' ? <Minus size={16} className="text-brand-muted" /> : <Plus size={16} className="text-brand-muted" />}
                </button>
                <AnimatePresence>
                  {activeTab === 'howToUse' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="py-4 font-body text-sm text-brand-muted leading-relaxed">
                        <p>{product.howToUse || "Apply a small amount to clean, dry skin. Massage gently in upward circular motions until fully absorbed. Use daily for best results."}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-brand-border pt-8">
              <div className="flex flex-col items-center text-center text-brand-dark">
                <ShieldCheck size={24} className="mb-3 stroke-[1.5]" />
                <span className="font-body text-[10px] uppercase tracking-widest text-brand-muted">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center text-center text-brand-dark">
                <Truck size={24} className="mb-3 stroke-[1.5]" />
                <span className="font-body text-[10px] uppercase tracking-widest text-brand-muted">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center text-brand-dark">
                <Star size={24} className="mb-3 stroke-[1.5]" />
                <span className="font-body text-[10px] uppercase tracking-widest text-brand-muted">Top Rated</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedData?.products?.length > 1 && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 mt-12 border-t border-brand-border">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-3xl font-heading text-brand-dark uppercase tracking-wide">You May Also Like</h3>
            <Link to="/shop" className="text-xs font-body uppercase tracking-widest text-brand-dark hover:text-brand-muted transition-colors flex items-center">
              View All <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-12">
            {relatedData.products.filter((p: any) => p._id !== product._id).slice(0, 4).map((p: any) => (
              <ProductCard key={p._id} product={p} onQuickView={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewedData && recentlyViewedData.length > 0 && (
        <div className="bg-brand-light py-20 border-t border-brand-border">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h3 className="text-3xl font-heading mb-12 text-brand-dark uppercase tracking-wide text-center">Recently Viewed</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-12">
              {recentlyViewedData.map((p: any) => (
                <ProductCard key={p._id} product={p} onQuickView={() => {}} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailsPage;
