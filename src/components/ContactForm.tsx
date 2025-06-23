import React from 'react';
import BookingForm from './BookingForm';

const ContactForm: React.FC = () => {
  return (
    <BookingForm
      bookingType="consultation"
      title="Book Your Free Consultation"
      description="Schedule a personalized consultation to discuss your AI automation needs."
    />
  );
};

export default ContactForm;