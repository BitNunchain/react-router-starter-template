'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  X, 
  Zap, 
  Star, 
  Crown, 
  Gift,
  TrendingDown,
  DollarSign,
  Users,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import PaymentModal from '@/components/PaymentModal'

export default function PricingPage() {
  const [selectedService, setSelectedService] = useState('audits')
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const services = {
    audits: {
      name: 'Smart Contract Audits',
      icon: '🔍',
      competitors: '$2,000 - $15,000',
      savings: 'Up to 95% less',
      plans: [
        {
          id: 'audit_free',
          name: 'Free Audit',
          price: '$0',
          period: 'Always Free',
          description: 'Automated security scan',
          features: ['Automated vulnerability scan', 'Basic report', 'Community support', '1 audit/month'],
          limitations: ['No manual review', 'Basic findings only'],
          cta: 'Start Free Audit',
          tier: 'free'
        },
        {
          id: 'audit_lite', 
          name: 'Lite Audit',
          price: '$99',
          period: 'per audit',
          description: 'Auto + manual checklist',
          features: ['Everything in Free', 'Manual checklist review', 'Detailed report', 'Email support', '48hr turnaround'],
          limitations: ['Standard scope only', 'No custom analysis'],
          cta: 'Get Lite Audit',
          tier: 'lite',
          popular: true
        },
        {
          id: 'audit_standard',
          name: 'Standard Audit', 
          price: '$349',
          period: 'per audit',
          description: 'Full manual review',
          features: ['Everything in Lite', 'Deep manual analysis', 'Gas optimization', 'Architecture review', '24hr turnaround', 'Video walkthrough'],
          cta: 'Get Standard Audit',
          tier: 'standard'
        },
        {
          id: 'audit_advanced',
          name: 'Advanced Audit',
          price: '$699',
          period: 'per audit', 
          description: 'Enterprise-grade security',
          features: ['Everything in Standard', 'Formal verification', 'Economic analysis', 'Multi-auditor review', '12hr turnaround', 'Live consultation'],
          cta: 'Get Advanced Audit',
          tier: 'enterprise'
        }
      ]
    },
    
    academy: {
      name: 'BITNUN Academy',
      icon: '🎓',
      competitors: '$200 - $500/month',
      savings: 'Up to 97% less',
      plans: [
        {
          id: 'academy_free',
          name: 'Free Tier',
          price: '$0',
          period: 'Always Free',
          description: '3 lessons per month',
          features: ['3 lessons/month', 'Basic tutorials', 'Community access', 'Progress tracking'],
          limitations: ['Limited content', 'No certificates', 'No mentor access'],
          cta: 'Start Learning Free',
          tier: 'free'
        },
        {
          id: 'academy_monthly',
          name: 'Pro Monthly',
          price: '$5',
          period: 'per month',
          description: 'Unlimited learning',
          features: ['Unlimited lessons', 'All courses included', 'Certificates', 'Priority support', 'Code reviews', 'Job board access'],
          cta: 'Go Pro',
          tier: 'standard',
          popular: true
        },
        {
          id: 'blockchain_basics',
          name: 'Blockchain Basics',
          price: '$19',
          period: 'one-time',
          description: 'Complete beginner course',
          features: ['20+ lessons', 'Hands-on projects', 'Certificate', '6 months access', 'Discord support'],
          cta: 'Buy Course',
          tier: 'lite'
        },
        {
          id: 'enterprise_bootcamp',
          name: 'Enterprise Bootcamp',
          price: '$79',
          period: 'one-time',
          description: 'Advanced enterprise development',
          features: ['50+ lessons', 'Real projects', 'Mentor sessions', 'Job placement help', 'Lifetime access'],
          cta: 'Join Bootcamp',
          tier: 'enterprise'
        }
      ]
    },

    launchpad: {
      name: 'Token Launchpad',
      icon: '🚀',
      competitors: '1.5 - 5 ETH',
      savings: '70-80% less ETH',
      plans: [
        {
          id: 'launchpad_starter',
          name: 'Starter Launch',
          price: '0.29 ETH',
          period: 'per launch',
          description: 'Basic presale setup',
          features: ['Presale contract', 'Liquidity lock', 'Basic PR kit', 'Distribution tools', 'Standard templates'],
          limitations: ['No KYC included', 'No audit included', 'Basic support'],
          cta: 'Launch Project',
          tier: 'lite',
          popular: true
        },
        {
          id: 'launchpad_pro',
          name: 'Pro Launch',
          price: '0.4 ETH', 
          period: 'per launch',
          description: 'Full launch suite',
          features: ['Everything in Starter', 'KYC integration', 'Marketing boost', 'Premium templates', 'Priority support'],
          cta: 'Go Pro',
          tier: 'standard'
        },
        {
          id: 'launchpad_enterprise',
          name: 'Enterprise Launch',
          price: '0.6 ETH',
          period: 'per launch',
          description: 'White-glove service',
          features: ['Everything in Pro', 'Full audit included', 'Custom branding', 'Dedicated manager', 'Success guarantee'],
          cta: 'Get Enterprise',
          tier: 'enterprise'
        }
      ]
    }
  }

  const currentService = services[selectedService as keyof typeof services]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 mb-6">
              <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-400 font-semibold">20-30% Below Any Competitor</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Unbeatable
              </span>
              <br />
              Web3 Pricing
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              We guarantee to beat any competitor's price by at least 20%. Professional Web3 services 
              with freemium tiers and transparent pricing that won't break your budget.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-green-400" />
                <span>Always Free Tier</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span>Price Match Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>No Hidden Fees</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Selector */}
      <section className="py-8 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setSelectedService(key)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedService === key
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span className="text-2xl">{service.icon}</span>
                <span>{service.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantage Banner */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentService.icon} {currentService.name}
                </h3>
                <p className="text-gray-300">
                  Competitors charge: <span className="line-through text-red-400">{currentService.competitors}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">{currentService.savings}</div>
                <div className="text-gray-300">You Save</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {currentService.plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  plan.tier === 'free' 
                    ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/20'
                    : plan.popular 
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                      : plan.tier === 'enterprise'
                        ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/20 to-orange-500/20'
                        : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50'
                }`}
              >
                {plan.tier === 'free' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 px-4 py-1 rounded-full text-sm font-bold text-white">
                      <Gift className="w-4 h-4 inline mr-1" />
                      FREE FOREVER
                    </div>
                  </div>
                )}

                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-500 px-4 py-1 rounded-full text-sm font-bold text-white">
                      <Star className="w-4 h-4 inline mr-1" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {plan.tier === 'enterprise' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-500 px-4 py-1 rounded-full text-sm font-bold text-black">
                      <Crown className="w-4 h-4 inline mr-1" />
                      ENTERPRISE
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations?.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-center space-x-3">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-gray-400 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    if (plan.tier === 'free') {
                      // Handle free tier signup
                      window.open('/dashboard', '_blank')
                    } else {
                      setSelectedPlan(plan.id)
                      setShowPayment(true)
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.tier === 'free' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90'
                      : plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90' 
                        : plan.tier === 'enterprise'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:opacity-90'
                          : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90'
                  } text-white transform hover:scale-105`}
                >
                  {plan.tier === 'free' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Start Free</span>
                    </div>
                  ) : (
                    plan.cta
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Guarantee */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Price Match Guarantee</h2>
            <p className="text-xl text-gray-300 mb-8">
              Find a legitimate competitor offering the same service for less? We'll beat their price by 20% 
              or give you the service for free. No questions asked.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">24 Hours</div>
                <div className="text-gray-300">Price Match Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">20%</div>
                <div className="text-gray-300">Minimum Savings Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                <div className="text-gray-300">Money-Back Promise</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentModal
          serviceKey={selectedPlan}
          serviceName={currentService.plans.find(p => p.id === selectedPlan)?.name || ''}
          amount={parseInt(currentService.plans.find(p => p.id === selectedPlan)?.price.replace(/[$,]/g, '') || '0')}
          onSuccess={() => {
            setShowPayment(false)
            window.location.href = '/dashboard?success=payment_complete'
          }}
          onClose={() => {
            setShowPayment(false)
            setSelectedPlan(null)
          }}
        />
      )}
    </div>
  )
}