'use client'

import { useState, useEffect } from 'react'

interface ChainStats {
  chainId: string
  blockNumber: string
  gasPrice: string
  clientVersion: string
}

export function UnifiedNunStats() {
  const [stats, setStats] = useState<ChainStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const RPC_URL = 'http://localhost:63886'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch multiple RPC calls in parallel
        const [chainIdResult, blockResult, gasPriceResult, clientResult] = await Promise.all([
          fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] })
          }),
          fetch(RPC_URL, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'eth_blockNumber', params: [] })
          }),
          fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'eth_gasPrice', params: [] })
          }),
          fetch(RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 4, method: 'web3_clientVersion', params: [] })
          })
        ])

        const [chainIdData, blockData, gasPriceData, clientData] = await Promise.all([
          chainIdResult.json(),
          blockResult.json(),
          gasPriceResult.json(),
          clientResult.json()
        ])

        const chainId = parseInt(chainIdData.result, 16)
        const blockNumber = parseInt(blockData.result, 16)
        const gasPrice = parseInt(gasPriceData.result, 16)

        setStats({
          chainId: chainId.toString(),
          blockNumber: blockNumber.toString(),
          gasPrice: (gasPrice / 1e9).toFixed(9) + ' Gwei',
          clientVersion: clientData.result
        })

      } catch (err) {
        setError('UnifiedNun chain not accessible. Is the blockchain running?')
        console.error('Failed to fetch UnifiedNun stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
          <span className="text-purple-400">Loading UnifiedNun stats...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="text-red-400 font-medium">UnifiedNun Chain Offline</div>
            <div className="text-sm text-gray-400">{error}</div>
            <div className="text-xs text-gray-500 mt-2">
              Run: <code className="bg-gray-800 px-2 py-1 rounded">docker start el-1-geth-lighthouse--ec61bbd0d69d4a0b9464e3730776476f</code>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🚀</span>
          <div>
            <h3 className="text-lg font-bold text-purple-300">UnifiedNun Blockchain</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">LIVE</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => window.open('/unifiednun-network.json', '_blank')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
        >
          Add to MetaMask
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.chainId}</div>
          <div className="text-xs text-gray-400">Chain ID</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.blockNumber}</div>
          <div className="text-xs text-gray-400">Current Block</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{stats.gasPrice}</div>
          <div className="text-xs text-gray-400">Gas Price</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">NUN</div>
          <div className="text-xs text-gray-400">Native Token</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <div className="text-xs text-gray-400">
          <span className="font-medium text-purple-300">RPC:</span> http://localhost:63886
        </div>
        <div className="text-xs text-gray-400 truncate">
          <span className="font-medium text-purple-300">Client:</span> {stats.clientVersion}
        </div>
      </div>
    </div>
  )
}