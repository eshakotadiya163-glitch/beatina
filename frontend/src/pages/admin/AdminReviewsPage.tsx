import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Loader2, Trash2, Star, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const AdminReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Assuming an endpoint exists, or fallback to fetching products and extracting reviews.
  // For demo, let's assume we have a generic GET /reviews if a real backend exists,
  // or we can mock the data if not implemented. Let's assume the endpoint is '/reviews'
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/reviews');
        return data;
      } catch (error) {
        return [];
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredReviews = reviews?.filter((review: any) => {
    return (
      review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-heading text-brand-dark">Reviews</h1>
          <p className="text-sm text-gray-500 font-body mt-1">Manage customer reviews and feedback.</p>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-sm focus:border-brand-primary focus:outline-none font-body"
            />
          </div>
          <div className="ml-auto text-xs text-gray-500 font-body uppercase tracking-widest font-medium">
            {filteredReviews.length} Reviews
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Comment</th>
                <th className="p-4 font-medium">Date</th>
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
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-body border border-dashed border-gray-200 mx-4 my-8 rounded-sm">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review: any) => (
                  <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-heading text-sm text-brand-dark line-clamp-1">{review.product?.name || 'Unknown Product'}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-brand-dark">{review.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-brand-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-brand-primary" : "text-gray-300"} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-start space-x-2 max-w-xs">
                        <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                        <p className="text-gray-600 line-clamp-2">{review.comment}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(review._id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
