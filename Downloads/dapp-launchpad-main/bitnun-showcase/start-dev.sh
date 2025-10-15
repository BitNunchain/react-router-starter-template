#!/bin/bash

# BITNUN Development Server Startup Script

echo "🚀 Starting BITNUN Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating basic configuration..."
    cat > .env.local << EOF
# Basic Configuration for Development
NEXTAUTH_SECRET=bitnun_dev_secret_change_in_production_$(date +%s)
NEXTAUTH_URL=http://localhost:3000

# Demo Database Configuration (optional)
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_anon_key_placeholder
SUPABASE_SERVICE_ROLE_KEY=demo_service_key_placeholder

# Demo Payment Configuration (optional)
STRIPE_SECRET_KEY=sk_test_demo_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_demo_webhook_secret

# Demo Business Configuration
BUSINESS_EMAIL=demo@bitnun.dev
EOF
    echo "✅ Created basic .env.local configuration"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🎯 BITNUN Platform Configuration:"
echo "   • Landing Page: ✅ Available"
echo "   • Service Pages: ✅ Available" 
echo "   • Pricing Display: ✅ Available"
echo "   • Authentication: ⚠️  Configure OAuth for full functionality"
echo "   • Database: ⚠️  Configure Supabase for user data"
echo "   • Payments: ⚠️  Configure Stripe for payments"
echo ""
echo "📖 For full setup instructions, see: ENVIRONMENT_SETUP.md"
echo ""
echo "🚀 Starting development server on http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

# Start the development server
npm run dev