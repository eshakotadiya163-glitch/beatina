import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const getPolicyContent = (path: string) => {
  switch (path) {
    case '/privacy':
      return {
        title: 'Privacy Policy',
        content: `
          <p>This Privacy Policy describes how beautinacosmetic.com (the "Site" or "we") collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.</p>
          
          <h3>Collecting Personal Information</h3>
          <p>When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.</p>
          
          <h3>Minors</h3>
          <p>The Site is not intended for individuals under the age of 18. We do not intentionally collect Personal Information from children.</p>

          <h3>Sharing Personal Information</h3>
          <p>We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above.</p>
        `
      };
    case '/terms':
      return {
        title: 'Terms of Service',
        content: `
          <p>This website is operated by Beautina. Throughout the site, the terms "we", "us" and "our" refer to Beautina. Beautina offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
          
          <h3>Online Store Terms</h3>
          <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.</p>
          
          <h3>General Conditions</h3>
          <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
        `
      };
    case '/shipping':
      return {
        title: 'Shipping Policy',
        content: `
          <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          
          <h3>Domestic Shipping Rates and Estimates</h3>
          <p>For calculated shipping rates: Shipping charges for your order will be calculated and displayed at checkout.</p>
          <p>We offer free standard shipping on all orders over $50.</p>
        `
      };
    case '/returns':
      return {
        title: 'Refund Policy',
        content: `
          <p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>
          
          <h3>Eligibility</h3>
          <p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.</p>
          
          <h3>Damages and issues</h3>
          <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>
        `
      };
    default:
      return {
        title: 'Policy',
        content: '<p>Information currently unavailable.</p>'
      };
  }
};

const PolicyPage = () => {
  const location = useLocation();
  const [policy, setPolicy] = useState({ title: '', content: '' });

  useEffect(() => {
    setPolicy(getPolicyContent(location.pathname));
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <main className="pt-24 pb-20 bg-white min-h-screen">
      <div className="bg-brand-light py-12 mb-16 text-center">
        <h1 className="font-heading text-4xl text-brand-dark tracking-wide uppercase">{policy.title}</h1>
        <div className="mt-4 flex items-center justify-center gap-2 font-body text-xs text-brand-muted uppercase tracking-widest">
          <span>Home</span>
          <span>/</span>
          <span className="text-brand-dark">{policy.title}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 xl:px-0">
        <div 
          className="prose prose-sm md:prose-base max-w-none font-body text-brand-muted 
          prose-headings:font-heading prose-headings:text-brand-dark prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-widest
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-brand-accent prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
      </div>
    </main>
  );
};

export default PolicyPage;
