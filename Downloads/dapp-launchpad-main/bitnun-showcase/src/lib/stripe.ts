import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export const BUSINESS_STRIPE_ACCOUNT = process.env.BUSINESS_STRIPE_ACCOUNT_ID!
export const BUSINESS_WALLET_ADDRESS = process.env.BUSINESS_WALLET_ADDRESS!

// ULTRA-COMPETITIVE FLOOR PRICING - 20-30% BELOW CHEAPEST COMPETITORS
type ServiceConfig = {
  price: number
  currency: string
  name: string
  interval?: 'month' | 'year'
  eth_price?: number  // For ETH-based pricing
  tier?: 'free' | 'lite' | 'standard' | 'advanced' | 'enterprise'
}

export const SERVICE_PRICES: Record<string, ServiceConfig> = {
  // AUDITS - Aggressive floor pricing with clear scopes
  'audit_free': { price: 0, currency: 'usd', name: 'Free Audit (Automated Only)', tier: 'free' },
  'audit_lite': { price: 99, currency: 'usd', name: 'Lite Audit (Auto + Checklist)', tier: 'lite' },
  'audit_standard': { price: 349, currency: 'usd', name: 'Standard Audit (Manual Review)', tier: 'standard' },
  'audit_advanced': { price: 699, currency: 'usd', name: 'Advanced Audit (Deep Analysis)', tier: 'advanced' },
  
  // ACADEMY - Unmatched freemium pricing
  'academy_free': { price: 0, currency: 'usd', name: 'Free Tier (3 lessons/month)', tier: 'free', interval: 'month' },
  'academy_monthly': { price: 5, currency: 'usd', name: 'BITNUN Academy Pro', tier: 'standard', interval: 'month' },
  'blockchain_basics': { price: 19, currency: 'usd', name: 'Blockchain Fundamentals', tier: 'lite' },
  'defi_masterclass': { price: 49, currency: 'usd', name: 'DeFi Development', tier: 'standard' },
  'enterprise_bootcamp': { price: 79, currency: 'usd', name: 'Enterprise Blockchain', tier: 'advanced' },
  
  // LAUNCHPAD - ETH-based competitive pricing
  'launchpad_starter': { price: 800, currency: 'usd', eth_price: 0.29, name: 'Starter Launchpad', tier: 'lite' }, // ~0.29 ETH
  'launchpad_pro': { price: 1100, currency: 'usd', eth_price: 0.4, name: 'Pro Launchpad', tier: 'standard' }, // ~0.4 ETH
  'launchpad_enterprise': { price: 1650, currency: 'usd', eth_price: 0.6, name: 'Enterprise Launchpad', tier: 'advanced' }, // ~0.6 ETH
  
  // NFT CREATOR - Ultra-competitive per deploy
  'nft_free': { price: 0, currency: 'usd', name: 'Free NFT Deploy (1/month)', tier: 'free' },
  'nft_basic': { price: 110, currency: 'usd', eth_price: 0.04, name: 'Basic NFT Deploy', tier: 'lite' }, // ~0.04 ETH
  'nft_pro': { price: 138, currency: 'usd', eth_price: 0.05, name: 'Pro NFT + Marketplace', tier: 'standard' }, // ~0.05 ETH
  'nft_unlimited': { price: 25, currency: 'usd', name: 'Unlimited NFT Plan', tier: 'standard', interval: 'month' },
  
  // DEFI GENERATOR - Hardened templates, L2 focused
  'defi_free': { price: 0, currency: 'usd', name: 'Free DeFi Template', tier: 'free' },
  'defi_basic': { price: 5225, currency: 'usd', eth_price: 1.9, name: 'Basic DeFi (DEX/Staking)', tier: 'standard' }, // ~1.9 ETH
  'defi_advanced': { price: 6600, currency: 'usd', eth_price: 2.4, name: 'Advanced DeFi Suite', tier: 'advanced' }, // ~2.4 ETH
  
  // ENTERPRISE - Fixed scope MVPs
  'enterprise_mvp_dex': { price: 1499, currency: 'usd', name: 'DEX MVP (Fixed Scope)', tier: 'lite' },
  'enterprise_mvp_nft': { price: 2499, currency: 'usd', name: 'NFT Marketplace MVP', tier: 'standard' },
  'enterprise_mvp_staking': { price: 3499, currency: 'usd', name: 'Staking Platform MVP', tier: 'standard' },
  'enterprise_custom': { price: 9999, currency: 'usd', name: 'Custom Enterprise Solution', tier: 'enterprise' },
  
  // WHITE LABEL - Setup + support credits model
  'white_label_basic': { price: 499, currency: 'usd', name: 'Basic White Label Setup', tier: 'lite' },
  'white_label_pro': { price: 1499, currency: 'usd', name: 'Pro White Label + Support', tier: 'standard' },
  'white_label_enterprise': { price: 4999, currency: 'usd', name: 'Enterprise White Label', tier: 'enterprise' },
  
  // INSURANCE - Transparent caps, automated claims
  'insurance_basic': { price: 39, currency: 'usd', name: 'Basic Protocol Insurance', tier: 'lite', interval: 'month' },
  'insurance_pro': { price: 149, currency: 'usd', name: 'Pro Multi-Protocol Insurance', tier: 'standard', interval: 'month' },
  'insurance_enterprise': { price: 399, currency: 'usd', name: 'Enterprise Insurance Suite', tier: 'enterprise', interval: 'month' },
  
  // CROSS-CHAIN TOOLS - Audited presets, safe defaults
  'crosschain_free': { price: 0, currency: 'usd', name: 'Free Bridge Template', tier: 'free' },
  'crosschain_basic': { price: 149, currency: 'usd', name: 'Basic Cross-Chain Tool', tier: 'lite' },
  'crosschain_pro': { price: 399, currency: 'usd', name: 'Pro Cross-Chain Suite', tier: 'standard' },
  'crosschain_enterprise': { price: 799, currency: 'usd', name: 'Enterprise Cross-Chain', tier: 'advanced' },
  
  // LEGACY COMPATIBILITY (keep old keys for existing integrations)
  'basic_audit': { price: 99, currency: 'usd', name: 'Basic Smart Contract Audit', tier: 'lite' },
  'professional_audit': { price: 349, currency: 'usd', name: 'Professional Smart Contract Audit', tier: 'standard' },
  'enterprise_audit': { price: 699, currency: 'usd', name: 'Enterprise Smart Contract Audit', tier: 'advanced' },
}

