'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Rocket, DollarSign, Users, TrendingUp, Lock, Star, Crown } from 'lucide-react'
import Link from 'next/link'

export default function LaunchpadPage() {
  const [selectedTier, setSelectedTier] = useState('starter')

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter Launch',
      price: '0.29 ETH',
      priceUSD: '$800',
      features: [
        'Basic project deployment',
        'Community access',
        'Standard marketing support',
        '30-day listing',
        'Basic analytics'
      ],
      color: 'from-blue-500 to-purple-600',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Launch',
      price: '0.4 ETH',
      priceUSD: '$1,100',
      features: [
        'Everything in Starter',
        'Priority placement',
        'Advanced marketing campaigns',
        'KOL partnerships',
        '90-day featured listing',
        'Advanced analytics & insights',
        'Dedicated support manager'
      ],
      color: 'from-purple-500 to-pink-600',
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite Launch',
      price: '0.6 ETH',
      priceUSD: '$1,650',
      features: [
        'Everything in Premium',
        'Guaranteed front page',
        'Influencer network access',
        'Custom smart contract audit',
        'Lifetime featured status',
        'Revenue sharing program',
        'Direct VC introductions',
        'White-glove service'
      ],
      color: 'from-yellow-500 to-orange-600',
      popular: false
    }
  ]

  const launchedProjects = [
    {
      name: 'CryptoVault DeFi',
      raised: '2,450 ETH',
      participants: '12,847',
      roi: '+340%',
      status: 'success'
    },
    {
      name: 'NFT Marketplace Pro',
      raised: '1,890 ETH',
      participants: '8,932',
      roi: '+280%',
      status: 'success'
    },
    {
      name: 'GameFi Universe',
      raised: '3,200 ETH',
      participants: '15,600',
      roi: '+420%',
      status: 'success'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Launchpad Competitive Pricing Alert */}
      <div className="fixed top-20 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-lg max-w-sm"
        >
          <div className="text-yellow-400 font-semibold text-sm mb-1">🚀 LAUNCHPAD DEALS</div>
          <div className="text-white font-bold text-lg">80% Below Competition</div>
          <div className="text-gray-300 text-sm mb-3">From 0.29 ETH vs 1.5+ ETH</div>
          <Link href="/pricing" className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-lg text-sm font-semibold transition-colors">
            Launch Pricing →
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
            <Rocket className="text-yellow-400" size={24} />
            <h1 className="text-2xl font-bold">BITNUN Launchpad</h1>
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
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Launch Your Crypto Project
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            The premium launchpad for serious crypto projects. Get funding, community, and market access 
            with our proven launch system that has raised over $50M for projects.
          </p>
          <div className="flex justify-center space-x-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-yellow-400">$50M+</div>
              <div className="text-gray-400">Total Raised</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-green-400">156</div>
              <div className="text-gray-400">Projects Launched</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-400">89%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </motion.section>

        {/* Pricing Tiers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Launch Package</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative bg-gray-800/50 rounded-2xl p-8 border cursor-pointer transition-all duration-300 ${
                  selectedTier === tier.id 
                    ? 'border-yellow-500 scale-105' 
                    : 'border-gray-700 hover:border-gray-600'
                } ${tier.popular ? 'ring-2 ring-yellow-500' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Crown size={16} />
                      <span>MOST POPULAR</span>
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {tier.price}
                  </div>
                  <div className="text-gray-400">{tier.priceUSD}</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                  selectedTier === tier.id 
                    ? `bg-gradient-to-r ${tier.color} text-white shadow-lg`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}>
                  {selectedTier === tier.id ? 'Selected' : 'Choose Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Success Stories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">Recent Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {launchedProjects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700"
              >
                <h3 className="text-xl font-bold mb-4 text-white">{project.name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Raised:</span>
                    <span className="text-green-400 font-semibold">{project.raised}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Participants:</span>
                    <span className="text-blue-400 font-semibold">{project.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ROI:</span>
                    <span className="text-yellow-400 font-semibold">{project.roi}</span>
                  </div>
                </div>
                <div className="mt-4 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm text-center">
                  Successful Launch
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Launch Process */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Apply', description: 'Submit your project for review' },
              { step: '2', title: 'Review', description: 'Our team evaluates your project' },
              { step: '3', title: 'Prepare', description: 'Marketing and community building' },
              { step: '4', title: 'Launch', description: 'Go live and raise funds' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-blue-500/20"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Launch Your Project?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the exclusive BITNUN Launchpad and get access to our network of investors, 
            marketing experts, and crypto communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-black rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
              <DollarSign size={20} />
              <span>Apply for Launch</span>
            </button>
            <button className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2">
              <Users size={20} />
              <span>Join Investor Network</span>
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}