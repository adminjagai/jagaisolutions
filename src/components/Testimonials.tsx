import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/content';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="testimonials" className="section relative bg-gray-50">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-30 -z-10"></div>
      
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Hear from businesses that have transformed their operations with our AI solutions.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card p-8 md:p-12 relative">
            <div className="absolute top-8 left-8 text-primary-300 opacity-50">
              <Quote size={64} />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/4 flex-shrink-0">
                  <img 
                    src={testimonials[currentIndex].avatarUrl} 
                    alt={testimonials[currentIndex].author}
                    className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-white shadow-md"
                  />
                </div>
                
                <div className="md:w-3/4">
                  <p className="text-lg md:text-xl text-gray-700 italic mb-6">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  
                  <div>
                    <h4 className="text-lg font-semibold">
                      {testimonials[currentIndex].author}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-primary-500 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary-500 w-6' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:text-primary-500 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;