import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

// Real footer links extracted from The Woman Company storefront
const footerSections = [
  {
    title: 'Pages',
    links: [
      { label: 'About-v1', to: '/pages/about-v1' },
      { label: 'About-v2', to: '/pages/about-v2' },
      { label: 'About-v3', to: '/pages/about-v3' },
      { label: 'LookBook', to: '/pages/lookbook' },
      { label: 'Contact', to: '/pages/contact' },
      { label: 'Find a Store', to: '/pages/find-a-store' },
    ],
  },
  {
    title: 'Trending Now',
    links: [
      { label: 'Spot Roll-On', to: '/product/acne-spot-roll-on' },
      { label: 'Scalp Peel Serum', to: '/product/scalp-peel-serum' },
      { label: 'Hydra Repair Serum', to: '/product/sos-hydra-repair-intensive-serum' },
      { label: 'AHA Peel Mask', to: '/product/creamy-clay-aha-peel-mask' },
      { label: 'Recharge Cream', to: '/product/madara-sos-skincare' },
    ],
  },
];

// Social links
const socials = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/madaracosmetics',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor"><path d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z" fillRule="evenodd"></path></svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/madaracosmetics/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor"><path d="M256 152c-57.43 0-104 46.57-104 104s46.57 104 104 104 104-46.57 104-104-46.57-104-104-104zm0 172.93c-38.07 0-68.93-30.86-68.93-68.93S217.93 187.07 256 187.07s68.93 30.86 68.93 68.93-30.86 68.93-68.93 68.93z"></path><path d="M347.9 140.7a23.4 23.4 0 1 0 23.4 23.4 23.4 23.4 0 0 0-23.4-23.4z"></path><path d="M379.8 98.45c-28.71-11.83-74.1-11.37-123.8-11.37s-95.09-.46-123.8 11.37c-31 12.78-43.14 26.68-45 83.33-1.63 48.78-1.57 91.31 0 140.23 1.83 55.45 14 69.83 45 82.61 28.71 11.83 74.1 11.37 123.8 11.37s95.09.46 123.8-11.37c31-12.78 43.14-26.68 45-83.33 1.63-48.78 1.57-91.31 0-140.23-1.83-55.45-14-69.83-45-82.61zm-21.72 216c-1.39 42.14-8 55.42-26.54 63-22 9-61.64 9.1-75.54 9.1s-53.5-.1-75.54-9.1c-18.52-7.62-25.15-20.9-26.54-63-1.42-43.13-1.42-83 0-126.15 1.39-42.14 8-55.42 26.54-63 22-9 61.64-9.1 75.54-9.1s53.5.1 75.54 9.1c18.52 7.62 25.15 20.9 26.54 63 1.42 43.14 1.42 83.01 0 126.15z"></path></svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/madaracosmetics',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor"><path d="M496 109.5a201.8 201.8 0 0 1-56.55 15.3 97.51 97.51 0 0 0 43.33-53.6 197.74 197.74 0 0 1-62.56 23.5A99.14 99.14 0 0 0 348.31 64c-54.42 0-98.46 43.4-98.46 96.9a93.21 93.21 0 0 0 2.54 22.1 280.7 280.7 0 0 1-203-101.3A95.69 95.69 0 0 0 36 130.4c0 33.6 17.53 63.3 44 80.7A97.5 97.5 0 0 1 35.22 199v1.2c0 46.9 34 86 79.2 94.9a101.77 101.77 0 0 1-25.88 3.4 82.4 82.4 0 0 1-18.56-1.8c12.51 38.5 48.92 66.5 92.05 67.3A199.59 199.59 0 0 1 39.5 405.6a172.5 172.5 0 0 1-23.5-1.4 284.7 284.7 0 0 0 151.72 43.7c182.11 0 281.67-148.5 281.67-277.6 0-4.2-.11-8.4-.31-12.5A198.48 198.48 0 0 0 496 109.5z"></path></svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/user/madaracosmetics',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor"><path d="M508.64 148.79c0-45-33.1-81.2-74-81.2C379.24 65 322.74 64 265 64h-18c-57.6 0-114.2 1-169.6 3.6C36.6 67.6 3.5 104 3.5 149C1 184.59-.06 220.19 0 255.79q-.15 53.4 3.4 106.9c0 45 33.1 81.5 73.9 81.5 58.2 2.7 117.9 3.9 178.6 3.8q91.2.3 178.6-3.8c40.9 0 74-36.5 74-81.5 2.4-35.7 3.5-71.3 3.4-107q.4-53.5-3.26-106.9zM207 353.89v-196.5l145 98.2z"></path></svg>
    ),
  }
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setLoading(true);
      await api.post('/newsletter', { email });
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#eeffec] text-[#111111] pt-12 md:pt-16 pb-6 border-t border-[#e2f0df]">
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 lg:gap-12 pb-12">
          {/* About Us */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-lg text-[#111111] font-medium mb-6">About us</h4>
            <div className="font-sans text-[15px] text-[#444444] leading-relaxed">
              <p>The Woman Company is an exclusive brand that makes beauty product.</p>
            </div>
          </div>

          {/* Nav columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="font-serif text-lg text-[#111111] font-medium mb-6">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="font-sans text-[15px] text-[#444444] hover:text-[#111111] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter & Socials */}
          <div className="lg:col-span-5 lg:pl-10">
            <h4 className="font-serif text-lg text-[#111111] font-medium mb-4">
              Sign up & save 15%
            </h4>
            <div className="font-sans text-[15px] text-[#444444] mb-6">
              <p>Get a 15% discount on your first order.</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="mb-8 w-full group flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full bg-transparent border-b border-[#5c6978] text-[#111111] placeholder-[#5c6978] px-0 py-[10px] text-[15px] font-sans focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#000000] text-[#f7f7f7] px-[30px] py-[12px] font-body text-[13px] font-medium uppercase tracking-[1px] hover:bg-[#ffb6c1] hover:text-[#ffffff] transition-colors w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            <div className="flex gap-5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="text-[#111111] hover:opacity-60 transition-opacity"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#111111]/10 pt-8 mt-2 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <p className="font-sans text-[14px] text-[#444444] m-0 w-full text-center lg:text-right">
            © {new Date().getFullYear()}, <Link to="/" className="text-[#111111] hover:underline underline-offset-4">The Woman Company cosmetic</Link>.
          </p>
        </div>
      </div>
      
      {/* Massive Brand Text at the bottom */}
      <div className="bg-[#eeffec] text-center overflow-hidden pt-10 pb-4">
        <h2 className="font-serif text-[50px] md:text-[90px] lg:text-[130px] xl:text-[180px] text-[#000000] m-0 leading-none whitespace-nowrap tracking-wider">
          TWC
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
