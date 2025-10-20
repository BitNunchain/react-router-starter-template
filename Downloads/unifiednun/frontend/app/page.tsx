'use client'

import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { ConnectButton } from '@rainbow-me/rainbowkit'
// import { useAccount, useBalance, useBlockNumber } from 'wagmi'
import { Hero } from '../components/Hero'
import { Stats } from '../components/Stats'
import { Features } from '../components/Features'
import { Bridge } from '../components/Bridge'
import { Explorer } from '../components/Explorer'
import { Footer } from '../components/Footer'
import { Navigation } from '../components/Navigation'
import { ParticleBackground } from '../components/ParticleBackground'
import { WalletStatus } from '../components/WalletStatus'

export default function HomePage() {
  // const { isConnected, address } = useAccount()
  // const { data: balance } = useBalance({ address })
  // const { data: blockNumber } = useBlockNumber()
  
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Stats Section */}
        <Stats />

        {/* Quick Features Preview */}
        <section id="features-section" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Experience UnifiedNun
              </h2>
              <p className="text-gray-400 text-lg">
                Explore our powerful blockchain features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <a href="/features" className="glass-effect rounded-xl p-8 text-center hover:scale-105 transition-transform cursor-pointer group">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400">Features</h3>
                <p className="text-gray-400">Discover ultra-low fees and lightning-fast transactions</p>
              </a>
              
              <a href="/bridge" className="glass-effect rounded-xl p-8 text-center hover:scale-105 transition-transform cursor-pointer group">
                <div className="text-4xl mb-4">🌉</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400">Bridge</h3>
                <p className="text-gray-400">Transfer assets between Ethereum L1 and UnifiedNun L2</p>
              </a>
              
              <a href="/explorer" className="glass-effect rounded-xl p-8 text-center hover:scale-105 transition-transform cursor-pointer group">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400">Explorer</h3>
                <p className="text-gray-400">Search transactions, blocks, and addresses</p>
              </a>
              
              <div className="glass-effect rounded-xl p-8">
                <WalletStatus />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}