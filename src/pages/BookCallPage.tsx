import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Clock, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

const BookCallPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      {/* Background elements */}
      <div className="absolute inset-0 circuit-pattern opacity-10 -z-10"></div>
      <div className="absolute inset-0 grid-bg opacity-15 -z-10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 71, 255, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite'
        }}
      ></div>
      
      <div className="container-custom relative z-10">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-primary-300 hover:text-primary-200 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary-100 rounded-lg text-primary-600 mr-4">
                  <Phone size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Book a Quick Call</h1>
                  <p className="text-gray-300">15-minute discovery call to discuss your needs</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Clock size={24} className="text-primary-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">What to Expect</h3>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Quick 15-minute conversation</li>
                      <li>• Understand your current challenges</li>
                      <li>• Identify potential AI solutions</li>
                      <li>• Determine if we're a good fit</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users size={24} className="text-primary-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Who Should Book This</h3>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Business owners exploring AI solutions</li>
                      <li>• Teams looking to automate processes</li>
                      <li>• Companies wanting to improve customer service</li>
                      <li>• Anyone curious about AI implementation</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle size={24} className="text-green-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">What You'll Get</h3>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Clear understanding of AI opportunities</li>
                      <li>• Honest assessment of your needs</li>
                      <li>• Next steps recommendation</li>
                      <li>• No pressure, just valuable insights</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary-900/20 border border-primary-800/30 rounded-lg">
                <p className="text-sm text-primary-200">
                  <strong>Note:</strong> This is a brief introductory call. For detailed project discussions, 
                  consider booking a <Link to="/book-consultation" className="underline hover:text-primary-100">
                    full consultation
                  </Link> instead.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BookingForm
              bookingType="call"
              title="Schedule Your Call"
              description="Book a 15-minute discovery call to explore how AI can transform your business."
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookCallPage;