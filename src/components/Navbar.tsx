import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { navItems } from '../data/content';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-950/90 backdrop-blur-lg shadow-lg border-b border-dark-800' 
          : 'bg-transparent'
      } py-4`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex justify-start"
          >
            <div className="relative group">
              <div className="text-6xl font-bold relative inline-block">
                <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent" 
                  style={{
                    textShadow: `
                      0 0 30px rgba(0, 71, 255, 0.3),
                      0 0 60px rgba(0, 71, 255, 0.1)
                    `
                  }}>
                  JAG AI SOLUTIONS
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-300 to-primary-400 opacity-10 group-hover:opacity-20 transition-opacity duration-300" 
                  style={{
                    filter: 'blur(20px)',
                    transform: 'perspective(1000px) translateZ(-20px)'
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-8"
          >
            {navItems.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  scrolled ? 'text-gray-300 hover:text-primary-300' : 'text-gray-200 hover:text-primary-300'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a 
              href="#contact" 
              className="btn btn-primary py-2 px-6"
            >
              Book a Call
            </a>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-200 hover:text-primary-300 font-medium"
                >
                  {item.label}
                </a>
              ))}
              <a 
                href="#contact" 
                onClick={() => setIsOpen(false)}
                className="btn btn-primary w-full text-center"
              >
                Book a Call
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;