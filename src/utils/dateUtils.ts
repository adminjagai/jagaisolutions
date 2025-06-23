export interface TimeSlot {
  value: string;
  label: string;
  available: boolean;
}

export interface Holiday {
  date: string;
  name: string;
}

// Major US holidays for the current and next year
export const getHolidays = (year: number): Holiday[] => {
  return [
    { date: `${year}-01-01`, name: "New Year's Day" },
    { date: `${year}-05-29`, name: "Memorial Day" }, // Last Monday in May (approximate)
    { date: `${year}-07-04`, name: "Independence Day" },
    { date: `${year}-09-04`, name: "Labor Day" }, // First Monday in September (approximate)
    { date: `${year}-11-23`, name: "Thanksgiving Day" }, // Fourth Thursday in November (approximate)
    { date: `${year}-12-25`, name: "Christmas Day" },
  ];
};

// Get all holidays for current and next year
export const getAllHolidays = (): Holiday[] => {
  const currentYear = new Date().getFullYear();
  return [
    ...getHolidays(currentYear),
    ...getHolidays(currentYear + 1),
  ];
};

// Check if a date is a weekend (Saturday or Sunday)
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

// Check if a date is a holiday
export const isHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split('T')[0];
  return getAllHolidays().some(holiday => holiday.date === dateString);
};

// Check if a date is available for booking with different advance notice requirements
export const isDateAvailable = (date: Date, bookingType: 'call' | 'consultation' = 'call'): boolean => {
  const now = new Date();
  const advanceHours = bookingType === 'consultation' ? 48 : 24;
  const minBookingTime = new Date(now);
  minBookingTime.setHours(now.getHours() + advanceHours);
  minBookingTime.setHours(0, 0, 0, 0); // Start of the minimum booking day
  
  // Must meet advance notice requirement
  if (date < minBookingTime) return false;
  
  // Cannot be weekend
  if (isWeekend(date)) return false;
  
  // Cannot be holiday
  if (isHoliday(date)) return false;
  
  return true;
};

// Get available dates for the next 60 days with booking type consideration
export const getAvailableDates = (bookingType: 'call' | 'consultation' = 'call'): Date[] => {
  const dates: Date[] = [];
  const now = new Date();
  const advanceHours = bookingType === 'consultation' ? 48 : 24;
  const startDate = new Date(now);
  startDate.setHours(now.getHours() + advanceHours);
  startDate.setHours(0, 0, 0, 0); // Start of the minimum booking day
  
  for (let i = 0; i < 90; i++) { // Check 90 days to ensure we get enough available dates
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    if (isDateAvailable(date, bookingType)) {
      dates.push(date);
    }
    
    // Stop when we have 60 available dates
    if (dates.length >= 60) break;
  }
  
  return dates;
};

// Generate time slots for business hours (9 AM - 5 PM) with booking type consideration
export const generateTimeSlots = (selectedDate: string, bookingType: 'call' | 'consultation' = 'call'): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  const selectedDateTime = new Date(selectedDate);
  const advanceHours = bookingType === 'consultation' ? 48 : 24;
  
  // Business hours: 9 AM to 5 PM (17:00)
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const slotDateTime = new Date(`${selectedDate}T${timeString}`);
      
      // Check if slot meets advance notice requirement
      const minBookingTime = new Date(now);
      minBookingTime.setHours(now.getHours() + advanceHours);
      
      const available = slotDateTime > minBookingTime;
      
      // Format time for display (12-hour format)
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
      
      slots.push({
        value: timeString,
        label: displayTime,
        available,
      });
    }
  }
  
  return slots;
};

// Get user's timezone
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Format date for display
export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Get holiday name for a date (if it's a holiday)
export const getHolidayName = (date: Date): string | null => {
  const dateString = date.toISOString().split('T')[0];
  const holiday = getAllHolidays().find(h => h.date === dateString);
  return holiday ? holiday.name : null;
};

// Get advance notice requirement text
export const getAdvanceNoticeText = (bookingType: 'call' | 'consultation'): string => {
  return bookingType === 'consultation' 
    ? 'at least 48 hours in advance' 
    : 'at least 24 hours in advance';
};