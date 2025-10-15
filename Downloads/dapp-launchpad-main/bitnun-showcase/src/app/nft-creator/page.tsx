'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Image, Zap, DollarSign, Crown, Palette, Cpu, Globe } from 'lucide-react'
import Link from 'next/link'

export default function NFTCreatorPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const nftPlans = [
    {
      id: 'free',
      name: 'Free NFT Deploy',
      price: 'FREE',
      priceUSD: '$0',
      collections: '1 Collection/month',
      nfts: 'Up to 100 NFTs',
      features: [
        'Basic NFT template',
        'Simple metadata generation', 
        'Deploy to testnet',
        'Community support',
        '1 free deploy per month'
      ],
      color: 'from-green-500 to-emerald-500',
      icon: '🎁'
    },
    {
      id: 'basic',
      name: 'NFT Starter',
      price: '0.04 ETH',
      priceUSD: '$110',
      collections: '1 Collection',
      nfts: 'Up to 1,000 NFTs',
      features: [
        'Basic NFT generation',
        'Standard marketplace listing',
        'Basic rarity system',
        'IPFS storage included',
        'Standard smart contract'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'pro',
      name: 'NFT Professional',
      price: '0.05 ETH',
      priceUSD: '$138',
      collections: '5 Collections',
      nfts: 'Up to 10,000 NFTs',
      features: [
        'Advanced AI generation',
        'Premium marketplace features',
        'Advanced rarity algorithms',
        'Custom metadata system',
        'Royalty management',
        'Whitelist management',
        'Reveal mechanisms'
      ],
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'NFT Enterprise',
      price: '0.1 ETH',
      priceUSD: '$275',
      collections: 'Unlimited',
      nfts: 'Unlimited NFTs',
      features: [
        'Everything in Professional',
        'Custom smart contracts',
        'Multi-chain deployment',
        'Advanced analytics',
        'Custom marketplace',
        'Gaming integration',
        'Dedicated support'
      ],
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const nftServices = [
    {
      title: 'AI Art Generation',
      description: 'Generate thousands of unique NFTs using advanced AI',
      price: '0.01 ETH per 1K NFTs',
      icon: Palette,
      features: ['Style consistency', 'Trait mixing', 'Rarity control']
    },
    {
      title: 'Smart Contract Audit',
      description: 'Professional security audit for your NFT contracts',
      price: '0.2 ETH per contract',
      icon: Cpu,
      features: ['Security analysis', 'Gas optimization', 'Compliance check']
    },
    {
      title: 'Marketplace Deployment',
      description: 'Deploy your own branded NFT marketplace',
      price: '0.5 ETH setup',
      icon: Globe,
      features: ['Custom branding', 'Trading features', 'Analytics dashboard']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* NFT Competitive Pricing Alert */}
      <div className="fixed top-20 right-6 z-50">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 backdrop-blur-lg max-w-sm"
        >
          <div className="text-purple-400 font-semibold text-sm mb-1">🎨 NFT SAVINGS</div>
          <div className="text-white font-bold text-lg">90% Less Than Market</div>
          <div className="text-gray-300 text-sm mb-3">From 0.04 ETH vs 0.5+ ETH</div>
          <Link href="/pricing" className="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors">
            NFT Pricing →
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
            <Image className="text-purple-400" size={24} />
            <h1 className="text-2xl font-bold">NFT Creator Suite</h1>
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
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 bg-clip-text text-transparent">
            Create & Launch NFTs
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Professional NFT creation suite with AI generation, smart contracts, and marketplace deployment. 
            Launch your NFT collection with zero technical knowledge required.
          </p>
          <div className="flex justify-center space-x-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-purple-400">2.4M+</div>
              <div className="text-gray-400">NFTs Created</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-pink-400">850+</div>
              <div className="text-gray-400">Collections Launched</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-cyan-400">$12M+</div>
              <div className="text-gray-400">Volume Generated</div>
            </div>
          </div>
        </motion.section>

        {/* NFT Plans */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">NFT Creation Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {nftPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-gray-800/50 rounded-2xl p-8 border cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id 
                    ? 'border-purple-500 scale-105' 
                    : 'border-gray-700 hover:border-gray-600'
                } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Crown size={16} />
                      <span>POPULAR</span>
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                    {plan.price}
                  </div>
                  <div className="text-gray-400 mb-4">{plan.priceUSD}</div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-300">{plan.collections}</div>
                    <div className="text-sm text-gray-300">{plan.nfts}</div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                  selectedPlan === plan.id 
                    ? `bg-gradient-to-r ${plan.color} text-white shadow-lg`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}>
                  {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Additional Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-12">Premium Add-On Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {nftServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
              >
                <service.icon className="text-purple-400 mb-4" size={48} />
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-300 mb-4">{service.description}</p>
                <div className="text-2xl font-bold text-purple-400 mb-4">{service.price}</div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Add Service
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Success Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-12 border border-purple-500/20"
        >
          <h2 className="text-4xl font-bold text-center mb-8">Featured Collections</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'CyberPunks 2077', floor: '2.4 ETH', volume: '450 ETH' },
              { name: 'Digital Dreamscape', floor: '1.8 ETH', volume: '320 ETH' },
              { name: 'Pixel Warriors', floor: '0.9 ETH', volume: '180 ETH' },
              { name: 'Abstract Universe', floor: '3.2 ETH', volume: '680 ETH' }
            ].map((collection, index) => (
              <div key={collection.name} className="bg-black/30 rounded-lg p-4">
                <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3"></div>
                <h4 className="font-semibold text-white mb-2">{collection.name}</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Floor:</span>
                    <span className="text-purple-400">{collection.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume:</span>
                    <span className="text-green-400">{collection.volume}</span>
                  </div>
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
          <h2 className="text-4xl font-bold mb-6">Start Creating Your NFT Collection</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of creators who have launched successful NFT collections using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
              <Zap size={20} />
              <span>Start Creating Now</span>
            </button>
            <button className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors">
              View Examples
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}