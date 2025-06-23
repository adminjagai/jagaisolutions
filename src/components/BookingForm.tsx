import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, User, Mail, Phone, MessageSquare, Home, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import DateTimePicker from './DateTimePicker';

interface BookingFormProps {
  bookingType: 'call' | 'consultation';
  title: string;
  description: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ bookingType, title, description }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, preferredDate: date }));
    if (errors.preferredDate) {
      setErrors(prev => ({ ...prev, preferredDate: '' }));
    }
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({ ...prev, preferredTime: time }));
    if (errors.preferredTime) {
      setErrors(prev => ({ ...prev, preferredTime: '' }));
    }
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date';
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select a preferred time';
    }
    
    // Phone validation (if provided)
    if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    // Message validation for consultations
    if (bookingType === 'consultation' && !formData.message.trim()) {
      newErrors.message = 'Please provide a brief description of your needs to help us prepare for your consultation';
    }
    
    // Date/time validation with different advance notice requirements
    if (formData.preferredDate && formData.preferredTime) {
      const selectedDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
      const now = new Date();
      const requiredAdvanceHours = bookingType === 'consultation' ? 48 : 24;
      const minBookingTime = new Date(now);
      minBookingTime.setHours(now.getHours() + requiredAdvanceHours);
      
      if (selectedDateTime <= minBookingTime) {
        const advanceText = bookingType === 'consultation' ? '48 hours' : '24 hours';
        newErrors.datetime = `Please select a date and time at least ${advanceText} in advance`;
      }
    }
    
    return newErrors;
  };

  const sendNotifications = async (bookingId: string) => {
    try {
      const notificationUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`;
      
      await fetch(notificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          bookingId,
          bookingType,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          message: formData.message || undefined,
        }),
      });
    } catch (error) {
      console.warn('Failed to send notifications:', error);
      // Don't fail the booking if notifications fail
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/book-consultation`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber || undefined,
          bookingType,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          message: formData.message || undefined,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: result.error || 'A booking with this email already exists' });
        } else if (response.status === 400 && result.error.includes('advance')) {
          const advanceText = bookingType === 'consultation' ? '48 hours' : '24 hours';
          setErrors({ datetime: `Appointments with less than ${advanceText} notice will need to be rescheduled. Please select a different time.` });
        } else {
          setErrors({ submit: result.error || 'Failed to submit booking' });
        }
        return;
      }
      
      // Send notifications after successful booking
      if (result.booking?.id) {
        await sendNotifications(result.booking.id);
      }
      
      setIsSubmitted(true);
      
    } catch (err) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      preferredDate: '',
      preferredTime: '',
      message: '',
    });
    setIsSubmitted(false);
    setErrors({});
  };

  const hasErrors = Object.keys(errors).length > 0;
  const canSubmit = formData.firstName && formData.lastName && formData.email && 
                   formData.preferredDate && formData.preferredTime && 
                   (bookingType === 'call' || formData.message.trim()) && !hasErrors;

  return (
    <>
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-transparent z-0">
          <div className="absolute inset-[-2px] bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-500 rounded-xl animate-shimmer opacity-50"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-300">{description}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General error message */}
            {errors.submit && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}
            
            {errors.datetime && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                {errors.datetime}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  <User size={16} className="inline mr-1" />
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 bg-dark-800 border rounded-lg focus:ring-2 transition-colors text-white ${
                    errors.firstName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-dark-600 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  <User size={16} className="inline mr-1" />
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 bg-dark-800 border rounded-lg focus:ring-2 transition-colors text-white ${
                    errors.lastName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-dark-600 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  <Mail size={16} className="inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 bg-dark-800 border rounded-lg focus:ring-2 transition-colors text-white ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-dark-600 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                  <Phone size={16} className="inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-dark-800 border rounded-lg focus:ring-2 transition-colors text-white ${
                    errors.phoneNumber 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-dark-600 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && (
                  <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
            
            {/* Advanced Date/Time Picker */}
            <DateTimePicker
              selectedDate={formData.preferredDate}
              selectedTime={formData.preferredTime}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              bookingType={bookingType}
              error={errors.preferredDate || errors.preferredTime}
            />
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                <MessageSquare size={16} className="inline mr-1" />
                {bookingType === 'consultation' ? 'Brief Description of Your Needs' : 'Additional Message'}
                {bookingType === 'consultation' && ' *'}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required={bookingType === 'consultation'}
                className={`w-full px-4 py-2 bg-dark-800 border rounded-lg focus:ring-2 transition-colors text-white ${
                  errors.message 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-dark-600 focus:ring-primary-500 focus:border-primary-500'
                }`}
                placeholder={
                  bookingType === 'consultation' 
                    ? "Please describe your business challenges, goals, and what you hope to achieve with AI automation. This helps us research your case and prepare valuable guidance for our meeting..."
                    : "Tell us about your project or any specific requirements..."
                }
              ></textarea>
              {bookingType === 'consultation' && (
                <p className="text-xs text-gray-400 mt-1">
                  This information helps us research your case and prepare to provide the most valuable guidance during our consultation.
                </p>
              )}
              {errors.message && (
                <p className="text-red-400 text-sm mt-1">{errors.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className={`w-full btn font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center ${
                isSubmitting || !canSubmit
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700'
              } text-white`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Book Your {bookingType === 'call' ? 'Call' : 'Free Consultation'}
                  <Send size={16} className="ml-2" />
                </span>
              )}
            </button>
            
            {!canSubmit && (
              <p className="text-sm text-gray-400 text-center">
                Please fill in all required fields to enable booking
              </p>
            )}
            
            <p className="text-xs text-gray-400 mt-4 text-center">
              By submitting this form, you agree to our privacy policy and terms of service.
              {bookingType === 'consultation' && ' All appointment requests with less than 48 hours notice will need to be rescheduled.'}
            </p>
          </form>
        </div>
      </div>

      {/* Persistent Confirmation Modal Overlay */}
      {isSubmitted && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop - prevents interaction with page content */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="glass-card p-8 md:p-12 relative">
              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-transparent">
                <div className="absolute inset-[-2px] bg-gradient-to-r from-green-400 via-primary-500 to-green-400 rounded-xl animate-shimmer opacity-60"></div>
              </div>
              
              <div className="relative z-10 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-8"
                >
                  <Check size={48} strokeWidth={3} />
                </motion.div>
                
                {/* Main Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold mb-6 text-white"
                >
                  Thank you so much for scheduling a {bookingType === 'call' ? 'call' : 'consultation'} with us!
                </motion.h2>
                
                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-xl text-gray-300 mb-8"
                >
                  We're excited to connect with you and discuss how we can help achieve your goals.
                </motion.p>
                
                {/* Confirmation Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="bg-primary-900/30 border border-primary-800/50 p-6 rounded-lg mb-8"
                >
                  <h3 className="text-lg font-semibold text-primary-200 mb-4">What Happens Next</h3>
                  <p className="text-primary-200 mb-4">
                    <strong>We will send a confirmation email when we have assigned an AI specialist to facilitate your company's needs.</strong>
                  </p>
                  <p className="text-sm text-primary-300">
                    You'll receive meeting details and a calendar invitation within 24 hours.
                    {bookingType === 'consultation' && ' We\'ll use the information you provided to research your case and prepare valuable guidance for our meeting.'}
                  </p>
                </motion.div>
                
                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="bg-green-900/20 border border-green-800/30 p-6 rounded-lg mb-8"
                >
                  <p className="text-lg text-green-200 font-medium">
                    We look forward to speaking with you soon!
                  </p>
                </motion.div>
                
                {/* Instructions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="mb-8"
                >
                  <p className="text-gray-300 mb-6">
                    Click here to return to our homepage, where you can explore more of our services and resources while you wait for our upcoming conversation.
                  </p>
                  
                  {/* Return Button */}
                  <Link 
                    to="/" 
                    onClick={resetForm}
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Home size={24} className="mr-3" />
                    Return to Homepage
                    <ArrowRight size={20} className="ml-3" />
                  </Link>
                </motion.div>
                
                {/* Footer Note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="text-xs text-gray-500"
                >
                  This confirmation will remain visible until you return to the homepage
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default BookingForm;