// Platform fee percentage (your revenue cut)
export const PLATFORM_FEE_PERCENTAGE = 0.97 // You keep 97%, 3% for processing

// Create payment intent for one-time payments
export async function createPaymentIntent(
  serviceKey: keyof typeof SERVICE_PRICES,
  userEmail: string,
  metadata?: any
) {
  const service = SERVICE_PRICES[serviceKey]
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: service.price * 100, // Convert to cents
    currency: service.currency,
    metadata: {
      service_key: serviceKey,
      service_name: service.name,
      user_email: userEmail,
      ...metadata,
    },
    transfer_data: {
      destination: BUSINESS_STRIPE_ACCOUNT,
      amount: Math.floor(service.price * 100 * PLATFORM_FEE_PERCENTAGE),
    },
  })
  
  return paymentIntent
}

// Create subscription for recurring payments
export async function createSubscription(
  serviceKey: keyof typeof SERVICE_PRICES,
  customerId: string,
  metadata?: any
) {
  const service = SERVICE_PRICES[serviceKey]
  
  if (!service.interval) {
    throw new Error('Service is not subscription-based')
  }
  
  // Create price for subscription
  const price = await stripe.prices.create({
    unit_amount: service.price * 100,
    currency: service.currency,
    recurring: { interval: service.interval as 'month' | 'year' },
    product_data: {
      name: service.name,
    },
  })
  
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: price.id }],
    metadata: {
      service_key: serviceKey,
      service_name: service.name,
      ...metadata,
    },
    transfer_data: {
      destination: BUSINESS_STRIPE_ACCOUNT,
      amount_percent: PLATFORM_FEE_PERCENTAGE * 100,
    },
  })
  
  return subscription
}

// Create customer
export async function createStripeCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  })
  
  return customer
}