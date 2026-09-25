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
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (isEditing) {
      updateMutation.mutate({ name, slug, description });
    } else {
      createMutation.mutate({ name, slug, description });
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
    <div className="space-y-6 pb-14">


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-zinc-800/50 sticky top-24 backdrop-blur-md">
            <h2 className="text-lg font-serif font-bold text-twc-text dark:text-twc-white mb-6">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-2 font-medium">Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-luxury dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-2 font-medium">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="input-luxury resize-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                ></textarea>
              </div>
              <div className="pt-4 flex space-x-3">
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                  <span>{isEditing ? 'Update' : 'Add'} Category</span>
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-4 py-3 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 rounded-sm text-sm font-button uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
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
          <div className="bg-white dark:bg-zinc-900/50 rounded-sm shadow-sm border border-gray-100 dark:border-zinc-800/50 overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm">
                <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-zinc-800/50">
                  <tr>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Slug</th>
                    <th className="p-4 font-medium">Products</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-twc-gold mx-auto" />
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
                      <tr key={category._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4 font-bold text-twc-text dark:text-twc-white">{category.name}</td>
                        <td className="p-4 text-gray-500 dark:text-zinc-400">{category.slug}</td>
                        <td className="p-4 text-gray-500 dark:text-zinc-400">--</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEdit(category)}
                              className="p-2 text-gray-400 dark:text-zinc-500 hover:text-twc-gold dark:hover:text-twc-gold hover:bg-twc-gold/10 dark:hover:bg-twc-gold/20 rounded-xl transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(category._id)}
                              disabled={deleteMutation.isPending}
                              className="p-2 text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-sm transition-colors disabled:opacity-50"
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
