import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import ProductCard from '../ProductCard';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Matches Beautina's "Luxury Essentials" / selected highlights section
const LuxuryEssentials = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'luxury'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=4');
      return data.products || data || [];
    },
  });

  const products = Array.isArray(data) ? data.slice(0, 4) : [];

  return (
    <section className="py-16 md:py-20 bg-brand-light">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="section-label">Editor's Pick</span>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-brand-dark" style={{ letterSpacing: '-0.02em' }}>
              Luxury Essentials
            </h2>
          </div>
          <Link to="/shop" className="btn-outline hidden md:inline-block">
            View All
          </Link>
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

        <div className="text-center mt-8 md:hidden">
          <Link to="/shop" className="btn-outline">View All</Link>
        </div>
      </div>
    </section>
  );
};

export default LuxuryEssentials;
