'use client'

import { useMultiChain } from '../contexts/MultiChainContext'

export function Features() {
  const { isConnected, getCurrentNetworkInfo } = useMultiChain()
  const currentNetwork = getCurrentNetworkInfo()

  const features = [
    {
      title: 'Multi-Chain Support',
      description: 'Choose between Ethereum and Polygon networks based on your needs.',
      icon: '🌐',
      benefits: [
        'Ethereum: Maximum security & full DeFi ecosystem',
        'Polygon: Ultra-low fees ($0.01) & fast transactions (2s)',
        'Seamless network switching in one interface'
      ],
      highlight: true
    },
    {
      title: 'Live Blockchain Integration',
      description: 'Real transactions on live networks with actual cryptocurrency.',
      icon: '⚡',
      benefits: [
        'No mock data - all transactions are real',
        'Connect directly to mainnet networks',
        'Full MetaMask integration with error handling'
      ]
    },
    {
      title: 'Cross-Chain Bridge',
      description: 'Transfer tokens between Ethereum and Polygon networks.',
      icon: '🌉',
      benefits: [
        'Ethereum ↔ Polygon asset transfers',
        'Support for ETH, USDC, USDT, and more',
        'Transparent fees and timing estimates'
      ]
    },
    {
      title: 'Cost Optimization',
      description: 'Smart network selection for optimal transaction costs.',
      icon: '💰',
      benefits: [
        'Polygon: 99% cheaper fees than Ethereum',
        'Same DeFi protocols available on both chains',
        'Real-time fee comparison and recommendations'
      ]
    },
    {
      title: 'Advanced Security',
      description: 'Enterprise-grade security with multi-layer protection.',
      icon: '🛡️',
      benefits: [
        'Ethereum: Battle-tested L1 security',
        'Polygon: Plasma + PoS dual consensus',
        'Non-custodial - you control your keys'
      ]
    },
    {
      title: 'DeFi Ecosystem',
      description: 'Access to the largest decentralized finance ecosystem.',
      icon: '🔄',
      benefits: [
        'Thousands of DeFi protocols available',
        'Lending, borrowing, trading, and yield farming',
        'Uniswap, Aave, Compound, and more'
      ]
    }
  ]

  const networkStats = {
    ethereum: {
      name: 'Ethereum',
      icon: '🔷',
      tvl: '$35B+',
      protocols: '3000+',
      avgFee: '$12-50',
      blockTime: '12s',
      color: 'blue'
    },
    polygon: {
      name: 'Polygon',
      icon: '🟣',
      tvl: '$1B+',
      protocols: '1000+',
      avgFee: '$0.01',
      blockTime: '2s',
      color: 'purple'
    }
  }

  return (
    <section id="features" className="py-20 bg-black/20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
          Multi-Chain Features
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Experience the best of both worlds with Ethereum's security and Polygon's efficiency
        </p>

        {/* Current Network Status */}
        {isConnected && currentNetwork && (
          <div className="max-w-md mx-auto mb-12">
            <div className={`bg-${networkStats[currentNetwork.chainId === '0x1' ? 'ethereum' : 'polygon'].color}-500/10 border border-${networkStats[currentNetwork.chainId === '0x1' ? 'ethereum' : 'polygon'].color}-500/20 rounded-xl p-4`}>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-2xl">{currentNetwork.icon}</span>
                  <span className="font-semibold text-lg">{currentNetwork.name}</span>
                </div>
                <div className="text-sm text-gray-400">Currently connected network</div>
              </div>
            </div>
          </div>
        )}

        {/* Network Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {Object.entries(networkStats).map(([key, network]) => (
            <div key={key} className={`glass-effect rounded-xl p-6 border-l-4 border-${network.color}-500`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{network.icon}</span>
                <h3 className="text-2xl font-bold">{network.name}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Total Value Locked</div>
                  <div className="text-lg font-semibold text-green-400">{network.tvl}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">DeFi Protocols</div>
                  <div className="text-lg font-semibold">{network.protocols}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Average Fee</div>
                  <div className={`text-lg font-semibold ${key === 'polygon' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {network.avgFee}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Block Time</div>
                  <div className="text-lg font-semibold">{network.blockTime}</div>
                </div>
              </div>
              
              {key === 'polygon' && (
                <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="text-green-400 font-medium text-sm">💰 Ultra-Low Cost Network</div>
                  <div className="text-xs text-green-200 mt-1">
                    Save 99% on transaction fees compared to Ethereum!
                  </div>
                </div>
              )}
              
              {key === 'ethereum' && (
                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-blue-400 font-medium text-sm">🛡️ Maximum Security Network</div>
                  <div className="text-xs text-blue-200 mt-1">
                    Battle-tested security with largest validator network
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300 ${
                feature.highlight ? 'ring-2 ring-purple-500/50 bg-purple-500/5' : ''
              }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              
              <ul className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start space-x-2 text-sm">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              {feature.highlight && (
                <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="text-purple-400 font-medium text-sm">🌟 Core Feature</div>
                  <div className="text-xs text-purple-200 mt-1">
                    Choose the perfect network for your needs
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Use Case Examples */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Perfect Use Cases</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-effect rounded-xl p-6 border-l-4 border-purple-500">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🟣</span>
                <h4 className="text-xl font-semibold">Use Polygon For:</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">💰</span>
                  <div>
                    <div className="font-medium">Frequent Trading</div>
                    <div className="text-sm text-gray-400">Save hundreds on fees with $0.01 transactions</div>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">🎮</span>
                  <div>
                    <div className="font-medium">Gaming & NFTs</div>
                    <div className="text-sm text-gray-400">Fast, cheap minting and marketplace activity</div>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">�</span>
                  <div>
                    <div className="font-medium">DeFi Farming</div>
                    <div className="text-sm text-gray-400">Compound yields without high gas eating profits</div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="glass-effect rounded-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🔷</span>
                <h4 className="text-xl font-semibold">Use Ethereum For:</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">🏦</span>
                  <div>
                    <div className="font-medium">Large Transactions</div>
                    <div className="text-sm text-gray-400">Maximum security for significant value transfers</div>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">🔐</span>
                  <div>
                    <div className="font-medium">Long-term Holdings</div>
                    <div className="text-sm text-gray-400">Store assets with battle-tested security</div>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">🌟</span>
                  <div>
                    <div className="font-medium">Premium DeFi</div>
                    <div className="text-sm text-gray-400">Access to original protocols and largest liquidity</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}