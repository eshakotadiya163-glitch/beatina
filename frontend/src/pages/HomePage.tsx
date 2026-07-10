import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

// 1. HeroBanner
import HeroBanner from '../components/home/HeroBanner';
// 1.5 CategoryScroll (Removed)
// 2. MarqueeBanner
import MarqueeBanner from '../components/home/MarqueeBanner';
// 3. NewArrivalsTab
import NewArrivalsTab from '../components/home/NewArrivalsTab';
// 4. ImageTextPromo
import ImageTextPromo from '../components/home/ImageTextPromo';
// 5. SummerSpecialGrid
import SummerSpecialGrid from '../components/home/SummerSpecialGrid';
// 6. InteractiveImage
import InteractiveImage from '../components/home/InteractiveImage';
// 7. FaqAccordion
import FaqAccordion from '../components/home/FaqAccordion';
// 8. FeaturedCollections
import FeaturedCollections from '../components/home/FeaturedCollections';
import TextMarquee from '../components/home/TextMarquee';
// 10. PressTestimonials
import PressTestimonials from '../components/home/PressTestimonials';
// 11. BeforeAfterSection
import BeforeAfterSection from '../components/home/BeforeAfterSection';
// 12. ProductListBestSellers
import ProductListBestSellers from '../components/home/ProductListBestSellers';
// 13. CountdownBanner
import CountdownBanner from '../components/home/CountdownBanner';
// 14. ShopTheLook
import ShopTheLook from '../components/home/ShopTheLook';
// 15. ShoppableVideos
import ShoppableVideos from '../components/home/ShoppableVideos';
// 16. TestimonialsCarousel
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
// 17. IconFeatures
import IconFeatures from '../components/home/IconFeatures';
// 18. BlogPreview
import BlogPreview from '../components/home/BlogPreview';
// 19. InstagramGrid
import InstagramGrid from '../components/home/InstagramGrid';
const HomePage = () => {
  // Fetch products for sliders
  const { data: productsData } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=100');
      return data;
    }
  });

  const products = productsData?.products || [];

  return (
    <main className="overflow-x-hidden pt-[116px]">
      {/* 1. Slideshow-1 */}
      <HeroBanner />
      
      {/* 1.5 Category Scroll (Removed) */}
      {/* 2. ag-scrolling-promotion */}
      <MarqueeBanner />

      {/* 3. product-tab */}
      <NewArrivalsTab products={products} />

      {/* 4. advanced_content */}
      <ImageTextPromo />

      {/* 5. grid-banner */}
      <SummerSpecialGrid />

      {/* 6. image-interactive */}
      <InteractiveImage />

      {/* 7. faq_accordion_1 */}
      <FaqAccordion />

      {/* 8. featured-collections-1 */}
      <FeaturedCollections />

      {/* 8.5 Text Marquee */}
      <TextMarquee />

      {/* 9. PromoBanner - SKIPPED / Background only in extracted DOM */}

      {/* 10. quotes-style3 */}
      <PressTestimonials />

      {/* 11. before-after */}
      <BeforeAfterSection />

      {/* 12. product-list */}
      <ProductListBestSellers products={products} />

      {/* 13. 8d7aa2ec... (Countdown) */}
      <CountdownBanner />

      {/* 14. shop-the-look */}
      <ShopTheLook products={products} />

      {/* 15. shoppable-videos */}
      <ShoppableVideos products={products} />

      {/* 16. quotes-special */}
      <TestimonialsCarousel />

      {/* 17. Icon features */}
      <IconFeatures />

      {/* 18. blog-section */}
      <BlogPreview />

      {/* 19. instagram */}
      <InstagramGrid />
    </main>
  );
};

export default HomePage;
