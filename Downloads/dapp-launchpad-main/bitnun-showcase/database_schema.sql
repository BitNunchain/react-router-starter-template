-- =============================================
-- BITNUN DATABASE SCHEMA
-- Supabase Database Setup Script
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'none',
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  credits_balance INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  email_verified BOOLEAN DEFAULT false,
  phone_number TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'user', -- user, admin, enterprise
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =============================================
-- 2. AUDIT PROJECTS TABLE
-- =============================================
CREATE TABLE audit_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  contract_address TEXT,
  blockchain_network TEXT DEFAULT 'ethereum',
  project_type TEXT NOT NULL, -- token, defi, nft, dao, gaming, etc.
  project_description TEXT,
  github_repo TEXT,
  documentation_url TEXT,
  contract_source_code TEXT,
  audit_scope TEXT[], -- array of contract files/functions to audit
  priority_level TEXT DEFAULT 'standard', -- standard, priority, express
  status TEXT DEFAULT 'pending', -- pending, in_review, in_progress, completed, failed
  audit_report_url TEXT,
  security_score INTEGER, -- 0-100 security score
  vulnerabilities_found INTEGER DEFAULT 0,
  critical_issues INTEGER DEFAULT 0,
  medium_issues INTEGER DEFAULT 0,
  low_issues INTEGER DEFAULT 0,
  gas_optimization_suggestions TEXT[],
  estimated_completion DATE,
  actual_completion DATE,
  auditor_notes TEXT,
  client_feedback TEXT,
  audit_price DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =============================================
-- 3. ORDERS TABLE
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- audit, development, consulting, academy, etc.
  service_name TEXT NOT NULL,
  service_description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending', -- pending, paid, processing, completed, cancelled, refunded
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  payment_method TEXT, -- card, crypto, bank_transfer
  billing_address JSONB,
  service_details JSONB, -- flexible field for service-specific data
  delivery_date DATE,
  completion_date DATE,
  refund_amount DECIMAL(10,2) DEFAULT 0.00,
  refund_reason TEXT,
  invoice_number TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =============================================
-- 4. ACADEMY ENROLLMENTS TABLE
-- =============================================
CREATE TABLE academy_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  course_type TEXT DEFAULT 'online', -- online, workshop, certification
  enrollment_status TEXT DEFAULT 'enrolled', -- enrolled, in_progress, completed, dropped
  progress_percentage INTEGER DEFAULT 0,
  current_lesson INTEGER DEFAULT 1,
  total_lessons INTEGER,
  completion_certificate_url TEXT,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  completion_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  price_paid DECIMAL(10,2),
  payment_status TEXT DEFAULT 'paid',
  instructor_feedback TEXT,
  student_rating INTEGER, -- 1-5 stars
  student_review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =============================================
-- 5. SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL, -- basic, pro, enterprise, academy
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- active, cancelled, expired, paused
  stripe_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  monthly_price DECIMAL(10,2),
  yearly_price DECIMAL(10,2),
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly
  features JSONB, -- json object with enabled features
  usage_limits JSONB, -- json object with usage limits
  current_usage JSONB, -- json object with current usage
  trial_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =============================================
-- 6. PROJECT DEPLOYMENTS TABLE
-- =============================================
CREATE TABLE project_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL, -- defi, nft, dao, token, dapp
  blockchain_network TEXT NOT NULL,
  contract_address TEXT,
  deployment_status TEXT DEFAULT 'pending', -- pending, deploying, deployed, failed
  transaction_hash TEXT,
  gas_used BIGINT,
  deployment_cost DECIMAL(18,8), -- in ETH or native token
  contract_source_code TEXT,
  constructor_arguments JSONB,
  verification_status TEXT DEFAULT 'pending', -- pending, verified, failed
  frontend_url TEXT,
  documentation_url TEXT,
  github_repo TEXT,
  deployment_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =============================================
-- 7. SUPPORT TICKETS TABLE
-- =============================================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- technical, billing, general, feature_request
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  assigned_to TEXT, -- admin/support staff email
  resolution TEXT,
  attachments TEXT[], -- array of file URLs
  client_satisfaction INTEGER, -- 1-5 rating
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =============================================
-- 8. NOTIFICATION PREFERENCES TABLE
-- =============================================
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT true,
  audit_updates BOOLEAN DEFAULT true,
  payment_confirmations BOOLEAN DEFAULT true,
  academy_progress BOOLEAN DEFAULT true,
  security_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);

-- Audit projects indexes
CREATE INDEX idx_audit_projects_user_id ON audit_projects(user_id);
CREATE INDEX idx_audit_projects_status ON audit_projects(status);
CREATE INDEX idx_audit_projects_created_at ON audit_projects(created_at);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_stripe_payment_intent_id ON orders(stripe_payment_intent_id);

-- Academy enrollments indexes
CREATE INDEX idx_academy_enrollments_user_id ON academy_enrollments(user_id);
CREATE INDEX idx_academy_enrollments_course_id ON academy_enrollments(course_id);
CREATE INDEX idx_academy_enrollments_status ON academy_enrollments(enrollment_status);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Project deployments indexes
CREATE INDEX idx_project_deployments_user_id ON project_deployments(user_id);
CREATE INDEX idx_project_deployments_status ON project_deployments(deployment_status);

-- Support tickets indexes
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_number ON support_tickets(ticket_number);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Audit projects policies
CREATE POLICY "Users can view their own audit projects" ON audit_projects FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own audit projects" ON audit_projects FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own audit projects" ON audit_projects FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Academy enrollments policies
CREATE POLICY "Users can view their own enrollments" ON academy_enrollments FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own enrollments" ON academy_enrollments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own enrollments" ON academy_enrollments FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid()::text = user_id::text);

-- Project deployments policies
CREATE POLICY "Users can view their own deployments" ON project_deployments FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own deployments" ON project_deployments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own deployments" ON project_deployments FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON support_tickets FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own tickets" ON support_tickets FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Notification preferences policies
CREATE POLICY "Users can view their own preferences" ON notification_preferences FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own preferences" ON notification_preferences FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own preferences" ON notification_preferences FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audit_projects_updated_at BEFORE UPDATE ON audit_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academy_enrollments_updated_at BEFORE UPDATE ON academy_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_deployments_updated_at BEFORE UPDATE ON project_deployments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample service types for reference
-- (This would be done through the application, but included for reference)

-- =============================================
-- COMPLETED SUCCESSFULLY
-- =============================================
-- Database schema created successfully!
-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify all tables are created
-- 3. Test with sample data
-- 4. Update application to use real database