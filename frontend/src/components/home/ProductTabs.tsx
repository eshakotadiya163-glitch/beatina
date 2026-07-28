import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import ProductCard from '../ProductCard';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const tabs = ['BEST SELLERS', 'SkinCare', 'Hair Care'];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState('BEST SELLERS');

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=50');
      return data.products || data || [];
    },
  });

  const products = Array.isArray(data) ? data : [];

  const getFiltered = () => {
    if (activeTab === 'Hair Care') {
      return products.filter((p: any) =>
        p.slug?.includes('hair') ||
        p.name?.toLowerCase().includes('hair') ||
        p.name?.toLowerCase().includes('shampoo') ||
        p.name?.toLowerCase().includes('scalp') ||
        p.name?.toLowerCase().includes('conditioner')
      ).slice(0, 8);
    }
    if (activeTab === 'SkinCare') {
      return products.filter((p: any) =>
        !p.slug?.includes('hair') &&
        !p.name?.toLowerCase().includes('shampoo') &&
        !p.name?.toLowerCase().includes('conditioner')
      ).slice(0, 8);
    }
    return products.slice(0, 8); // Best Sellers = all
  };

  const displayed = getFiltered();

  return (
    <section className="py-12 md:py-14 bg-brand-light">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        {/* Tab Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div className="flex gap-6 md:gap-10 border-b border-brand-border w-full pb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-body text-sm uppercase tracking-[0.12em] transition-all duration-200 relative whitespace-nowrap
                  ${activeTab === tab
                    ? 'text-brand-dark border-b-2 border-brand-dark -mb-px'
                    : 'text-brand-muted hover:text-brand-dark'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="animate-spin text-brand-dark w-6 h-6" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayed.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/shop/category/all" className="btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
