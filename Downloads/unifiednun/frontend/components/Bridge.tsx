'use client'

import { useState } from 'react'
import { useMultiChain } from '../contexts/MultiChainContext'

export function Bridge() {
  const { isConnected, switchToNetwork, getCurrentNetworkInfo } = useMultiChain()
  const [fromNetwork, setFromNetwork] = useState('ethereum')
  const [toNetwork, setToNetwork] = useState('unifiednun')
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('ETH')

  const currentNetworkInfo = getCurrentNetworkInfo()

  const networks = {
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: '🔷',
      color: 'from-blue-500 to-blue-600',
      fees: '$10-50',
      time: '12s'
    },
    polygon: {
      name: 'Polygon',
      symbol: 'MATIC',
      icon: '🟣',
      color: 'from-purple-500 to-purple-600',
      fees: '$0.01',
      time: '2s'
    },
    unifiednun: {
      name: 'UnifiedNun',
      symbol: 'NUN',
      icon: '🚀',
      color: 'from-purple-400 to-purple-600',
      fees: '$0.0001',
      time: '<1s'
    }
  }

  const bridgeableTokens = {
    ETH: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    USDC: { name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    USDT: { name: 'Tether', symbol: 'USDT', decimals: 6 },
    WMATIC: { name: 'Wrapped MATIC', symbol: 'WMATIC', decimals: 18 },
    NUN: { name: 'UnifiedNun Token', symbol: 'NUN', decimals: 18 }
  }

  const switchNetworks = () => {
    const newFrom = toNetwork
    const newTo = fromNetwork
    setFromNetwork(newFrom)
    setToNetwork(newTo)
  }

  const handleNetworkSwitch = async (targetNetwork: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }
    
    const success = await switchToNetwork(targetNetwork)
    if (!success) {
      alert(`Failed to switch to ${networks[targetNetwork as keyof typeof networks].name}`)
    }
  }

  const calculateBridgeFee = () => {
    if (fromNetwork === 'ethereum') {
      return '0.005 ETH (~$12-25)'
    } else if (fromNetwork === 'unifiednun') {
      return '0.0001 NUN (~$0.0001)'
    } else {
      return '0.1 MATIC (~$0.01)'
    }
  }

  const calculateBridgeTime = () => {
    if (fromNetwork === 'ethereum' && toNetwork === 'polygon') {
      return '7-8 minutes'
    } else if (fromNetwork === 'polygon' && toNetwork === 'ethereum') {
      return '30-45 minutes (challenge period)'
    } else if (fromNetwork === 'unifiednun' || toNetwork === 'unifiednun') {
      return '1-2 minutes (Lightning Fast!)'
    }
    return '5-10 minutes'
  }

  const handleBridge = async () => {
    if (!amount) {
      alert('Please enter an amount to bridge')
      return
    }
    
    if (!isConnected) {
      alert('Please connect your MetaMask wallet first')
      return
    }

    // Check if user is on the correct source network
    const targetChainId = fromNetwork === 'ethereum' ? '0x1' : fromNetwork === 'unifiednun' ? '0x20d5e4' : '0x89'
    if (currentNetworkInfo?.chainId !== targetChainId) {
      const shouldSwitch = confirm(`You need to be on ${networks[fromNetwork as keyof typeof networks].name} network to bridge. Switch now?`)
      if (shouldSwitch) {
        const success = await switchToNetwork(fromNetwork)
        if (!success) {
          alert('Failed to switch networks')
          return
        }
      } else {
        return
      }
    }
    
    // Simulate bridge transaction
    alert(`Bridge functionality coming soon! 
    
From: ${networks[fromNetwork as keyof typeof networks].name}
To: ${networks[toNetwork as keyof typeof networks].name}
Amount: ${amount} ${selectedToken}
Fee: ${calculateBridgeFee()}
Time: ${calculateBridgeTime()}

This will integrate with official Polygon bridge contracts.`)
  }

  return (
    <section id="bridge" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          🚀 Multi-Chain Bridge - Including UnifiedNun
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="glass-effect rounded-xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold mb-4">Cross-Chain Bridge</h3>
              <p className="text-gray-400">
                Transfer tokens between Ethereum, Polygon, and your own UnifiedNun blockchain
              </p>
            </div>
            
            {/* Network Status */}
            {currentNetworkInfo && (
              <div className="mb-6 p-4 bg-black/20 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Currently connected to:</span>
                  <div className="flex items-center space-x-2">
                    <span>{currentNetworkInfo.icon}</span>
                    <span className="font-medium">{currentNetworkInfo.name}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {/* From Network */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">From</label>
                <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => handleNetworkSwitch(fromNetwork)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r ${networks[fromNetwork as keyof typeof networks].color} hover:opacity-90 transition-opacity`}
                    >
                      <span className="text-lg">{networks[fromNetwork as keyof typeof networks].icon}</span>
                      <span className="font-medium text-white">{networks[fromNetwork as keyof typeof networks].name}</span>
                    </button>
                    
                    {/* Token Selector */}
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                    >
                      {Object.entries(bridgeableTokens).map(([symbol, token]) => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                      ))}
                    </select>
                  </div>
                  
                  <input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent text-2xl font-bold placeholder-gray-500 focus:outline-none"
                  />
                  <div className="text-sm text-gray-400 mt-1">
                    Network fees: {networks[fromNetwork as keyof typeof networks].fees} • Speed: {networks[fromNetwork as keyof typeof networks].time}
                  </div>
                </div>
              </div>

              {/* Switch Button */}
              <div className="flex justify-center">
                <button
                  onClick={switchNetworks}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors group"
                  title="Switch bridge direction"
                >
                  <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* To Network */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">To</label>
                <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => handleNetworkSwitch(toNetwork)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r ${networks[toNetwork as keyof typeof networks].color} hover:opacity-90 transition-opacity`}
                    >
                      <span className="text-lg">{networks[toNetwork as keyof typeof networks].icon}</span>
                      <span className="font-medium text-white">{networks[toNetwork as keyof typeof networks].name}</span>
                    </button>
                    <span className="text-gray-400">{selectedToken}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">
                    {amount || '0.0'}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Network fees: {networks[toNetwork as keyof typeof networks].fees} • Speed: {networks[toNetwork as keyof typeof networks].time}
                  </div>
                </div>
              </div>

              {/* Bridge Info */}
              <div className="space-y-3">
                <div className={`${fromNetwork === 'polygon' || fromNetwork === 'unifiednun' ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'} border rounded-lg p-4`}>
                  <div className="flex items-start space-x-2">
                    <div className={`${fromNetwork === 'polygon' || fromNetwork === 'unifiednun' ? 'text-green-400' : 'text-blue-400'} mt-1`}>
                      {fromNetwork === 'polygon' || fromNetwork === 'unifiednun' ? '💰' : 'ℹ️'}
                    </div>
                    <div className="text-sm">
                      <p className={`font-medium mb-1 ${fromNetwork === 'polygon' || fromNetwork === 'unifiednun' ? 'text-green-300' : 'text-blue-300'}`}>
                        {fromNetwork === 'unifiednun' ? '🚀 Ultra-Fast UnifiedNun Bridge' : fromNetwork === 'polygon' ? '💰 Ultra-Low Cost Bridge' : 'Bridge Details'}:
                      </p>
                      <ul className={`space-y-1 ${fromNetwork === 'polygon' || fromNetwork === 'unifiednun' ? 'text-green-200' : 'text-blue-200'}`}>
                        <li>• Bridge fee: {calculateBridgeFee()}</li>
                        <li>• Estimated time: {calculateBridgeTime()}</li>
                        <li>• Minimum amount: 0.01 {selectedToken}</li>
                        {fromNetwork === 'unifiednun' && (
                          <li>• 🚀 Lightning speed from your own blockchain!</li>
                        )}
                        {fromNetwork === 'polygon' && (
                          <li>• Save 99% on fees compared to Ethereum!</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Network Comparison */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <div className="text-purple-400 font-medium text-sm mb-1">🟣 Polygon Benefits</div>
                    <div className="text-xs text-purple-200">
                      • Ultra-low fees ($0.01)
                      <br />• Fast transactions (2s)
                      <br />• Same DeFi protocols
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="text-blue-400 font-medium text-sm mb-1">🔷 Ethereum Benefits</div>
                    <div className="text-xs text-blue-200">
                      • Largest DeFi ecosystem
                      <br />• Maximum security
                      <br />• Original protocols
                    </div>
                  </div>
                  <div className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-3">
                    <div className="text-purple-300 font-medium text-sm mb-1">🚀 UnifiedNun Benefits</div>
                    <div className="text-xs text-purple-100">
                      • Ultra-cheap fees ($0.0001)
                      <br />• Lightning speed (&lt;1s)
                      <br />• YOUR own blockchain
                      <br />• NUN cryptocurrency
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleBridge}
                disabled={!isConnected}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnected ? `Bridge ${selectedToken} to ${networks[toNetwork as keyof typeof networks].name}` : 'Connect Wallet to Bridge'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}