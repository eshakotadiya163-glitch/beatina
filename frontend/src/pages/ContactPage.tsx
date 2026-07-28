import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post('/contact', data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
    },
    onError: () => {
      toast.error('Failed to send message. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMutation.mutate(formData);
  };

  return (
    <main className="bg-white min-h-screen">
      
      {/* Top Info Banner */}
      <div className="bg-[#fdf5f9] py-16 px-4 md:px-8 border-b border-[#f0e6df]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Address */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 bg-white">
              <MapPin size={20} className="text-[#333]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-[#111] mb-2 tracking-wide">Address</h3>
              <p className="font-body text-[14px] text-[#666] leading-relaxed">
                D Washington Square South New York, NY
                <br />
                10012, United States
              </p>
            </div>
          </div>

          {/* Call us */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 bg-white">
              <Phone size={20} className="text-[#333]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-[#111] mb-2 tracking-wide">Call us</h3>
              <p className="font-body text-[14px] text-[#666] leading-relaxed">
                (+877) 834-1434
                <br />
                (+877) 834-1255
              </p>
            </div>
          </div>

          {/* Open */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 bg-white">
              <Clock size={20} className="text-[#333]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-[#111] mb-2 tracking-wide">Open</h3>
              <p className="font-body text-[14px] text-[#666] leading-relaxed">
                Monday - Friday: 8am - 4pm
                <br />
                Saturday - Sunday: 9am - 5pm
              </p>
            </div>
          </div>

          {/* Emails */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 bg-white">
              <Mail size={20} className="text-[#333]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-heading text-xl text-[#111] mb-2 tracking-wide">Emails</h3>
              <p className="font-body text-[14px] text-[#666] leading-relaxed">
                support@thewomancompany.com
                <br />
                info@madaraproducts.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Form Section */}
      <div className="py-20 px-4 max-w-[800px] mx-auto text-center">
        <h2 className="font-heading text-4xl text-[#111] mb-4 uppercase tracking-widest">Got Any Questions?</h2>
        <p className="font-body text-[14px] text-[#666] mb-12">Use the form below to get in touch with the sales team</p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input 
                  type="text" 
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-[#e5e5e5] bg-white px-5 py-3 font-body text-[14px] text-[#111] focus:border-[#111] focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-[#e5e5e5] bg-white px-5 py-3 font-body text-[14px] text-[#111] focus:border-[#111] focus:outline-none transition-colors" 
                  required 
                />
              </div>
            </div>

            <div>
              <input 
                type="text" 
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-[#e5e5e5] bg-white px-5 py-3 font-body text-[14px] text-[#111] focus:border-[#111] focus:outline-none transition-colors" 
              />
            </div>

            <div>
              <textarea 
                rows={6} 
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full border border-[#e5e5e5] bg-white px-5 py-4 font-body text-[14px] text-[#111] focus:border-[#111] focus:outline-none transition-colors resize-none" 
              ></textarea>
            </div>

            <div className="text-center mt-8">
              <button 
                type="submit" 
                disabled={submitContactMutation.isPending}
                className="bg-[#111] text-white px-10 py-4 font-sans text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-black/80 transition-colors"
              >
                {submitContactMutation.isPending ? 'SENDING...' : 'SEND QUESTION >'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[#fdf5f9] p-8 text-center rounded">
            <h3 className="font-heading text-2xl text-[#111] mb-2">Message Sent</h3>
            <p className="font-body text-[#666] text-sm">We will get back to you shortly.</p>
          </div>
        )}

        <p className="mt-8 font-body text-[12px] text-[#999] text-center">
          This site is protected by reCAPTCHA and the Google <a href="#" className="hover:text-black">Privacy Policy</a> and <a href="#" className="hover:text-black">Terms of Service</a> apply.
        </p>
      </div>

      {/* Bottom Map with Overlay */}
      <div className="relative w-full h-[600px]">
        <iframe 
          src="https://maps.google.com/maps?q=CN%20Tower,%20Toronto,%20Canada&t=&z=13&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>

        {/* Overlay Box */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-[10%] lg:left-[15%] bg-white w-full max-w-[400px] p-10 md:p-14 text-center shadow-xl">
          <h2 className="font-heading text-3xl text-[#111] mb-6 uppercase tracking-widest">Our Store</h2>
          
          <div className="font-body text-[14px] text-[#666] leading-relaxed mb-8 space-y-4">
            <p>
              123 Fake St
              <br />
              Toronto, Canada
            </p>
            <p>
              Mon - Fri, 10am - 9pm
              <br />
              Saturday, 11am - 9pm
              <br />
              Sunday, 11am - 5pm
            </p>
          </div>

          <a 
            href="https://maps.google.com/?q=123+Fake+St,+Toronto,+Canada" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#111] text-white px-8 py-4 font-sans text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-black/80 transition-colors w-full"
          >
            <MapPin size={16} />
            Get Directions
          </a>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
