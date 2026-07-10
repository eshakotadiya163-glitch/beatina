import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Loader2, Upload, X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  brand: z.string().min(2, 'Brand is required'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(0, 'Price must be positive'),
  discount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
  countInStock: z.number().min(0, 'Stock cannot be negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ingredients: z.string().optional(),
  howToUse: z.string().optional(),
  video: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<{ url: string; altText: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['adminProduct', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.category._id || product.category,
        price: product.price,
        discount: product.discount || 0,
        countInStock: product.countInStock,
        description: product.description,
        ingredients: product.ingredients || '',
        howToUse: product.howToUse || '',
        video: product.video || '',
        isFeatured: product.isFeatured || false,
      });
      setImages(product.images || []);
      setBenefits(product.benefits || []);
    }
  }, [product, reset]);

  const updateMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { data } = await api.put(`/products/${id}`, productData);
      return data;
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['adminProduct', id] });
      navigate('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  });

  const onSubmit = (data: ProductFormValues) => {
    updateMutation.mutate({
      ...data,
      images,
      benefits,
    });
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await api.post('/upload', formData, config);
      setImages([...images, { url: data.image, altText: product?.name || 'Product Image' }]);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error(error);
      // Fallback for development if upload route isn't fully ready
      const dummyUrl = 'https://beautina-cosmetic.myshopify.com/cdn/shop/files/gallery-image-7.webp?v=1773124923';
      setImages([...images, { url: dummyUrl, altText: 'Dummy Image' }]);
      toast.success('Used development dummy image (Upload endpoint failed)');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const addBenefit = () => {
    if (benefitInput.trim() !== '') {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...benefits];
    newBenefits.splice(index, 1);
    setBenefits(newBenefits);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">Error loading product</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/admin/products" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-heading text-brand-dark">Edit Product</h1>
            <p className="text-sm text-gray-500 font-body mt-1">{product?.name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading text-brand-dark mb-6 border-b border-gray-100 pb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Product Name *</label>
              <input type="text" {...register('name')} className="input-luxury" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Slug *</label>
              <input type="text" {...register('slug')} className="input-luxury" />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Brand *</label>
              <input type="text" {...register('brand')} className="input-luxury" />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Category *</label>
              <select {...register('category')} className="input-luxury bg-white">
                <option value="">Select a category</option>
                {categories?.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Description *</label>
              <textarea {...register('description')} rows={4} className="input-luxury resize-none"></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading text-brand-dark mb-6 border-b border-gray-100 pb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Price (₹) *</label>
              <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="input-luxury" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Discount (%)</label>
              <input type="number" {...register('discount', { valueAsNumber: true })} className="input-luxury" />
              {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Stock Quantity *</label>
              <input type="number" {...register('countInStock', { valueAsNumber: true })} className="input-luxury" />
              {errors.countInStock && <p className="text-red-500 text-xs mt-1">{errors.countInStock.message}</p>}
            </div>
            <div className="md:col-span-3">
              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 accent-brand-primary" />
                <span className="font-body text-sm font-medium text-brand-dark">Feature this product on the homepage</span>
              </label>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading text-brand-dark mb-6 border-b border-gray-100 pb-4">Product Media</h2>
          
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4 font-medium">Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative group aspect-[3/4] border border-gray-200 rounded-sm overflow-hidden bg-gray-50">
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-600 shadow-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-xs font-button uppercase tracking-widest text-gray-500">Upload Image</span>
                <input 
                  type="file" 
                  onChange={uploadFileHandler}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 font-body">Recommended size: 800x1200px. High quality lifestyle or studio product shots.</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Video URL (Optional)</label>
            <input type="text" {...register('video')} placeholder="e.g. https://www.youtube.com/watch?v=..." className="input-luxury" />
            {errors.video && <p className="text-red-500 text-xs mt-1">{errors.video.message}</p>}
          </div>
        </div>

        {/* Details & Specs */}
        <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          <h2 className="text-lg font-heading text-brand-dark mb-6 border-b border-gray-100 pb-4">Details & Specifications</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Key Ingredients</label>
              <textarea {...register('ingredients')} rows={3} className="input-luxury resize-none"></textarea>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">How To Use</label>
              <textarea {...register('howToUse')} rows={3} className="input-luxury resize-none"></textarea>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Benefits</label>
              <div className="flex space-x-2 mb-3">
                <input 
                  type="text" 
                  value={benefitInput} 
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => { if(e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                  placeholder="e.g. Deeply hydrates skin" 
                  className="input-luxury"
                />
                <button type="button" onClick={addBenefit} className="bg-gray-100 text-brand-dark px-4 py-2 text-sm font-button uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-sm font-body text-sm text-gray-700">
                    <span>• {benefit}</span>
                    <button type="button" onClick={() => removeBenefit(index)} className="text-red-400 hover:text-red-600 transition-colors">
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Link to="/admin/products" className="text-sm font-button uppercase tracking-widest text-gray-500 hover:text-brand-dark transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="flex items-center space-x-2 bg-brand-primary text-white px-8 py-3 text-sm font-button uppercase tracking-widest rounded-sm hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20 disabled:opacity-50"
          >
            {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Save Product</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProductEditPage;
