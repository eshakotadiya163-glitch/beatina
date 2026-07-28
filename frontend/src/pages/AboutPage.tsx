import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import InstagramGrid from '../components/home/InstagramGrid';
import Newsletter from '../components/home/Newsletter';

const AboutPage = () => {
  return (
    <main className="pt-16 pb-0 bg-white min-h-screen">
      
      {/* Breadcrumb / Title Area */}
      <div className="bg-brand-light py-12 mb-12 text-center">
        <h1 className="font-heading text-4xl text-[#111111] tracking-wide uppercase">About Us</h1>
        <div className="mt-4 flex items-center justify-center gap-2 font-body text-xs text-brand-muted uppercase tracking-widest">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#111111]">About Us</span>
        </div>
      </div>

      {/* Intro Section */}
      <section className="max-w-6xl mx-auto px-4 xl:px-0 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square md:aspect-[4/5] overflow-hidden">
            <img 
              src="/images/migrated/21_about-img-3.webp" 
              alt="About The Woman Company" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="md:pl-12">
            <h2 className="font-heading text-3xl md:text-4xl text-[#111111] mb-6 leading-tight">
              The Elegance of<br/>Effortless Beauty
            </h2>
            <div className="font-body text-brand-muted space-y-4 text-sm leading-relaxed mb-8">
              <p>
                At The Woman Company, we believe that true beauty stems from nature. Our journey began with a simple vision: to create premium skincare that honors your skin's natural balance while delivering high-performance results.
              </p>
              <p>
                Every product is meticulously crafted using ethically sourced, organic ingredients. We combine traditional botanical wisdom with modern science to formulate products that not only nourish your skin but elevate your daily ritual.
              </p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-[#111111] hover:text-brand-accent transition-colors">
              Explore Our Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="bg-[#111111] py-16 text-white">
        <div className="max-w-6xl mx-auto px-4 xl:px-0 text-center">
          <h2 className="font-heading text-3xl mb-12">Our Promise To You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/20 rounded-full">
                <img src="/images/migrated/54_Icon_2.png" alt="Organic" className="w-8 h-8 invert brightness-0" />
              </div>
              <h3 className="font-heading text-xl mb-3 tracking-wide">100% Organic</h3>
              <p className="font-body text-xs text-white/70 leading-relaxed">
                Sourced directly from nature, our ingredients are certified organic and completely free from harmful synthetics.
              </p>
              <h3 className="font-heading text-xl mb-4">Clean Ingredients</h3>
              <p className="font-body text-sm text-white/70">
                We never use harsh chemicals. Our formulas are clean, vegan, and rigorously tested for safety and efficacy.
              </p>
            </div>
            
            <div className="text-center p-8 border border-white/10 hover:border-white/30 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/20 rounded-full">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-heading text-xl mb-4">Sustainable Packaging</h3>
              <p className="font-body text-sm text-white/70">
                We care for the earth as much as your skin. All our packaging is 100% recyclable and sourced responsibly.
              </p>
            </div>
            
            <div className="text-center p-8 border border-white/10 hover:border-white/30 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/20 rounded-full">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="font-heading text-xl mb-4">Dermatologist Tested</h3>
              <p className="font-body text-sm text-white/70">
                Co-developed with leading experts to ensure our products are safe for all skin types, even the most sensitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Story Image */}
      <section className="py-16 max-w-6xl mx-auto px-4 xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 md:pr-12 text-right md:text-left">
            <h2 className="font-heading text-3xl md:text-4xl text-[#111111] mb-6 leading-tight">
              Crafted With Purpose
            </h2>
            <div className="space-y-6 text-[#111111]/80 font-body leading-relaxed">
              <p>
                Welcome to The Woman Company, where beauty meets science. Founded in 2020 by a team of passionate dermatologists and skincare enthusiasts, our mission is to empower individuals to feel confident in their own skin through high-quality, efficacious products.
              </p>
              <p>
                We believe that skincare should be a ritual, not a chore. That's why we meticulously source the finest ingredients from around the world, combining nature's best with cutting-edge scientific research to create formulations that truly deliver results.
              </p>
              <p>
                Our commitment goes beyond skin deep. We are dedicated to sustainability, using eco-friendly packaging and ethical sourcing practices. Every product in the The Woman Company line is cruelty-free, paraben-free, and designed with your skin's long-term health in mind.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/3] overflow-hidden">
            <img 
              src="/images/migrated/18_gallery-2-v2.webp" 
              alt="Crafting The Woman Company" 
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
