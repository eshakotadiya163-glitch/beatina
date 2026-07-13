import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useState, useEffect } from 'react';
import { Star, Truck, ShieldCheck, Plus, Minus, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howToUse'>('description');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState('Standard');
  const { addItem, setIsOpen } = useCartStore();
  
  const { ref: addToCartRef, inView: isAddToCartVisible } = useInView({
    threshold: 0,
    rootMargin: "-100px 0px 0px 0px",
  });

  const addToCartHandler = () => {
    if (!product) return;
    addItem({
      _id: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      price: product.price,
      qty,
      countInStock: product.countInStock || 0
    });
    toast.success('Added to bag');
    setIsOpen(true);
  };

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
  const categoryId = product?.category?._id || product?.category;
  const { data: relatedData } = useQuery({
    queryKey: ['products', 'related', categoryId],
    queryFn: async () => {
      const { data } = await api.get(`/products?category=${categoryId}&limit=8`);
      return data;
    },
    enabled: !!categoryId,
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
                  <span className="font-body text-brand-muted text-sm">₹{product.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex border border-brand-border bg-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-brand-dark hover:bg-brand-light transition-colors"><Minus size={14} /></button>
                  <div className="px-3 py-2 font-body text-sm text-brand-dark border-l border-r border-brand-border flex items-center min-w-[40px] justify-center">{qty}</div>
                  <button onClick={() => setQty(Math.min(product.countInStock || 10, qty + 1))} className="px-3 py-2 text-brand-dark hover:bg-brand-light transition-colors"><Plus size={14} /></button>
                </div>
                <button 
                  onClick={addToCartHandler}
                  className="bg-brand-dark text-white font-body uppercase tracking-[0.2em] text-xs px-8 py-3 hover:bg-black transition-colors"
                >
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
            <div className="sticky top-32 flex flex-col md:flex-row gap-4">
              
              {/* Desktop Thumbnails */}
              <div className="hidden md:block w-20 flex-shrink-0 h-[60vh] md:h-[75vh]">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  direction="vertical"
                  spaceBetween={12}
                  slidesPerView="auto"
                  watchSlidesProgress={true}
                  modules={[Navigation, Thumbs]}
                  className="h-full custom-scrollbar"
                >
                  {productImages.map((img: string, idx: number) => (
                    <SwiperSlide key={idx} className="!h-auto !aspect-[3/4] cursor-pointer">
                      <div className={`w-full h-full border overflow-hidden transition-opacity bg-brand-light ${activeImage === idx ? 'border-brand-dark opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Main Image Slider */}
              <div className="flex-1 bg-brand-light overflow-hidden relative group border border-brand-border/50 h-[50vh] md:h-[75vh] w-full">
                <Swiper
                  modules={[Navigation, Thumbs, Pagination]}
                  navigation={{
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next',
                  }}
                  pagination={{ clickable: true, el: '.swiper-pagination-mobile' }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
                  className="h-full w-full"
                >
                  {productImages.map((img: string, idx: number) => (
                    <SwiperSlide key={idx} className="h-full w-full">
                      <InnerImageZoom 
                        src={img} 
                        zoomSrc={img} 
                        className="w-full h-full object-cover mix-blend-multiply"
                        zoomType="hover"
                        zoomPreload={true}
                        hideHint={true}
                      />
                    </SwiperSlide>
                  ))}
                  
                  {/* Custom Navigation Arrows */}
                  <div className="swiper-button-prev !text-brand-dark !left-4 opacity-0 group-hover:opacity-100 transition-opacity after:!text-xl hidden md:flex w-10 h-10 bg-white items-center justify-center rounded-full shadow-md hover:bg-brand-dark hover:!text-white"></div>
                  <div className="swiper-button-next !text-brand-dark !right-4 opacity-0 group-hover:opacity-100 transition-opacity after:!text-xl hidden md:flex w-10 h-10 bg-white items-center justify-center rounded-full shadow-md hover:bg-brand-dark hover:!text-white"></div>
                </Swiper>
              </div>

              {/* Mobile Thumbnails (Pagination dots below main image) */}
              <div className="md:hidden mt-4">
                 <div className="swiper-pagination-mobile flex justify-center gap-2"></div>
              </div>
              
              {/* Optional Mobile Image Thumbnails if they prefer clicks over dots */}
              <div className="flex md:hidden gap-3 overflow-x-auto mt-2 no-scrollbar">
                {productImages.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => {
                      const swiperEl = document.querySelector('.flex-1 .swiper') as any;
                      if (swiperEl && swiperEl.swiper) swiperEl.swiper.slideTo(idx);
                    }}
                    className={`border ${activeImage === idx ? 'border-brand-dark' : 'border-transparent'} w-16 aspect-[3/4] flex-shrink-0 bg-brand-light`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                  </button>
                ))}
              </div>
              
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
                 <span className="text-2xl font-body text-brand-dark">₹{product.price.toFixed(2)}</span>
                 {product.compareAtPrice && product.compareAtPrice > product.price && (
                   <span className="text-sm font-body text-brand-muted line-through mb-1">₹{product.compareAtPrice.toFixed(2)}</span>
                 )}
               </div>
               <p className="text-xs font-body text-brand-muted mt-2">
                 Taxes included. Free shipping on orders over ₹500.
               </p>
            </div>

            {/* Variants */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-heading text-sm uppercase tracking-widest text-brand-dark">Select Size</span>
                <span className="font-body text-xs text-brand-muted cursor-pointer hover:text-brand-dark transition-colors">Size Guide</span>
              </div>
              <div className="flex gap-3">
                {['Travel Size', 'Standard', 'Value Size'].map(variant => (
                  <button 
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex-1 py-3 font-body text-xs uppercase tracking-widest border transition-colors ${selectedVariant === variant ? 'border-brand-dark bg-brand-dark text-white' : 'border-brand-border bg-white text-brand-dark hover:border-brand-dark'}`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div ref={addToCartRef} className="flex flex-col gap-4 mb-10">
              <div className="flex gap-4">
                <div className="flex border border-brand-border w-32 bg-white">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex-1 py-3 text-brand-dark hover:bg-brand-light flex justify-center items-center transition-colors"><Minus size={14} /></button>
                  <div className="flex-1 py-3 font-body text-sm text-brand-dark border-l border-r border-brand-border flex justify-center items-center">{qty}</div>
                  <button onClick={() => setQty(Math.min(product.countInStock || 10, qty + 1))} className="flex-1 py-3 text-brand-dark hover:bg-brand-light flex justify-center items-center transition-colors"><Plus size={14} /></button>
                </div>
                <button 
                  onClick={addToCartHandler}
                  className="flex-1 bg-brand-dark text-white font-body uppercase tracking-[0.2em] text-xs hover:bg-black transition-colors"
                >
                  Add to Bag
                </button>
              </div>
            </div>

            {/* Horizontal Tabs */}
            <div className="mt-8">
              <div className="flex border-b border-brand-border">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'ingredients', label: 'Ingredients' },
                  { id: 'howToUse', label: 'How to Use' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-4 font-heading text-sm uppercase tracking-widest text-center transition-colors relative ${activeTab === tab.id ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'}`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-dark" 
                      />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="py-6 min-h-[150px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'description' && (
                    <motion.div key="desc" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <div className="font-body text-sm text-brand-muted leading-relaxed prose prose-sm prose-p:mb-4 max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                    </motion.div>
                  )}
                  {activeTab === 'ingredients' && (
                    <motion.div key="ingr" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <div className="font-body text-sm text-brand-muted leading-relaxed">
                        <p>{product.ingredients || "Carefully sourced natural and organic ingredients. Formulated without parabens, phthalates, sulfates, or synthetic fragrances."}</p>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'howToUse' && (
                    <motion.div key="how" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <div className="font-body text-sm text-brand-muted leading-relaxed">
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
