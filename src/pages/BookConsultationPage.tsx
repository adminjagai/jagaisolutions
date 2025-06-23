import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, BarChart, Users, Lightbulb, Target, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';

const BookConsultationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-16">
      {/* Background elements */}
      <div className="absolute inset-0 circuit-pattern opacity-10 -z-10"></div>
      <div className="absolute inset-0 grid-bg opacity-15 -z-10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full -z-10"
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
                <div className="p-3 bg-secondary-100 rounded-lg text-secondary-600 mr-4">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Free 30-Minute Consultation</h1>
                  <p className="text-gray-300">Comprehensive strategy session to create your AI roadmap</p>
                </div>
              </div>

              {/* 48-Hour Notice Requirement */}
              <div className="bg-amber-900/20 border border-amber-800/30 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <Clock size={20} className="text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-amber-300 mb-2">48-Hour Advance Notice Required</h3>
                    <p className="text-sm text-amber-200 mb-2">
                      To schedule a free 30-minute consultation, please provide at least 48 hours advance notice. 
                      This allows us to properly research your case and prepare to provide the most valuable guidance during our meeting.
                    </p>
                    <p className="text-sm text-amber-200">
                      <strong>Important:</strong> Free consultations must be booked through our online scheduling system, 
                      and all appointment requests with less than 48 hours notice will need to be rescheduled.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Lightbulb size={24} className="text-accent-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Comprehensive Analysis</h3>
                    <ul className="text-gray-300 space-y-1">
                      <li>• In-depth business process review</li>
                      <li>• AI opportunity identification</li>
                      <li>• Custom solution recommendations</li>
                      <li>• ROI projections and timeline</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <Target size={24} className="text-primary-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Strategic Planning</h3>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Implementation roadmap creation</li>
                      <li>• Priority setting and phasing</li>
                      <li>• Resource requirement planning</li>
                      <li>• Risk assessment and mitigation</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <BarChart size={24} className="text-secondary-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Actionable Insights</h3>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Detailed consultation report</li>
                      <li>• Technology stack recommendations</li>
                      <li>• Budget and timeline estimates</li>
                      <li>• Next steps action plan</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <Zap size={24} className="text-green-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Immediate Value</h3>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Quick wins identification</li>
                      <li>• Process optimization tips</li>
                      <li>• Industry best practices</li>
                      <li>• Competitive advantage insights</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                <p className="text-sm text-green-200">
                  <strong>100% Free Consultation:</strong> No strings attached. Even if we don't work together, 
                  you'll walk away with valuable insights and a clear action plan for implementing AI in your business.
                </p>
              </div>

              <div className="mt-4 p-4 bg-primary-900/20 border border-primary-800/30 rounded-lg">
                <p className="text-sm text-primary-200">
                  <strong>Perfect for:</strong> Established businesses ready to invest in AI solutions, 
                  teams with specific automation goals, and companies planning digital transformation initiatives.
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
              bookingType="consultation"
              title="Book Your Free Consultation"
              description="Schedule a comprehensive strategy session to create your personalized AI implementation roadmap."
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookConsultationPage;