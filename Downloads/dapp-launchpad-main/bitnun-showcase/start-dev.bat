@echo off
echo 🚀 Starting BITNUN Platform...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  .env.local not found. Creating basic configuration...
    
    echo # Basic Configuration for Development > .env.local
    echo NEXTAUTH_SECRET=bitnun_dev_secret_change_in_production_%random% >> .env.local
    echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
    echo. >> .env.local
    echo # Demo Database Configuration (optional) >> .env.local
    echo NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co >> .env.local
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_anon_key_placeholder >> .env.local
    echo SUPABASE_SERVICE_ROLE_KEY=demo_service_key_placeholder >> .env.local
    echo. >> .env.local
    echo # Demo Payment Configuration (optional) >> .env.local
    echo STRIPE_SECRET_KEY=sk_test_demo_stripe_secret_key >> .env.local
    echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo_stripe_publishable_key >> .env.local
    echo STRIPE_WEBHOOK_SECRET=whsec_demo_webhook_secret >> .env.local
    echo. >> .env.local
    echo # Demo Business Configuration >> .env.local
    echo BUSINESS_EMAIL=demo@bitnun.dev >> .env.local
    
    echo ✅ Created basic .env.local configuration
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo.
echo 🎯 BITNUN Platform Configuration:
echo    • Landing Page: ✅ Available
echo    • Service Pages: ✅ Available
echo    • Pricing Display: ✅ Available
echo    • Authentication: ⚠️  Configure OAuth for full functionality
echo    • Database: ⚠️  Configure Supabase for user data
echo    • Payments: ⚠️  Configure Stripe for payments
echo.
echo 📖 For full setup instructions, see: ENVIRONMENT_SETUP.md
echo.
echo 🚀 Starting development server on http://localhost:3000
echo    Press Ctrl+C to stop
echo.

REM Start the development server
npm run dev