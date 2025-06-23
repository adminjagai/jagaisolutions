import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden bg-dark-950">
      {/* Modern tech background elements with reduced opacity */}
      <div className="absolute inset-0 circuit-pattern opacity-10 -z-10"></div>
      <div className="absolute inset-0 grid-bg opacity-15 -z-10"></div>
      
      {/* Floating orbs with darker gradients */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 71, 255, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite'
        }}
      ></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(133, 168, 255, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      ></div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-6 py-3 rounded-full bg-primary-900/30 text-primary-200 font-semibold text-xl mb-8 border border-primary-800/30 shadow-lg"
                style={{
                  textShadow: '0 2px 4px rgba(0, 71, 255, 0.2)'
                }}>
                Next-Gen AI Solutions for Business
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white"
            >
              Transform Your Business with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-400" 
                style={{
                  textShadow: '0 0 20px rgba(0, 71, 255, 0.3)'
                }}>
                Intelligent AI
              </span> Automation
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-300 mb-8 max-w-xl"
            >
              Custom AI chat agents, lead capture systems, and seamless CRM integrations 
              designed to elevate your customer experience and drive business growth.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/book-consultation" className="btn btn-primary group">
                Book Free Consultation
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link to="/book-call" className="btn btn-outline border-primary-300 text-primary-200 hover:bg-primary-900/30">
                Quick Discovery Call
              </Link>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:w-1/2 mt-12 md:mt-0"
          >
            <div className="relative group">
              {/* Enhanced glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl opacity-10 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-300/10 to-primary-500/10 rounded-xl opacity-20 group-hover:opacity-30 blur-2xl transition-all duration-500"></div>
              
              {/* Glass card with enhanced styling */}
              <div className="glass-card p-6 relative backdrop-blur-xl overflow-hidden bg-dark-900/50">
                <div className="absolute inset-0 bg-gradient-to-tr from-dark-900/50 to-dark-800/30 rounded-xl"></div>
                <img 
                  src="/pexels-pixabay-373543.jpg" 
                  alt="AI Technology Visualization"
                  className="w-full h-auto rounded-lg object-cover shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500"
                  style={{
                    filter: 'brightness(0.85) contrast(1.1)',
                    imageRendering: 'high-quality'
                  }}
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;