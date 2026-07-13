import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Filter, Loader2, X } from 'lucide-react';
import QuickViewModal from '../components/QuickViewModal';
import ProductCard from '../components/ProductCard';
import { useInView } from 'react-intersection-observer';

const CategoryPage = () => {
  const { id } = useParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  // Filters State
  const [sort, setSort] = useState('newest');
  const [priceFilter, setPriceFilter] = useState<{min: number, max: number} | null>(null);

  const { ref, inView } = useInView();

  const formattedCategoryName = id ? id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Category';

  const fetchProducts = async ({ pageParam = 1 }) => {
    let url = `/products?pageNumber=${pageParam}&sort=${sort}&category=${formattedCategoryName}`;
    if (priceFilter) {
      url += `&minPrice=${priceFilter.min}&maxPrice=${priceFilter.max}`;
    }
    const { data } = await api.get(url);
    return data;
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['products', 'category', formattedCategoryName, sort, priceFilter],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="pt-[116px] pb-20 bg-white min-h-screen">
      
      {quickViewProduct && (
        <QuickViewModal 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
          product={quickViewProduct} 
        />
      )}

      {/* Page Header */}
      <div className="bg-brand-light py-12 mb-12 text-center border-b border-brand-border">
        <h1 className="font-heading text-4xl text-brand-dark tracking-wide uppercase">{formattedCategoryName}</h1>
        <div className="mt-4 flex items-center justify-center gap-2 font-body text-xs text-brand-muted uppercase tracking-widest">
          <Link to="/" className="hover:text-brand-dark transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-dark transition-colors">Products</Link>
          <span>/</span>
          <span className="text-brand-dark">{formattedCategoryName}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <button 
            className="lg:hidden flex items-center justify-center w-full py-3 border border-brand-border font-body text-sm uppercase tracking-widest text-brand-dark hover:bg-brand-light transition-colors"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Filter size={16} className="mr-2" /> Filters & Sort
          </button>

          {/* Sidebar */}
          <div className={`w-full lg:w-[240px] flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-32">
              
              <div className="mb-10">
                <h3 className="font-heading text-lg text-brand-dark mb-4 uppercase tracking-widest">
                  Sort By
                </h3>
                <div className="space-y-3 font-body text-sm text-brand-muted">
                  {[
                    { label: 'Newest Arrivals', val: 'newest' },
                    { label: 'Price: Low To High', val: 'price_asc' },
                    { label: 'Price: High To Low', val: 'price_desc' }
                  ].map(option => (
                    <label key={option.val} className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="sort" 
                        className="mr-3 accent-brand-dark" 
                        checked={sort === option.val}
                        onChange={() => setSort(option.val)}
                      />
                      <span className="group-hover:text-brand-dark transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="font-heading text-lg text-brand-dark mb-4 uppercase tracking-widest">
                  Price
                </h3>
                <div className="space-y-3 font-body text-sm text-brand-muted">
                  {[
                    { label: 'Under ₹20', min: 0, max: 20 },
                    { label: '₹20 - ₹50', min: 20, max: 50 },
                    { label: 'Over ₹50', min: 50, max: 1000 }
                  ].map(range => (
                    <label key={range.label} className="flex items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name="price"
                        className="mr-3 accent-brand-dark"
                        checked={priceFilter?.min === range.min}
                        onChange={() => setPriceFilter({ min: range.min, max: range.max })}
                      />
                      <span className="group-hover:text-brand-dark transition-colors">{range.label}</span>
                    </label>
                  ))}
                  {priceFilter && (
                    <button 
                      onClick={() => setPriceFilter(null)} 
                      className="flex items-center gap-1 text-xs text-brand-dark mt-4 hover:underline"
                    >
                      <X size={12} /> Clear Price Filter
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12">
                 {[1,2,3,4,5,6,7,8].map(i => (
                   <div key={i} className="animate-pulse bg-brand-light aspect-[3/4] w-full"></div>
                 ))}
               </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500 font-body">Error loading products.</div>
            ) : data?.pages[0]?.products?.length === 0 ? (
              <div className="text-center py-24 text-brand-muted font-body">No products found in this category.</div>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12">
                  {data?.pages.map((page, pageIdx) => (
                    <React.Fragment key={pageIdx}>
                      {page.products.map((product: any) => (
                        <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
                      ))}
                    </React.Fragment>
                  ))}
                </div>

                <div ref={ref} className="flex justify-center mt-20 mb-8">
                  {isFetchingNextPage ? (
                    <div className="flex flex-col items-center text-brand-muted">
                      <Loader2 className="animate-spin mb-3 text-brand-dark" size={24} />
                      <span className="font-body text-xs uppercase tracking-widest">Loading More</span>
                    </div>
                  ) : hasNextPage ? (
                    <span className="font-body text-xs uppercase tracking-widest text-brand-muted">Scroll to load more</span>
                  ) : (
                    <span className="font-body text-xs uppercase tracking-widest text-brand-muted border-t border-brand-border pt-8 w-full text-center">
                      End of Results
                    </span>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
