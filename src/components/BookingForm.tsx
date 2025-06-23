import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum time for today
  const getMinTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // If it's today, set minimum time to current time + 1 hour
    if (formData.preferredDate === getMinDate()) {
      const minHour = currentHour + 1;
      return `${minHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    }
    
    return '09:00'; // Default business hours start
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.preferredDate) return 'Preferred date is required';
    if (!formData.preferredTime) return 'Preferred time is required';
    
    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
    
    // Phone validation (if provided)
    if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    
    // Date validation
    const selectedDateTime = new Date(`${formData.preferredDate}T${formData.preferredTime}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      return 'Please select a future date and time';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
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
        throw new Error(result.error || 'Failed to submit booking');
      }
      
      setIsSubmitted(true);
      
      // Reset form after showing success message
      setTimeout(() => {
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
      }, 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden">
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-transparent z-0">
        <div className="absolute inset-[-2px] bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-xl animate-shimmer opacity-50"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
        
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Check size={32} />
            </div>
            <h4 className="text-xl font-semibold mb-2 text-white">Booking Confirmed!</h4>
            <p className="text-gray-300">
              Thank you for your booking. We'll contact you shortly to confirm the details.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
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
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-white"
                  placeholder="John"
                />
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
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-white"
                  placeholder="Doe"
                />
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
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-white"
                  placeholder="john@example.com"
                />
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
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-300 mb-1">
                  <Calendar size={16} className="inline mr-1" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-white"
                />
              </div>
              
              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-300 mb-1">
                  <Clock size={16} className="inline mr-1" />
                  Preferred Time *
                </label>
                <input
                  type="time"
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  min={getMinTime()}
                  required
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-white"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                <MessageSquare size={16} className="inline mr-1" />
                Additional Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-white"
                placeholder="Tell us about your project or any specific requirements..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full btn ${
                isSubmitting ? 'bg-gray-600' : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700'
              } text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center`}
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
                  Book Your {bookingType === 'call' ? 'Call' : 'Consultation'}
                  <Send size={16} className="ml-2" />
                </span>
              )}
            </button>
            
            <p className="text-xs text-gray-400 mt-4 text-center">
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingForm;