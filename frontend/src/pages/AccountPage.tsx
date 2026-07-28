import { useState } from 'react';
import { motion } from 'framer-motion';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user data
  const user = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
  };

  return (
    <div className="pt-24 pb-14 bg-brand-accent min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-heading mb-12 text-brand-dark">My Account</h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-1/4">
            <nav className="flex flex-col space-y-4 font-body uppercase tracking-widest text-sm">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`text-left pb-2 border-b transition-colors ${activeTab === 'profile' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-gray-500 hover:text-brand-dark'}`}
              >
                Profile Info
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`text-left pb-2 border-b transition-colors ${activeTab === 'orders' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-gray-500 hover:text-brand-dark'}`}
              >
                Order History
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`text-left pb-2 border-b transition-colors ${activeTab === 'addresses' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-gray-500 hover:text-brand-dark'}`}
              >
                Addresses
              </button>
              <button 
                className="text-left text-red-500 hover:text-red-700 transition-colors pt-4"
              >
                Logout
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-3/4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-8 md:p-12 shadow-sm"
            >
              {activeTab === 'profile' && (
                <div>
                  <h2 className="font-heading text-2xl mb-8">Personal Information</h2>
                  <form className="space-y-6 font-body max-w-xl">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                        <input type="text" className="input-luxury" defaultValue={user.firstName} />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                        <input type="text" className="input-luxury" defaultValue={user.lastName} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                      <input type="email" className="input-luxury" defaultValue={user.email} />
                    </div>
                    <div className="pt-4">
                      <button className="btn-outline">Update Profile</button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-heading text-2xl mb-8">Order History</h2>
                  <div className="text-center py-10">
                    <p className="text-gray-500 font-body mb-6">You haven't placed any orders yet.</p>
                    <button className="btn-primary">Start Shopping</button>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="font-heading text-2xl mb-8">Saved Addresses</h2>
                  <div className="border border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-brand-primary transition-colors">
                    <span className="font-body text-sm text-gray-500 uppercase tracking-widest">+ Add New Address</span>
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

export default AccountPage;
