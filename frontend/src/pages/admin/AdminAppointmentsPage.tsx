import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Calendar as CalendarIcon, List, Clock, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '../../components/ui/table';

interface Appointment {
  _id: string;
  customer: { firstName: string, lastName: string, phoneNumber: string };
  staff: { firstName: string, lastName: string };
  date: string;
  timeSlot: string;
  status: string;
}

const AdminAppointmentsPage = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['adminAppointments'],
    queryFn: async () => {
      const response = await api.get('/admin/appointments');
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAppointments'] });
      toast.success('Appointment deleted');
    },
    onError: () => toast.error('Failed to delete appointment')
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this appointment?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    `${apt.customer?.firstName} ${apt.customer?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.customer?.phoneNumber?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage bookings and schedules.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> New Booking
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              type="text" 
              placeholder="Search customer name or phone..." 
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                  : 'bg-white dark:bg-zinc-900 text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List size={16} /> List
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' 
                  : 'bg-white dark:bg-zinc-900 text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon size={16} /> Calendar
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading...</TableCell></TableRow>
                ) : filteredAppointments.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No appointments found.</TableCell></TableRow>
                ) : (
                  filteredAppointments.map((apt) => (
                    <TableRow key={apt._id}>
                      <TableCell className="font-medium">
                        {apt.customer?.firstName} {apt.customer?.lastName}
                        <div className="text-xs text-gray-500 font-normal">{apt.customer?.phoneNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} className="text-gray-400" />
                          <span>{new Date(apt.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                          <Clock size={14} />
                          <span>{apt.timeSlot}</span>
                        </div>
                      </TableCell>
                      <TableCell>{apt.staff ? `${apt.staff.firstName} ${apt.staff.lastName}` : 'Unassigned'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          apt.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {apt.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(apt._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
            <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calendar View</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              The rich calendar view with drag-and-drop capability is currently being configured. 
              Please use the List view to manage current appointments.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setViewMode('list')}>
              Return to List View
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
