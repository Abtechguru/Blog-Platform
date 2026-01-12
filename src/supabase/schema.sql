-- VERITUS INTERNATIONAL Database Schema
-- This file contains all the table definitions for the blog platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'author', 'contributor', 'reader')) DEFAULT 'reader',
  bio TEXT,
  display_name TEXT,
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- =============================================
-- ARTICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'scheduled', 'archived')) DEFAULT 'draft',
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 0,
  meta_description TEXT,
  meta_keywords TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- =============================================
-- COMMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments(is_approved);

-- =============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{"weekly_digest": true, "article_updates": true, "exclusive_content": true}'
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON newsletter_subscribers(is_active);

-- =============================================
-- MEDIA TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document')),
  size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  usage_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);

-- =============================================
-- ANALYTICS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'article_view', 'article_read', 'share', 'download')),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_article_id ON analytics(article_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET view_count = view_count + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update category article count
CREATE OR REPLACE FUNCTION update_category_article_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update old category count (if changed)
  IF TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    UPDATE categories SET article_count = article_count - 1 WHERE id = OLD.category_id;
  END IF;
  
  -- Update new category count
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
    UPDATE categories SET article_count = article_count + 1 WHERE id = NEW.category_id;
  END IF;
  
  -- Decrease count on delete
  IF TG_OP = 'DELETE' THEN
    UPDATE categories SET article_count = article_count - 1 WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_category_count ON articles;
CREATE TRIGGER update_category_count
  AFTER INSERT OR UPDATE OR DELETE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_category_article_count();

-- Function to update media usage count
CREATE OR REPLACE FUNCTION update_media_usage_count()
RETURNS void AS $$
BEGIN
  UPDATE media m
  SET usage_count = (
    SELECT COUNT(*)
    FROM articles a
    WHERE a.featured_image = m.url
       OR a.content LIKE '%' || m.url || '%'
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Public can view published articles" ON articles
  FOR SELECT USING (status = 'published');

-- Public read access for categories
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

-- Public read access for approved comments
CREATE POLICY "Public can view approved comments" ON comments
  FOR SELECT USING (is_approved = true);

-- Admin full access to all tables
CREATE POLICY "Admins have full access to users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to articles" ON articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authors can manage their own articles
CREATE POLICY "Authors can manage own articles" ON articles
  FOR ALL USING (author_id = auth.uid());

-- =============================================
-- SEED DATA
-- =============================================

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Technology', 'technology', 'Latest in tech innovation', '💻', '#3b82f6'),
  ('Business', 'business', 'Business insights and trends', '💼', '#10b981'),
  ('Science', 'science', 'Scientific discoveries', '🔬', '#8b5cf6'),
  ('Culture', 'culture', 'Arts and culture', '🎨', '#f59e0b'),
  ('Politics', 'politics', 'Political analysis', '🏛️', '#dc2626'),
  ('Health', 'health', 'Health and wellness', '🏥', '#ec4899')
ON CONFLICT (slug) DO NOTHING;

-- Insert admin user (password should be set via Supabase Auth)
INSERT INTO users (email, full_name, role, display_name, bio) VALUES
  ('admin@veritus.com', 'Admin User', 'admin', 'VERITUS Admin', 'Platform administrator')
ON CONFLICT (email) DO NOTHING;
