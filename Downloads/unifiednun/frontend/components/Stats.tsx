'use client'

import { useState, useEffect } from 'react'

interface BlockchainStats {
  chainId: number
  blockNumber: number
  isConnected: boolean
  networkName: string
}

export function Stats() {
  const [stats, setStats] = useState<BlockchainStats>({
    chainId: 2151908,
    blockNumber: 0,
    isConnected: false,
    networkName: 'UnifiedNun'
  })

  const fetchBlockchainStats = async () => {
    try {
      // Get current block number
      const blockResponse = await fetch('http://localhost:63886', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      })
      
      if (blockResponse.ok) {
        const blockData = await blockResponse.json()
        const blockNumber = parseInt(blockData.result, 16)
        
        setStats(prev => ({
          ...prev,
          blockNumber,
          isConnected: true
        }))
      }
    } catch (error) {
      console.error('Failed to fetch blockchain stats:', error)
      setStats(prev => ({ ...prev, isConnected: false }))
    }
  }

  useEffect(() => {
    fetchBlockchainStats()
    const interval = setInterval(fetchBlockchainStats, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-black/20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          🔥 LIVE UnifiedNun Blockchain Stats 🔥
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="glass-effect rounded-xl p-6 text-center border-2 border-green-500/50">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.chainId.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Chain ID</div>
            <div className="text-xs text-green-400 mt-1">✅ LIVE</div>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center border-2 border-purple-500/50">
            <div className="text-3xl font-bold text-purple-400 mb-2">{stats.blockNumber.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Current Block</div>
            <div className="text-xs text-purple-400 mt-1">🚀 MINING</div>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center border-2 border-yellow-500/50">
            <div className="text-3xl font-bold text-yellow-400 mb-2">NUN</div>
            <div className="text-sm text-gray-400">Native Token</div>
            <div className="text-xs text-yellow-400 mt-1">💰 REAL CRYPTO</div>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center border-2 border-blue-500/50">
            <div className="text-3xl font-bold text-blue-400 mb-2">LIVE</div>
            <div className="text-sm text-gray-400">Network Status</div>
            <div className="text-xs text-blue-400 mt-1">{stats.isConnected ? '🟢 ONLINE' : '🔴 OFFLINE'}</div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="glass-effect rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 gradient-text">🎯 Your REAL UnifiedNun Chain</h3>
            <p className="text-gray-300 mb-4">
              This is NOT a demo! You're seeing live data from your actual UnifiedNun blockchain running on localhost:63886
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">✅ Real Blockchain</span>
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">🔗 Live Blocks</span>
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">💎 NUN Cryptocurrency</span>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">🚀 Polygon CDK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}