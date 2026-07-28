import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import QuickViewModal from '../components/QuickViewModal';
import CollectionProductCard from '../components/CollectionProductCard';

const ShopPage = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  // Fetch all products (for the collections layout)
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['all-products-shop'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=100');
      return data.products || [];
    }
  });

  // Fetch all categories with their info
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories-shop'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data || [];
    }
  });

  const isLoading = isLoadingProducts || isLoadingCategories;

  // Process data for the collections layout
  const collections = useMemo(() => {
    if (!productsData || !categoriesData) return [];

    // Filter out hidden or empty categories if needed
    const validCategories = categoriesData.filter((c: any) => c.slug !== 'uncategorized');

    return validCategories.map((cat: any) => {
      // Find up to 3 products belonging to this category
      const catProducts = productsData
        .filter((p: any) => p.category.includes(cat.slug))
        .slice(0, 3);
      
      return {
        ...cat,
        products: catProducts
      };
    }).filter((cat: any) => cat.products.length > 0); // Only show collections that have products
  }, [productsData, categoriesData]);

  return (
    <div className="bg-white min-h-screen font-sans pb-16">
      {quickViewProduct && (
        <QuickViewModal 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
          product={quickViewProduct} 
        />
      )}

      {/* Page Header matching The Woman Company style */}
      <div className="bg-[#fcf8f5] py-12 md:py-16 mb-12 text-center border-b border-[#f0e6df]">
        <h1 className="font-serif text-[42px] md:text-[56px] text-[#111] mb-4">
          Collections
        </h1>
        <div className="flex items-center justify-center gap-3 font-sans text-[13px] text-[#555] tracking-widest uppercase">
          <Link to="/" className="hover:text-[#ffb6c1] transition-colors">Home</Link>
          <span className="text-[#999]">/</span>
          <span className="text-[#111] font-medium">Collections</span>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-[20px]">
        {isLoading ? (
          <div className="flex flex-col gap-[3rem]">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-wrap mx-[-15px]">
                <div className="w-full lg:w-1/4 px-[15px] mb-6 lg:mb-0">
                  <div className="animate-pulse bg-[#f4f4f4] h-[300px] w-full"></div>
                </div>
                {[1, 2, 3].map(j => (
                  <div key={j} className="w-full sm:w-1/2 lg:w-1/4 px-[15px] mb-6 lg:mb-0">
                    <div className="animate-pulse bg-[#f4f4f4] h-[300px] w-full"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-14 text-[#555] text-lg font-body">No collections found.</div>
        ) : (
          <div>
            {collections.map((collection: any) => (
              <div key={collection.slug} className="mb-12 lg:mb-[3rem]">
                <div className="flex flex-wrap mx-[-15px]">
                  
                  {/* Collection Card */}
                  <div className="w-full lg:w-1/4 px-[15px] mb-8 lg:mb-0">
                    <Link 
                      to={`/shop/category/${collection.slug}`} 
                      className="group block relative bg-white bg-no-repeat bg-top bg-cover p-0 h-full min-h-[300px] z-[1] lg:min-h-full"
                      style={{ backgroundImage: `url(${collection.image || '/placeholder.png'})` }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black opacity-25 group-hover:opacity-60 transition-opacity duration-200 ease-in-out z-[1]"></div>
                      
                      {/* Meta */}
                      <div className="absolute bottom-[40px] left-0 mr-[15px] z-[2]">
                        <h2 className="inline bg-[#111] text-white py-[2px] px-[15px] text-[32px] leading-[1.4] font-serif box-decoration-clone capitalize">
                          {collection.name}
                        </h2>
                        <p className="text-[13px] font-bold text-white mt-[15px] ml-[15px] font-sans">
                          View all
                        </p>
                      </div>
                    </Link>
                  </div>

                  {/* Product Cards */}
                  {collection.products.map((product: any) => (
                    <div key={product._id} className="w-full sm:w-1/2 lg:w-1/4 px-[15px] mb-8 lg:mb-0">
                      {/* The ProductCard inside takes up 100% height */}
                      <div className="h-full">
                        <CollectionProductCard product={product} />
                      </div>
                    </div>
                  ))}

                  {/* Empty placeholders if less than 3 products to maintain grid layout */}
                  {Array.from({ length: Math.max(0, 3 - collection.products.length) }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="hidden lg:block lg:w-1/4 px-[15px]"></div>
                  ))}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
