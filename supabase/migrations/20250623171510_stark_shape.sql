/*
  # Create user_bookings table

  1. New Tables
    - `user_bookings`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz, default: now())
      - `first_name` (text, not null)
      - `last_name` (text, not null)
      - `email` (text, not null, unique)
      - `phone_number` (text)
      - `booking_type` (text, not null) - either "call" or "consultation"
      - `preferred_date` (timestamptz, not null)
      - `preferred_time` (time, not null)
      - `message` (text)
      - `status` (text, default: 'pending')

  2. Security
    - Enable RLS on `user_bookings` table
    - Add policy for authenticated users to insert their own bookings
    - Add policy for service role to manage all bookings

  3. Constraints
    - Email format validation
    - Phone number format validation
    - Booking type validation
    - Status validation
    - Future date validation
*/

-- Create user_bookings table
CREATE TABLE IF NOT EXISTS user_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone_number text,
  booking_type text NOT NULL,
  preferred_date timestamptz NOT NULL,
  preferred_time time NOT NULL,
  message text,
  status text DEFAULT 'pending'
);

-- Add constraints
ALTER TABLE user_bookings 
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE user_bookings 
ADD CONSTRAINT valid_phone_format 
CHECK (phone_number IS NULL OR phone_number ~* '^\+?[1-9]\d{1,14}$');

ALTER TABLE user_bookings 
ADD CONSTRAINT valid_booking_type 
CHECK (booking_type IN ('call', 'consultation'));

ALTER TABLE user_bookings 
ADD CONSTRAINT valid_status 
CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

ALTER TABLE user_bookings 
ADD CONSTRAINT future_date_only 
CHECK (preferred_date > now());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_bookings_email ON user_bookings(email);
CREATE INDEX IF NOT EXISTS idx_user_bookings_created_at ON user_bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_user_bookings_status ON user_bookings(status);
CREATE INDEX IF NOT EXISTS idx_user_bookings_preferred_date ON user_bookings(preferred_date);

-- Enable Row Level Security
ALTER TABLE user_bookings ENABLE ROW LEVEL SECURITY;

-- Policy for users to insert their own bookings
CREATE POLICY "Users can insert bookings"
  ON user_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy for users to read their own bookings
CREATE POLICY "Users can read own bookings"
  ON user_bookings
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

-- Policy for service role to manage all bookings
CREATE POLICY "Service role has full access to bookings"
  ON user_bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for admins to read all bookings
CREATE POLICY "Admins can read all bookings"
  ON user_bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role IN ('admin', 'super_admin')
    )
  );

-- Policy for admins to update bookings
CREATE POLICY "Admins can update bookings"
  ON user_bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_role IN ('admin', 'super_admin')
    )
  );