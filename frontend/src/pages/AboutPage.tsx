import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import InstagramGrid from '../components/home/InstagramGrid';
import Newsletter from '../components/home/Newsletter';

const AboutPage = () => {
  return (
    <main className="pt-24 pb-0 bg-white min-h-screen">
      
      {/* Breadcrumb / Title Area */}
      <div className="bg-brand-light py-12 mb-16 text-center">
        <h1 className="font-heading text-4xl text-brand-dark tracking-wide uppercase">About Us</h1>
        <div className="mt-4 flex items-center justify-center gap-2 font-body text-xs text-brand-muted uppercase tracking-widest">
          <span>Home</span>
          <span>/</span>
          <span className="text-brand-dark">About Us</span>
        </div>
      </div>

      {/* Intro Section */}
      <section className="max-w-6xl mx-auto px-4 xl:px-0 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square md:aspect-[4/5] overflow-hidden">
            <img 
              src="/assets/migrated/21_about-img-3.webp" 
              alt="About Beautina" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="md:pl-12">
            <h2 className="font-heading text-3xl md:text-4xl text-brand-dark mb-6 leading-tight">
              The Elegance of<br/>Effortless Beauty
            </h2>
            <div className="font-body text-brand-muted space-y-4 text-sm leading-relaxed mb-8">
              <p>
                At Beautina, we believe that true beauty stems from nature. Our journey began with a simple vision: to create premium skincare that honors your skin's natural balance while delivering high-performance results.
              </p>
              <p>
                Every product is meticulously crafted using ethically sourced, organic ingredients. We combine traditional botanical wisdom with modern science to formulate products that not only nourish your skin but elevate your daily ritual.
              </p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-brand-dark hover:text-brand-accent transition-colors">
              Explore Our Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="bg-brand-dark py-24 text-white">
        <div className="max-w-6xl mx-auto px-4 xl:px-0 text-center">
          <h2 className="font-heading text-3xl mb-16">Our Promise To You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/20 rounded-full">
                <img src="/assets/migrated/54_Icon_2.png" alt="Organic" className="w-8 h-8 invert brightness-0" />
              </div>
              <h3 className="font-heading text-xl mb-3 tracking-wide">100% Organic</h3>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                Sourced directly from nature, our ingredients are certified organic and completely free from harmful synthetics.
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/20 rounded-full">
                <img src="/assets/migrated/55_Icon_4.png" alt="Cruelty Free" className="w-8 h-8 invert brightness-0" />
              </div>
              <h3 className="font-heading text-xl mb-3 tracking-wide">Cruelty Free</h3>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                We love animals. None of our products or ingredients are ever tested on animals, and we are proudly Leaping Bunny certified.
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/20 rounded-full">
                <img src="/assets/migrated/56_Icon_3.png" alt="Dermatologist Tested" className="w-8 h-8 invert brightness-0" />
              </div>
              <h3 className="font-heading text-xl mb-3 tracking-wide">Dermatologist Tested</h3>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                Clinically tested and approved by dermatologists to ensure safety and efficacy for all skin types, even the most sensitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Story Image */}
      <section className="py-24 max-w-6xl mx-auto px-4 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 md:pr-12 text-right md:text-left">
            <h2 className="font-heading text-3xl md:text-4xl text-brand-dark mb-6 leading-tight">
              Crafted With Purpose
            </h2>
            <div className="font-body text-brand-muted space-y-4 text-sm leading-relaxed">
              <p>
                Sustainability is at the core of everything we do. From our eco-friendly packaging to our carbon-neutral shipping processes, we are committed to minimizing our environmental footprint.
              </p>
              <p>
                When you choose Beautina, you're not just investing in your skin; you're joining a movement towards a more conscious and beautiful world.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/3] overflow-hidden">
            <img 
              src="/assets/migrated/18_gallery-2-v2.webp" 
              alt="Crafting Beautina" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <InstagramGrid />
      <Newsletter />

    </main>
  );
};

export default AboutPage;
