import React, { useState, useEffect } from 'react';
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
  compareAtPrice: z.number().min(0).optional(),
  discount: z.number().min(0).max(100, 'Discount must be between 0 and 100').optional(),
  countInStock: z.number().min(0, 'Stock cannot be negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  ingredients: z.string().optional(),
  howToUse: z.string().optional(),
  sku: z.string().optional(),
  video: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  shippingInfo: z.string().optional(),
  returnPolicy: z.string().optional(),
  careInstructions: z.string().optional(),
  vendor: z.string().optional(),
  productType: z.string().optional(),
  warranty: z.string().optional(),
  safeCheckout: z.boolean().optional(),
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
  const [coreFeatures, setCoreFeatures] = useState<{title: string, description: string}[]>([]);
  const [howToUseSteps, setHowToUseSteps] = useState<{image: string, title: string, description: string}[]>([]);
  const [featureIcons, setFeatureIcons] = useState<{icon: string, text: string}[]>([]);
  const [benefitInput, setBenefitInput] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (id === 'new') return null;
      const { data } = await api.get(`/products/admin/${id}`);
      return data;
    },
    enabled: id !== 'new',
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.category?._id || product.category,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        discount: product.discount,
        countInStock: product.countInStock,
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        ingredients: product.ingredients || '',
        howToUse: product.howToUse || '',
        sku: product.sku || '',
        video: product.video || '',
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        shippingInfo: product.shippingInfo || '',
        returnPolicy: product.returnPolicy || '',
        careInstructions: product.careInstructions || '',
        vendor: product.vendor || '',
        productType: product.productType || '',
        warranty: product.warranty || '',
        safeCheckout: product.safeCheckout !== false,
        isFeatured: product.isFeatured || false,
      });
      setImages(product.images || []);
      setBenefits(product.benefits || []);
      setCoreFeatures(product.coreFeatures || []);
      setHowToUseSteps(product.howToUseSteps || []);
      setFeatureIcons(product.featureIcons || []);
    }
  }, [product, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (id === 'new') {
        const res = await api.post('/products', data);
        return res.data;
      } else {
        const res = await api.put(`/products/${id}`, data);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast.success(`Product ${id === 'new' ? 'created' : 'updated'} successfully`);
      navigate('/admin/products');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || `Failed to ${id === 'new' ? 'create' : 'update'} product`);
    }
  });

  const onSubmit = (data: ProductFormValues) => {
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    updateMutation.mutate({
      ...data,
      images,
      benefits,
      coreFeatures,
      howToUseSteps,
      featureIcons,
      shippingInfo: data.shippingInfo,
      returnPolicy: data.returnPolicy,
      careInstructions: data.careInstructions,
      features: product?.features || [],
      specifications: product?.specifications || [],
      sizes: product?.sizes || [],
      tags: product?.tags || [],
      variants: product?.variants || [],
      relatedProducts: product?.relatedProducts || [],
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
      setImages([...images, { url: data.url, altText: file.name.split('.')[0] }]);
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
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
    if (benefitInput.trim()) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    const newBenefits = [...benefits];
    newBenefits.splice(index, 1);
    setBenefits(newBenefits);
  };

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link to="/admin/products" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-brand-dark" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading text-brand-dark">{id === 'new' ? 'Create Product' : 'Edit Product'}</h1>
          <p className="text-sm font-body text-gray-500 mt-1">{id === 'new' ? 'Add a new product to your catalog' : 'Update product details and media'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-none border border-gray-100">
              <h3 className="text-lg font-heading text-brand-dark mb-4">Basic Information</h3>
              
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Product Name *</label>
                <input 
                  type="text" 
                  {...register('name')}
                  onChange={(e) => {
                    setValue('name', e.target.value);
                    if (id === 'new' && !product) {
                      setValue('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                    }
                  }}
                  className="input-luxury" 
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Category *</label>
                  <select {...register('category')} className="input-luxury">
                    <option value="">Select a category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">SKU</label>
                  <input type="text" {...register('sku')} className="input-luxury" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-none border border-gray-100">
              <h3 className="text-lg font-heading text-brand-dark mb-4">Pricing & Inventory</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Price (₹) *</label>
                  <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="input-luxury" />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Compare At (₹)</label>
                  <input type="number" step="0.01" {...register('compareAtPrice', { valueAsNumber: true })} className="input-luxury" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Stock *</label>
                  <input type="number" {...register('countInStock', { valueAsNumber: true })} className="input-luxury" />
                  {errors.countInStock && <p className="text-red-500 text-xs mt-1">{errors.countInStock.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-none border border-gray-100">
              <h3 className="text-lg font-heading text-brand-dark mb-4">Details</h3>
              
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Short Description</label>
                <textarea {...register('shortDescription')} rows={2} className="input-luxury resize-none"></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Description *</label>
                <textarea {...register('description')} rows={4} className="input-luxury resize-none"></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Ingredients (HTML allowed)</label>
                <textarea {...register('ingredients')} rows={4} className="input-luxury resize-none"></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Benefits</label>
                <div className="flex mt-1 mb-2">
                  <input 
                    type="text" 
                    value={benefitInput} 
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                    className="flex-1 input-luxury !rounded-r-none"
                    placeholder="e.g. Deeply hydrates skin"
                  />
                  <button 
                    type="button" 
                    onClick={addBenefit}
                    className="bg-brand-dark text-white px-4 border border-brand-dark hover:bg-brand-primary hover:border-brand-primary transition-colors"
                  >
                    Add
                  </button>
                </div>
                {benefits.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 px-4 py-2 border border-gray-100">
                        <span className="text-sm font-body text-gray-700">{benefit}</span>
                        <button type="button" onClick={() => removeBenefit(index)} className="text-red-500 hover:text-red-700 p-1">
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-none border border-gray-100 mb-8">
              <h3 className="text-lg font-heading text-brand-dark mb-4">Extended Product Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Shipping Info</label>
                  <textarea {...register('shippingInfo')} rows={3} className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body"></textarea>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Care Instructions</label>
                  <textarea {...register('careInstructions')} rows={3} className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body"></textarea>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Return Policy</label>
                  <textarea {...register('returnPolicy')} rows={3} className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body"></textarea>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Vendor</label>
                  <input type="text" {...register('vendor')} className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Product Type</label>
                  <input type="text" {...register('productType')} className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Warranty</label>
                  <input type="text" {...register('warranty')} className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body" />
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <input type="checkbox" {...register('safeCheckout')} id="safeCheckout" className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                <label htmlFor="safeCheckout" className="ml-2 block text-sm text-brand-dark font-body">Show Safe Checkout Badge</label>
              </div>
              
              <div className="mb-6">
                 <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Core Features (Title : Description)</label>
                 <textarea 
                   value={coreFeatures.map(f => f.title + ' : ' + f.description).join('\n')}
                   onChange={(e) => {
                     const lines = e.target.value.split('\n');
                     const parsed = lines.filter(l => l.includes(':')).map(l => {
                       const [title, ...desc] = l.split(':');
                       return { title: title.trim(), description: desc.join(':').trim() };
                     });
                     setCoreFeatures(parsed);
                   }}
                   rows={4} 
                   className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body" 
                   placeholder="Anti-Aging : Reduces wrinkles.\nHydrating : Deeply plumps skin."
                 ></textarea>
              </div>
              
              <div className="mb-6">
                 <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">How To Use Steps (Image URL : Title : Description)</label>
                 <textarea 
                   value={howToUseSteps.map(s => s.image + ' : ' + s.title + ' : ' + s.description).join('\n')}
                   onChange={(e) => {
                     const lines = e.target.value.split('\n');
                     const parsed = lines.filter(l => l.includes(':')).map(l => {
                       const parts = l.split(':');
                       if (parts.length >= 3) {
                         const img = parts[0].trim();
                         const title = parts[1].trim();
                         const desc = parts.slice(2).join(':').trim();
                         return { image: img, title: title, description: desc };
                       }
                       return null;
                     }).filter(Boolean) as { image: string; title: string; description: string; }[];
                     setHowToUseSteps(parsed);
                   }}
                   rows={6} 
                   className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body" 
                   placeholder="/images/1.png : Step 1 Cleanse : Wash face.\n/images/2.png : Step 2 Apply : Apply serum."
                 ></textarea>
              </div>
              
              <div className="mb-6">
                 <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Feature Icons (IconName : Text)</label>
                 <textarea 
                   value={featureIcons.map(i => i.icon + ' : ' + i.text).join('\n')}
                   onChange={(e) => {
                     const lines = e.target.value.split('\n');
                     const parsed = lines.filter(l => l.includes(':')).map(l => {
                       const [icon, ...text] = l.split(':');
                       return { icon: icon.trim(), text: text.join(':').trim() };
                     });
                     setFeatureIcons(parsed);
                   }}
                   rows={4} 
                   className="w-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand-primary font-body" 
                   placeholder="leaf : Vegan\nshield-check : Cruelty-Free"
                 ></textarea>
              </div>
            </div>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Visibility */}
            <div className="bg-white p-6 rounded-none border border-gray-100">
              <h3 className="text-lg font-heading text-brand-dark mb-4">Visibility</h3>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  {...register('isFeatured')} 
                  id="isFeatured"
                  className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" 
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-brand-dark font-body">
                  Feature this product on homepage
                </label>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white p-6 rounded-none border border-gray-100">
              <h3 className="text-lg font-heading text-brand-dark mb-4">Media *</h3>
              
              <div className="mb-4">
                <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed hover:border-brand-primary hover:bg-gray-50 cursor-pointer">
                  <span className="flex flex-col items-center justify-center space-y-2">
                    {uploading ? (
                      <Loader2 size={24} className="text-brand-primary animate-spin" />
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-xs font-body text-gray-500">Upload product image</span>
                      </>
                    )}
                  </span>
                  <input type="file" name="file_upload" className="hidden" onChange={uploadFileHandler} accept="image/*" disabled={uploading} />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group border border-gray-200">
                      <img src={img.url} alt={img.altText || 'Product image'} className="w-full h-32 object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-brand-dark/70 text-white text-[10px] uppercase px-2 py-1 truncate">
                        {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-none border border-gray-100">
              <h3 className="text-lg font-heading text-brand-dark mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Meta Title</label>
                  <input type="text" {...register('seoTitle')} className="input-luxury" placeholder="Leave blank to use product name" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">Meta Description</label>
                  <textarea {...register('seoDescription')} rows={3} className="input-luxury resize-none" placeholder="Leave blank to use short description"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 mb-12">
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
