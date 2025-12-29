-- WebCraft Studio Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    credits INTEGER DEFAULT 500,
    role VARCHAR(20) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TEMPLATES TABLE
-- ============================================
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'header', 'footer', 'theme', 'page'
    category VARCHAR(50),      -- 'business', 'portfolio', 'ecommerce', 'blog'
    thumbnail_url VARCHAR(500),
    content JSONB NOT NULL,
    css_framework VARCHAR(50) DEFAULT 'tailwind', -- 'bootstrap', 'tailwind', 'vanilla'
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    content JSONB NOT NULL DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    template_id UUID REFERENCES templates(id),
    css_framework VARCHAR(50) DEFAULT 'tailwind',
    custom_domain VARCHAR(255),
    is_exported BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROJECT VERSIONS (Version Control)
-- ============================================
CREATE TABLE project_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, version_number)
);

-- ============================================
-- TRANSACTIONS TABLE (Credit History)
-- ============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'purchase', 'export', 'refund', 'bonus'
    amount INTEGER NOT NULL,   -- positive for credit, negative for debit
    description VARCHAR(255),
    payment_method VARCHAR(50), -- 'credit_card', 'paypal', 'bank_transfer'
    payment_status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
    reference_id VARCHAR(100), -- external payment reference
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EXPORTS TABLE
-- ============================================
CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url VARCHAR(500),
    file_size INTEGER,
    format VARCHAR(50) DEFAULT 'zip', -- 'zip', 'html'
    css_framework VARCHAR(50),
    credits_used INTEGER DEFAULT 200,
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMPONENTS TABLE (Reusable Components)
-- ============================================
CREATE TABLE components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'header', 'footer', 'hero', 'features', 'pricing', etc.
    category VARCHAR(50),
    content JSONB NOT NULL,
    thumbnail_url VARCHAR(500),
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER COMPONENTS (User Saved Components)
-- ============================================
CREATE TABLE user_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    content JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MEDIA TABLE
-- ============================================
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    file_size INTEGER,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREDIT PACKAGES TABLE
-- ============================================
CREATE TABLE credit_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_exports_user_id ON exports(user_id);
CREATE INDEX idx_exports_project_id ON exports(project_id);
CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_components_type ON components(type);

-- ============================================
-- INITIAL DATA: Credit Packages
-- ============================================
INSERT INTO credit_packages (name, credits, price, is_popular) VALUES
('Starter', 500, 4.99, FALSE),
('Popular', 1500, 9.99, TRUE),
('Professional', 5000, 24.99, FALSE),
('Enterprise', 15000, 49.99, FALSE);

-- ============================================
-- INITIAL DATA: Sample Templates
-- ============================================
INSERT INTO templates (name, type, category, content, css_framework) VALUES
('Classic Centered', 'header', 'business', '{"layout": "centered", "logo": true, "nav": ["Home", "About", "Services", "Contact"]}', 'tailwind'),
('Logo Left Nav Right', 'header', 'business', '{"layout": "split", "logo": "left", "nav": "right"}', 'tailwind'),
('Mega Menu', 'header', 'ecommerce', '{"layout": "mega", "dropdown": true}', 'tailwind'),
('Transparent Overlay', 'header', 'portfolio', '{"layout": "overlay", "transparent": true}', 'tailwind'),
('Sticky Shrink', 'header', 'business', '{"layout": "sticky", "shrink": true}', 'tailwind'),
('Modern Minimal', 'theme', 'portfolio', '{"colors": {"primary": "#000", "secondary": "#fff", "accent": "#0070f3"}, "fonts": {"heading": "Inter", "body": "Inter"}}', 'tailwind'),
('Corporate Pro', 'theme', 'business', '{"colors": {"primary": "#1a365d", "secondary": "#2d3748", "accent": "#3182ce"}, "fonts": {"heading": "Montserrat", "body": "Open Sans"}}', 'tailwind'),
('Dark Elegant', 'theme', 'portfolio', '{"colors": {"primary": "#0f0f0f", "secondary": "#1a1a1a", "accent": "#ffd700"}, "fonts": {"heading": "Playfair Display", "body": "Lato"}}', 'tailwind'),
('Glassmorphism', 'theme', 'portfolio', '{"colors": {"primary": "rgba(255,255,255,0.1)", "secondary": "rgba(255,255,255,0.05)", "accent": "#8b5cf6"}, "effects": ["blur", "glass"]}', 'tailwind'),
('Gradient Vibrant', 'theme', 'creative', '{"colors": {"primary": "#667eea", "secondary": "#764ba2", "accent": "#f093fb"}, "gradient": true}', 'tailwind');

-- ============================================
-- INITIAL DATA: Sample Components
-- ============================================
INSERT INTO components (name, type, category, content) VALUES
('Hero Section', 'hero', 'landing', '{"title": "Welcome", "subtitle": "Build amazing websites", "cta": "Get Started", "image": true}'),
('Features Grid', 'features', 'landing', '{"columns": 3, "icons": true, "items": []}'),
('Pricing Table', 'pricing', 'landing', '{"columns": 3, "popular": 1, "items": []}'),
('Contact Form', 'form', 'contact', '{"fields": ["name", "email", "message"], "submit": "Send Message"}'),
('Footer Simple', 'footer', 'general', '{"columns": 4, "social": true, "copyright": true}'),
('Testimonials', 'testimonials', 'landing', '{"layout": "carousel", "items": []}'),
('Blog Cards', 'blog', 'blog', '{"layout": "grid", "columns": 3}'),
('Gallery', 'gallery', 'portfolio', '{"layout": "masonry", "lightbox": true}'),
('Team Section', 'team', 'about', '{"layout": "grid", "columns": 4}'),
('CTA Banner', 'cta', 'landing', '{"layout": "centered", "button": true, "background": "gradient"}');

-- ============================================
-- FUNCTION: Update timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
