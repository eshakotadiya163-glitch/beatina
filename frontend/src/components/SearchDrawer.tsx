import { Link, useNavigate } from 'react-router-dom';
import { X, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { getImageUrl } from '../utils/imageHelper';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['live-search', debouncedTerm],
    queryFn: async () => {
      const { data } = await api.get(`/products?keyword=${debouncedTerm.trim()}&limit=6`);
      return data.products;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-[60] transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Content Container */}
        <div className="p-6 md:p-8 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans text-[22px] md:text-[24px] text-[#111111]">
              Search
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="relative flex items-center w-full bg-[#f4f4f4] rounded-[2px] px-3 h-[45px]">
              <Search size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent border-none text-[14px] font-sans text-[#111111] focus:outline-none focus:ring-0 placeholder:text-gray-500"
                autoFocus
              />
            </div>
          </form>

          {/* Suggestions */}
          {!searchTerm.trim() && (
            <div className="mb-6 border-b border-gray-100 pb-6">
              <h3 className="font-sans text-[14px] text-[#111111] mb-3 w-fit border-b border-[#111111] pb-0.5">
                Suggestions
              </h3>
              <div className="flex flex-wrap gap-2">
                {['sos', 'serum', 'silk', 'set'].map((sug) => (
                  <button 
                    key={sug}
                    onClick={() => setSearchTerm(sug)}
                    className="px-4 py-1.5 bg-[#f4f4f4] text-[#111111] font-sans text-[12px] hover:bg-[#e0e0e0] transition-colors rounded-[2px]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
            <div className="mb-4">
              <h3 className="font-sans text-[14px] text-[#111111] w-fit border-b border-[#111111] pb-0.5 inline-block mr-4">
                Products
              </h3>
              {searchTerm.trim() && searchResults && searchResults.length > 0 && (
                <Link 
                  to={`/search?q=${encodeURIComponent(searchTerm.trim())}`}
                  onClick={onClose}
                  className="font-sans text-[12px] text-gray-500 hover:text-black underline"
                >
                  View All
                </Link>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {searchResults.map((product: any) => (
                  <li key={product._id}>
                    <Link
                      to={`/product/${product.slug}`}
                      className="flex items-start gap-4 group"
                      onClick={onClose}
                    >
                      <div className="w-[90px] h-[100px] bg-[#d9d9d9] flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img 
                          src={getImageUrl(product) || '/placeholder.png'} 
                          alt={product.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform mix-blend-multiply"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      </div>
                      <div className="flex flex-col flex-1 justify-center py-1">
                        <div className="mb-1.5">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-sans font-medium bg-[#f2e6db] text-[#5e4b3c] rounded-[2px]">
                            Bestseller
                          </span>
                        </div>
                        <h4 className="font-sans text-[10px] uppercase tracking-widest text-[#111111] mb-1">
                          {product.category?.name || product.brand || 'SKINCARE'}
                        </h4>
                        <p className="font-sans text-[13px] text-[#333333] leading-[1.3] mb-1.5 group-hover:text-gray-600 transition-colors">
                          {product.name}
                        </p>
                        <p className="font-sans text-[13px] font-bold text-[#111111]">
                          ₹{product.price?.toLocaleString('en-IN') || product.price}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-4 text-gray-400 font-sans text-[13px]">
                No products found.
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default SearchDrawer;
