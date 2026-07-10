import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, Tag, LayoutDashboard } from 'lucide-react';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-heading mb-12 text-brand-dark">Admin Portal</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Admin Sidebar Navigation */}
          <div className="w-full md:w-1/5">
            <nav className="bg-white p-6 shadow-sm flex flex-col space-y-2 font-body uppercase tracking-widest text-xs h-full border border-gray-100 rounded-sm">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`text-left p-3 rounded-sm flex items-center transition-colors ${activeTab === 'dashboard' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-gray-500 hover:bg-brand-secondary/30'}`}
              >
                <LayoutDashboard size={16} className="mr-3" /> Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`text-left p-3 rounded-sm flex items-center transition-colors ${activeTab === 'products' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-gray-500 hover:bg-brand-secondary/30'}`}
              >
                <Package size={16} className="mr-3" /> Products
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`text-left p-3 rounded-sm flex items-center transition-colors ${activeTab === 'orders' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-gray-500 hover:bg-brand-secondary/30'}`}
              >
                <ShoppingCart size={16} className="mr-3" /> Orders
              </button>
              <button 
                onClick={() => setActiveTab('customers')}
                className={`text-left p-3 rounded-sm flex items-center transition-colors ${activeTab === 'customers' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-gray-500 hover:bg-brand-secondary/30'}`}
              >
                <Users size={16} className="mr-3" /> Customers
              </button>
              <button 
                onClick={() => setActiveTab('coupons')}
                className={`text-left p-3 rounded-sm flex items-center transition-colors ${activeTab === 'coupons' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-gray-500 hover:bg-brand-secondary/30'}`}
              >
                <Tag size={16} className="mr-3" /> Coupons
              </button>
            </nav>
          </div>

          {/* Admin Content Area */}
          <div className="w-full md:w-4/5">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 shadow-sm h-full border border-gray-100 rounded-sm"
            >
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="font-heading text-2xl mb-8">Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 border border-brand-secondary bg-brand-secondary/10 rounded-sm">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-body">Total Sales</p>
                      <p className="text-3xl font-heading text-brand-dark">$12,450</p>
                    </div>
                    <div className="p-6 border border-brand-secondary bg-brand-secondary/10 rounded-sm">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-body">Orders</p>
                      <p className="text-3xl font-heading text-brand-dark">142</p>
                    </div>
                    <div className="p-6 border border-brand-secondary bg-brand-secondary/10 rounded-sm">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-body">Products</p>
                      <p className="text-3xl font-heading text-brand-dark">48</p>
                    </div>
                    <div className="p-6 border border-brand-secondary bg-brand-secondary/10 rounded-sm">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-body">Customers</p>
                      <p className="text-3xl font-heading text-brand-dark">89</p>
                    </div>
                  </div>
                  
                  {/* Mock Chart Area */}
                  <div className="h-64 border border-gray-100 bg-gray-50 flex items-center justify-center rounded-sm">
                    <p className="text-sm font-body text-gray-400 uppercase tracking-widest">Sales Chart Visualization</p>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-heading text-2xl">Products Management</h2>
                    <button className="bg-brand-primary text-white px-6 py-3 font-button uppercase tracking-widest text-xs font-semibold rounded-sm hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/20">
                      + Add Product
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-body text-sm">
                      <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200">
                        <tr>
                          <th className="p-4 font-normal">Product</th>
                          <th className="p-4 font-normal">Price</th>
                          <th className="p-4 font-normal">Stock</th>
                          <th className="p-4 font-normal">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {/* Mock Rows */}
                        <tr>
                          <td className="p-4">Luminous Hydration Serum</td>
                          <td className="p-4">$85.00</td>
                          <td className="p-4">50</td>
                          <td className="p-4 text-brand-primary cursor-pointer">Edit</td>
                        </tr>
                        <tr>
                          <td className="p-4">Velvet Rose Body Butter</td>
                          <td className="p-4">$65.00</td>
                          <td className="p-4">30</td>
                          <td className="p-4 text-brand-primary cursor-pointer">Edit</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Other tabs follow similar structure... */}
              {activeTab !== 'dashboard' && activeTab !== 'products' && (
                 <div>
                   <h2 className="font-heading text-2xl mb-8 capitalize">{activeTab} Management</h2>
                   <div className="text-center py-20 text-gray-500 font-body text-sm">
                      {activeTab} management panel placeholder
                   </div>
                 </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
