import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const AdminCategoriesPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const { data } = await api.post('/categories', categoryData);
      return data;
    },
    onSuccess: () => {
      toast.success('Category created');
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const { data } = await api.put(`/categories/${currentId}`, categoryData);
      return data;
    },
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate({ name, description });
    } else {
      createMutation.mutate({ name, description });
    }
  };

  const handleEdit = (category: any) => {
    setIsEditing(true);
    setCurrentId(category._id);
    setName(category.name);
    setDescription(category.description || '');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId('');
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading text-brand-dark">Categories</h1>
          <p className="text-sm text-gray-500 font-body mt-1">Organize your products into collections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-heading text-brand-dark mb-6">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-luxury"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="input-luxury resize-none"
                ></textarea>
              </div>
              <div className="pt-4 flex space-x-3">
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-brand-primary text-white py-3 text-sm font-button uppercase tracking-widest rounded-sm hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                  <span>{isEditing ? 'Update' : 'Add'} Category</span>
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
        <div className="lg:col-span-2">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Slug</th>
                    <th className="p-4 font-medium">Products</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
                      </td>
                    </tr>
                  ) : categories?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-500 font-body border border-dashed border-gray-200 mx-4 my-8 rounded-sm">
                        No categories found. Create one to get started.
                      </td>
                    </tr>
                  ) : (
                    categories?.map((category: any) => (
                      <tr key={category._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-medium text-brand-dark">{category.name}</td>
                        <td className="p-4 text-gray-500">{category.slug}</td>
                        <td className="p-4 text-gray-500">--</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEdit(category)}
                              className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-sm transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(category._id)}
                              disabled={deleteMutation.isPending}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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

export default AdminCategoriesPage;
