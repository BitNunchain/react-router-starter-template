'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, AlertTriangle, TrendingUp, Users, DollarSign, CheckCircle, Award, FileText, Zap } from 'lucide-react'
import Link from 'next/link'

export default function InsuranceServices() {
  const insuranceProducts = [
    {
      name: "Smart Contract Coverage",
      premium: "$39 - $149/month",
      coverage: "Up to $10M",
      description: "Comprehensive coverage for smart contract vulnerabilities and exploits",
      features: [
        "24/7 vulnerability monitoring",
        "Automated claim processing",
        "Code audit verification",
        "Emergency response team",
        "Legal defense coverage"
      ],
      claims: "99.2% claim satisfaction",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "DeFi Protocol Insurance", 
      premium: "$149 - $299/month",
      coverage: "Up to $50M",
      description: "Specialized coverage for DeFi protocols, liquidity pools, and yield farming",
      features: [
        "Flash loan attack protection",
        "Oracle manipulation coverage", 
        "Impermanent loss protection",
        "Governance attack insurance",
        "Cross-chain bridge coverage"
      ],
      claims: "Sub-24h claim processing",
      color: "from-purple-500 to-pink-500",
      popular: true
    },
    {
      name: "Enterprise Blockchain Coverage",
      premium: "$299 - $399/month", 
      coverage: "Up to $100M+",
      description: "Complete enterprise coverage for large-scale blockchain implementations",
      features: [
        "Multi-protocol coverage",
        "Business interruption insurance",
        "Cyber liability protection",
        "Regulatory compliance coverage",
        "Key person insurance"
      ],
      claims: "Dedicated claims manager",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const riskCategories = [
    {
      category: "Smart Contract Risks",
      risks: [
        "Reentrancy attacks",
        "Integer overflow/underflow",
        "Access control vulnerabilities", 
        "Logic errors in code",
        "Unhandled exceptions"
      ],
      coverage: "Up to $10M per incident",
      premium: "2-5% of coverage amount"
    },
    {
      category: "Economic Risks",
      risks: [
        "Oracle price manipulation",
        "Flash loan attacks",
        "MEV exploitation",
        "Governance token attacks",
        "Market manipulation"
      ],
      coverage: "Up to $25M per incident", 
      premium: "3-7% of coverage amount"
    },
    {
      category: "Infrastructure Risks",
      risks: [
        "Node failures",
        "Network congestion",
        "Bridge exploits", 
        "Validator slashing",
        "Key management failures"
      ],
      coverage: "Up to $50M per incident",
      premium: "1-3% of coverage amount"
    }
  ]

  const claimsProcess = [
    {
      step: "1. Detection",
      description: "Automated monitoring detects potential incidents",
      time: "Real-time",
      icon: <AlertTriangle className="w-8 h-8" />
    },
    {
      step: "2. Verification", 
      description: "Our experts verify the incident and assess damages",
      time: "2-4 hours",
      icon: <FileText className="w-8 h-8" />
    },
    {
      step: "3. Processing",
      description: "Claims are processed through smart contracts",
      time: "4-24 hours", 
      icon: <Zap className="w-8 h-8" />
    },
    {
      step: "4. Payout",
      description: "Automatic payout to affected parties",
      time: "1-3 days",
      icon: <DollarSign className="w-8 h-8" />
    }
  ]

  const marketStats = [
    { metric: "$2.3B+", label: "Total Value Protected", icon: <Shield className="w-6 h-6" /> },
    { metric: "450+", label: "Protocols Covered", icon: <Lock className="w-6 h-6" /> },
    { metric: "99.2%", label: "Claims Paid", icon: <CheckCircle className="w-6 h-6" /> },
    { metric: "12min", label: "Avg Response Time", icon: <Zap className="w-6 h-6" /> }
  ]

  const partnerTestimonials = [
    {
      protocol: "UniDEX Protocol",
      tvl: "$250M TVL",
      testimonial: "BITNUN's insurance gave our users confidence to deposit larger amounts. Our TVL increased 300% after getting coverage.",
      executive: "Sarah Chen, Protocol Lead",
      savings: "Prevented $15M loss during flash loan attack"
    },
    {
      protocol: "YieldMax Finance",
      tvl: "$180M TVL", 
      testimonial: "The automated claim process is incredible. When we got exploited, users were compensated within 24 hours.",
      executive: "Marcus Rodriguez, CTO",
      savings: "Full coverage of $8M exploit incident"
    },
    {
      protocol: "CrossChain Bridge",
      tvl: "$500M TVL",
      testimonial: "Enterprise coverage allows us to offer institutional-grade security to our corporate clients.",
      executive: "Alex Kim, CEO",
      savings: "Enabled $100M+ institutional adoption"
    }
  ]

  const businessModels = [
    {
      model: "Direct Underwriting",
      description: "Underwrite insurance policies directly to protocols",
      revenue: "$15K - $500K per policy",
      margin: "30-50% profit margin"
    },
    {
      model: "Broker Network",
      description: "Partner with insurance brokers and agents",
      revenue: "10-20% commission", 
      margin: "Revenue sharing model"
    },
    {
      model: "Self-Insurance Pools",
      description: "Manage community-owned insurance pools",
      revenue: "2-5% management fee",
      margin: "Performance-based bonuses"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white">
      {/* Header */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-blue-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
                Insurance Services
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Protect your DeFi protocols, smart contracts, and blockchain infrastructure with comprehensive insurance coverage. 
              Build user confidence and attract institutional capital with proven risk management.
            </p>
            <div className="flex items-center justify-center space-x-6 text-green-400">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">A+ Rated</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">$2.3B Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Instant Claims</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {marketStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-xl border border-blue-500/20"
              >
                <div className="text-blue-400 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.metric}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Products */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Insurance Products</h2>
            <p className="text-xl text-gray-300">Comprehensive coverage for all blockchain risks</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {insuranceProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  product.popular 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                    : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-blue-500'
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{product.name}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Premium:</span>
                      <span className="text-blue-400 font-semibold">{product.premium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coverage:</span>
                      <span className="text-green-400 font-bold">{product.coverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Claims:</span>
                      <span className="text-purple-400 font-semibold">{product.claims}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <h4 className="text-lg font-semibold text-white mb-3">Coverage Includes:</h4>
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r ${product.color} hover:opacity-90 transform hover:scale-105`}>
                  Get Quote
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Categories */}
      <section className="py-20 px-6 bg-gradient-to-r from-red-900/10 to-orange-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Risk Coverage</h2>
            <p className="text-xl text-gray-300">Comprehensive protection across all blockchain risk categories</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {riskCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl border border-red-500/20"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{category.category}</h3>
                
                <div className="space-y-3 mb-6">
                  {category.risks.map((risk, riskIndex) => (
                    <div key={riskIndex} className="flex items-center space-x-3">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-gray-300">{risk}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-600 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Coverage:</span>
                    <span className="text-green-400 font-bold">{category.coverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Premium Range:</span>
                    <span className="text-blue-400 font-semibold">{category.premium}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Claims Process */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Lightning-Fast Claims</h2>
            <p className="text-xl text-gray-300">Automated claims processing with smart contract verification</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {claimsProcess.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"
              >
                <div className="text-blue-400 mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.step}</h3>
                <p className="text-gray-300 mb-4">{step.description}</p>
                <div className="text-green-400 font-semibold">{step.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Client Success Stories</h2>
            <p className="text-xl text-gray-300">How insurance coverage transformed these protocols</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {partnerTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.protocol}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/20"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{testimonial.protocol}</h3>
                  <div className="text-green-400 font-semibold mb-4">{testimonial.tvl}</div>
                  <p className="text-gray-300 italic">"{testimonial.testimonial}"</p>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="text-center">
                    <div className="text-blue-400 font-semibold mb-2">{testimonial.executive}</div>
                    <div className="text-green-400 font-bold">{testimonial.savings}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Models */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Revenue Models</h2>
            <p className="text-xl text-gray-300">Multiple ways to build an insurance business</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {businessModels.map((model, index) => (
              <motion.div
                key={model.model}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{model.model}</h3>
                <p className="text-gray-300 mb-6">{model.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Revenue:</span>
                    <span className="text-green-400 font-bold">{model.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Margin:</span>
                    <span className="text-blue-400 font-semibold">{model.margin}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Potential */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12 border border-green-500/20"
          >
            <Shield className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Insurance Revenue Potential</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">$15K - $100K+</div>
                <div className="text-gray-300">Monthly Premium Income</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">30-50%</div>
                <div className="text-gray-300">Profit Margins</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">95%+</div>
                <div className="text-gray-300">Client Retention</div>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Build a scalable insurance business with recurring premium income, high margins, and growing market demand for DeFi protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity">
                Start Insurance Business
              </button>
              <Link href="/business-dashboard">
                <button className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors">
                  View Revenue Dashboard
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}