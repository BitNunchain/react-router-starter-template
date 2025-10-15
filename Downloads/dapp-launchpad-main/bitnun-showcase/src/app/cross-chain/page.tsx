'use client'

import { motion } from 'framer-motion'
import { GitBranch, Zap, Globe, Lock, ArrowUpDown, Network, DollarSign, CheckCircle, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function CrossChainTools() {
  const crossChainSolutions = [
    {
      name: "Universal Bridge Builder",
      price: "$149 - $399",
      description: "Deploy secure cross-chain bridges between any blockchain networks",
      features: [
        "Multi-signature security",
        "Automated validators",
        "Liquidity optimization",
        "Real-time monitoring",
        "Emergency pause system",
        "Cross-chain governance"
      ],
      networks: "15+ Networks",
      volume: "$500M+ Bridged",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Cross-Chain DEX Engine",
      price: "$399 - $599", 
      description: "Build DEXs that trade assets across multiple blockchains seamlessly",
      features: [
        "Atomic cross-chain swaps",
        "Multi-chain liquidity pools",
        "Optimized routing algorithms", 
        "MEV protection layer",
        "Yield farming across chains",
        "Governance token mechanics"
      ],
      networks: "20+ Networks",
      volume: "$2B+ Trading Volume",
      color: "from-purple-500 to-pink-500",
      premium: true
    },
    {
      name: "Enterprise Multi-Chain Suite",
      price: "$599 - $799",
      description: "Complete cross-chain infrastructure for enterprise applications",
      features: [
        "Private blockchain connectors",
        "Enterprise security standards",
        "Regulatory compliance tools",
        "Advanced analytics dashboard",
        "24/7 support & monitoring", 
        "Custom integration services"
      ],
      networks: "All Major Networks",
      volume: "Custom Enterprise Volume",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const supportedNetworks = [
    { name: "Ethereum", symbol: "ETH", color: "from-blue-400 to-blue-600", tvl: "$45B" },
    { name: "Polygon", symbol: "MATIC", color: "from-purple-400 to-purple-600", tvl: "$8B" },
    { name: "Binance Smart Chain", symbol: "BNB", color: "from-yellow-400 to-yellow-600", tvl: "$12B" },
    { name: "Avalanche", symbol: "AVAX", color: "from-red-400 to-red-600", tvl: "$6B" },
    { name: "Arbitrum", symbol: "ARB", color: "from-blue-400 to-cyan-400", tvl: "$15B" },
    { name: "Optimism", symbol: "OP", color: "from-red-400 to-pink-400", tvl: "$7B" },
    { name: "Solana", symbol: "SOL", color: "from-green-400 to-green-600", tvl: "$18B" },
    { name: "Cardano", symbol: "ADA", color: "from-blue-400 to-purple-400", tvl: "$2B" }
  ]

  const bridgeStats = [
    { metric: "$15B+", label: "Total Value Bridged", icon: <ArrowUpDown className="w-6 h-6" /> },
    { metric: "2.3M+", label: "Successful Transfers", icon: <CheckCircle className="w-6 h-6" /> },
    { metric: "99.98%", label: "Success Rate", icon: <Star className="w-6 h-6" /> },
    { metric: "12s", label: "Average Bridge Time", icon: <Zap className="w-6 h-6" /> }
  ]

  const useCases = [
    {
      title: "Cross-Chain DeFi Protocols",
      description: "Enable users to participate in DeFi across multiple chains",
      examples: ["Multi-chain yield farming", "Cross-chain lending", "Universal staking"],
      revenue: "$50K - $500K/month",
      icon: <GitBranch className="w-12 h-12" />
    },
    {
      title: "Enterprise Asset Management",
      description: "Manage corporate assets across different blockchain networks",
      examples: ["Treasury management", "Supply chain tracking", "Cross-border payments"],
      revenue: "$100K - $1M/month",
      icon: <Globe className="w-12 h-12" />
    },
    {
      title: "Gaming & NFT Ecosystems", 
      description: "Create seamless gaming experiences across multiple chains",
      examples: ["Cross-chain NFT trading", "Multi-chain gaming tokens", "Interoperable game assets"],
      revenue: "$25K - $250K/month",
      icon: <Network className="w-12 h-12" />
    }
  ]

  const technicalFeatures = [
    {
      feature: "Atomic Swaps",
      description: "Trustless cross-chain transactions without intermediaries",
      benefit: "Eliminates counterparty risk"
    },
    {
      feature: "Liquidity Optimization",
      description: "Intelligent routing to find best rates across chains", 
      benefit: "Reduces slippage by 60%"
    },
    {
      feature: "Security Validation",
      description: "Multi-layered security with formal verification",
      benefit: "99.9% uptime guarantee"
    },
    {
      feature: "Gas Optimization",
      description: "Batching and compression to reduce transaction costs",
      benefit: "75% gas savings"
    }
  ]

  const competitorComparison = [
    {
      feature: "Supported Networks",
      bitnun: "25+ Networks",
      competitor1: "8 Networks", 
      competitor2: "12 Networks"
    },
    {
      feature: "Average Bridge Time",
      bitnun: "12 seconds",
      competitor1: "3-5 minutes",
      competitor2: "2-8 minutes"
    },
    {
      feature: "Security Model",
      bitnun: "Multi-sig + ZK Proofs",
      competitor1: "Multi-sig only",
      competitor2: "Validator set"
    },
    {
      feature: "Developer Tools", 
      bitnun: "Complete SDK + API",
      competitor1: "Basic API",
      competitor2: "Limited tools"
    }
  ]

  const pricingModels = [
    {
      model: "Transaction Fees",
      description: "Earn percentage of every cross-chain transaction",
      rate: "0.05% - 0.3%",
      volume: "High volume potential"
    },
    {
      model: "Licensing Revenue",
      description: "License technology to other protocols and enterprises", 
      rate: "$50K - $500K",
      volume: "Per integration"
    },
    {
      model: "Premium Features",
      description: "Advanced features and priority support",
      rate: "$5K - $50K/month",
      volume: "Recurring revenue"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <GitBranch className="w-16 h-16 text-indigo-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Cross-Chain Tools
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              Build the future of interoperable blockchain infrastructure. Create seamless cross-chain experiences 
              with our premium tools and capture the multi-trillion dollar multi-chain economy.
            </p>
            <div className="flex items-center justify-center space-x-6 text-green-400">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5" />
                <span className="font-semibold">25+ Networks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">12s Bridge Time</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Bank-Grade Security</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bridge Stats */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {bridgeStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20"
              >
                <div className="text-indigo-400 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.metric}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Chain Solutions */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Cross-Chain Solutions</h2>
            <p className="text-xl text-gray-300">Premium tools for building interoperable blockchain applications</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {crossChainSolutions.map((solution, index) => (
              <motion.div
                key={solution.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  solution.premium 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                    : 'border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-indigo-500'
                }`}
              >
                {solution.premium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-sm font-bold">
                      Premium Solution
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{solution.name}</h3>
                  <p className="text-gray-300 mb-4">{solution.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>{solution.networks}</span>
                    <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
                      {solution.price}
                    </span>
                  </div>
                  <div className="text-center text-purple-400 font-semibold">{solution.volume}</div>
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
                  Deploy Solution
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Supported Networks</h2>
            <p className="text-xl text-gray-300">Connect and bridge assets across all major blockchain networks</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {supportedNetworks.map((network, index) => (
              <motion.div
                key={network.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 bg-gradient-to-br ${network.color} bg-opacity-10 rounded-2xl border border-white/10 text-center hover:scale-105 transition-all duration-300`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${network.color} rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4`}>
                  {network.symbol.slice(0, 2)}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{network.name}</h3>
                <div className="text-gray-300 text-sm mb-2">{network.symbol}</div>
                <div className="text-green-400 font-semibold">{network.tvl} TVL</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Revenue-Generating Use Cases</h2>
            <p className="text-xl text-gray-300">Build profitable cross-chain applications</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-all duration-300"
              >
                <div className="text-indigo-400 mb-6 flex justify-center">{useCase.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{useCase.title}</h3>
                <p className="text-gray-300 mb-6">{useCase.description}</p>
                
                <div className="space-y-2 mb-6">
                  {useCase.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{example}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <div className="text-green-400 font-bold">{useCase.revenue}</div>
                  <div className="text-gray-400 text-sm">Revenue Potential</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Advanced Features</h2>
            <p className="text-xl text-gray-300">Cutting-edge technology for seamless cross-chain experiences</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={feature.feature}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20"
              >
                <h3 className="text-xl font-bold text-white mb-3">{feature.feature}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="text-green-400 font-semibold">✓ {feature.benefit}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose BITNUN</h2>
            <p className="text-xl text-gray-300">Superior technology and performance vs competitors</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="p-6 text-left text-white font-bold">Feature</th>
                  <th className="p-6 text-center text-green-400 font-bold">BITNUN</th>
                  <th className="p-6 text-center text-gray-400 font-bold">Competitor A</th>
                  <th className="p-6 text-center text-gray-400 font-bold">Competitor B</th>
                </tr>
              </thead>
              <tbody>
                {competitorComparison.map((row, index) => (
                  <tr key={row.feature} className="border-b border-gray-700 last:border-b-0">
                    <td className="p-6 text-gray-300 font-semibold">{row.feature}</td>
                    <td className="p-6 text-center text-green-400 font-bold">{row.bitnun}</td>
                    <td className="p-6 text-center text-gray-400">{row.competitor1}</td>
                    <td className="p-6 text-center text-gray-400">{row.competitor2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Revenue Models</h2>
            <p className="text-xl text-gray-300">Multiple streams of premium pricing revenue</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingModels.map((model, index) => (
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
                    <span className="text-gray-400">Rate:</span>
                    <span className="text-green-400 font-bold">{model.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume:</span>
                    <span className="text-blue-400 font-semibold">{model.volume}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Potential */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500/10 to-indigo-500/10 rounded-2xl p-12 border border-green-500/20"
          >
            <GitBranch className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">Cross-Chain Revenue Potential</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">$1M - $10M+</div>
                <div className="text-gray-300">Annual Bridge Volume Revenue</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-400 mb-2">0.05-0.3%</div>
                <div className="text-gray-300">Transaction Fee Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">25+</div>
                <div className="text-gray-300">Supported Networks</div>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Capture premium pricing in the rapidly growing cross-chain economy. Build infrastructure that generates revenue from every transaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity">
                Deploy Cross-Chain Infrastructure
              </button>
              <Link href="/business-dashboard">
                <button className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors">
                  View Revenue Calculator
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}