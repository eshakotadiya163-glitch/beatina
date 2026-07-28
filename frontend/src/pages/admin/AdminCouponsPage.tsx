import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
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
      toast.success('Coupon created');
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
      toast.success('Coupon updated');
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
    <div className="space-y-6 pb-14">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading text-brand-dark">Coupons & Offers</h1>
          <p className="text-sm text-gray-500 font-body mt-1">Create promotional codes and discounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-heading text-brand-dark mb-6">{isEditing ? 'Edit Coupon' : 'Create Coupon'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Coupon Code *</label>
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="input-luxury uppercase"
                  placeholder="e.g. SUMMER20"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Type</label>
                  <select 
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="input-luxury bg-white"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Value *</label>
                  <input 
                    type="number" 
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="input-luxury"
                    placeholder={discountType === 'percentage' ? '%' : '₹'}
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Min. Purchase Amount (₹)</label>
                <input 
                  type="number" 
                  value={minPurchaseAmount}
                  onChange={(e) => setMinPurchaseAmount(Number(e.target.value))}
                  className="input-luxury"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Expiry Date *</label>
                <input 
                  type="date" 
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="input-luxury"
                  required 
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-brand-primary" 
                  />
                  <span className="font-body text-sm font-medium text-brand-dark">Active Coupon</span>
                </label>
              </div>

              <div className="pt-6 flex space-x-3">
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-brand-primary text-white py-3 text-sm font-button uppercase tracking-widest rounded-sm hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                  <span>{isEditing ? 'Update' : 'Create'} Coupon</span>
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-4 py-3 border border-gray-200 text-gray-600 rounded-sm text-sm font-button uppercase tracking-widest hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-medium">Code</th>
                    <th className="p-4 font-medium">Discount</th>
                    <th className="p-4 font-medium">Min. Purchase</th>
                    <th className="p-4 font-medium">Status / Expiry</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
                      </td>
                    </tr>
                  ) : coupons?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 font-body border border-dashed border-gray-200 mx-4 my-8 rounded-sm">
                        No coupons found. Create one to run promotions.
                      </td>
                    </tr>
                  ) : (
                    coupons?.map((coupon: any) => {
                      const isExpired = new Date(coupon.expirationDate) < new Date();
                      
                      return (
                        <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-sm font-button tracking-widest text-brand-dark">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="p-4 text-brand-dark font-medium">
                            {coupon.discountType === 'percentage' 
                              ? `${coupon.discountValue}% OFF` 
                              : `₹${coupon.discountValue} OFF`}
                          </td>
                          <td className="p-4 text-gray-500">
                            {coupon.minPurchaseAmount > 0 ? `₹${coupon.minPurchaseAmount}` : 'No minimum'}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col space-y-1">
                              {coupon.isActive && !isExpired ? (
                                <span className="inline-block w-fit px-2 py-0.5 rounded-sm text-[10px] uppercase font-button tracking-widest bg-green-100 text-green-700">
                                  Active
                                </span>
                              ) : isExpired ? (
                                <span className="inline-block w-fit px-2 py-0.5 rounded-sm text-[10px] uppercase font-button tracking-widest bg-red-100 text-red-700">
                                  Expired
                                </span>
                              ) : (
                                <span className="inline-block w-fit px-2 py-0.5 rounded-sm text-[10px] uppercase font-button tracking-widest bg-gray-100 text-gray-700">
                                  Inactive
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400 font-medium">
                                Ends: {new Date(coupon.expirationDate).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleEdit(coupon)}
                                className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-sm transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(coupon._id)}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
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
