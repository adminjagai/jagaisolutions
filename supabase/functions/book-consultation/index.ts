import { createClient } from 'npm:@supabase/supabase-js@2';

interface BookingRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  bookingType: 'call' | 'consultation';
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

const validateFutureDate = (dateString: string, timeString: string): boolean => {
  try {
    const combinedDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    return combinedDateTime > now;
  } catch {
    return false;
  }
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const body: BookingRequest = await req.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.bookingType || !body.preferredDate || !body.preferredTime) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: 'firstName, lastName, email, bookingType, preferredDate, and preferredTime are required'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate phone number format (if provided)
    if (body.phoneNumber && !validatePhoneNumber(body.phoneNumber)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate booking type
    if (!['call', 'consultation'].includes(body.bookingType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid booking type. Must be "call" or "consultation"' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate future date
    if (!validateFutureDate(body.preferredDate, body.preferredTime)) {
      return new Response(
        JSON.stringify({ error: 'Preferred date and time must be in the future' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Sanitize inputs
    const sanitizedData = {
      first_name: sanitizeInput(body.firstName),
      last_name: sanitizeInput(body.lastName),
      email: sanitizeInput(body.email.toLowerCase()),
      phone_number: body.phoneNumber ? sanitizeInput(body.phoneNumber) : null,
      booking_type: body.bookingType,
      preferred_date: `${body.preferredDate}T${body.preferredTime}:00.000Z`,
      preferred_time: body.preferredTime,
      message: body.message ? sanitizeInput(body.message) : null,
      status: 'pending'
    };

    // Insert booking into database
    const { data, error } = await supabase
      .from('user_bookings')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ 
            error: 'A booking with this email already exists',
            details: 'Please use a different email address or contact support to modify your existing booking'
          }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          error: 'Failed to create booking',
          details: 'Please try again later or contact support'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking created successfully',
        booking: {
          id: data.id,
          bookingType: data.booking_type,
          preferredDate: data.preferred_date,
          status: data.status
        }
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'An unexpected error occurred. Please try again later.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});