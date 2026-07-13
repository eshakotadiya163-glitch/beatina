import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Filter, X, Grid2X2, Grid3X3, Grid, ChevronDown, Check } from 'lucide-react';
import QuickViewModal from '../components/QuickViewModal';
import ProductCard from '../components/ProductCard';

const ShopPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  // Filters State
  const [sort, setSort] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<{min: number, max: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Toolbar layout state
  const [gridColumns, setGridColumns] = useState(4);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Fetch unique categories for the sidebar
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=100');
      // category is a populated object {_id, name, slug}
      const seen = new Set<string>();
      const cats: {_id: string; name: string}[] = [];
      data.products.forEach((p: any) => {
        if (p.category?._id && !seen.has(p.category._id)) {
          seen.add(p.category._id);
          cats.push({ _id: p.category._id, name: p.category.name });
        }
      });
      return cats;
    }
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    let url = `/products?pageNumber=${page}&sort=${sort}`;
    if (categoryFilter.length > 0) {
      // Send category _id to backend
      url += `&category=${categoryFilter[0]}`;
    }
    if (priceFilter) {
      url += `&minPrice=${priceFilter.min}&maxPrice=${priceFilter.max}`;
    }
    if (searchQuery) {
      url += `&keyword=${searchQuery}`;
    }
    if (inStockOnly) {
      url += `&inStock=true`;
    }
    const { data } = await api.get(url);
    setTotalPages(data.pages || 1);
    return data;
  };

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['products', sort, categoryFilter, priceFilter, searchQuery, inStockOnly, page],
    queryFn: fetchProducts,
  });

  const handleCategoryChange = (catId: string) => {
    setCategoryFilter(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
    setPage(1);
  };

  const gridClass = gridColumns === 2 ? 'grid-cols-1 sm:grid-cols-2' 
                  : gridColumns === 3 ? 'grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4';

  return (
    <div className="bg-[#fffcfc] min-h-screen font-sans">
      
      {quickViewProduct && (
        <QuickViewModal 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
          product={quickViewProduct} 
        />
      )}

      {/* Page Header (Points 4, 5, 26) */}
      <div className="bg-[#fcf8f5] py-16 md:py-24 mb-12 text-center border-b border-[#f0e6df]">
        <h1 className="font-serif text-[42px] md:text-[56px] text-[#111] mb-4">Shop All</h1>
        <div className="flex items-center justify-center gap-3 font-sans text-[13px] text-[#555] tracking-widest uppercase">
          <Link to="/" className="hover:text-[#ffb6c1] transition-colors">Home</Link>
          <span className="text-[#999]">/</span>
          <span className="text-[#111] font-medium">Products</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 md:px-10 pb-24">
        
        {/* Toolbar Mobile (Point 9, 29, 30) */}
        <div className="lg:hidden flex items-center justify-between mb-8 border border-[#e0e0e0] p-4">
          <button 
            className="flex items-center text-[13px] uppercase tracking-widest font-bold text-[#111]"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Filter size={18} className="mr-2" /> Filters
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#777]">{data?.total || 0} products</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar (Points 6, 7, 8) */}
          <div className={`w-full lg:w-[280px] flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-32 pr-4">
              
              <div className="mb-12">
                <h3 className="font-serif text-[22px] text-[#111] mb-6 pb-4 border-b border-[#eaeaea]">
                  Search
                </h3>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full border border-[#eaeaea] p-3 text-[14px] text-[#333] focus:outline-none focus:border-[#111] bg-[#fafafa]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="mb-12">
                <h3 className="font-serif text-[22px] text-[#111] mb-6 pb-4 border-b border-[#eaeaea]">
                  Categories
                </h3>
                <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                  {categories.length > 0 ? categories.map((cat: any) => (
                    <label key={cat._id} className="flex items-center cursor-pointer group">
                      <div
                        className={`w-5 h-5 mr-3 border flex items-center justify-center transition-colors ${categoryFilter.includes(cat._id) ? 'border-[#111] bg-[#111]' : 'border-[#ccc] bg-white group-hover:border-[#111]'}`}
                        onClick={() => handleCategoryChange(cat._id)}
                      >
                        {categoryFilter.includes(cat._id) && <Check size={14} className="text-white" />}
                      </div>
                      <span
                        className={`text-[15px] transition-colors capitalize ${categoryFilter.includes(cat._id) ? 'text-[#111] font-medium' : 'text-[#666] group-hover:text-[#111]'}`}
                        onClick={() => handleCategoryChange(cat._id)}
                      >
                        {cat.name}
                      </span>
                    </label>
                  )) : (
                    <div className="text-sm text-[#999]">Loading categories...</div>
                  )}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="font-serif text-[22px] text-[#111] mb-6 pb-4 border-b border-[#eaeaea]">
                  Price Range
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Under ₹1500', min: 0, max: 1500 },
                    { label: '₹1500 - ₹4000', min: 1500, max: 4000 },
                    { label: 'Over ₹4000', min: 4000, max: 100000 }
                  ].map(range => (
                    <label key={range.label} className="flex items-center cursor-pointer group">
                      <div className={`w-5 h-5 mr-3 rounded-full border flex items-center justify-center transition-colors ${priceFilter?.min === range.min ? 'border-[#111]' : 'border-[#ccc] group-hover:border-[#111]'}`}>
                         {priceFilter?.min === range.min && <div className="w-2.5 h-2.5 bg-[#111] rounded-full" />}
                      </div>
                      <span className={`text-[15px] transition-colors ${priceFilter?.min === range.min ? 'text-[#111] font-medium' : 'text-[#666] group-hover:text-[#111]'}`}>{range.label}</span>
                    </label>
                  ))}
                  {priceFilter && (
                    <button 
                      onClick={() => setPriceFilter(null)} 
                      className="flex items-center gap-1 text-[13px] text-[#ff6b6b] mt-5 hover:underline uppercase tracking-widest font-semibold"
                    >
                      <X size={14} /> Clear Price
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="font-serif text-[22px] text-[#111] mb-6 pb-4 border-b border-[#eaeaea]">
                  Availability
                </h3>
                <label className="flex items-center cursor-pointer group" onClick={() => setInStockOnly(!inStockOnly)}>
                  <div className={`w-5 h-5 mr-3 border flex items-center justify-center transition-colors ${inStockOnly ? 'border-[#111] bg-[#111]' : 'border-[#ccc] bg-white group-hover:border-[#111]'}`}>
                    {inStockOnly && <Check size={14} className="text-white" />}
                  </div>
                  <span className={`text-[15px] transition-colors ${inStockOnly ? 'text-[#111] font-medium' : 'text-[#666] group-hover:text-[#111]'}`}>In Stock Only</span>
                </label>
              </div>

            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Toolbar Desktop (Points 9, 10, 11) */}
            <div className="hidden lg:flex items-center justify-between mb-10 pb-6 border-b border-[#eaeaea]">
              <div className="flex items-center gap-6">
                <button onClick={() => setGridColumns(2)} className={`p-2 transition-colors ${gridColumns === 2 ? 'text-[#111]' : 'text-[#aaa] hover:text-[#111]'}`}><Grid size={22} /></button>
                <button onClick={() => setGridColumns(3)} className={`p-2 transition-colors ${gridColumns === 3 ? 'text-[#111]' : 'text-[#aaa] hover:text-[#111]'}`}><Grid3X3 size={22} /></button>
                <button onClick={() => setGridColumns(4)} className={`p-2 transition-colors ${gridColumns === 4 ? 'text-[#111]' : 'text-[#aaa] hover:text-[#111]'}`}><Grid2X2 size={22} /></button>
                <span className="text-[14px] text-[#666] ml-4">Showing {data?.products?.length || 0} of {data?.total || 0} products</span>
              </div>
              
              <div className="relative">
                <button 
                  className="flex items-center gap-2 text-[14px] font-medium uppercase tracking-widest text-[#111]"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  Sort by: <span className="text-[#777] font-normal normal-case tracking-normal">{sort === 'newest' ? 'Newest Arrivals' : sort === 'price_asc' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                  <ChevronDown size={16} />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-3 w-[220px] bg-white shadow-xl border border-[#eaeaea] z-40 py-2">
                    <button onClick={() => { setSort('newest'); setIsSortOpen(false); setPage(1); }} className="w-full text-left px-5 py-3 text-[14px] text-[#444] hover:bg-[#f9f9f9]">Newest Arrivals</button>
                    <button onClick={() => { setSort('price_asc'); setIsSortOpen(false); setPage(1); }} className="w-full text-left px-5 py-3 text-[14px] text-[#444] hover:bg-[#f9f9f9]">Price: Low to High</button>
                    <button onClick={() => { setSort('price_desc'); setIsSortOpen(false); setPage(1); }} className="w-full text-left px-5 py-3 text-[14px] text-[#444] hover:bg-[#f9f9f9]">Price: High to Low</button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Grid (Point 12) */}
            {isLoading ? (
               <div className={`grid ${gridClass} gap-x-8 gap-y-16`}>
                 {[1,2,3,4,5,6,7,8].map(i => (
                   <div key={i} className="flex flex-col gap-4">
                     <div className="animate-pulse bg-[#f4f4f4] aspect-[3/4] w-full"></div>
                     <div className="flex flex-col items-center">
                       <div className="animate-pulse bg-[#eaeaea] h-4 w-1/2 mb-3"></div>
                       <div className="animate-pulse bg-[#eaeaea] h-5 w-3/4 mb-3"></div>
                       <div className="animate-pulse bg-[#eaeaea] h-5 w-1/4"></div>
                     </div>
                   </div>
                 ))}
               </div>
            ) : error ? (
              <div className="text-center py-32 text-[#ff6b6b] text-[18px]">An error occurred while fetching products.</div>
            ) : (
              <>
                <div className={`grid ${gridClass} gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16`}>
                  {data?.products?.map((product: any) => (
                    <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
                  ))}
                </div>

                {/* Pagination (Point 27) */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-24">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-12 h-12 border border-[#ddd] flex items-center justify-center hover:bg-[#111] hover:text-white hover:border-[#111] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#111] disabled:hover:border-[#ddd] text-[#111] rounded-full"
                    >
                      &larr;
                    </button>
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`w-12 h-12 flex items-center justify-center text-[15px] font-medium transition-all rounded-full ${page === i + 1 ? 'bg-[#111] text-white' : 'text-[#666] hover:bg-[#f4f4f4]'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-12 h-12 border border-[#ddd] flex items-center justify-center hover:bg-[#111] hover:text-white hover:border-[#111] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#111] disabled:hover:border-[#ddd] text-[#111] rounded-full"
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
