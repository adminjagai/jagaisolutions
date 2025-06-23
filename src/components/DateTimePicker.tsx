import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Info } from 'lucide-react';
import { 
  getAvailableDates, 
  generateTimeSlots, 
  formatDateForDisplay, 
  getUserTimezone,
  isDateAvailable,
  getHolidayName,
  isWeekend,
  getAdvanceNoticeText,
  TimeSlot 
} from '../utils/dateUtils';

interface DateTimePickerProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  bookingType: 'call' | 'consultation';
  error?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  bookingType,
  error
}) => {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const userTimezone = getUserTimezone();
  const advanceNoticeText = getAdvanceNoticeText(bookingType);

  useEffect(() => {
    // Load available dates on component mount
    const dates = getAvailableDates(bookingType);
    setAvailableDates(dates);
  }, [bookingType]);

  useEffect(() => {
    // Generate time slots when date is selected
    if (selectedDate) {
      setIsLoadingTimes(true);
      // Simulate loading delay for better UX
      setTimeout(() => {
        const slots = generateTimeSlots(selectedDate, bookingType);
        setTimeSlots(slots);
        setIsLoadingTimes(false);
      }, 300);
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, bookingType]);

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    onDateChange(dateString);
    onTimeChange(''); // Reset time when date changes
    setShowDatePicker(false);
  };

  const handleTimeSelect = (timeValue: string) => {
    onTimeChange(timeValue);
    setShowTimePicker(false);
  };

  const getDateDisplayText = () => {
    if (!selectedDate) return 'Select a date';
    const date = new Date(selectedDate);
    return formatDateForDisplay(date);
  };

  const getTimeDisplayText = () => {
    if (!selectedTime) return 'Select a time';
    const slot = timeSlots.find(s => s.value === selectedTime);
    return slot ? slot.label : selectedTime;
  };

  const isDateDisabled = (date: Date): boolean => {
    return !isDateAvailable(date, bookingType);
  };

  const getDateDisabledReason = (date: Date): string => {
    if (isWeekend(date)) return 'Weekend';
    const holidayName = getHolidayName(date);
    if (holidayName) return holidayName;
    return 'Not available';
  };

  return (
    <div className="space-y-4">
      {/* Timezone and Advance Notice Info */}
      <div className="flex items-center text-sm text-gray-400 bg-dark-800/50 p-3 rounded-lg">
        <Info size={16} className="mr-2 text-primary-400" />
        <span>All times shown in your local timezone: {userTimezone}</span>
      </div>

      {bookingType === 'consultation' && (
        <div className="bg-amber-900/20 border border-amber-800/30 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle size={16} className="text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-300 mb-1">48-Hour Advance Notice Required</h4>
              <p className="text-xs text-amber-200">
                Free consultations require at least 48 hours advance notice to allow us to properly research your case and prepare valuable guidance for our meeting.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar size={16} className="inline mr-1" />
            Preferred Date *
          </label>
          
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`w-full px-4 py-3 bg-dark-800 border rounded-lg text-left transition-colors ${
              error && !selectedDate 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-dark-600 focus:ring-primary-500 focus:border-primary-500'
            } text-white hover:bg-dark-700`}
          >
            <span className={selectedDate ? 'text-white' : 'text-gray-400'}>
              {getDateDisplayText()}
            </span>
          </button>

          {showDatePicker && (
            <div className="absolute z-50 mt-2 w-full bg-dark-800 border border-dark-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              <div className="p-2">
                <div className="text-sm text-gray-400 mb-2 px-2">
                  Available dates (excluding weekends and holidays, {advanceNoticeText})
                </div>
                {availableDates.map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-dark-700 text-white transition-colors"
                  >
                    {formatDateForDisplay(date)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Clock size={16} className="inline mr-1" />
            Preferred Time *
          </label>
          
          <button
            type="button"
            onClick={() => selectedDate && setShowTimePicker(!showTimePicker)}
            disabled={!selectedDate}
            className={`w-full px-4 py-3 bg-dark-800 border rounded-lg text-left transition-colors ${
              !selectedDate 
                ? 'border-dark-600 text-gray-500 cursor-not-allowed' 
                : error && !selectedTime
                ? 'border-red-500 focus:ring-red-500'
                : 'border-dark-600 focus:ring-primary-500 focus:border-primary-500 hover:bg-dark-700'
            } text-white`}
          >
            {isLoadingTimes ? (
              <span className="flex items-center text-gray-400">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading available times...
              </span>
            ) : (
              <span className={selectedTime ? 'text-white' : 'text-gray-400'}>
                {getTimeDisplayText()}
              </span>
            )}
          </button>

          {showTimePicker && selectedDate && !isLoadingTimes && (
            <div className="absolute z-50 mt-2 w-full bg-dark-800 border border-dark-600 rounded-lg shadow-xl max-h-64 overflow-y-auto">
              <div className="p-2">
                <div className="text-sm text-gray-400 mb-2 px-2">
                  Business hours: 9:00 AM - 5:00 PM (30-minute slots)
                </div>
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => slot.available && handleTimeSelect(slot.value)}
                    disabled={!slot.available}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      slot.available
                        ? 'hover:bg-dark-700 text-white'
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span className={slot.available ? '' : 'line-through'}>
                      {slot.label}
                    </span>
                    {!slot.available && (
                      <span className="text-xs text-gray-500 ml-2">(Not available)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Booking Requirements Info */}
      <div className="bg-primary-900/20 border border-primary-800/30 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-primary-300 mb-2">Booking Requirements:</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• {bookingType === 'consultation' ? 'Consultations' : 'Calls'} must be booked {advanceNoticeText}</li>
          <li>• Available Monday through Friday, 9:00 AM - 5:00 PM</li>
          <li>• No bookings on weekends or major holidays</li>
          <li>• Times shown in your local timezone ({userTimezone})</li>
          {bookingType === 'consultation' && (
            <li>• Please include a brief description of your needs when booking</li>
          )}
        </ul>
      </div>

      {/* Click outside to close dropdowns */}
      {(showDatePicker || showTimePicker) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowDatePicker(false);
            setShowTimePicker(false);
          }}
        />
      )}
    </div>
  );
};

export default DateTimePicker;