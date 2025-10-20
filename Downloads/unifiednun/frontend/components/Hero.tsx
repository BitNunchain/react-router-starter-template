'use client'

import { useMultiChain } from '../contexts/MultiChainContext'

export function Hero() {
  const { isConnected, connectWallet, isLoading } = useMultiChain()

  const handleConnectClick = async () => {
    if (!isConnected) {
      try {
        await connectWallet()
      } catch (error) {
        console.error('Connection failed:', error)
      }
    }
  }

  const handleLearnMore = () => {
    // Scroll to features section or navigate to features page
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Navigate to features page if no section found
      window.location.href = '/features'
    }
  }
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="text-transparent bg-clip-text unifiednun-gradient">
              UnifiedNun
            </span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-light text-gray-300 mb-8">
            Multi-Chain DeFi{' '}
            <span className="text-purple-400 font-semibold">
              Made Simple
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
          Experience your{' '}
          <span className="text-purple-300 font-medium">own UnifiedNun blockchain</span>{' '}
          with native{' '}
          <span className="text-blue-300 font-medium">NUN cryptocurrency</span>.{' '}
          Lightning-fast transactions at almost zero cost - your blockchain, your rules!
        </p>

        {/* UnifiedNun Showcase */}
        <div className="flex justify-center items-center space-x-8 mb-12">
          <div className="flex flex-col items-center space-y-3 p-6 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <span className="text-6xl">�</span>
            <span className="font-bold text-purple-300 text-lg">UnifiedNun</span>
            <span className="text-sm text-purple-400">Your Own Blockchain</span>
            <span className="text-xs text-gray-400">Chain ID: 2151908</span>
            <span className="text-xs text-green-400">Currently LIVE!</span>
          </div>
          <div className="text-purple-400 text-3xl">🔥</div>
          <div className="flex flex-col items-center space-y-2 text-center">
            <span className="text-2xl font-bold text-blue-300">NUN Crypto</span>
            <span className="text-sm text-gray-400">Native Gas Token</span>
            <span className="text-xs text-green-400">Ultra-Low Fees</span>
            <span className="text-xs text-yellow-400">Lightning Speed</span>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={handleConnectClick}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 unifiednun-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Connecting...' : isConnected ? 'Explore Multi-Chain DeFi →' : 'Connect to Multi-Chain DeFi'}
            </button>
            <button 
              onClick={handleLearnMore}
              className="px-8 py-4 border border-purple-500 text-purple-400 hover:bg-purple-500/10 font-semibold rounded-xl text-lg transition-all duration-300 hover:scale-105"
            >
              Learn More
            </button>
          </div>

          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Connect your wallet to access Ethereum and Polygon networks with real cryptocurrency transactions
          </p>
        </div>

        {/* UnifiedNun Stats Preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center glass-effect rounded-xl p-4 border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-400">$0.0001</div>
            <div className="text-sm text-gray-400">UnifiedNun Fees</div>
          </div>
          <div className="text-center glass-effect rounded-xl p-4 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-400">2151908</div>
            <div className="text-sm text-gray-400">Chain ID</div>
          </div>
          <div className="text-center glass-effect rounded-xl p-4 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-400">&lt;1s</div>
            <div className="text-sm text-gray-400">Block Time</div>
          </div>
          <div className="text-center glass-effect rounded-xl p-4 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-400">LIVE</div>
            <div className="text-sm text-gray-400">Status Now</div>
          </div>
        </div>
      </div>
    </section>
  )
}