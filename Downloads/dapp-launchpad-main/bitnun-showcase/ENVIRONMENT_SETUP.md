# BITNUN Platform - Environment Setup Guide

## 🚀 Quick Start for Development

Your BITNUN platform is ready to run, but you need to configure environment variables for full functionality.

## 📋 Environment Variables Setup

### 1. Copy the example file:
```bash
cp .env.local .env.local.backup
```

### 2. Update `.env.local` with your actual values:

#### Required for Basic Functionality:
```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# For Production Deployment:
# NEXTAUTH_URL=https://yourdomain.com
```

#### Required for Database Features:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### Required for Payment Processing:
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Your Business Account (for revenue)
BUSINESS_STRIPE_ACCOUNT_ID=acct_your_stripe_account
BUSINESS_WALLET_ADDRESS=0xYourBusinessWalletAddress
BUSINESS_EMAIL=your-business@email.com
```

## 🛠️ Step-by-Step Setup

### Option 1: Development Mode (Recommended)
Run the app with demo functionality (no database required):

1. **Generate NextAuth Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update `.env.local`:**
   ```bash
   NEXTAUTH_SECRET=your_generated_secret_from_step_1
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```

The app will run with limited functionality but all pages will work.

### Option 2: Full Production Setup

#### A. Supabase Database Setup:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Run the provided SQL schema in your Supabase SQL editor
4. Get your project URL and keys from Settings > API

#### B. Stripe Payment Setup:
1. Create a [Stripe account](https://stripe.com)
2. Get your test API keys from the dashboard
3. Set up webhook endpoints for payment processing

#### C. OAuth Providers:
1. **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth2 credentials
   - Add your domain to authorized origins

2. **GitHub OAuth:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth app
   - Set callback URL to: `http://localhost:3000/api/auth/callback/github`

## 🎯 Feature Availability by Configuration

| Feature | Requirements | Status |
|---------|-------------|---------|
| **Landing Page** | None | ✅ Always Available |
| **Service Pages** | None | ✅ Always Available |
| **Pricing Display** | None | ✅ Always Available |
| **User Authentication** | NextAuth Secret | ✅ With Google/GitHub |
| **User Dashboard** | Supabase + Auth | ⚠️ Limited without DB |
| **Payment Processing** | Stripe + Auth | ⚠️ Requires Stripe setup |
| **Audit Submissions** | Full Setup | ⚠️ Requires all services |

## 🔧 Troubleshooting

### Common Issues:

1. **"supabaseKey is required" error:**
   - The app is trying to connect to Supabase with demo keys
   - Either set up real Supabase keys or ignore this error for development

2. **Authentication not working:**
   - Check your NEXTAUTH_SECRET is set
   - Verify OAuth provider configurations

3. **Payment processing fails:**
   - Ensure Stripe keys are correctly set
   - Check webhook endpoints are configured

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set up production Supabase instance
- [ ] Configure production Stripe account
- [ ] Set up OAuth providers for your domain
- [ ] Update NEXTAUTH_URL to your production domain
- [ ] Set all environment variables in your deployment platform
- [ ] Run database migrations
- [ ] Test payment flows
- [ ] Set up monitoring and error tracking

## 💡 Development Tips

1. **Start Simple:** Begin with just NextAuth setup to test authentication
2. **Add Services Gradually:** Add Supabase, then Stripe, then additional features
3. **Use Test Data:** The app gracefully handles missing services with demo data
4. **Monitor Logs:** Check console for configuration warnings and errors

## 📞 Need Help?

Your BITNUN platform is designed to work even without full configuration. Start with basic setup and add features as needed!