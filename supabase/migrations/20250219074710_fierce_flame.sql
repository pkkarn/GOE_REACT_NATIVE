/*
  # Create entries table for Yuga Tracker

  1. New Tables
    - `entries`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `hours` (decimal)
      - `description` (text)
      - `points` (decimal)

  2. Security
    - Enable RLS on `entries` table
    - Add policies for authenticated users to manage their entries
*/

CREATE TABLE IF NOT EXISTS entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  hours decimal NOT NULL CHECK (hours >= 0 AND hours <= 10),
  description text NOT NULL,
  points decimal NOT NULL
);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Allow public access for this local version
CREATE POLICY "Allow public access to entries"
  ON entries
  FOR ALL
  USING (true)
  WITH CHECK (true);