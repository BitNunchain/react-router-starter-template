'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Lock, Coins, Zap, Shield, BarChart3, Users } from 'lucide-react'
import Link from 'next/link'

export default function DeFiGeneratorPage() {
  const [selectedProtocol, setSelectedProtocol] = useState('dex')

  const protocolTypes = [
    {
      id: 'free',
      name: 'Free DeFi Template',
      price: 'FREE',
      priceUSD: '$0',
      description: 'Basic DeFi template with simple swap functionality - perfect for learning',
      features: [
        'Simple Token Swap',
        'Basic Smart Contracts',
        'Deployment Guide',
        'Community Support',
        '1 deployment/month'
      ],
      icon: 'Gift',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'dex',
      name: 'DEX (Decentralized Exchange)',
      price: '1.9 ETH',
      priceUSD: '$5,225',
      description: 'Create your own Uniswap-style DEX with AMM, liquidity pools, and yield farming',
      features: [
        'Automated Market Making (AMM)',
        'Liquidity Pool Management',
        'Yield Farming & Staking',
        'Governance Token Integration',
        'Flash Loan Protection',
        'Multi-token Swaps',
        'Fee Distribution System'
      ],
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      complexity: 'Advanced'
    },
    {
      id: 'lending',
      name: 'Lending Protocol',
      price: '1.5 ETH',
      priceUSD: '$4,125',
      description: 'Build a lending/borrowing platform like Compound with interest rates and collateral',
      features: [
        'Collateralized Lending',
        'Dynamic Interest Rates',
        'Liquidation Mechanisms',
        'Multi-asset Support',
        'Risk Assessment Tools',
        'Compound Interest Calculation',
        'Oracle Price Feeds'
      ],
      icon: Coins,
      color: 'from-green-500 to-emerald-500',
      complexity: 'Expert'
    },
    {
      id: 'vault',
      name: 'Yield Vault System',
      price: '1.2 ETH',
      priceUSD: '$3,300',
      description: 'Create yield optimization vaults with auto-compounding and strategy management',
      features: [
        'Auto-compounding Rewards',
        'Strategy Optimization',
        'Multi-protocol Integration',
        'Risk Management',
        'Performance Analytics',
        'Emergency Withdraw',
        'Fee Management'
      ],
      icon: Lock,
      color: 'from-purple-500 to-violet-500',
      complexity: 'Intermediate'
    },
    {
      id: 'staking',
      name: 'Staking Platform',
      price: '0.8 ETH',
      priceUSD: '$2,200',
      description: 'Build a staking platform with rewards distribution and delegation features',
      features: [
        'Flexible Staking Periods',
        'Reward Distribution',
        'Delegation Support',
        'Slashing Protection',
        'Validator Management',
        'Unstaking Queues',
        'Penalty Systems'
      ],
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      complexity: 'Beginner'
    }
  ]

  const addOnServices = [
    {
      name: 'Smart Contract Audit',
      price: '1 ETH',
      description: 'Professional security audit by certified auditors',
      icon: Shield
    },
    {
      name: 'Oracle Integration',
      price: '0.4 ETH',
      description: 'Integrate Chainlink or custom price oracles',
      icon: BarChart3
    },
    {
      name: 'Governance Setup',
      price: '0.6 ETH',
      description: 'DAO governance with voting and proposals',
      icon: Users
    },
    {
      name: 'Frontend Dashboard',
      price: '0.8 ETH',
      description: 'Custom React dashboard for protocol interaction',
      icon: Zap
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* DeFi Competitive Pricing Alert */}
      <div className="fixed top-20 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-lg max-w-sm"
        >
          <div className="text-green-400 font-semibold text-sm mb-1">📈 DeFi SAVINGS</div>
          <div className="text-white font-bold text-lg">80% Below Market</div>
          <div className="text-gray-300 text-sm mb-3">From 1.9 ETH vs 10+ ETH</div>
          <Link href="/pricing" className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors">
            DeFi Pricing →
          </Link>
        </motion.div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-400" size={24} />
            <h1 className="text-2xl font-bold">DeFi Protocol Generator</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Build DeFi Protocols
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Launch production-ready DeFi protocols with our no-code generator. From DEX to lending platforms, 
            create sophisticated financial primitives without writing a single line of code.
          </p>
          <div className="flex justify-center space-x-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-400">$2.1B+</div>
              <div className="text-gray-400">TVL Generated</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-400">147</div>
              <div className="text-gray-400">Protocols Built</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-400">99.8%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </motion.section>

        {/* Protocol Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your DeFi Protocol Type</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {protocolTypes.map((protocol, index) => (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedProtocol(protocol.id)}
                className={`relative bg-gray-800/50 rounded-2xl p-8 border cursor-pointer transition-all duration-300 ${
                  selectedProtocol === protocol.id 
                    ? 'border-green-500 scale-105 shadow-2xl' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <protocol.icon className={`bg-gradient-to-r ${protocol.color} bg-clip-text text-transparent`} size={48} />
                  <div className="text-right">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${protocol.color} bg-clip-text text-transparent`}>
                      {protocol.price}
                    </div>
                    <div className="text-gray-400">{protocol.priceUSD}</div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{protocol.name}</h3>
                <p className="text-gray-300 mb-6">{protocol.description}</p>

                <div className="mb-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    protocol.complexity === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    protocol.complexity === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    protocol.complexity === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {protocol.complexity}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {protocol.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                  selectedProtocol === protocol.id 
                    ? `bg-gradient-to-r ${protocol.color} text-white shadow-lg`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}>
                  {selectedProtocol === protocol.id ? 'Selected Protocol' : 'Select Protocol'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Add-on Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">Professional Add-On Services</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {addOnServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300"
              >
                <service.icon className="text-green-400 mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                <div className="text-xl font-bold text-green-400 mb-4">{service.price}</div>
                <button className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm">
                  Add Service
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Success Stories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12 border border-green-500/20"
        >
          <h2 className="text-4xl font-bold text-center mb-8">Successful DeFi Protocols Built</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'YieldMax Protocol', tvl: '$45M', apy: '12.5%', type: 'Yield Vault' },
              { name: 'SwapLab DEX', tvl: '$128M', volume: '$2.1B', type: 'DEX' },
              { name: 'LendFi Platform', tvl: '$89M', utilization: '78%', type: 'Lending' }
            ].map((protocol, index) => (
              <div key={protocol.name} className="bg-black/30 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-white">{protocol.name}</h3>
                <div className="text-sm text-blue-400 mb-4">{protocol.type}</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">TVL:</span>
                    <span className="text-green-400 font-semibold">{protocol.tvl}</span>
                  </div>
                  {protocol.apy && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">APY:</span>
                      <span className="text-yellow-400 font-semibold">{protocol.apy}</span>
                    </div>
                  )}
                  {protocol.volume && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">24h Volume:</span>
                      <span className="text-purple-400 font-semibold">{protocol.volume}</span>
                    </div>
                  )}
                  {protocol.utilization && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Utilization:</span>
                      <span className="text-cyan-400 font-semibold">{protocol.utilization}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Launch Your DeFi Protocol Today</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the DeFi revolution with battle-tested protocols. Our generators include security audits, 
            oracle integrations, and ongoing support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
              <TrendingUp size={20} />
              <span>Start Building Protocol</span>
            </button>
            <button className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}