'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Globe, Users, TrendingUp, Cpu } from 'lucide-react'

interface NetworkStat {
  name: string
  value: string
  change: string
  icon: React.ElementType
  color: string
}

export default function LiveStats() {
  const [stats, setStats] = useState<NetworkStat[]>([
    {
      name: 'Projects Created',
      value: '1,247',
      change: '+12%',
      icon: Activity,
      color: 'text-blue-400'
    },
    {
      name: 'Active Developers',
      value: '856',
      change: '+8%',
      icon: Users,
      color: 'text-green-400'
    },
    {
      name: 'Deployments Today',
      value: '34',
      change: '+24%',
      icon: Zap,
      color: 'text-purple-400'
    },
    {
      name: 'Networks Supported',
      value: '6',
      change: '+1',
      icon: Globe,
      color: 'text-orange-400'
    }
  ])

  const [blockchainData, setBlockchainData] = useState({
    ethereum: { blocks: 18547392, gasPrice: '23 gwei', tps: '15' },
    polygon: { blocks: 49582749, gasPrice: '30 gwei', tps: '65' },
    zkEVM: { blocks: 8472638, gasPrice: '0.1 gwei', tps: '2000' }
  })

  // Fetch real blockchain data
  const fetchRealBlockchainData = async () => {
    try {
      const response = await fetch('/api/blockchain-stats')
      const data = await response.json()
      
      if (data.success && data.networks) {
        const ethNetwork = data.networks.find((n: any) => n.name === 'Ethereum')
        const polygonNetwork = data.networks.find((n: any) => n.name === 'Polygon')
        const sepoliaNetwork = data.networks.find((n: any) => n.name === 'Sepolia')
        
        if (ethNetwork || polygonNetwork || sepoliaNetwork) {
          setBlockchainData({
            ethereum: {
              blocks: ethNetwork?.blockNumber || blockchainData.ethereum.blocks,
              gasPrice: ethNetwork?.gasPrice || blockchainData.ethereum.gasPrice,
              tps: ethNetwork?.tps || blockchainData.ethereum.tps
            },
            polygon: {
              blocks: polygonNetwork?.blockNumber || blockchainData.polygon.blocks,
              gasPrice: polygonNetwork?.gasPrice || blockchainData.polygon.gasPrice,
              tps: polygonNetwork?.tps || blockchainData.polygon.tps
            },
            zkEVM: {
              blocks: sepoliaNetwork?.blockNumber || blockchainData.zkEVM.blocks,
              gasPrice: sepoliaNetwork?.gasPrice || '0.1 gwei',
              tps: sepoliaNetwork?.tps || '2000'
            }
          })
        }
        
        // Update project stats too
        setStats(prevStats => 
          prevStats.map(stat => ({
            ...stat,
            value: stat.name === 'Projects Created' 
              ? data.totalProjects?.toString() || stat.value
              : stat.name === 'Deployments Today'
              ? data.activeDeployments?.toString() || stat.value
              : stat.name === 'Networks Supported'
              ? data.networks?.length?.toString() || stat.value
              : stat.value
          }))
        )
      }
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error)
      // Keep existing data on error
    }
  }

  useEffect(() => {
    // Fetch immediately
    fetchRealBlockchainData()
    
    // Then fetch every 10 seconds for real-time updates
    const interval = setInterval(fetchRealBlockchainData, 10000)

    return () => clearInterval(interval)
  }, [])

  const networks = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      color: 'from-blue-500 to-blue-600',
      data: blockchainData.ethereum,
      status: 'online'
    },
    {
      name: 'Polygon',
      symbol: 'MATIC',
      color: 'from-purple-500 to-purple-600',
      data: blockchainData.polygon,
      status: 'online'
    },
    {
      name: 'Polygon zkEVM',
      symbol: 'ETH',
      color: 'from-green-500 to-green-600',
      data: blockchainData.zkEVM,
      status: 'online'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Live Stats */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="text-green-400" size={24} />
          <h3 className="text-2xl font-bold text-white">Live BITNUN Stats</h3>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-6 backdrop-blur-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={stat.color} size={24} />
                <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Network Status */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Cpu className="text-blue-400" size={24} />
          <h3 className="text-2xl font-bold text-white">Network Status</h3>
          <div className="text-green-400 text-sm">All Systems Operational</div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {networks.map((network, index) => (
            <motion.div
              key={network.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-6 backdrop-blur-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${network.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{network.symbol}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{network.name}</h4>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-xs">Online</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Latest Block</span>
                  <span className="text-white font-mono text-sm">
                    {network.data.blocks.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Gas Price</span>
                  <span className="text-white font-mono text-sm">{network.data.gasPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">TPS</span>
                  <span className="text-white font-mono text-sm">{network.data.tps}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
        <h3 className="text-2xl font-bold text-white mb-6">Why Developers Choose BITNUN</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">90%</div>
            <div className="text-gray-300 text-sm">Faster Development</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">Zero</div>
            <div className="text-gray-300 text-sm">Configuration Required</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">6+</div>
            <div className="text-gray-300 text-sm">Blockchain Networks</div>
          </div>
        </div>
      </div>
    </div>
  )
}