-- Simple database setup for testing UPI payment links
-- This creates minimal tables needed for the UPI payment link feature

-- Create users table (minimal for testing)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table (minimal for testing)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create groups table (minimal for testing)
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UPI payment links table
CREATE TABLE IF NOT EXISTS upi_payment_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_code VARCHAR(20) UNIQUE NOT NULL,
    upi_id VARCHAR(100) NOT NULL,
    payee_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'INR',
    message TEXT,
    transaction_note TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    click_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    allow_custom_amount BOOLEAN DEFAULT false,
    min_amount DECIMAL(12, 2),
    max_amount DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UPI payment link analytics table
CREATE TABLE IF NOT EXISTS upi_link_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upi_link_id UUID NOT NULL REFERENCES upi_payment_links(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_upi_payment_links_short_code ON upi_payment_links(short_code);
CREATE INDEX IF NOT EXISTS idx_upi_payment_links_created_by ON upi_payment_links(created_by);
CREATE INDEX IF NOT EXISTS idx_upi_link_analytics_upi_link_id ON upi_link_analytics(upi_link_id);

-- Insert test data
INSERT INTO users (id, email, name) VALUES 
('test-user-id', 'test@example.com', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_upi_payment_links_updated_at ON upi_payment_links;
CREATE TRIGGER update_upi_payment_links_updated_at 
    BEFORE UPDATE ON upi_payment_links 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 