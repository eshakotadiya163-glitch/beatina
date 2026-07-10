import { X, Star, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuickViewModal = ({ isOpen, onClose, product }: any) => {
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 mt-16">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        ></motion.div>

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-gray-50 relative group overflow-hidden">
            <img 
              src={product.images[0]?.url} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-125 origin-center cursor-crosshair"
            />
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto no-scrollbar">
            <h4 className="text-xs font-body uppercase tracking-widest text-gray-500 mb-2">{product.brand}</h4>
            <h2 className="text-2xl font-heading text-brand-dark mb-4">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-brand-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} strokeWidth={1} />
                ))}
              </div>
              <span className="text-xs font-body text-gray-500">({product.numReviews} Reviews)</span>
            </div>

            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
               <span className="text-3xl font-heading text-brand-dark">₹{product.price.toLocaleString('en-IN')}</span>
               <span className="text-lg font-body text-gray-400 line-through mb-1">₹{Math.round(product.price * 1.2).toLocaleString('en-IN')}</span>
            </div>

            <p className="font-body text-sm text-gray-600 mb-8 leading-relaxed line-clamp-4">
              {product.description}
            </p>

            <div className="mt-auto space-y-4">
              <button className="w-full bg-brand-primary text-white py-4 font-button uppercase tracking-widest text-xs font-semibold hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center">
                <ShoppingBag size={16} className="mr-2" /> Add to Bag
              </button>
              <button onClick={onClose} className="w-full bg-white text-brand-dark border border-gray-200 py-4 font-button uppercase tracking-widest text-xs font-semibold hover:bg-gray-50 transition-colors">
                View Full Details
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
