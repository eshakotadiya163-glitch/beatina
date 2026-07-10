import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import ProductCard from '../ProductCard';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BestSellersGrid = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=12&sort=-rating');
      return data.products || data || [];
    },
  });

  const products = Array.isArray(data) ? data.slice(0, 8) : [];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="font-body text-[11px] uppercase tracking-[0.2em] text-brand-dark mb-2">best Sellers</div>
          <h3 className="font-heading text-3xl md:text-4xl text-brand-dark mb-5">
            <span>The Elegance of Effortless Beauty</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-dark w-6 h-6" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/shop" className="btn-outline">
            Shop All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellersGrid;
