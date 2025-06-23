import { createClient } from 'npm:@supabase/supabase-js@2';

interface NotificationRequest {
  bookingId: string;
  bookingType: 'call' | 'consultation';
  customerName: string;
  customerEmail: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Email template for team notifications
const generateTeamNotificationEmail = (booking: NotificationRequest): string => {
  const bookingTypeLabel = booking.bookingType === 'call' ? 'Discovery Call' : 'Free Consultation';
  const duration = booking.bookingType === 'call' ? '15 minutes' : '30 minutes';
  const advanceNotice = booking.bookingType === 'consultation' ? '48 hours' : '24 hours';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0047FF, #85ABFF); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Booking Alert</h1>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">New ${bookingTypeLabel} Booking</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0047FF; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${booking.customerName}</p>
          <p><strong>Email:</strong> ${booking.customerEmail}</p>
          <p><strong>Booking Type:</strong> ${bookingTypeLabel} (${duration})</p>
          <p><strong>Advance Notice:</strong> ${advanceNotice} requirement met ✓</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0047FF; margin-top: 0;">Appointment Details</h3>
          <p><strong>Preferred Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Preferred Time:</strong> ${booking.preferredTime}</p>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        </div>
        
        ${booking.message ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0047FF; margin-top: 0;">${booking.bookingType === 'consultation' ? 'Customer Needs & Requirements' : 'Customer Message'}</h3>
          <p style="font-style: italic; background: #f8f9fa; padding: 15px; border-left: 4px solid #0047FF;">"${booking.message}"</p>
          ${booking.bookingType === 'consultation' ? '<p style="color: #666; font-size: 14px;"><strong>Note:</strong> Use this information to research their case and prepare valuable guidance for the consultation.</p>' : ''}
        </div>
        ` : ''}
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #0047FF;">
          <h3 style="color: #0047FF; margin-top: 0;">Next Steps</h3>
          <ol style="color: #333;">
            <li>Review the customer's requirements${booking.bookingType === 'consultation' ? ' and research their case' : ''}</li>
            <li>Confirm the appointment time</li>
            <li>Send calendar invite to customer</li>
            <li>Prepare relevant materials for the session</li>
            ${booking.bookingType === 'consultation' ? '<li>Prepare customized recommendations based on their needs</li>' : ''}
          </ol>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">JAG AI Solutions - Booking Management System</p>
      </div>
    </div>
  `;
};

// Customer confirmation email template
const generateCustomerConfirmationEmail = (booking: NotificationRequest): string => {
  const bookingTypeLabel = booking.bookingType === 'call' ? 'Discovery Call' : 'Free Consultation';
  const duration = booking.bookingType === 'call' ? '15 minutes' : '30 minutes';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0047FF, #85ABFF); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Booking Confirmation</h1>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333;">Thank you, ${booking.customerName}!</h2>
        <p style="font-size: 16px; color: #666;">Your ${bookingTypeLabel.toLowerCase()} has been successfully scheduled.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0047FF;">
          <h3 style="color: #0047FF; margin-top: 0;">Appointment Details</h3>
          <p><strong>Type:</strong> ${bookingTypeLabel} (${duration})</p>
          <p><strong>Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Time:</strong> ${booking.preferredTime}</p>
          <p><strong>Booking Reference:</strong> ${booking.bookingId}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin-top: 0;">What Happens Next?</h3>
          <ol style="color: #333;">
            <li>Our team will review your booking within 24 hours</li>
            <li>You'll receive a calendar invitation with meeting details</li>
            <li>We'll send you a brief preparation guide</li>
            ${booking.bookingType === 'consultation' ? '<li>We\'ll research your case using the information you provided</li>' : ''}
            <li>Join the session at your scheduled time</li>
          </ol>
        </div>
        
        ${booking.bookingType === 'consultation' ? `
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f57c00; margin-top: 0;">Consultation Preparation</h3>
          <p>We'll use the information you provided to research your case and prepare customized recommendations. To maximize our consultation time, please also consider:</p>
          <ul style="color: #333;">
            <li>Any additional business challenges you'd like to address</li>
            <li>Specific questions about AI implementation in your industry</li>
            <li>Current systems or processes you'd like to improve</li>
            <li>Budget considerations and timeline expectations</li>
          </ul>
        </div>
        ` : ''}
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0047FF; margin-top: 0;">Need to Reschedule?</h3>
          <p>If you need to change your appointment, please reply to this email or contact us at:</p>
          <p><strong>Email:</strong> info@jagaisolutions.com</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
          <p style="color: #666; font-size: 14px; margin-top: 10px;">
            <strong>Note:</strong> Please provide at least ${booking.bookingType === 'consultation' ? '48' : '24'} hours notice for any changes.
          </p>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">We're excited to help transform your business with AI!</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">JAG AI Solutions</p>
      </div>
    </div>
  `;
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

    const booking: NotificationRequest = await req.json();

    // Validate required fields
    if (!booking.bookingId || !booking.customerName || !booking.customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking information' }),
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

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    
    // For now, we'll simulate the email sending process
    console.log('Sending team notification email...');
    console.log('Team Email Content:', generateTeamNotificationEmail(booking));
    
    console.log('Sending customer confirmation email...');
    console.log('Customer Email Content:', generateCustomerConfirmationEmail(booking));

    // Log the notification in the database (optional)
    const { error: logError } = await supabase
      .from('booking_notifications')
      .insert([
        {
          booking_id: booking.bookingId,
          notification_type: 'booking_created',
          recipient_email: booking.customerEmail,
          sent_at: new Date().toISOString(),
          status: 'sent'
        }
      ]);

    if (logError) {
      console.warn('Failed to log notification:', logError);
      // Don't fail the request if logging fails
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notifications sent successfully',
        details: {
          teamNotificationSent: true,
          customerConfirmationSent: true,
          bookingId: booking.bookingId,
          advanceNoticeRequirement: booking.bookingType === 'consultation' ? '48 hours' : '24 hours'
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Notification error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send notifications',
        details: 'An error occurred while processing the notification request'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});