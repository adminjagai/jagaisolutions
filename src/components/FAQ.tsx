import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '../data/content';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 font-medium text-sm mb-4">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Find answers to common questions about our AI solutions and implementation process.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {faqItems.map((faq, index) => (
            <div 
              key={faq.id}
              className="mb-4 border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left p-6 flex justify-between items-center focus:outline-none transition-colors ${
                  openIndex === index ? 'bg-primary-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <span className={`font-semibold text-lg ${openIndex === index ? 'text-primary-700' : 'text-gray-800'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`transform transition-transform ${openIndex === index ? 'rotate-180 text-primary-600' : 'text-gray-500'}`}
                  size={20}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="mb-4 text-gray-700">
            Still have questions? We're here to help.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
          >
            Contact our team
            <ChevronDown className="ml-1 rotate-[-90deg]" size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;