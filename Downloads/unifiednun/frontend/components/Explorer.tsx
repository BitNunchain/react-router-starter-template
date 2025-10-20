'use client'

import { useState, useEffect } from 'react'

export function Explorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [latestBlock, setLatestBlock] = useState('0')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Fetch latest block number from UnifiedNun RPC
    const fetchLatestBlock = async () => {
      try {
        const response = await fetch('http://127.0.0.1:59987', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: 1,
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: []
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.result) {
            const blockNumber = parseInt(data.result, 16)
            setLatestBlock(blockNumber.toString())
          }
        }
      } catch (error) {
        console.error('Failed to fetch latest block:', error)
        // Keep default value if RPC is not available
      }
    }

    fetchLatestBlock()
    const interval = setInterval(fetchLatestBlock, 10000) // Update every 10 seconds
    
    return () => clearInterval(interval)
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query')
      return
    }

    setIsSearching(true)
    
    try {
      // This is a mock search - in a real explorer, you'd search the blockchain
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate search delay
      
      if (searchQuery.startsWith('0x') && searchQuery.length === 66) {
        alert(`Transaction Hash: ${searchQuery}\n\nThis would show transaction details in a real explorer.`)
      } else if (searchQuery.startsWith('0x') && searchQuery.length === 42) {
        alert(`Address: ${searchQuery}\n\nThis would show address balance and transaction history.`)
      } else if (/^\d+$/.test(searchQuery)) {
        alert(`Block Number: ${searchQuery}\n\nThis would show block details and transactions.`)
      } else {
        alert('Invalid search query. Please enter:\n• Transaction hash (0x...)\n• Address (0x...)\n• Block number')
      }
    } catch (error) {
      alert('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section id="explorer" className="py-20 bg-black/20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          Block Explorer
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-4">UnifiedNun Explorer</h3>
              <p className="text-gray-400">
                Search transactions, blocks, and addresses on UnifiedNun Chain
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by transaction hash, block, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-3 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-black/20 rounded-lg text-center border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="text-2xl font-bold text-purple-400">{latestBlock}</div>
                  <div className="text-sm text-gray-400">Latest Block</div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg text-center border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="text-2xl font-bold text-blue-400">2151908</div>
                  <div className="text-sm text-gray-400">Chain ID</div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg text-center border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="text-2xl font-bold text-green-400">~2s</div>
                  <div className="text-sm text-gray-400">Block Time</div>
                </div>
                <div className="p-4 bg-black/20 rounded-lg text-center border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="text-2xl font-bold text-yellow-400">0.001</div>
                  <div className="text-sm text-gray-400">Avg Gas (Gwei)</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-semibold mb-4 text-center">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => {
                      setSearchQuery(latestBlock)
                      handleSearch()
                    }}
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium">View Latest Block</div>
                    <div className="text-sm text-gray-400">Block #{latestBlock}</div>
                  </button>
                  <button 
                    onClick={() => {
                      const rpcUrl = 'http://127.0.0.1:59987'
                      alert(`RPC Endpoint: ${rpcUrl}\n\nYou can connect to this RPC in your wallet or dApp.`)
                    }}
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium">RPC Endpoint</div>
                    <div className="text-sm text-gray-400">127.0.0.1:59987</div>
                  </button>
                  <button 
                    onClick={() => {
                      if (window.ethereum) {
                        window.ethereum.request({
                          method: 'wallet_addEthereumChain',
                          params: [{
                            chainId: '0x20D8A4',
                            chainName: 'UnifiedNun',
                            rpcUrls: ['http://127.0.0.1:59987'],
                            nativeCurrency: {
                              name: 'UnifiedNun Token',
                              symbol: 'NUN',
                              decimals: 18
                            }
                          }]
                        })
                      } else {
                        alert('Please install MetaMask to add the network')
                      }
                    }}
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium">Add to MetaMask</div>
                    <div className="text-sm text-gray-400">One-click setup</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}