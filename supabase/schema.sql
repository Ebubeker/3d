-- Supabase Schema for Virtuality Fashion Admin Panel
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  portrait TEXT,
  languages TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Items Table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_team_member ON portfolio_items(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_members_name ON team_members(name);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on team_members
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read access for team_members
CREATE POLICY "Public can read team_members"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

-- Public read access for portfolio_items
CREATE POLICY "Public can read portfolio_items"
  ON portfolio_items
  FOR SELECT
  TO public
  USING (true);

-- Allow anonymous insert for team_members (admin panel uses localStorage auth)
CREATE POLICY "Anyone can insert team_members"
  ON team_members
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous update for team_members
CREATE POLICY "Anyone can update team_members"
  ON team_members
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous delete for team_members
CREATE POLICY "Anyone can delete team_members"
  ON team_members
  FOR DELETE
  TO anon
  USING (true);

-- Allow anonymous insert for portfolio_items
CREATE POLICY "Anyone can insert portfolio_items"
  ON portfolio_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous update for portfolio_items
CREATE POLICY "Anyone can update portfolio_items"
  ON portfolio_items
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous delete for portfolio_items
CREATE POLICY "Anyone can delete portfolio_items"
  ON portfolio_items
  FOR DELETE
  TO anon
  USING (true);

-- Authenticated users can insert team_members
CREATE POLICY "Authenticated users can insert team_members"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update team_members
CREATE POLICY "Authenticated users can update team_members"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete team_members
CREATE POLICY "Authenticated users can delete team_members"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (true);

-- Authenticated users can insert portfolio_items
CREATE POLICY "Authenticated users can insert portfolio_items"
  ON portfolio_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update portfolio_items
CREATE POLICY "Authenticated users can update portfolio_items"
  ON portfolio_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete portfolio_items
CREATE POLICY "Authenticated users can delete portfolio_items"
  ON portfolio_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Storage bucket for images
-- Run these commands to create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the images bucket
CREATE POLICY "Public can view images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- Allow anonymous uploads (for admin panel without full auth)
CREATE POLICY "Anyone can upload images"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can update images"
  ON storage.objects
  FOR UPDATE
  TO anon
  USING (bucket_id = 'images');

CREATE POLICY "Anyone can delete images"
  ON storage.objects
  FOR DELETE
  TO anon
  USING (bucket_id = 'images');

-- Sample data (optional - uncomment to insert)
/*
INSERT INTO team_members (name, role, location, bio, languages, specialties, tools, years_experience) VALUES
(
  'Sarah Chen',
  'Senior 3D Designer',
  'New York, USA',
  'Sarah brings over 8 years of experience in digital fashion design. She has worked with major brands including Nike, Adidas, and Zara on their 3D prototyping initiatives.',
  ARRAY['English', 'Mandarin'],
  ARRAY['Sportswear', 'Activewear', 'Footwear'],
  ARRAY['CLO3D', 'Browzwear', 'Adobe Illustrator', 'Photoshop'],
  8
),
(
  'Marco Rossi',
  'Technical Designer',
  'Milan, Italy',
  'Marco specializes in luxury fashion technical design with a focus on tailoring and construction details. His background includes 6 years at Gucci and Prada.',
  ARRAY['English', 'Italian', 'French'],
  ARRAY['Luxury Fashion', 'Tailoring', 'Outerwear'],
  ARRAY['Gerber AccuMark', 'Adobe Illustrator', 'CLO3D'],
  10
),
(
  'Emma Thompson',
  '3D Visualization Specialist',
  'London, UK',
  'Emma creates photorealistic renders and virtual showrooms for fashion brands. She combines her background in photography with cutting-edge 3D technology.',
  ARRAY['English'],
  ARRAY['Product Visualization', 'Virtual Showrooms', 'E-commerce Assets'],
  ARRAY['Marvelous Designer', 'Blender', 'KeyShot', 'Photoshop'],
  5
);
*/
