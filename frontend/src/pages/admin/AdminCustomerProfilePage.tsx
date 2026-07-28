import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { useState } from 'react';

const AdminCustomerProfilePage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('purchases');

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminCustomerProfile', id],
    queryFn: async () => {
      const response = await api.get(`/admin/customers/${id}`);
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-600 rounded-lg">
        <h3 className="font-semibold text-lg">Error loading profile</h3>
      </div>
    );
  }

  const { customer, purchases, appointments, payments } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Customer Profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Mail size={16} />
              <span className="text-sm">{customer.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Phone size={16} />
              <span className="text-sm">{customer.phoneNumber || 'No phone provided'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Calendar size={16} />
              <span className="text-sm">Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <div className="border-b border-gray-200 dark:border-zinc-800">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('purchases')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'purchases'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingBag size={16} />
                Purchases ({purchases.length})
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar size={16} />
                Appointments ({appointments.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard size={16} />
                Payments ({payments.length})
              </button>
            </nav>
          </div>
          <CardContent className="p-0">
            {activeTab === 'purchases' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-4">No purchases yet.</TableCell></TableRow>
                    ) : (
                      purchases.map((order: any) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium text-sm truncate max-w-[100px]">{order._id}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell className="text-right">₹{order.totalPrice}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            {activeTab === 'appointments' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-4">No appointments yet.</TableCell></TableRow>
                    ) : (
                      appointments.map((apt: any) => (
                        <TableRow key={apt._id}>
                          <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                          <TableCell>{apt.timeSlot}</TableCell>
                          <TableCell>{apt.status}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-4">No payments yet.</TableCell></TableRow>
                    ) : (
                      payments.map((pay: any) => (
                        <TableRow key={pay._id}>
                          <TableCell>{new Date(pay.paymentDate).toLocaleDateString()}</TableCell>
                          <TableCell>{pay.method}</TableCell>
                          <TableCell>{pay.status}</TableCell>
                          <TableCell className="text-right">₹{pay.amount}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCustomerProfilePage;
