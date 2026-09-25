import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, Eye, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '../../components/ui/dialog';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

const AdminCustomersPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const response = await api.get('/admin/customers');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/admin/customers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      toast.success('Customer created successfully');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const response = await api.put(`/admin/customers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      toast.success('Customer updated successfully');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update customer');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      toast.success('Customer deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    }
  });

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '' });
    setEditingCustomer(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phoneNumber: customer.phoneNumber || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredCustomers = customers.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phoneNumber?.includes(searchTerm)
  );

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-twc-text dark:text-twc-white tracking-tight">Customers</h1>
          <p className="text-sm text-twc-muted dark:text-zinc-400 mt-1">Manage your customer base and view their history.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-twc-text dark:bg-twc-white text-white dark:text-twc-text px-6 py-3 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-twc-gold dark:hover:bg-twc-gold hover:text-white transition-all shadow-md"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-zinc-800/50 overflow-hidden">
        <div className="p-6 border-b border-twc-nude/30 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40 dark:bg-zinc-900/40">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-twc-muted dark:text-zinc-500 group-focus-within:text-twc-gold transition-colors" size={16} />
            <Input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl bg-white/60 dark:bg-zinc-800/60 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/70 focus:outline-none focus:border-twc-gold focus:ring-2 focus:ring-twc-gold/20 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-twc-nude/30 dark:border-zinc-800/50 bg-twc-beige/30 dark:bg-zinc-950/30">
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-4">Name</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-4">Contact</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-4">Joined Date</TableHead>
                <TableHead className="text-[10px] uppercase tracking-[0.2em] text-twc-muted font-bold py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                     <div className="w-8 h-8 border-2 border-twc-gold/20 border-t-twc-gold rounded-full animate-spin mx-auto mb-3"></div>
                     <p className="text-sm font-semibold text-twc-muted">Loading customers...</p>
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16">
                     <div className="w-16 h-16 bg-twc-beige dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-twc-nude/50 dark:border-zinc-700/50">
                        <Users size={24} className="text-twc-muted" />
                     </div>
                     <p className="text-sm font-bold text-twc-text dark:text-twc-white mb-1">No customers found</p>
                     <p className="text-[11px] font-semibold uppercase tracking-widest text-twc-muted">Try adjusting your search</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer._id} className="border-b border-twc-nude/10 dark:border-zinc-800/30 hover:bg-white/50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-[12px] bg-twc-nude/30 dark:bg-zinc-800 flex items-center justify-center text-[13px] font-bold text-twc-text dark:text-twc-white shadow-sm border border-twc-nude/50 dark:border-zinc-700/50 group-hover:bg-twc-gold group-hover:text-white transition-colors">
                          {customer.firstName[0]}{customer.lastName?.[0]}
                        </div>
                        <span className="font-bold text-[13px] text-twc-text dark:text-twc-white">{customer.firstName} {customer.lastName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-[13px] font-bold text-twc-text dark:text-zinc-200">{customer.email || 'N/A'}</div>
                      <div className="text-[11px] font-semibold tracking-wide text-twc-muted mt-1">{customer.phoneNumber || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="py-4">
                       <span className="text-[12px] font-semibold text-twc-muted">{new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link to={`/admin/customers/${customer._id}`}>
                          <button className="h-8 w-8 rounded-lg flex items-center justify-center text-twc-muted hover:text-twc-gold hover:bg-twc-gold/10 transition-colors" title="View Profile">
                            <Eye size={16} />
                          </button>
                        </Link>
                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-twc-muted hover:text-twc-gold hover:bg-twc-gold/10 transition-colors" onClick={() => handleOpenEdit(customer)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-twc-muted hover:text-[#e53e3e] hover:bg-[#e53e3e]/10 transition-colors" onClick={() => handleDelete(customer._id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[460px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-white/50 dark:border-zinc-800/50 rounded-[24px] shadow-[0_10px_40px_rgb(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgb(0,0,0,0.5)] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-twc-nude/30 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/30">
            <DialogTitle className="font-serif text-2xl text-twc-text dark:text-twc-white">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-twc-muted uppercase tracking-widest">First Name *</label>
                <input 
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="John"
                  className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/50 focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-twc-muted uppercase tracking-widest">Last Name *</label>
                <input 
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Doe"
                  className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/50 focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-twc-muted uppercase tracking-widest">Email Address</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john.doe@example.com"
                className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/50 focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-twc-muted uppercase tracking-widest">Phone Number</label>
              <input 
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                placeholder="+91 9876543210"
                className="w-full bg-white dark:bg-zinc-950 border border-twc-nude/50 dark:border-zinc-700/50 rounded-xl px-4 py-2.5 text-[13px] text-twc-text dark:text-twc-white placeholder-twc-muted/50 focus:outline-none focus:border-twc-gold focus:ring-1 focus:ring-twc-gold transition-colors"
              />
            </div>
            <DialogFooter className="pt-4 border-t border-twc-nude/30 dark:border-zinc-800/50">
              <div className="flex gap-3 w-full sm:w-auto mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-[14px] text-[12px] font-bold uppercase tracking-widest text-twc-text dark:text-zinc-300 bg-twc-beige dark:bg-zinc-800 hover:bg-twc-nude dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending} 
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-[14px] text-[12px] font-bold uppercase tracking-widest text-white bg-twc-text dark:bg-twc-gold hover:bg-twc-gold dark:hover:bg-white dark:hover:text-twc-text transition-all disabled:opacity-50"
                >
                  {editingCustomer ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomersPage;
