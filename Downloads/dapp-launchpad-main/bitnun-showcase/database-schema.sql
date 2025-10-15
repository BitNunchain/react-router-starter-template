-- Users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  wallet_address text,
  subscription_status text default 'none',
  subscription_plan text,
  subscription_end_date timestamp with time zone,
  total_spent decimal(10,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Services table
create table public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text not null,
  price_type text not null, -- 'one_time', 'subscription', 'custom'
  base_price decimal(10,2),
  currency text default 'USD',
  features jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete cascade not null,
  status text default 'pending', -- 'pending', 'paid', 'processing', 'completed', 'cancelled'
  amount decimal(10,2) not null,
  currency text default 'USD',
  payment_method text, -- 'stripe', 'crypto'
  stripe_payment_intent_id text,
  transaction_hash text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete cascade not null,
  stripe_subscription_id text unique,
  status text not null, -- 'active', 'cancelled', 'past_due', 'unpaid'
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audit Projects table (for audit service)
create table public.audit_projects (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  project_name text not null,
  contract_address text,
  github_repo text,
  audit_type text not null, -- 'basic', 'professional', 'enterprise'
  status text default 'submitted', -- 'submitted', 'in_progress', 'completed', 'delivered'
  findings jsonb,
  report_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Academy Enrollments table
create table public.academy_enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  course_id text not null,
  order_id uuid references public.orders(id) on delete cascade,
  progress integer default 0, -- percentage completed
  status text default 'enrolled', -- 'enrolled', 'completed', 'certificate_issued'
  certificate_url text,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Revenue Tracking table
create table public.revenue_tracking (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  service_category text not null,
  gross_amount decimal(10,2) not null,
  platform_fee decimal(10,2) not null,
  net_amount decimal(10,2) not null,
  payout_status text default 'pending', -- 'pending', 'paid', 'failed'
  payout_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default services
INSERT INTO public.services (name, description, category, price_type, base_price, features) VALUES
('Basic Audit', 'Smart contract security audit for small projects', 'audit', 'one_time', 10000.00, '{"vulnerabilities": "50+", "response_time": "5-7 days", "report": "Standard"}'),
('Professional Audit', 'Comprehensive audit for medium projects', 'audit', 'one_time', 25000.00, '{"vulnerabilities": "100+", "response_time": "3-5 days", "report": "Detailed", "consultation": "1 hour"}'),
('Enterprise Audit', 'Full security assessment for large projects', 'audit', 'one_time', 50000.00, '{"vulnerabilities": "200+", "response_time": "1-3 days", "report": "Executive", "consultation": "Unlimited", "priority": "24/7"}'),

('Blockchain Fundamentals', 'Learn blockchain basics and Web3 development', 'academy', 'one_time', 299.00, '{"lessons": 40, "projects": 5, "certificate": true, "duration": "8 weeks"}'),
('DeFi Development Mastery', 'Advanced DeFi protocol development course', 'academy', 'one_time', 799.00, '{"lessons": 80, "projects": 10, "certificate": true, "duration": "16 weeks", "mentorship": "Group"}'),
('Enterprise Blockchain Program', 'Complete enterprise blockchain development', 'academy', 'one_time', 1299.00, '{"lessons": 120, "projects": 15, "certificate": true, "duration": "24 weeks", "mentorship": "1-on-1"}'),

('Starter Enterprise Solution', 'Basic enterprise blockchain integration', 'enterprise', 'custom', 100000.00, '{"development": "3 months", "team": "4 developers", "support": "Business hours", "deployment": "Single chain"}'),
('Professional Enterprise Solution', 'Comprehensive enterprise blockchain platform', 'enterprise', 'custom', 500000.00, '{"development": "6 months", "team": "8 developers", "support": "24/7", "deployment": "Multi-chain", "consulting": "Included"}'),
('Enterprise Plus Solution', 'Full-scale enterprise blockchain ecosystem', 'enterprise', 'custom', 2000000.00, '{"development": "12 months", "team": "15+ developers", "support": "Dedicated", "deployment": "Global", "consulting": "Executive", "maintenance": "2 years"}'),

('White Label Basic', 'Basic platform licensing', 'white_label', 'one_time', 50000.00, '{"setup": "Basic", "branding": "Limited", "support": "Email", "updates": "Quarterly"}'),
('White Label Professional', 'Professional platform licensing with customization', 'white_label', 'one_time', 150000.00, '{"setup": "Custom", "branding": "Full", "support": "Phone + Email", "updates": "Monthly", "training": "Included"}'),
('White Label Enterprise', 'Enterprise platform licensing with full source code', 'white_label', 'one_time', 500000.00, '{"setup": "Enterprise", "branding": "Unlimited", "support": "Dedicated team", "updates": "Weekly", "training": "On-site", "source_code": true}'),

('DeFi Protocol Insurance', 'Insurance for DeFi protocols and smart contracts', 'insurance', 'subscription', 15000.00, '{"coverage": "$10M", "protocols": "Unlimited", "claims": "Automated", "audit": "Included"}'),
('Enterprise Insurance', 'Comprehensive blockchain insurance for enterprises', 'insurance', 'subscription', 50000.00, '{"coverage": "$100M", "protocols": "Unlimited", "claims": "Priority", "audit": "Premium", "legal": "Included"}'),
('Institutional Insurance', 'Maximum coverage for institutional clients', 'insurance', 'subscription', 100000.00, '{"coverage": "$1B+", "protocols": "Unlimited", "claims": "Instant", "audit": "Real-time", "legal": "Full service", "consulting": "24/7"}'),

('Cross-Chain Bridge Builder', 'Build secure cross-chain bridges', 'cross_chain', 'one_time', 25000.00, '{"networks": "15+", "security": "Multi-sig", "monitoring": "Real-time", "support": "Email"}'),
('Cross-Chain DEX Engine', 'Deploy cross-chain decentralized exchanges', 'cross_chain', 'one_time', 100000.00, '{"networks": "20+", "features": "Advanced", "liquidity": "Optimized", "support": "Priority"}'),
('Enterprise Cross-Chain Suite', 'Complete cross-chain infrastructure', 'cross_chain', 'custom', 250000.00, '{"networks": "All major", "features": "Enterprise", "compliance": "Full", "support": "24/7", "custom": true}');

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.subscriptions enable row level security;
alter table public.audit_projects enable row level security;
alter table public.academy_enrollments enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);

create policy "Users can view own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);

create policy "Users can view own audit projects" on public.audit_projects for select using (auth.uid() = user_id);
create policy "Users can create audit projects" on public.audit_projects for insert with check (auth.uid() = user_id);

create policy "Users can view own enrollments" on public.academy_enrollments for select using (auth.uid() = user_id);