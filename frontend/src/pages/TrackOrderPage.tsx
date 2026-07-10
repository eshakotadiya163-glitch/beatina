import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, Truck, CheckCircle } from 'lucide-react';

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
  };

  return (
    <div className="pt-32 pb-20 bg-brand-bg min-h-[80vh]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-heading text-center mb-2 text-brand-dark">Track Your Order</h1>
        <p className="text-center text-sm font-body text-gray-500 mb-10 tracking-wide">Enter your order details to see the current status.</p>
        
        {!isTracking ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm"
          >
            <form onSubmit={handleTrack} className="space-y-6 font-body">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Order Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. TWC-123456"
                  className="w-full border border-gray-300 rounded-sm p-3 focus:border-brand-primary focus:outline-none transition-colors"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Email Address</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-sm p-3 focus:border-brand-primary focus:outline-none transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-brand-primary text-white py-4 font-button uppercase tracking-widest text-sm font-semibold rounded-sm hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20"
              >
                Track Order
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm"
          >
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
              <div>
                <p className="text-xs font-body uppercase tracking-widest text-gray-500 mb-1">Order #{orderNumber || 'TWC-123456'}</p>
                <p className="font-heading text-xl text-brand-dark">Arriving on Oct 24, 2026</p>
              </div>
              <button onClick={() => setIsTracking(false)} className="text-sm font-body text-brand-primary hover:underline">Track Another</button>
            </div>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-gray-200">
                <div className="w-full bg-brand-primary transition-all duration-1000" style={{ height: '50%' }}></div>
              </div>

              {/* Status Nodes */}
              <div className="space-y-10 relative z-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <CheckCircle size={20} />
                  </div>
                  <div className="pt-3">
                    <h3 className="font-heading text-lg text-brand-dark mb-1">Order Confirmed</h3>
                    <p className="text-sm font-body text-gray-500">Oct 20, 2026 - 10:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <Package size={20} />
                  </div>
                  <div className="pt-3">
                    <h3 className="font-heading text-lg text-brand-dark mb-1">Packed</h3>
                    <p className="text-sm font-body text-gray-500">Oct 21, 2026 - 02:15 PM</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-brand-primary text-brand-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Truck size={20} />
                  </div>
                  <div className="pt-3">
                    <h3 className="font-heading text-lg text-brand-dark mb-1">Shipped</h3>
                    <p className="text-sm font-body text-gray-500">Expected Oct 22, 2026</p>
                  </div>
                </div>
                <div className="flex gap-6 opacity-50">
                  <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-300 text-gray-400 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="pt-3">
                    <h3 className="font-heading text-lg text-gray-600 mb-1">Out for Delivery</h3>
                    <p className="text-sm font-body text-gray-400">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
