import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AdminLayout from './layouts/AdminLayout';

// Lazy loaded Admin Routes
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminProductEditPage = lazy(() => import('./pages/admin/AdminProductEditPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));

// SaaS Admin Routes
const AdminLeadsPage = lazy(() => import('./pages/admin/AdminLeadsPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminCustomerProfilePage = lazy(() => import('./pages/admin/AdminCustomerProfilePage'));
const AdminAppointmentsPage = lazy(() => import('./pages/admin/AdminAppointmentsPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminInvoicesPage = lazy(() => import('./pages/admin/AdminInvoicesPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'));
const AdminStaffPage = lazy(() => import('./pages/admin/AdminStaffPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

// Lazy loaded Public/Customer Routes
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

// Auth
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Account / Dashboard
const AccountPage = lazy(() => import('./pages/AccountPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AddressBookPage = lazy(() => import('./pages/AddressBookPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));

// Checkout Flow
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));

// Company & Policies
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailsPage = lazy(() => import('./pages/BlogDetailsPage'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-brand-bg">
    <div className="w-8 h-8 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Toaster position="bottom-center" />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/:id/edit" element={<AdminProductEditPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          {/* New SaaS Modules */}
          <Route path="leads" element={<AdminLeadsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="customers/:id" element={<AdminCustomerProfilePage />} />
          <Route path="appointments" element={<AdminAppointmentsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="invoices" element={<AdminInvoicesPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Public/Customer Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<Navigate to="/shop/category/all" replace />} />
          <Route path="shop/category/:id" element={<CategoryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          
          {/* Auth */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Account / Dashboard */}
          <Route path="account" element={<AccountPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="addresses" element={<AddressBookPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          
          {/* Checkout Flow */}
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
          
          {/* Company & Policies */}
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogDetailsPage />} />
          <Route path="privacy" element={<PolicyPage />} />
          <Route path="terms" element={<PolicyPage />} />
          <Route path="shipping" element={<PolicyPage />} />
          <Route path="returns" element={<PolicyPage />} />
          <Route path="faq" element={<FaqPage />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
