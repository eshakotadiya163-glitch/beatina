import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-12 md:py-14 bg-brand-dark text-white">
      <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
        <span className="font-body text-[10px] uppercase tracking-[0.25em] text-white/60 mb-4 block">
          Newsletter
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-light mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
          Stay in the Loop
        </h2>
        <p className="font-body text-sm text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
          Subscribe for exclusive offers, skincare tips and early access to new arrivals.
        </p>

        {submitted ? (
          <p className="font-body text-sm text-white/80 border border-white/20 px-6 py-4 inline-block">
            Thank you for subscribing! ✓
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-transparent border border-white/30 text-white placeholder-white/40 px-5 py-4 text-sm font-body focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-brand-dark font-body text-xs uppercase tracking-[0.15em] px-8 py-4 hover:bg-brand-light transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
