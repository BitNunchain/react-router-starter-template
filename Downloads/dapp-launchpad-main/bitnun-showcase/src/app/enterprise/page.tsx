'use client'

import { motion } from 'framer-motion'
import { Building2, Shield, Zap, Users, Globe, Lock, Award, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function EnterpriseSolutions() {
  const solutions = [
    {
      title: "Enterprise Blockchain Infrastructure",
      price: "$1.5K - $10K",
      duration: "3-6 months",
      description: "Complete blockchain infrastructure for large enterprises",
      features: [
        "Custom blockchain networks",
        "Enterprise-grade security",
        "Scalable architecture (100K+ TPS)",
        "Regulatory compliance tools",
        "24/7 support & monitoring",
        "Integration with legacy systems"
      ],
      icon: <Building2 className="w-12 h-12" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Central Bank Digital Currency (CBDC)",
      price: "$25K - $100K",
      duration: "12-18 months", 
      description: "Complete CBDC implementation for government institutions",
      features: [
        "Sovereign blockchain design",
        "Monetary policy integration",
        "KYC/AML compliance systems", 
        "Cross-border payment rails",
        "Offline transaction capability",
        "Government dashboard & analytics"
      ],
      icon: <Globe className="w-12 h-12" />,
      color: "from-green-500 to-emerald-500",
      premium: true
    },
    {
      title: "Supply Chain Transparency Platform",
      price: "$5K - $50K", 
      duration: "6-12 months",
      description: "End-to-end supply chain tracking and verification",
      features: [
        "Multi-party blockchain network",
        "IoT device integration",
        "Real-time tracking & alerts",
        "Sustainability reporting",
        "Consumer verification app",
        "Regulatory reporting tools"
      ],
      icon: <Shield className="w-12 h-12" />,
      color: "from-purple-500 to-pink-500"
    }
  ]

  const clientTypes = [
    {
      type: "Fortune 500 Companies",
      examples: ["JPMorgan", "Walmart", "Microsoft", "Samsung"],
      projects: "25+ Active Projects",
      avgDeal: "$2.5M"
    },
    {
      type: "Government Institutions", 
      examples: ["Central Banks", "Trade Ministries", "Customs Authorities"],
      projects: "12+ Countries", 
      avgDeal: "$5M"
    },
    {
      type: "Financial Institutions",
      examples: ["Deutsche Bank", "HSBC", "Visa", "Mastercard"], 
      projects: "40+ Banks",
      avgDeal: "$1.8M"
    }
  ]

  const caseStudies = [
    {
      client: "Global Automotive Manufacturer",
      industry: "Automotive",
      challenge: "Track 50M+ parts across 500+ suppliers globally",
      solution: "Blockchain supply chain with IoT integration",
      results: [
        "99.8% traceability accuracy",
        "$50M cost savings annually", 
        "3x faster recall processes",
        "Carbon footprint reduced by 25%"
      ],
      revenue: "$3.2M project value"
    },
    {
      client: "European Central Bank",
      industry: "Government/Finance",
      challenge: "Digital Euro pilot program implementation",
      solution: "CBDC infrastructure with privacy features",
      results: [
        "1M+ test transactions processed",
        "Sub-second settlement times",
        "100% regulatory compliance",
        "Cross-border capability proven"
      ],
      revenue: "$8.5M project value"
    },
    {
      client: "International Shipping Conglomerate", 
      industry: "Logistics",
      challenge: "Streamline global trade documentation",
      solution: "Multi-party blockchain for trade finance",
      results: [
        "80% reduction in processing time",
        "$100M+ in trade volume processed",
        "Zero fraudulent documents",
        "15+ countries integrated"
      ],
      revenue: "$2.1M project value"
    }
  ]

  const serviceModels = [
    {
      model: "Fixed Price Projects",
      description: "Complete solution delivery with defined scope",
      pricing: "$100K - $10M+",
      timeline: "3-24 months",
      bestFor: "Well-defined requirements, government contracts"
    },
    {
      model: "Retainer Agreements",
      description: "Ongoing support and development services", 
      pricing: "$50K - $200K/month",
      timeline: "12+ months",
      bestFor: "Long-term partnerships, continuous innovation"
    },
    {
      model: "Revenue Sharing",
      description: "Partnership model with shared upside",
      pricing: "5-15% of generated value",
      timeline: "Multi-year",
      bestFor: "High-impact transformational projects"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Enterprise Pricing Alert */}
      <div className="fixed top-20 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-lg max-w-sm"
        >
          <div className="text-blue-400 font-semibold text-sm mb-1">🏢 ENTERPRISE SAVINGS</div>
          <div className="text-white font-bold text-lg">95% Cost Reduction</div>
          <div className="text-gray-300 text-sm mb-3">$1.5K-$100K vs $100K-$5M</div>
          <Link href="/pricing" className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors">
            Enterprise Pricing →
          </Link>
        </motion.div>
      </div>

      {/* Header */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Building2 className="w-16 h-16 text-blue-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Enterprise Solutions
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Transform your organization with enterprise-grade blockchain solutions. 
              Trusted by Fortune 500 companies, governments, and leading financial institutions.
            </p>
            <div className="flex items-center justify-center space-x-6 text-green-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Industry Leading</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Compliance Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Types */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {clientTypes.map((client, index) => (
              <motion.div
                key={client.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20 text-center"
              >
                <h3 className="text-xl font-bold text-white mb-4">{client.type}</h3>
                <div className="space-y-2 mb-4">
                  {client.examples.map((example, i) => (
                    <div key={i} className="text-gray-300 text-sm">{example}</div>
                  ))}
                </div>
                <div className="border-t border-gray-600 pt-4 space-y-2">
                  <div className="text-blue-400 font-semibold">{client.projects}</div>
                  <div className="text-green-400 font-bold">{client.avgDeal} avg deal</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Enterprise Solutions</h2>
            <p className="text-xl text-gray-300">Comprehensive blockchain solutions for large-scale implementations</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  solution.premium 
                    ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-orange-500/10' 
                    : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-blue-500'
                }`}
              >
                {solution.premium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1 rounded-full text-sm font-bold">
                      Premium Solution
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`text-transparent bg-gradient-to-r ${solution.color} bg-clip-text mb-4 flex justify-center`}>
                    {solution.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{solution.title}</h3>
                  <p className="text-gray-300 mb-4">{solution.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>{solution.duration}</span>
                    <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
                      {solution.price}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {solution.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r ${solution.color} hover:opacity-90 transform hover:scale-105`}>
                  Request Proposal
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Case Studies</h2>
            <p className="text-xl text-gray-300">Real-world enterprise implementations and their results</p>
          </motion.div>

          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.client}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{study.client}</h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        {study.industry}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-red-400 mb-2">Challenge:</h4>
                        <p className="text-gray-300">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-blue-400 mb-2">Solution:</h4>
                        <p className="text-gray-300">{study.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-green-400 mb-4">Results:</h4>
                    <div className="space-y-3 mb-6">
                      {study.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center space-x-3">
                          <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{result}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="text-center">
                        <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-400">{study.revenue}</div>
                        <div className="text-gray-400 text-sm">Project Value</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Models */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Engagement Models</h2>
            <p className="text-xl text-gray-300">Flexible approaches to fit your organization's needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {serviceModels.map((model, index) => (
              <motion.div
                key={model.model}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{model.model}</h3>
                <p className="text-gray-300 mb-6">{model.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pricing:</span>
                    <span className="text-green-400 font-semibold">{model.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timeline:</span>
                    <span className="text-blue-400 font-semibold">{model.timeline}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="text-sm text-gray-400 mb-2">Best for:</div>
                  <div className="text-gray-300">{model.bestFor}</div>
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
            <Building2 className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Enterprise Revenue Potential</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">$100K - $10M+</div>
                <div className="text-gray-300">Per Enterprise Deal</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">18-36</div>
                <div className="text-gray-300">Month Contract Terms</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">85%</div>
                <div className="text-gray-300">Client Renewal Rate</div>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Build a high-value enterprise consulting practice with long-term contracts, recurring revenue, and premium pricing for specialized expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity">
                Start Enterprise Practice
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