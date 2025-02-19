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
  points decimal NOT NULL,
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own entries"
  ON entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own entries"
  ON entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);