import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SearchDrawer from '../components/SearchDrawer';
import MobileBottomNav from '../components/MobileBottomNav';
import useSearchStore from '../store/searchStore';

const MainLayout = () => {
  const { isOpen, setIsOpen } = useSearchStore();

  return (
    <div className="flex flex-col min-h-screen pb-12 md:pb-0">
      <Navbar />
      <CartDrawer />
      <SearchDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;
