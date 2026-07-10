import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Newsletter from '../components/home/Newsletter';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="pt-24 pb-0 bg-white min-h-screen">
      
      {/* Breadcrumb / Title Area */}
      <div className="bg-brand-light py-12 mb-16 text-center">
        <h1 className="font-heading text-4xl text-brand-dark tracking-wide uppercase">Contact</h1>
        <div className="mt-4 flex items-center justify-center gap-2 font-body text-xs text-brand-muted uppercase tracking-widest">
          <span>Home</span>
          <span>/</span>
          <span className="text-brand-dark">Contact</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 xl:px-0 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Contact Form */}
          <div>
            <h2 className="font-heading text-3xl text-brand-dark mb-8">Got Any Questions?</h2>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="sr-only">First Name</label>
                    <input 
                      type="text" 
                      placeholder="First Name *"
                      className="w-full border border-brand-border bg-white px-5 py-3 font-body text-sm text-brand-dark focus:border-brand-dark focus:outline-none transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="sr-only">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Last Name *"
                      className="w-full border border-brand-border bg-white px-5 py-3 font-body text-sm text-brand-dark focus:border-brand-dark focus:outline-none transition-colors" 
                      required 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="sr-only">Email</label>
                  <input 
                    type="email" 
                    placeholder="Email *"
                    className="w-full border border-brand-border bg-white px-5 py-3 font-body text-sm text-brand-dark focus:border-brand-dark focus:outline-none transition-colors" 
                    required 
                  />
                </div>

                <div>
                  <label className="sr-only">Message</label>
                  <textarea 
                    rows={6} 
                    placeholder="Message"
                    className="w-full border border-brand-border bg-white px-5 py-4 font-body text-sm text-brand-dark focus:border-brand-dark focus:outline-none transition-colors resize-none" 
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="bg-brand-dark text-white px-10 py-4 font-body text-xs uppercase tracking-[0.2em] hover:bg-black transition-colors"
                >
                  Send Message
                </button>
              </form>
            ) : (
              <div className="bg-brand-light p-8 text-center">
                <h3 className="font-heading text-2xl text-brand-dark mb-2">Message Sent</h3>
                <p className="font-body text-brand-muted text-sm">We will get back to you within 24 hours.</p>
              </div>
            )}
          </div>

          {/* Right: Store Info */}
          <div>
            <h2 className="font-heading text-3xl text-brand-dark mb-8">Our Store</h2>
            
            <div className="space-y-8 font-body text-sm text-brand-muted">
              
              <div className="flex gap-4">
                <MapPin className="text-brand-dark flex-shrink-0" size={20} strokeWidth={1.5} />
                <div>
                  <h4 className="font-heading text-lg text-brand-dark mb-2 tracking-wide uppercase">Address</h4>
                  <p>123 Luxury Avenue, Suite 400</p>
                  <p>New York City, NY 10001</p>
                  <p>United States</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="text-brand-dark flex-shrink-0" size={20} strokeWidth={1.5} />
                <div>
                  <h4 className="font-heading text-lg text-brand-dark mb-2 tracking-wide uppercase">Phone</h4>
                  <p>+1 (123) 456-7890</p>
                  <p>Mon - Fri, 8am to 5pm</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="text-brand-dark flex-shrink-0" size={20} strokeWidth={1.5} />
                <div>
                  <h4 className="font-heading text-lg text-brand-dark mb-2 tracking-wide uppercase">Email</h4>
                  <p>hello@beautina.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 h-64 bg-brand-light border border-brand-border flex items-center justify-center">
              {/* Map Placeholder matching luxury minimal style */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1683210344234!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) opacity(80%)' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </div>
      
      {/* End with Newsletter block as requested */}
      <Newsletter />

    </main>
  );
};

export default ContactPage;
