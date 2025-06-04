import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as LucideIcons from 'lucide-react';
import { benefits } from '../data/content';

const Benefits: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="benefits" className="section relative">
      {/* Glowing orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent-300 rounded-full filter blur-[100px] opacity-20 -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary-200 rounded-full filter blur-[120px] opacity-20 -z-10"></div>
      
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent-100 text-accent-700 font-medium text-sm mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of AI-Powered Solutions</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our intelligent systems deliver measurable results that impact your bottom line
            while improving customer satisfaction.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit) => {
            const IconComponent = LucideIcons[benefit.icon as keyof typeof LucideIcons] || LucideIcons.CheckCircle;
            
            return (
              <motion.div 
                key={benefit.id} 
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-primary-50 rounded-lg text-primary-500">
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 animated-gradient">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience the Power of AI?</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Join the hundreds of businesses that have transformed their operations with our intelligent solutions.
            </p>
            <a href="#contact" className="btn btn-primary">
              Start Your AI Journey
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;