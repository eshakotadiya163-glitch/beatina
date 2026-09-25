import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminPlaceholderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-24 h-24 bg-twc-gold/10 text-twc-gold rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-twc-gold/20">
        <Construction size={40} />
      </div>
      <h2 className="text-3xl font-serif font-bold text-twc-text dark:text-twc-white capitalize tracking-tight mb-3">
        {pageName} (Coming Soon)
      </h2>
      <p className="text-twc-muted dark:text-zinc-400 font-body max-w-md mx-auto mb-8 text-sm">
        We're currently building this module for the new Premium Dashboard. Check back later for updates.
      </p>
      <button 
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
    </div>
  );
};

export default AdminPlaceholderPage;
