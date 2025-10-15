'use client'

import { motion } from 'framer-motion'
import { Package, Code, Layers, Settings, Zap, Users, Globe, DollarSign, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

export default function WhiteLabelLicensing() {
  const licensingTiers = [
    {
      name: "Startup License",
      price: "$499",
      setupFee: "$199",
      monthlyFee: "$49",
      description: "Complete white-label solution for emerging businesses",
      features: [
        "Full BITNUN platform source code",
        "Custom branding & UI themes",
        "Basic smart contract templates",
        "Standard deployment tools",
        "Email support (48h response)",
        "Documentation & guides"
      ],
      limits: {
        users: "Up to 1,000 users",
        projects: "50 projects/month",
        networks: "3 blockchain networks"
      },
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Professional License",
      price: "$1,499",
      setupFee: "$499", 
      monthlyFee: "$149",
      description: "Advanced platform for growing blockchain businesses",
      features: [
        "Complete platform with premium features",
        "Advanced smart contract library",
        "Multi-tenant architecture", 
        "API access & webhooks",
        "Priority support (24h response)",
        "Custom integrations",
        "Training & onboarding"
      ],
      limits: {
        users: "Up to 10,000 users",
        projects: "500 projects/month", 
        networks: "10 blockchain networks"
      },
      color: "from-purple-500 to-pink-500",
      popular: true
    },
    {
      name: "Enterprise License",
      price: "$4,999",
      setupFee: "$1,999",
      monthlyFee: "$499",
      description: "Unlimited enterprise solution with full customization",
      features: [
        "Enterprise-grade platform",
        "Unlimited customization",
        "White-label mobile apps",
        "Dedicated infrastructure",
        "24/7 premium support",
        "Custom feature development",
        "Revenue sharing opportunities"
      ],
      limits: {
        users: "Unlimited users",
        projects: "Unlimited projects",
        networks: "All supported networks"
      },
      color: "from-green-500 to-emerald-500"
    }
  ]

  const platformModules = [
    {
      name: "Smart Contract IDE",
      description: "Visual smart contract development environment",
      features: ["Drag-drop interface", "Code generation", "Testing tools", "Deployment automation"],
      icon: <Code className="w-8 h-8" />
    },
    {
      name: "DeFi Protocol Builder",
      description: "Pre-built DeFi protocol templates and components", 
      features: ["DEX templates", "Lending protocols", "Yield farming", "Governance systems"],
      icon: <Layers className="w-8 h-8" />
    },
    {
      name: "NFT Marketplace Engine",
      description: "Complete NFT marketplace infrastructure",
      features: ["Marketplace frontend", "Smart contracts", "Payment processing", "Creator tools"],
      icon: <Package className="w-8 h-8" />
    },
    {
      name: "Multi-Chain Deployment",
      description: "Deploy to 15+ blockchain networks",
      features: ["Ethereum", "Polygon", "BSC", "Avalanche", "Solana", "Cardano"],
      icon: <Globe className="w-8 h-8" />
    }
  ]

  const successPartners = [
    {
      company: "CryptoLaunch Pro",
      industry: "Launchpad Platform",
      revenue: "$2.3M ARR",
      users: "45,000+",
      story: "Built a leading IDO launchpad using our white-label solution",
      growth: "300% YoY growth"
    },
    {
      company: "DeFi Builder Suite", 
      industry: "Developer Tools",
      revenue: "$1.8M ARR",
      users: "12,000+",
      story: "Created a no-code DeFi protocol builder for enterprises",
      growth: "250% YoY growth"
    },
    {
      company: "NFT Creator Hub",
      industry: "NFT Platform", 
      revenue: "$5.2M ARR",
      users: "100,000+",
      story: "Launched a comprehensive NFT creation and trading platform",
      growth: "400% YoY growth"
    }
  ]

  const businessModels = [
    {
      model: "SaaS Subscription",
      description: "Monthly/annual subscriptions for platform access",
      revenue: "$50-$500/user/month",
      examples: ["Per-seat licensing", "Usage-based pricing", "Tiered features"]
    },
    {
      model: "Transaction Fees",
      description: "Take percentage of transactions processed", 
      revenue: "0.5-3% per transaction",
      examples: ["Trading fees", "Deployment fees", "Gas fee markup"]
    },
    {
      model: "Premium Services",
      description: "High-value add-on services and consulting",
      revenue: "$10K-$100K/project", 
      examples: ["Custom development", "Audits", "Training"]
    }
  ]

  const technicalSpecs = [
    {
      category: "Architecture",
      specs: [
        "Microservices architecture",
        "Docker containerization", 
        "Kubernetes orchestration",
        "Auto-scaling infrastructure"
      ]
    },
    {
      category: "Security", 
      specs: [
        "Multi-signature wallet integration",
        "Hardware security modules",
        "Penetration tested codebase",
        "SOC 2 Type II compliant"
      ]
    },
    {
      category: "Performance",
      specs: [
        "Sub-second response times",
        "99.99% uptime SLA",
        "Global CDN distribution", 
        "Real-time updates"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Package className="w-16 h-16 text-purple-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                White-Label Licensing
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Launch your own blockchain development platform with our complete white-label solution. 
              Build a profitable SaaS business with enterprise-grade infrastructure and unlimited customization.
            </p>
            <div className="flex items-center justify-center space-x-6 text-green-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Full Source Code</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span className="font-semibold">Proven Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Rapid Deployment</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Licensing Tiers */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Licensing Options</h2>
            <p className="text-xl text-gray-300">Choose the right level of access for your business</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {licensingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  tier.popular 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                    : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-purple-500'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{tier.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text">
                      {tier.price}
                    </div>
                    <div className="text-sm text-gray-400">License Fee</div>
                    <div className="text-green-400 font-semibold">+ {tier.monthlyFee}/month</div>
                  </div>
                  <p className="text-gray-300 mb-6">{tier.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Features Include:</h4>
                    <div className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-600 pt-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Usage Limits:</h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>{tier.limits.users}</div>
                      <div>{tier.limits.projects}</div>
                      <div>{tier.limits.networks}</div>
                    </div>
                  </div>
                </div>

                <button className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r ${tier.color} hover:opacity-90 transform hover:scale-105`}>
                  Get License Quote
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What You Get</h2>
            <p className="text-xl text-gray-300">Complete platform modules ready for customization</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {platformModules.map((module, index) => (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="text-purple-400 mr-4">{module.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{module.name}</h3>
                </div>
                <p className="text-gray-300 mb-6">{module.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {module.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Partners */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Success Stories</h2>
            <p className="text-xl text-gray-300">Partners who built successful businesses with our platform</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {successPartners.map((partner, index) => (
              <motion.div
                key={partner.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/20"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{partner.company}</h3>
                  <div className="text-blue-400 font-semibold mb-4">{partner.industry}</div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-green-400">{partner.revenue}</div>
                      <div className="text-gray-400 text-sm">Annual Revenue</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{partner.users}</div>
                      <div className="text-gray-400 text-sm">Active Users</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-300 italic mb-4">"{partner.story}"</p>
                  <div className="text-green-400 font-semibold">{partner.growth}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Models */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-green-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Revenue Models</h2>
            <p className="text-xl text-gray-300">Multiple ways to monetize your white-label platform</p>
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
                
                <div className="mb-6">
                  <div className="text-2xl font-bold text-green-400 mb-2">{model.revenue}</div>
                  <div className="text-gray-400 text-sm">Potential Revenue</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-300 mb-2">Examples:</div>
                  {model.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{example}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Technical Specifications</h2>
            <p className="text-xl text-gray-300">Enterprise-grade architecture and security</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {technicalSpecs.map((spec, index) => (
              <motion.div
                key={spec.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{spec.category}</h3>
                <div className="space-y-3">
                  {spec.specs.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <Settings className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Potential */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-2xl p-12 border border-green-500/20"
          >
            <Package className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">White-Label Revenue Potential</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">$50K - $500K+</div>
                <div className="text-gray-300">Setup & Licensing Revenue</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">$100K - $2M+</div>
                <div className="text-gray-300">Monthly Recurring Revenue</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">6-12</div>
                <div className="text-gray-300">Months to Launch</div>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Build a scalable SaaS business with our proven platform. Multiple successful partners are generating millions in ARR.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity">
                Request License Demo
              </button>
              <Link href="/business-dashboard">
                <button className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors">
                  View Revenue Projections
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}