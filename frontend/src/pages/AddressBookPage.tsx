import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, MapPin, Loader2, X } from 'lucide-react';
import AccountLayout from '../components/AccountLayout';
import api from '../api/axios';

const addressSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const AddressBookPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await api.get('/users/profile');
      return data;
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  const openAddModal = () => {
    reset({ isDefault: false });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: any) => {
    setValue('street', address.street);
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('postalCode', address.postalCode);
    setValue('country', address.country);
    setValue('isDefault', address.isDefault);
    setEditingId(address._id);
    setIsModalOpen(true);
  };

  const addAddressMutation = useMutation({
    mutationFn: async (data: AddressFormValues) => {
      const res = await api.post('/users/addresses', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Address added successfully');
      setIsModalOpen(false);
    }
  });

  const editAddressMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: AddressFormValues }) => {
      const res = await api.put(`/users/addresses/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Address updated successfully');
      setIsModalOpen(false);
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/users/addresses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Address deleted successfully');
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/users/addresses/${id}/default`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Default address updated');
    }
  });

  const onSubmit = (data: AddressFormValues) => {
    if (editingId) {
      editAddressMutation.mutate({ id: editingId, data });
    } else {
      addAddressMutation.mutate(data);
    }
  };

  const addresses = profile?.addresses || [];

  return (
    <AccountLayout title="Address Book">
      {isLoading ? (
        <div className="flex justify-center items-center py-14">
          <Loader2 className="animate-spin text-brand-primary" size={32} />
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={openAddModal}
              className="bg-brand-dark text-white px-6 py-2.5 font-button uppercase tracking-widest text-xs hover:bg-brand-primary transition-colors flex items-center shadow-sm"
            >
              <Plus size={16} className="mr-2" /> Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-white p-12 text-center border border-gray-100 shadow-sm rounded-sm">
              <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-heading text-brand-dark mb-2">No addresses saved</h3>
              <p className="font-body text-gray-500 mb-6">Add an address to checkout faster next time.</p>
              <button
                onClick={openAddModal}
                className="border border-brand-dark px-6 py-2.5 font-button uppercase tracking-widest text-xs hover:bg-brand-dark hover:text-white transition-colors"
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address: any) => (
                <div key={address._id} className={`bg-white p-6 border ${address.isDefault ? 'border-brand-primary' : 'border-gray-100'} shadow-sm rounded-sm relative`}>
                  {address.isDefault && (
                    <span className="absolute top-4 right-4 bg-brand-primary/10 text-brand-primary px-2 py-1 text-[10px] uppercase tracking-widest font-button rounded-sm">
                      Default
                    </span>
                  )}
                  
                  <div className="mb-6 mt-2">
                    <p className="font-body text-brand-dark mb-1">{address.street}</p>
                    <p className="font-body text-gray-600 mb-1">{address.city}, {address.state} {address.postalCode}</p>
                    <p className="font-body text-gray-600">{address.country}</p>
                  </div>

                  <div className="flex items-center space-x-4 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => openEditModal(address)}
                      className="text-xs font-button uppercase tracking-widest text-gray-500 hover:text-brand-primary transition-colors flex items-center"
                    >
                      <Edit2 size={12} className="mr-1.5" /> Edit
                    </button>
                    <button
                      onClick={() => deleteAddressMutation.mutate(address._id)}
                      className="text-xs font-button uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors flex items-center"
                    >
                      <Trash2 size={12} className="mr-1.5" /> Delete
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultMutation.mutate(address._id)}
                        className="text-xs font-button uppercase tracking-widest text-brand-primary hover:text-brand-dark transition-colors ml-auto"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-heading text-brand-dark">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-brand-dark transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1.5">Street Address</label>
                  <input
                    {...register('street')}
                    className="w-full border border-gray-200 p-2.5 font-body text-sm focus:outline-none focus:border-brand-primary transition-colors"
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1 font-body">{errors.street.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1.5">City</label>
                    <input
                      {...register('city')}
                      className="w-full border border-gray-200 p-2.5 font-body text-sm focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-body">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1.5">State</label>
                    <input
                      {...register('state')}
                      className="w-full border border-gray-200 p-2.5 font-body text-sm focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1 font-body">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1.5">Postal Code</label>
                    <input
                      {...register('postalCode')}
                      className="w-full border border-gray-200 p-2.5 font-body text-sm focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1 font-body">{errors.postalCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-button uppercase tracking-widest text-gray-500 mb-1.5">Country</label>
                    <input
                      {...register('country')}
                      className="w-full border border-gray-200 p-2.5 font-body text-sm focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    {errors.country && <p className="text-red-500 text-xs mt-1 font-body">{errors.country.message}</p>}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center cursor-pointer group">
                    <input type="checkbox" {...register('isDefault')} className="mr-3 accent-brand-primary w-4 h-4" />
                    <span className="font-body text-sm text-gray-600 group-hover:text-brand-dark transition-colors">Set as default shipping address</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 font-button uppercase tracking-widest text-xs text-gray-500 hover:text-brand-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addAddressMutation.isPending || editAddressMutation.isPending}
                  className="bg-brand-dark text-white px-8 py-2.5 font-button uppercase tracking-widest text-xs hover:bg-brand-primary transition-colors disabled:opacity-70 flex items-center"
                >
                  {(addAddressMutation.isPending || editAddressMutation.isPending) && <Loader2 size={16} className="animate-spin mr-2" />}
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default AddressBookPage;
