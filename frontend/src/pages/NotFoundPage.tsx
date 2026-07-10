import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <main className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="font-heading text-8xl md:text-9xl text-brand-dark mb-4">404</h1>
        <h2 className="font-heading text-3xl md:text-4xl text-brand-dark mb-6 uppercase tracking-widest">Page Not Found</h2>
        <p className="font-body text-brand-muted mb-10 leading-relaxed text-sm">
          We can't seem to find the page you're looking for. It may have been moved or no longer exists.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 bg-brand-dark text-white px-8 py-4 font-body text-xs uppercase tracking-[0.2em] hover:bg-black transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Homepage
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
