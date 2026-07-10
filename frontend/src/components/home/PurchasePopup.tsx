import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PurchasePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 5 seconds
    const timer1 = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Hide after 15 seconds
    const timer2 = setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] rounded-md border border-brand-border/40 p-4 max-w-[320px] animate-in slide-in-from-bottom-5 fade-in duration-500">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-brand-dark transition-colors"
      >
        <X size={16} />
      </button>
      
      <p className="font-body text-sm text-brand-dark mb-1 leading-snug pr-4">
        Someone recently bought <Link to="/product/3-step-hair-care-set-for-thinning-hair" className="font-semibold hover:underline">3-Step Hair Care Routine for Fuller, Stronger Hair</Link>
      </p>
      
      <p className="font-body text-xs text-brand-muted mb-2">
        in Blackburn, UK
      </p>
      
      <div className="flex items-center gap-3">
        <span className="font-body text-[10px] text-brand-muted flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          about 21 minutes ago
        </span>
        <span className="font-body text-[10px] text-green-600 flex items-center gap-1">
          <Check size={12} strokeWidth={3} />
          Verified
        </span>
      </div>
    </div>
  );
};

export default PurchasePopup;
