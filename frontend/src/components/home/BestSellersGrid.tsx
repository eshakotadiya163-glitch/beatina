import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import ProductCard from '../ProductCard';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-gray-500 mb-4 font-semibold">
            best Sellers
          </div>
          <h3 className="font-serif text-3xl md:text-[40px] text-[#111111] font-light leading-tight">
            The Elegance of Effortless Beauty
          </h3>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-black w-8 h-8" />
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12"
          >
            {products.map((product: any) => (
              <motion.div 
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          <Link 
            to="/shop" 
            className="group inline-flex items-center justify-center bg-transparent text-[#111111] font-sans text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-semibold px-10 py-[15px] border border-[#111111] transition-all duration-300 hover:bg-[#111111] hover:text-white"
          >
            Shop All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellersGrid;
