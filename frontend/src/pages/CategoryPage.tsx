import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import QuickViewModal from '../components/QuickViewModal';
import CollectionProductCard from '../components/CollectionProductCard';

const CategoryPage = () => {
  const { id } = useParams();
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const initialSort = searchParams.get('sort') || 'best-selling';
  const [sortValue, setSortValue] = useState(initialSort);
  const [gridCols, setGridCols] = useState(3);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch category info to get the image and correct name
  const { data: categoriesData } = useQuery({
    queryKey: ['category-info', id],
    queryFn: async () => {
      if (id === 'all') return { slug: 'all', name: 'All Products', image: '' };
      const { data } = await api.get('/categories');
      return data.find((c: any) => c.slug === id) || { slug: id, name: id?.replace(/-/g, ' '), image: '' };
    }
  });

  // Fetch all products for this category
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['category-products', id, sortValue],
    queryFn: async () => {
      let sortParam = '';
      if (sortValue === 'price-ascending') sortParam = 'price_asc';
      else if (sortValue === 'price-descending') sortParam = 'price_desc';
      else if (sortValue === 'created-descending') sortParam = 'newest';
      else if (sortValue === 'created-ascending') sortParam = 'oldest';

      const sortQuery = sortParam ? `&sort=${sortParam}` : '';
      const endpoint = id === 'all' ? `/products?limit=100${sortQuery}` : `/products/category/${id}?limit=40${sortQuery}`;
      const { data } = await api.get(endpoint);
      return data.products || [];
    }
  });

  const categoryName = categoriesData?.name || (id === 'all' ? 'All Products' : id?.replace(/-/g, ' '));
  const heroImage = categoriesData?.bannerImage || categoriesData?.image || '';

  const processedProducts = useMemo(() => {
    if (!productsData) return [];
    let filtered = [...productsData];
    
    if (inStockOnly) {
      filtered = filtered.filter((p: any) => p.countInStock > 0);
    }

    switch (sortValue) {
      case 'title-ascending':
        filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      case 'title-descending':
        filtered.sort((a: any, b: any) => b.name.localeCompare(a.name));
        break;
      case 'price-ascending':
        filtered.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-descending':
        filtered.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'created-descending':
        filtered.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'created-ascending':
        filtered.sort((a: any, b: any) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        break;
    }
    return filtered;
  }, [productsData, sortValue, inStockOnly]);

  const gridClass = gridCols === 2 ? 'grid-cols-2' 
                  : gridCols === 3 ? 'grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="bg-white min-h-screen pb-16">
      {quickViewProduct && (
        <QuickViewModal
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
        />
      )}

      {/* Hero Banner — fixed height to match The Woman Company's ~420px banner */}
      <div
        className="relative w-full overflow-hidden bg-[#b0bcbe]"
        style={{ height: '420px' }}
      >
        {heroImage && (
          <img
            src={heroImage}
            alt={categoryName}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        {/* Breadcrumbs */}
        <div className="absolute top-0 left-0 z-10 px-6 py-4">
          <nav className="flex items-center gap-2 font-body text-[13px] text-white/80">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white capitalize">{categoryName}</span>
          </nav>
        </div>
        {/* Title centered */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="font-serif text-white text-[42px] md:text-[52px] leading-tight capitalize drop-shadow-sm">
            {categoryName}
          </h1>
        </div>
      </div>

      {/* Main content area — full width, padded */}
      <div className="max-w-[1440px] mx-auto px-6 pt-10 pb-12">

        {/* Toolbar: Filter label | Column toggle | Sort | Count */}
        <div className="flex items-center gap-6 border-b border-gray-200 pb-5 mb-6">
          {/* Filter label (left) */}
          <span className="font-body text-[15px] font-medium text-brand-dark tracking-wide">Filter:</span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Column toggle buttons */}
          <div className="hidden md:flex items-center gap-1">
            {/* 2-column */}
            <button 
              onClick={() => setGridCols(2)}
              className={`w-8 h-8 border flex items-center justify-center transition-colors ${gridCols === 2 ? 'border-brand-dark' : 'border-gray-300 hover:border-brand-dark'}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="5.5" height="14" fill="currentColor" opacity={gridCols === 2 ? "1" : "0.4"}/>
                <rect x="8.5" y="0" width="5.5" height="14" fill="currentColor" opacity={gridCols === 2 ? "1" : "0.4"}/>
              </svg>
            </button>
            {/* 3-column */}
            <button 
              onClick={() => setGridCols(3)}
              className={`w-8 h-8 border flex items-center justify-center transition-colors ${gridCols === 3 ? 'border-brand-dark' : 'border-gray-300 hover:border-brand-dark'}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="3.5" height="14" fill="currentColor" opacity={gridCols === 3 ? "1" : "0.4"}/>
                <rect x="5.25" y="0" width="3.5" height="14" fill="currentColor" opacity={gridCols === 3 ? "1" : "0.4"}/>
                <rect x="10.5" y="0" width="3.5" height="14" fill="currentColor" opacity={gridCols === 3 ? "1" : "0.4"}/>
              </svg>
            </button>
            {/* 4-column */}
            <button 
              onClick={() => setGridCols(4)}
              className={`w-8 h-8 border flex items-center justify-center transition-colors ${gridCols === 4 ? 'border-brand-dark' : 'border-gray-300 hover:border-brand-dark'}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="2.5" height="14" fill="currentColor" opacity={gridCols === 4 ? "1" : "0.4"}/>
                <rect x="3.8" y="0" width="2.5" height="14" fill="currentColor" opacity={gridCols === 4 ? "1" : "0.4"}/>
                <rect x="7.6" y="0" width="2.5" height="14" fill="currentColor" opacity={gridCols === 4 ? "1" : "0.4"}/>
                <rect x="11.4" y="0" width="2.5" height="14" fill="currentColor" opacity={gridCols === 4 ? "1" : "0.4"}/>
              </svg>
            </button>
          </div>

          {/* Sort by */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort_by" className="font-body text-[14px] text-brand-dark hidden sm:block whitespace-nowrap">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort_by"
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                className="font-body text-[14px] text-brand-dark bg-transparent border border-gray-300 rounded-none py-1.5 pl-3 pr-8 focus:ring-0 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="manual">Featured</option>
                <option value="best-selling">Best selling</option>
                <option value="title-ascending">Alphabetically, A-Z</option>
                <option value="title-descending">Alphabetically, Z-A</option>
                <option value="price-ascending">Price, low to high</option>
                <option value="price-descending">Price, high to low</option>
                <option value="created-descending">Date, new to old</option>
                <option value="created-ascending">Date, old to new</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Product count */}
          <span className="font-body text-[14px] text-brand-dark whitespace-nowrap">
            {processedProducts.length} Products
          </span>
        </div>

        {/* Two-column layout: sidebar + grid */}
        <div className="flex gap-8">

          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-[90px]">

              {/* Availability filter */}
              <details className="border-b border-gray-200 pb-4 mb-0 group" open>
                <summary className="flex items-center justify-between cursor-pointer py-3 font-body text-[14px] font-medium text-brand-dark list-none">
                  Availability
                  <svg className="group-open:rotate-180 transition-transform duration-200" width="12" height="8" viewBox="0 0 10 6" fill="none">
                    <path d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"/>
                  </svg>
                </summary>
                <div className="pt-3 flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer group/check">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${inStockOnly ? 'bg-brand-dark border-brand-dark' : 'border-gray-400 group-hover/check:border-brand-dark'}`}>
                      {inStockOnly && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="font-body text-[13px] text-brand-dark select-none">
                      In stock ({productsData?.filter((p: any) => p.countInStock > 0).length || 0})
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group/check opacity-50">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      disabled
                    />
                    <div className="w-4 h-4 border border-gray-400 flex-shrink-0 flex items-center justify-center">
                    </div>
                    <span className="font-body text-[13px] text-brand-dark select-none">
                      Out of stock ({productsData?.filter((p: any) => p.countInStock === 0).length || 0})
                    </span>
                  </label>
                </div>
              </details>

              {/* Price filter */}
              <details className="border-b border-gray-200 pb-4 mb-0 group">
                <summary className="flex items-center justify-between cursor-pointer py-3 font-body text-[14px] font-medium text-brand-dark list-none">
                  Price
                  <svg className="group-open:rotate-180 transition-transform duration-200" width="12" height="8" viewBox="0 0 10 6" fill="none">
                    <path d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"/>
                  </svg>
                </summary>
                <div className="pt-3">
                  <span className="font-body text-[13px] text-gray-500">Rs. 0 – Rs. 20,000+</span>
                </div>
              </details>

            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className={`grid ${gridClass} gap-x-[15px] gap-y-[30px]`}>
                {[1,2,3,4,5,6].map(j => (
                  <div key={j} className="animate-pulse bg-[#f4f4f4]" style={{ paddingTop: '125%' }} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-14 text-[#ff6b6b]">
                Could not load products. Please make sure the server is running.
              </div>
            ) : processedProducts.length === 0 ? (
              <div className="text-center py-14 text-[#555]">No products found matching your criteria.</div>
            ) : (
              <div className={`grid ${gridClass} gap-x-[15px] gap-y-[30px]`}>
                {processedProducts.map((product: any) => (
                  <CollectionProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
