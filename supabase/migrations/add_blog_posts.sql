-- Migration: Add blog_posts table
-- Run this in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  reading_time_minutes INTEGER,
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Trigger: auto-update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can only read published posts
CREATE POLICY "Public can read published blog_posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (status = 'published');

-- Admin (anon + authenticated) can read all posts (including drafts)
CREATE POLICY "Anon can read all blog_posts"
  ON blog_posts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read all blog_posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Anon CRUD (admin panel uses localStorage/supabase auth)
CREATE POLICY "Anyone can insert blog_posts"
  ON blog_posts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update blog_posts"
  ON blog_posts
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete blog_posts"
  ON blog_posts
  FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Authenticated can insert blog_posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update blog_posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete blog_posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);
