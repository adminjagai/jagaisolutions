import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as LucideIcons from 'lucide-react';
import { services } from '../data/content';

const Services: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="services" className="section relative bg-gray-50">
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
          <span className="inline-block px-4 py-2 rounded-full bg-secondary-100 text-secondary-700 font-medium text-sm mb-4">
            Our Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Cutting-Edge AI Solutions</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover how our intelligent AI services can transform your business operations
            and create exceptional customer experiences.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service) => {
            const IconComponent = LucideIcons[service.icon as keyof typeof LucideIcons] || LucideIcons.Code;
            
            return (
              <motion.div 
                key={service.id} 
                variants={itemVariants}
                className="glass-card p-6 glow-effect group transition-all duration-300 hover:translate-y-[-8px]"
              >
                <div className="relative mb-6 inline-flex">
                  <div className="absolute inset-0 bg-primary-100 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative p-4 bg-white rounded-full text-primary-500 group-hover:text-primary-600 transition-colors">
                    <IconComponent size={28} />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;