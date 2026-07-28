import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    answer: 'Orders can only be modified or canceled within 24 hours of placement. Please contact our support team immediately to request any changes.',
  },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        {/* Title Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-12"
        >
          <div className="font-body text-[13px] md:text-[15px] text-gray-500 mb-4 font-[400]">
            Sub Title Top
          </div>
          <h3 className="font-serif text-[28px] md:text-[36px] lg:text-[42px] text-[#111111] font-[400] leading-[1.2] max-w-3xl mx-auto">
            Time to achieve more with less
          </h3>
        </motion.div>

        {/* Content Area */}
        <div className="max-w-[1140px] mx-auto">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-12 lg:w-4/5 mx-auto items-center">
            
            {/* Left: FAQs */}
            <div className="w-full md:w-1/2">
              <div className="border-t border-gray-200">
                {faqs.map((faq, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="border-b border-gray-200"
                  >
                    <button
                      className="w-full relative py-5 md:py-6 flex justify-between items-center text-left focus:outline-none cursor-pointer pr-12 group transition-colors hover:text-black"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      aria-expanded={openIndex === index}
                    >
                      <span className={`font-serif text-[20px] md:text-[26px] leading-[1.3] font-medium transition-colors ${openIndex === index ? 'text-black' : 'text-[#222222]'}`}>
                        {faq.question}
                      </span>
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-black">
                        {openIndex === index
                          ? <Minus size={18} strokeWidth={1} />
                          : <Plus size={18} strokeWidth={1} />
                        }
                      </span>
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pr-6">
                            <p className="font-sans text-[13px] md:text-[14px] text-gray-500 leading-relaxed font-light">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Image */}
            <div className="w-full md:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative w-full aspect-[4/5] overflow-hidden"
              >
                <img 
                  src="/images/migrated/10_collection-tab-1.jpg" 
                  alt="FAQ Image" 
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
