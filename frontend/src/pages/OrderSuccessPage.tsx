import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const OrderSuccessPage = () => {
  return (
    <div className="pt-32 pb-20 bg-brand-bg min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-brand-secondary/30 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-primary"
        >
          <CheckCircle size={48} strokeWidth={1.5} />
        </motion.div>
        
        <h1 className="text-4xl font-heading text-brand-dark mb-4">Thank You!</h1>
        <p className="font-body text-gray-600 mb-2">Your order has been placed successfully.</p>
        <p className="font-body text-sm text-gray-500 mb-10">We will send you an email confirmation with your order details and tracking information shortly.</p>
        
        <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm mb-10">
          <p className="font-body text-xs uppercase tracking-widest text-gray-500 mb-1">Order Number</p>
          <p className="font-heading text-xl text-brand-dark">#TWC-{Math.floor(100000 + Math.random() * 900000)}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/account" className="bg-white border border-brand-primary text-brand-primary px-8 py-4 font-button uppercase tracking-widest text-xs font-semibold rounded-sm hover:bg-brand-primary hover:text-white transition-colors shadow-sm">
            View Order
          </Link>
          <Link to="/" className="bg-brand-primary text-white px-8 py-4 font-button uppercase tracking-widest text-xs font-semibold rounded-sm hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
