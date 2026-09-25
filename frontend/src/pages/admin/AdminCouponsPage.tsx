import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Loader2, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const AdminCouponsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  
  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState<number | ''>('');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState<number | ''>(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['adminCoupons'],
    queryFn: async () => {
      const { data } = await api.get('/coupons');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (couponData: any) => {
      const { data } = await api.post('/coupons', couponData);
      return data;
    },
    onSuccess: () => {
      toast.success('Coupon created successfully');
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (couponData: any) => {
      const { data } = await api.put(`/coupons/${currentId}`, couponData);
      return data;
    },
    onSuccess: () => {
      toast.success('Coupon updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/coupons/${id}`);
    },
    onSuccess: () => {
      toast.success('Coupon deleted');
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const couponData = {
      code,
      discountType,
      discountValue: Number(discountValue),
      minPurchaseAmount: Number(minPurchaseAmount),
      expirationDate,
      isActive
    };

    if (isEditing) {
      updateMutation.mutate(couponData);
    } else {
      createMutation.mutate(couponData);
    }
  };

  const handleEdit = (coupon: any) => {
    setIsEditing(true);
    setCurrentId(coupon._id);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinPurchaseAmount(coupon.minPurchaseAmount);
    setExpirationDate(new Date(coupon.expirationDate).toISOString().split('T')[0]);
    setIsActive(coupon.isActive);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId('');
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinPurchaseAmount(0);
    setExpirationDate('');
    setIsActive(true);
  };

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-twc-text dark:text-twc-white tracking-tight">Coupons & Offers</h1>
          <p className="text-sm text-twc-muted dark:text-zinc-400 mt-1">Create promotional codes and discounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="xl:col-span-1">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 sticky top-24">
            <h2 className="text-xl font-serif font-bold text-twc-text dark:text-twc-white mb-6 tracking-tight">{isEditing ? 'Edit Coupon' : 'Create Coupon'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-twc-muted mb-2 font-bold">Coupon Code *</label>
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/50 focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors uppercase font-bold"
                  placeholder="e.g. SUMMER20"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-twc-muted mb-2 font-bold">Type</label>
                  <select 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-[13px] text-twc-text dark:text-twc-white focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-twc-muted mb-2 font-bold">Value *</label>
                  <input 
                    type="number" 
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/50 focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors font-bold"
                    placeholder={discountType === 'percentage' ? '%' : '₹'}
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-twc-muted mb-2 font-bold">Min. Purchase Amount (₹)</label>
                <input 
                  type="number" 
                  value={minPurchaseAmount}
                  onChange={(e) => setMinPurchaseAmount(Number(e.target.value))}
                  className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/50 focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors font-medium"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-twc-muted mb-2 font-bold">Expiry Date *</label>
                <input 
                  type="date" 
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-[13px] text-twc-text dark:text-twc-white focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors font-medium"
                  required 
                />
              </div>

              <div className="pt-2 pb-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isActive ? 'bg-twc-gold border-twc-gold' : 'bg-transparent border-twc-nude dark:border-zinc-700 group-hover:border-twc-gold/50'}`}>
                    {isActive && <span className="text-white text-xs font-bold leading-none select-none">✓</span>}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="hidden" 
                  />
                  <span className="font-body text-[13px] font-bold text-twc-text dark:text-zinc-300">Active Coupon</span>
                </label>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 border-t border-twc-nude/30 dark:border-zinc-800/50">
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-twc-text dark:bg-twc-gold text-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-twc-gold dark:hover:bg-white dark:hover:text-twc-text transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                  <span>{isEditing ? 'Update' : 'Create'}</span>
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-6 py-3.5 border border-twc-nude dark:border-zinc-700 text-twc-muted rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-twc-beige dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="xl:col-span-2">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left font-body">
                <thead className="bg-twc-beige/30 dark:bg-zinc-950/30 border-b border-twc-nude/30 dark:border-zinc-800/50">
                  <tr>
                    <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold">Code</th>
                    <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold">Discount</th>
                    <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold">Min. Purchase</th>
                    <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold">Status / Expiry</th>
                    <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-16 text-center">
                        <div className="w-8 h-8 border-2 border-twc-gold/20 border-t-twc-gold rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-sm font-semibold text-twc-muted">Loading coupons...</p>
                      </td>
                    </tr>
                  ) : coupons?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-16 text-center">
                        <div className="w-16 h-16 bg-twc-beige dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-twc-nude/50 dark:border-zinc-700/50">
                          <Tag size={24} className="text-twc-muted" />
                        </div>
                        <p className="text-sm font-bold text-twc-text dark:text-twc-white mb-1">No coupons found</p>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-twc-muted">Create your first promotion</p>
                      </td>
                    </tr>
                  ) : (
                    coupons?.map((coupon: any) => {
                      const isExpired = new Date(coupon.expirationDate) < new Date();
                      
                      return (
                        <tr key={coupon._id} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                          <td className="p-5">
                            <span className="px-3 py-1.5 bg-twc-nude/20 dark:bg-zinc-800 border border-twc-nude/50 dark:border-zinc-700/50 rounded-lg font-bold tracking-widest text-[13px] text-twc-text dark:text-twc-white">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="p-5 font-bold text-[13px] text-twc-text dark:text-twc-white">
                            {coupon.discountType === 'percentage' 
                              ? `${coupon.discountValue}% OFF` 
                              : `₹${coupon.discountValue} OFF`}
                          </td>
                          <td className="p-5 text-[13px] font-medium text-twc-muted dark:text-zinc-400">
                            {coupon.minPurchaseAmount > 0 ? `₹${coupon.minPurchaseAmount}` : 'No minimum'}
                          </td>
                          <td className="p-5">
                            <div className="flex flex-col space-y-1.5">
                              {coupon.isActive && !isExpired ? (
                                <span className="inline-flex w-fit px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-twc-sage/20 text-[#4a6b38] dark:text-[#88b070]">
                                  Active
                                </span>
                              ) : isExpired ? (
                                <span className="inline-flex w-fit px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#e53e3e]/10 text-[#e53e3e]">
                                  Expired
                                </span>
                              ) : (
                                <span className="inline-flex w-fit px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                                  Inactive
                                </span>
                              )}
                              <span className="text-[11px] text-twc-muted font-semibold tracking-wide">
                                Ends: {new Date(coupon.expirationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex justify-end space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEdit(coupon)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-twc-muted hover:text-twc-gold hover:bg-twc-gold/10 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(coupon._id)}
                                disabled={deleteMutation.isPending}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-twc-muted hover:text-[#e53e3e] hover:bg-[#e53e3e]/10 transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCouponsPage;
