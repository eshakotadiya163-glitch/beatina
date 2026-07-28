import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, Copy, Power, PowerOff } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from '../../components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../../components/ui/table';

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price > 0'),
  duration: z.coerce.number().min(1, 'Duration > 0'),
  tax: z.coerce.number().min(0),
  discount: z.coerce.number().min(0),
  isActive: z.boolean(),
  featured: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface Service extends ServiceFormValues {
  _id: string;
  createdAt: string;
}

const AdminServicesPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      name: '', category: 'General', description: '', price: 0, duration: 60, tax: 0, discount: 0, isActive: true, featured: false
    }
  });

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['adminServices'],
    queryFn: async () => {
      const response = await api.get('/admin/services');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: ServiceFormValues) => {
      await api.post('/admin/services', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      toast.success('Service created');
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to create')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<ServiceFormValues> }) => {
      await api.put(`/admin/services/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      toast.success('Service updated');
      setIsDialogOpen(false);
      setEditingService(null);
      form.reset();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to update')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      toast.success('Service deleted');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to delete')
  });

  const onSubmit = (data: ServiceFormValues) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.reset(service);
    setIsDialogOpen(true);
  };

  const handleDuplicate = (service: Service) => {
    setEditingService(null);
    form.reset({
      ...service,
      name: `${service.name} (Copy)`
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = (service: Service) => {
    updateMutation.mutate({ id: service._id, data: { ...service, isActive: !service.isActive } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this service?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-sm text-gray-500 mt-1">Manage service catalog, pricing, and duration.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setEditingService(null); form.reset(); }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input {...form.register('name')} placeholder="e.g. Premium Haircut" />
                  {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input {...form.register('category')} placeholder="e.g. Hair" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹) *</label>
                  <Input type="number" step="0.01" {...form.register('price')} />
                  {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (mins) *</label>
                  <Input type="number" {...form.register('duration')} />
                  {form.formState.errors.duration && <p className="text-red-500 text-xs">{form.formState.errors.duration.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax (%)</label>
                  <Input type="number" {...form.register('tax')} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  {...form.register('description')}
                  className="w-full min-h-[100px] p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Service details..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" {...form.register('isActive')} className="rounded border-zinc-300" />
                  Active Service
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" {...form.register('featured')} className="rounded border-zinc-300" />
                  Featured
                </label>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingService ? 'Update Service' : 'Create Service'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="text" 
              placeholder="Search services..." 
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : filteredServices.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No services found.</TableCell></TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service._id} className={!service.isActive ? 'opacity-60' : ''}>
                    <TableCell className="font-medium">
                      {service.name}
                      {service.featured && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Featured</span>}
                    </TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>₹{service.price.toFixed(2)}</TableCell>
                    <TableCell>{service.duration} mins</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(service)} title={service.isActive ? 'Deactivate' : 'Activate'}>
                          {service.isActive ? <PowerOff size={14} className="text-gray-400" /> : <Power size={14} className="text-green-600" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleDuplicate(service)} title="Duplicate">
                          <Copy size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(service)} title="Edit">
                          <Edit2 size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(service._id)} title="Delete">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminServicesPage;
