import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageHelper';
import useAuthStore from '../../store/authStore';

const AdminProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['adminProducts', page, searchTerm, user?._id],
    queryFn: async () => {
      const vendorQuery = user && !user.isAdmin && user.isVendor ? `&vendor=${user._id}` : '';
      const { data } = await api.get(`/products?pageNumber=${page}&keyword=${searchTerm}&limit=10${vendorQuery}`);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/products');
      return data;
    },
    onSuccess: (data) => {
      navigate(`/admin/products/${data._id}/edit`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = () => {
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading text-brand-dark">Products</h1>
          <p className="text-sm text-gray-500 font-body mt-1">Manage your catalog, inventory, and pricing.</p>
        </div>
        <button 
          onClick={handleCreate}
          disabled={createMutation.isPending}
          className="flex items-center space-x-2 bg-brand-primary text-white px-5 py-2.5 text-sm font-button uppercase tracking-widest rounded-sm hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-sm focus:border-brand-primary focus:outline-none font-body"
            />
          </div>
          <div className="text-xs text-gray-500 font-body uppercase tracking-widest font-medium">
            {data?.total || 0} Products
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium w-16">Image</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
                  </td>
                </tr>
              ) : data?.products?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-body border border-dashed border-gray-200 mx-4 my-8 rounded-sm">
                    No products found. Add a new product to get started.
                  </td>
                </tr>
              ) : (
                data?.products?.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      {product.images?.length > 0 ? (
                        <img src={getImageUrl(product)} alt={product.name} className="w-10 h-12 object-cover border border-gray-100 rounded-sm bg-white" />
                      ) : (
                        <div className="w-10 h-12 bg-gray-100 flex items-center justify-center rounded-sm text-gray-400">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-heading text-sm text-brand-dark line-clamp-1">{product.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{product.brand}</p>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-brand-dark">₹{product.price}</div>
                      {product.discount > 0 && <div className="text-[10px] text-green-600 mt-1">{product.discount}% OFF</div>}
                    </td>
                    <td className="p-4 text-gray-600">{product.category?.name || 'Uncategorized'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-sm text-[10px] uppercase font-button tracking-widest ${
                        product.countInStock > 10 ? 'bg-green-100 text-green-700' :
                        product.countInStock > 0 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.countInStock} IN STOCK
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/admin/products/${product._id}/edit`}
                          className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-sm transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
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
        
        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-center space-x-2 bg-gray-50/30">
            {[...Array(data.pages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-sm text-xs font-button transition-colors ${
                  page === x + 1 
                    ? 'bg-brand-primary text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary'
                }`}
              >
                {x + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
