import FaqAccordion from '../components/home/FaqAccordion';

const FaqPage = () => {
  return (
    <main className="pt-16 pb-0 bg-white min-h-screen">
      <div className="bg-brand-light py-12 mb-12 text-center">
        <h1 className="font-heading text-4xl text-[#111111] tracking-wide uppercase">Frequently Asked Questions</h1>
        <div className="mt-4 flex items-center justify-center gap-2 font-body text-xs text-brand-muted uppercase tracking-widest">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#111111]">FAQ</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 xl:px-0 mb-16">
        <FaqAccordion />
      </div>
    </main>
  );
};

export default FaqPage;
