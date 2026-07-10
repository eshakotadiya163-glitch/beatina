import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AboutPage from './pages/AboutPage';
import PolicyPage from './pages/PolicyPage';
import BlogPage from './pages/BlogPage';
import FaqPage from './pages/FaqPage';

// New Pages
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Account Pages
import ProfilePage from './pages/ProfilePage';
import AddressBookPage from './pages/AddressBookPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';



function App() {
  return (
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
      </Route>

      {/* Public/Customer Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="category/:id" element={<CategoryPage />} />
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
        <Route path="privacy" element={<PolicyPage />} />
        <Route path="terms" element={<PolicyPage />} />
        <Route path="shipping" element={<PolicyPage />} />
        <Route path="returns" element={<PolicyPage />} />
        <Route path="faq" element={<FaqPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
