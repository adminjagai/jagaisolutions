import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, MessagesSquare, BarChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="contact" className="section relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary-50 to-transparent opacity-70 -z-10"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-200 rounded-full filter blur-[100px] opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-secondary-200 rounded-full filter blur-[120px] opacity-30 -z-10"></div>
      
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent-100 text-accent-700 font-medium text-sm mb-4">
            Let's Get Started
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Choose the perfect starting point for your AI journey. Whether you need a quick overview or comprehensive strategy, we're here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6">Why Work With JAG AI Solutions?</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="mr-4 p-2 bg-primary-100 rounded-lg text-primary-600">
                  <MessagesSquare size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">Expert AI Implementation</h4>
                  <p className="text-gray-600">
                    Our team specializes in creating custom AI solutions tailored to your specific business needs and objectives.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 p-2 bg-secondary-100 rounded-lg text-secondary-600">
                  <BarChart size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">Data-Driven Results</h4>
                  <p className="text-gray-600">
                    We focus on delivering measurable outcomes, with comprehensive analytics and continuous optimization.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 p-2 bg-accent-100 rounded-lg text-accent-600">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1">Dedicated Support</h4>
                  <p className="text-gray-600">
                    Our relationship doesn't end at implementation. We provide ongoing support and optimization to ensure long-term success.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <p className="text-gray-700 mb-4">
                "Working with JAG AI Solutions has been transformative for our business. Their AI chat agents have increased our customer satisfaction scores by 35% while reducing support costs."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">David Wilson</p>
                  <p className="text-sm text-gray-500">CEO, TechNova</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Call Option */}
            <div className="glass-card p-6 border-2 border-primary-200 hover:border-primary-300 transition-colors">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600 mr-3">
                  <MessagesSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Quick Discovery Call</h3>
                  <p className="text-gray-600 text-sm">15 minutes • Perfect for initial exploration</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Not sure where to start? Book a brief call to discuss your challenges and see if AI is right for your business.
              </p>
              <ul className="text-sm text-gray-600 mb-6 space-y-1">
                <li>• Quick needs assessment</li>
                <li>• AI opportunity overview</li>
                <li>• No commitment required</li>
              </ul>
              <Link 
                to="/book-call" 
                className="btn btn-outline border-primary-500 text-primary-600 hover:bg-primary-50 w-full justify-center"
              >
                Book Discovery Call
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Full Consultation Option */}
            <div className="glass-card p-6 border-2 border-secondary-200 hover:border-secondary-300 transition-colors">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-secondary-100 rounded-lg text-secondary-600 mr-3">
                  <BarChart size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Free Strategy Consultation</h3>
                  <p className="text-gray-600 text-sm">45-60 minutes • Comprehensive planning session</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Ready to dive deep? Get a complete AI strategy with actionable recommendations and implementation roadmap.
              </p>
              <ul className="text-sm text-gray-600 mb-6 space-y-1">
                <li>• Detailed business analysis</li>
                <li>• Custom solution design</li>
                <li>• ROI projections & timeline</li>
                <li>• Written consultation report</li>
              </ul>
              <Link 
                to="/book-consultation" 
                className="btn btn-primary w-full justify-center"
              >
                Book Free Consultation
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;