import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: '01. How long does it take to process an order?',
    answer: "Orders are processed within 1-2 business days. You'll receive a confirmation once it ships. During holidays or peak times, processing may take slightly longer than usual.",
  },
  {
    question: '02. Do you ship internationally?',
    answer: "Yes, we ship internationally! Delivery times and rates vary by location. Additional customs fees or duties may apply, depending on your country's regulations.",
  },
  {
    question: '03. What is your return policy?',
    answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging. Refunds are processed once the return is received and inspected.',
  },
  {
    question: '04. Can I modify or cancel my order after placing it?',
    answer: 'Orders can be modified or canceled within a short window after purchase. Once processed, changes may not be possible. Contact us as soon as possible for assistance.',
  },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-[40px] md:py-[50px] bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Title Area */}
        <div className="text-center mb-10 md:mb-12">
          <div className="font-body text-[11px] uppercase tracking-[0.2em] text-brand-dark mb-2">
            Sub Title Top
          </div>
          <h3 className="font-heading text-3xl md:text-4xl text-brand-dark">
            Time to achieve more with less
          </h3>
        </div>

        {/* Content Area */}
        <div className="max-w-[1140px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-0 lg:w-3/4 mx-auto">
            
            {/* Left: FAQs */}
            <div className="w-full md:w-1/2 md:pr-8 lg:pr-12">
              <div className="border-t border-[#ebebeb]">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-[#ebebeb]">
                    <button
                      className="w-full relative py-5 flex justify-between items-center text-left focus:outline-none cursor-pointer pr-12 group"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      aria-expanded={openIndex === index}
                    >
                      <span className="font-body text-[15px] font-medium text-[#111111]">
                        {faq.question}
                      </span>
                      <span className="absolute right-0 top-[10px] w-10 h-10 flex items-center justify-center text-brand-dark transition-transform duration-300">
                        {openIndex === index
                          ? <Minus size={16} strokeWidth={1.5} />
                          : <Plus size={16} strokeWidth={1.5} />
                        }
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'
                      }`}
                    >
                      <p className="font-body text-[14px] text-gray-600 leading-[1.6]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image */}
            <div className="w-full md:w-1/2">
              <div className="relative w-full aspect-square overflow-hidden">
                <img 
                  src="https://beautina-cosmetic.myshopify.com/cdn/shop/files/collection-tab-1.jpg?v=1773124924&width=1080" 
                  alt="FAQ Image" 
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
