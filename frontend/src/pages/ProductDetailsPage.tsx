import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useState, useEffect } from 'react';
import { Minus, Plus, Star, ArrowRight, ShieldCheck, Flame, Eye, Heart, ArrowLeftRight, Mail, Globe, Lock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import InnerImageZoomPkg from 'react-inner-image-zoom';
// @ts-ignore
const InnerImageZoom = InnerImageZoomPkg.default || InnerImageZoomPkg.InnerImageZoom || InnerImageZoomPkg;
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Keyboard, Mousewheel, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/cartStore';

import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { getImageUrl } from '../utils/imageHelper';

// Helper for dynamic icons


const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('description');
  const [activeTab, setActiveTab] = useState('description');
  
  const { addItem, setIsOpen } = useCartStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  
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


  const categoryId = product?.category?._id || product?.category;
  const { data: relatedData } = useQuery({
    queryKey: ['products', 'related', categoryId],
    queryFn: async () => {
      const { data } = await api.get(`/products?category=${categoryId}&limit=8`);
      return data;
    },
    enabled: !!categoryId,
  });

  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    if (product) {
      try {
        const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const current = {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: getImageUrl(product),
          category: product?.category?.name || product?.category || 'Beauty'
        };
        // Remove if exists to push to front
        const filtered = stored.filter((item: any) => item._id !== product._id);
        const updated = [current, ...filtered].slice(0, 10); // Keep last 10
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        setRecentlyViewed(updated.filter((item: any) => item._id !== product._id)); // Don't show current product in recently viewed
      } catch (err) {
        console.error('Error saving recently viewed', err);
      }
    }
  }, [product]);

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.post('/wishlist', { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: () => {
      toast.error('Failed to add to wishlist. Please login.');
    }
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      await api.post(`/products/${product?._id || id}/reviews`, reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast.success('Review submitted successfully');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    submitReviewMutation.mutate(reviewForm);
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordion(expandedAccordion === id ? null : id);
  };

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center pt-14"><div className="w-8 h-8 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !product) return <div className="min-h-screen bg-white flex items-center justify-center pt-14 text-brand-dark font-body">Product not found</div>;

  const productImages = Array.isArray(product.images) ? product.images.map((_: any, idx: number) => getImageUrl(product, idx)) : [];

  const addToCartHandler = () => {
    const variantSuffix = selectedVariant ? ` - ${selectedVariant}` : '';
    const { cartItems } = useCartStore.getState();
    const existingItem = cartItems.find((x) => x._id === product._id && x.variantKey === (selectedVariant || undefined));
    const currentQty = existingItem ? existingItem.qty : 0;
    const newQty = currentQty + qty;

    if (product.countInStock && newQty > product.countInStock) {
      toast.error('Not enough stock to add that quantity');
      return;
    }

    addItem({
      _id: product._id,
      name: `${product.name}${variantSuffix}`,
      image: getImageUrl(product),
      price: product.price,
      qty: newQty,
      countInStock: product.countInStock || 0,
      variantKey: selectedVariant || undefined
    });
    toast.success('Added to bag');
    setIsOpen(true);
  };

  const buyNowHandler = () => {
    addToCartHandler();
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen pt-[120px] pb-14">
      
      {/* Sticky Add to Cart Bar */}
      <AnimatePresence>
        {!isAddToCartVisible && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] lg:top-[90px] left-0 right-0 bg-white border-b border-brand-border z-40 shadow-sm py-3 px-4 hidden md:block"
          >
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={productImages[0] || '/placeholder.png'} alt={product.name} className="w-12 h-16 object-cover bg-brand-light" />
                <div>
                  <h3 className="font-heading text-sm text-brand-dark line-clamp-1">{product.name}</h3>
                  <span className="font-body text-brand-muted text-sm">Rs. {product?.price?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-brand-border rounded-sm h-10 w-24">
                  <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="flex-1 flex justify-center items-center h-full hover:bg-brand-light transition-colors" type="button"><Minus size={14} /></button>
                  <div className="w-8 text-center font-body text-sm font-medium">{qty}</div>
                  <button onClick={() => setQty(qty < product.countInStock ? qty + 1 : product.countInStock)} className="flex-1 flex justify-center items-center h-full hover:bg-brand-light transition-colors" type="button"><Plus size={14} /></button>
                </div>
                <button onClick={addToCartHandler} disabled={product.countInStock === 0} className="h-10 px-6 bg-brand-dark text-white font-body text-sm uppercase tracking-wider hover:bg-brand-primary transition-colors disabled:opacity-50">
                  {product.countInStock > 0 ? 'Add to Bag' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="text-xs font-body text-brand-muted mb-8 tracking-wider uppercase flex items-center gap-2">
          <Link to="/" className="hover:text-brand-dark transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-dark transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-dark line-clamp-1">{product.name}</span>
        </div>

        {/* Breadcrumbs */}
        <div className="text-[11px] font-body text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/collections/${product.category.slug || product.category}`} className="hover:text-black">
                {product.category.name || product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-400">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] mb-12">
              
              {/* Image Gallery Section */}
              <div className="flex flex-col w-full">
                {/* Main Image Slider */}
                <div 
                  className="w-full relative group flex justify-center items-center rounded-md" 
                  style={{ backgroundColor: '#e2e2e2', aspectRatio: '1/1.15' }}
                >
                  <Swiper
                    spaceBetween={0}
                    navigation={{
                      nextEl: '.swiper-button-next-custom',
                      prevEl: '.swiper-button-prev-custom',
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[Navigation, Thumbs, Keyboard, Mousewheel, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    keyboard={{ enabled: true }}
                    mousewheel={{ forceToAxis: true }}
                    loop={true}
                    className="w-full h-full"
                    onSlideChange={(swiper) => setActiveImage(swiper.realIndex)}
                  >
                    {productImages.map((img: string, idx: number) => (
                      <SwiperSlide key={idx} className="w-full h-full">
                        <div className="w-full h-full flex justify-center items-center cursor-zoom-in relative overflow-hidden p-6 lg:p-10">
                          <img 
                            src={img || '/placeholder.png'} 
                            alt={`${product.name} - view ${idx + 1}`}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="w-full h-full object-contain object-center block mix-blend-multiply"
                            style={{ 
                              maxWidth: '100%',
                              maxHeight: '100%'
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                    {productImages.length === 0 && (
                      <SwiperSlide className="w-full h-full">
                        <div className="w-full h-full flex justify-center items-center overflow-hidden p-6 lg:p-10">
                          <img src="/placeholder.png" alt="Placeholder" className="w-full h-full object-contain object-center block mix-blend-multiply" />
                        </div>
                      </SwiperSlide>
                    )}
                    
                    {/* Custom Arrows */}
                    <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 bg-transparent flex items-center justify-center z-10 text-gray-500 hover:text-black transition-colors cursor-pointer">
                      <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
                    </button>
                    <button className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 w-7 h-7 bg-transparent flex items-center justify-center z-10 text-gray-500 hover:text-black transition-colors cursor-pointer">
                      <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                    </button>
                  </Swiper>
                </div>

                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div className="w-full mt-4">
                      <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={12}
                        slidesPerView="auto"
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="product-thumbs-swiper w-full flex justify-start"
                      >
                        {productImages.map((img: string, idx: number) => {
                          const thumbPath = img.replace('main-large.webp', 'thumb-1.webp').replace(/gallery-(\d+)\.webp/, (_, p1) => `thumb-${parseInt(p1) + 1}.webp`);
                          return (
                            <SwiperSlide key={idx} style={{ width: '80px', height: '80px' }}>
                              <div 
                                className={`w-full h-full cursor-pointer transition-all rounded-sm overflow-hidden flex justify-center items-center bg-[#e2e2e2] ${activeImage === idx ? 'border-2 border-black' : 'border border-transparent hover:border-gray-300'}`}
                              >
                                <img src={thumbPath} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-contain object-center block mix-blend-multiply p-2" />
                              </div>
                            </SwiperSlide>
                          );
                        })}
                    </Swiper>
                  </div>
                )}
              </div>

          {/* Right Column - Info */}
          <div className="w-full lg:py-8 lg:pl-16" ref={addToCartRef}>
            
            {/* Title */}
            <h1 className="text-3xl md:text-[32px] font-heading text-brand-dark mb-4 uppercase tracking-widest">{product.name}</h1>
            
            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-body text-brand-dark">
                Rs. {product?.price?.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2}) || "0.00"}
              </span>
            </div>

            {/* Fire and Eye icons */}
            <div className="flex flex-col gap-2 mb-8 text-[13px] font-body text-gray-600">
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-orange-500 fill-orange-500" />
                <span>30 sold in last 18 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-indigo-900" />
                <span>25 customers are viewing this product</span>
              </div>
            </div>

            {/* Variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="text-[13px] font-body text-gray-500 mb-3">Custom Active : <span className="text-gray-400">{selectedVariant || product.sizes[0]}</span></div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string, index: number) => (
                    <button
                      key={index} 
                      onClick={() => setSelectedVariant(size)}
                      className={`px-3 py-2 text-[12px] font-body transition-all border ${selectedVariant === size || (!selectedVariant && index === 0) ? "border-black border-[1.5px] text-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Volumes */}
            <div className="mb-8">
              <div className="text-[13px] font-body text-gray-500 mb-3">Volumes : <span className="text-gray-400">17.5 ml</span></div>
              <div className="flex flex-wrap gap-2">
                  <button
                    className="px-3 py-2 text-[12px] font-body transition-all border border-black border-[1.5px] text-black"
                  >
                    17.5 ml
                  </button>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-4 h-[40px]">
              <div className="flex items-center border border-gray-300 h-full w-[85px] bg-white">
                <button 
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)} 
                  className="flex-1 flex justify-center items-center h-full hover:bg-gray-50 transition-colors text-lg text-gray-500"
                  type="button"
                >
                  <Minus size={14} />
                </button>
                <div className="w-10 text-center font-body text-[13px] text-gray-700">{qty}</div>
                <button 
                  onClick={() => setQty(qty < (product.countInStock || 0) ? qty + 1 : product.countInStock || 0)} 
                  className="flex-1 flex justify-center items-center h-full hover:bg-gray-50 transition-colors text-lg text-gray-500"
                  type="button"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button 
                onClick={addToCartHandler} 
                disabled={product.countInStock === 0}
                className="flex-1 h-full bg-black text-white font-heading text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ADD TO CART
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" id="terms" className="w-3 h-3 border-gray-300 rounded-sm" />
              <label htmlFor="terms" className="text-[12px] font-body text-gray-500">
                I agree with the <span className="underline cursor-pointer">terms and conditions</span>
              </label>
            </div>

            {/* Buy it now */}
            <button 
              onClick={buyNowHandler} 
              disabled={product.countInStock === 0}
              className="w-full h-[46px] bg-[#9e9e9e] text-white font-heading text-xs tracking-widest uppercase hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
            >
              BUY IT NOW
            </button>

            {/* Links */}
            <div className="flex items-center gap-6 mb-8 text-[12px] font-body text-gray-600">
              <button 
                onClick={() => addToWishlistMutation.mutate(product._id)}
                className="flex items-center gap-2 hover:text-black transition-colors"
              >
                <Heart size={14} /> Add to Wishlist
              </button>
              <button className="flex items-center gap-2 hover:text-black transition-colors"><ArrowLeftRight size={14} /> Compare</button>
              <button className="flex items-center gap-2 hover:text-black transition-colors"><Mail size={14} /> Ask an Expert</button>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 gap-3 text-[11px] font-body text-gray-500 mb-8 pb-8 border-b border-gray-200">
              {product.vendor && (
                <div className="flex"><span className="w-16 text-gray-400 capitalize">Vendor:</span> <span className="text-gray-700">{product.vendor}</span></div>
              )}
              {(product.category?.name || product.category) && (
                <div className="flex"><span className="w-16 text-gray-400 capitalize">Type:</span> <span className="text-gray-700">{product.category?.name || product.category}</span></div>
              )}
              {product.sku && (
                <div className="flex"><span className="w-16 text-gray-400 capitalize">SKU:</span> <span className="text-gray-700">{product.sku}</span></div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pb-8 mb-8 border-b border-gray-200">
              <div className="flex flex-col items-center justify-center text-center gap-3 text-gray-500">
                <Globe size={24} strokeWidth={1} />
                <span className="text-[10px] font-body text-gray-500 uppercase tracking-wide">Wordwide Free shipping</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-3 text-gray-500">
                <Lock size={24} strokeWidth={1} />
                <span className="text-[10px] font-body text-gray-500 uppercase tracking-wide">Secure payment</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-3 text-gray-500">
                <ShieldCheck size={24} strokeWidth={1} />
                <span className="text-[10px] font-body text-gray-500 uppercase tracking-wide">6 Month Warranty</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="mb-8">
              {[
                { id: "core_features", title: "CORE FEATURES", content: "Core features detail.", html: true },
                { id: "ingredients", title: "INGREDIENTS", content: product.ingredients || "Ingredients detail.", html: true },
              ].map((acc) => (
                <div key={acc.id} className="border-b border-gray-200">
                  <button 
                    onClick={() => toggleAccordion(acc.id)}
                    className="w-full py-4 flex items-center justify-between focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      {acc.id === "core_features" ? <span className="text-gray-400 text-sm">🏷️</span> : <span className="text-gray-400 text-sm">🌿</span>}
                      <span className="text-[12px] font-heading font-bold uppercase tracking-widest text-gray-800">{acc.title}</span>
                    </div>
                    {expandedAccordion === acc.id ? <Minus size={14} className="text-black" /> : <Plus size={14} className="text-black" />}
                  </button>
                  <AnimatePresence>
                    {expandedAccordion === acc.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pt-2 text-[13px] font-body text-gray-500 leading-relaxed whitespace-pre-line">
                          {acc.html ? <div dangerouslySetInnerHTML={{ __html: acc.content }} /> : acc.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Payment Section */}
            {product?.safeCheckout !== false && (
              <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg py-6 relative mt-12">
                <div className="absolute -top-3 bg-white px-4">
                  <span className="text-[12px] font-heading font-bold text-gray-800">Guarantee safe checkout</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center mt-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-[20px] object-contain border border-gray-200 rounded-sm bg-white px-1" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-[20px] object-contain border border-gray-200 rounded-sm bg-white px-1" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-[20px] object-contain border border-gray-200 rounded-sm bg-white px-1" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-[20px] object-contain border border-gray-200 rounded-sm bg-white px-1 py-1" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-[20px] object-contain border border-gray-200 rounded-sm bg-white px-1 py-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Tabs Section */}
      {product && (
        <div className="max-w-[1320px] mx-auto px-4 md:px-8">
          <div className="w-full border-t border-gray-200 pt-12 mb-12">
            <div className="flex gap-8 border-b border-gray-200 mb-8">
              <button 
                onClick={() => setActiveTab('description')}
                className={`text-[15px] font-heading font-medium pb-4 border-b-[2px] transition-colors ${activeTab === 'description' ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}
              >
                Description
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={`text-[15px] font-heading font-medium pb-4 border-b-[2px] transition-colors ${activeTab === 'shipping' ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}
              >
                Shipping & Returns
              </button>
              <button 
                onClick={() => setActiveTab('care')}
                className={`text-[15px] font-heading font-medium pb-4 border-b-[2px] transition-colors ${activeTab === 'care' ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}
              >
                Care
              </button>
            </div>
            
            <div className="text-[15px] font-body text-gray-700 leading-relaxed max-w-4xl">
              {activeTab === 'description' && (
                <div dangerouslySetInnerHTML={{ __html: product.description || '' }} />
              )}
              {activeTab === 'shipping' && (
                <div>
                  <p className="mb-4">We offer free express shipping on all orders above Rs. 970.</p>
                  <p className="mb-4">Standard delivery takes 3-5 business days.</p>
                  <p>If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange. The items must be in their original condition and packaging.</p>
                </div>
              )}
              {activeTab === 'care' && (
                <div>
                  <p className="mb-4">Store in a cool, dry place away from direct sunlight.</p>
                  <p>Keep the product tightly closed when not in use to maintain its efficacy and freshness. Avoid contact with eyes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic How To Use Steps (Match Screenshot) */}
      {product?.howToUseSteps?.length > 0 && (
         <div className="bg-white py-12 mb-12">
            <div className="max-w-[1000px] mx-auto px-4">
               <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-[36px] font-heading text-[#111111] mb-4">HOW TO USE</h2>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-10">
                  {product.howToUseSteps.map((step: any, idx: number) => {
                    const isEven = idx % 2 === 0;

                    return (
                      <div key={idx} className="flex flex-col h-full">
                        {isEven ? (
                          <>
                            {/* Image Top */}
                            <div className="w-full aspect-square overflow-hidden bg-gray-50 mb-6">
                              {step.image && (
                                <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                              )}
                            </div>
                            {/* Text Bottom */}
                            <div>
                               <h4 className="text-[18px] md:text-[20px] font-heading text-[#111111] mb-2">{idx + 1}. {step.title}</h4>
                               <p className="text-[#555] font-body text-[14px] leading-[1.6]">{step.description}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Text Top */}
                            <div className="mb-6">
                               <h4 className="text-[18px] md:text-[20px] font-heading text-[#111111] mb-2">{idx + 1}. {step.title}</h4>
                               <p className="text-[#555] font-body text-[14px] leading-[1.6]">{step.description}</p>
                            </div>
                            {/* Image Bottom */}
                            <div className="w-full aspect-square overflow-hidden bg-gray-50 mt-auto">
                              {step.image && (
                                <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
               </div>
            </div>
         </div>
      )}

      {/* Related Products Slider */}
      {relatedData?.products?.length > 1 && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 mt-12 border-t border-brand-border">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-3xl md:text-4xl font-heading text-brand-dark uppercase tracking-widest">You May Also Like</h3>
            <Link to="/shop" className="text-sm font-body uppercase tracking-widest text-brand-dark hover:text-brand-primary transition-colors flex items-center underline underline-offset-4">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="relative">
            <Swiper
              spaceBetween={24}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
              className="related-products-swiper pb-10"
            >
              {relatedData.products.filter((p: any) => p._id !== product._id).slice(0, 6).map((p: any) => (
                <SwiperSlide key={p._id}>
                  <ProductCard product={p} onQuickView={() => {}} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Recently Viewed Slider */}
      {recentlyViewed.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 border-t border-brand-border">
          <div className="mb-12 text-center">
            <h3 className="text-3xl md:text-4xl font-heading text-brand-dark uppercase tracking-widest">Recently Viewed</h3>
          </div>
          
          <div className="relative">
            <Swiper
              spaceBetween={24}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
              className="recently-viewed-swiper pb-10"
            >
              {recentlyViewed.map((p: any) => (
                <SwiperSlide key={p._id}>
                  <ProductCard product={{...p, image: p.image}} onQuickView={() => {}} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Customer Reviews block */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-14 border-t border-brand-border mb-14">
         <div className="text-center mb-12">
           <h2 className="text-3xl md:text-5xl font-heading text-brand-dark mb-6 uppercase tracking-wider">Customer Reviews</h2>
           <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="flex flex-col items-center">
                 <span className="text-[80px] font-heading text-brand-dark mb-2 leading-none">{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
                 <div className="flex items-center justify-center gap-1 mb-2">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={24} className={i < Math.round(product.rating || 0) ? "text-brand-dark fill-brand-dark" : "text-gray-200"} />
                   ))}
                 </div>
                 <p className="text-brand-muted font-body">Based on {product.numReviews || 0} reviews</p>
              </div>
              
              <div className="w-full max-w-md space-y-3">
                 {[5,4,3,2,1].map(stars => {
                    const count = product.reviews?.filter((r:any) => r.rating === stars).length || 0;
                    const percent = product.numReviews ? Math.round((count / product.numReviews) * 100) : 0;
                    return (
                       <div key={stars} className="flex items-center gap-4 text-sm font-body">
                          <span className="w-16 flex items-center justify-end gap-1 text-brand-dark">
                             {stars} <Star size={14} className="fill-current" />
                          </span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-brand-dark rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                          <span className="w-12 text-brand-muted">{percent}%</span>
                       </div>
                    );
                 })}
              </div>
           </div>
           <div className="mt-10">
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-8 py-4 bg-black text-white font-heading uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors rounded-full"
              >
                 {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
           </div>
         </div>

         {/* Review Form */}
         <AnimatePresence>
            {showReviewForm && (
               <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden max-w-2xl mx-auto mb-12"
               >
                  <form onSubmit={handleReviewSubmit} className="bg-brand-light p-8 rounded-2xl border border-gray-100">
                     <h4 className="font-heading text-xl text-brand-dark mb-6">Write a Review</h4>
                     
                     <div className="mb-6">
                        <label className="block text-sm font-body text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                 key={star}
                                 type="button"
                                 onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                 className="focus:outline-none"
                              >
                                 <Star 
                                    size={24} 
                                    className={star <= reviewForm.rating ? "text-brand-dark fill-brand-dark" : "text-gray-300"} 
                                 />
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="mb-6">
                        <label className="block text-sm font-body text-gray-700 mb-2">Review Title</label>
                        <input
                           type="text"
                           required
                           value={reviewForm.title}
                           onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                           className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-brand-dark focus:outline-none font-body text-sm"
                           placeholder="Sum up your experience"
                        />
                     </div>

                     <div className="mb-6">
                        <label className="block text-sm font-body text-gray-700 mb-2">Review Content</label>
                        <textarea
                           required
                           rows={4}
                           value={reviewForm.comment}
                           onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                           className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm focus:border-brand-dark focus:outline-none font-body text-sm resize-none"
                           placeholder="What did you like or dislike? What did you use this product for?"
                        ></textarea>
                     </div>

                     <button
                        type="submit"
                        disabled={submitReviewMutation.isPending}
                        className="w-full bg-brand-dark text-white py-4 font-heading uppercase tracking-widest text-xs hover:bg-black transition-colors rounded-sm flex items-center justify-center"
                     >
                        {submitReviewMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Submit Review'}
                     </button>
                  </form>
               </motion.div>
            )}
         </AnimatePresence>
         
         {product?.reviews?.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {product.reviews.map((review: any, idx: number) => (
               <div key={idx} className="border border-gray-100 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex items-center gap-1 mb-4">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={16} className={i < review.rating ? "text-brand-dark fill-brand-dark" : "text-gray-200"} />
                   ))}
                 </div>
                 <h6 className="font-heading text-brand-dark text-xl mb-3">{review.title}</h6>
                 <p className="text-brand-muted font-body leading-relaxed text-base mb-6">{review.comment}</p>
                 <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-brand-dark font-heading uppercase">
                       {review.name?.charAt(0) || "U"}
                     </div>
                     <h5 className="font-heading text-brand-dark tracking-wider">{review.name}</h5>
                   </div>
                   <span className="text-sm text-brand-muted font-body">{new Date(review.createdAt).toLocaleDateString()}</span>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <p className="text-brand-muted font-body text-lg">No reviews yet. Be the first to review this product!</p>
           </div>
         )}
      </div>

    </div>
  );
};

export default ProductDetailsPage;