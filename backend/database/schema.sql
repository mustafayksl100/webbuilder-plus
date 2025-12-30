-- WebCraft Studio Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS templates (
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
CREATE TABLE IF NOT EXISTS projects (
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
CREATE TABLE IF NOT EXISTS project_versions (
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
CREATE TABLE IF NOT EXISTS transactions (
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
CREATE TABLE IF NOT EXISTS exports (
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
CREATE TABLE IF NOT EXISTS components (
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
CREATE TABLE IF NOT EXISTS user_components (
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
CREATE TABLE IF NOT EXISTS media (
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
CREATE TABLE IF NOT EXISTS credit_packages (
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
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_exports_user_id ON exports(user_id);
CREATE INDEX IF NOT EXISTS idx_exports_project_id ON exports(project_id);
CREATE INDEX IF NOT EXISTS idx_media_user_id ON media(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type);
CREATE INDEX IF NOT EXISTS idx_components_type ON components(type);

-- ============================================
-- INITIAL DATA: Seed User (mustafa@gmail.com)
-- ============================================
INSERT INTO users (email, password_hash, full_name, credits, role, is_verified) 
SELECT 'mustafa@gmail.com', '$2a$10$wdhqDxzf4H.g0OUZ8QQyPfTgeqasIeOO/FqDsCocQW.HG9HP', 'Mustafa Yüksel', 1000, 'user', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'mustafa@gmail.com');

-- ============================================
-- INITIAL DATA: Credit Packages
-- ============================================
INSERT INTO credit_packages (name, credits, price, is_popular) 
SELECT 'Starter', 500, 4.99, FALSE
WHERE NOT EXISTS (SELECT 1 FROM credit_packages WHERE name = 'Starter');

INSERT INTO credit_packages (name, credits, price, is_popular) 
SELECT 'Popular', 1500, 9.99, TRUE
WHERE NOT EXISTS (SELECT 1 FROM credit_packages WHERE name = 'Popular');

INSERT INTO credit_packages (name, credits, price, is_popular) 
SELECT 'Professional', 5000, 24.99, FALSE
WHERE NOT EXISTS (SELECT 1 FROM credit_packages WHERE name = 'Professional');

INSERT INTO credit_packages (name, credits, price, is_popular) 
SELECT 'Enterprise', 15000, 49.99, FALSE
WHERE NOT EXISTS (SELECT 1 FROM credit_packages WHERE name = 'Enterprise');

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
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
