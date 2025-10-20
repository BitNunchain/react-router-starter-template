'use client'

import { useState } from 'react'
import { useMultiChain, SUPPORTED_NETWORKS, TESTNET_NETWORKS } from '../contexts/MultiChainContext'

export function NetworkSelector() {
  const { 
    currentNetwork, 
    preferredNetwork, 
    switchToNetwork, 
    setPreferredNetwork,
    getNetworkInfo,
    getCurrentNetworkInfo
  } = useMultiChain()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentNetworkInfo = getCurrentNetworkInfo()
  const allNetworks = { ...SUPPORTED_NETWORKS, ...TESTNET_NETWORKS }

  const handleNetworkSwitch = async (networkKey: string) => {
    setIsLoading(true)
    const success = await switchToNetwork(networkKey)
    setIsLoading(false)
    setIsOpen(false)
    
    if (success && (networkKey === 'ethereum' || networkKey === 'polygon')) {
      setPreferredNetwork(networkKey as 'ethereum' | 'polygon')
    }
  }

  return (
    <div className="relative">
      {/* Current Network Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg border transition-all ${
          currentNetworkInfo 
            ? `${currentNetworkInfo.bgColor} ${currentNetworkInfo.borderColor} ${currentNetworkInfo.color}`
            : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
        }`}
        disabled={isLoading}
      >
        <span className="text-lg">
          {currentNetworkInfo?.icon || '🌐'}
        </span>
        <div className="text-left">
          <div className="font-medium text-sm">
            {currentNetworkInfo?.name || 'Unknown Network'}
          </div>
          {currentNetworkInfo && (
            <div className="text-xs opacity-75">
              {currentNetworkInfo.fees}
            </div>
          )}
        </div>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Network Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl z-50 min-w-80">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Select Network</h3>
            
            {/* Mainnets */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs text-gray-400 uppercase tracking-wide">Mainnets</h4>
              {Object.entries(SUPPORTED_NETWORKS).map(([key, network]) => (
                <button
                  key={key}
                  onClick={() => handleNetworkSwitch(key)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all hover:opacity-80 ${
                    currentNetwork === network.chainId
                      ? `${network.bgColor} ${network.borderColor} ${network.color}`
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{network.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{network.name}</div>
                      <div className="text-xs opacity-75">{network.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs">{network.fees}</div>
                    <div className="text-xs opacity-75">{network.speed}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Testnets */}
            <div className="space-y-2">
              <h4 className="text-xs text-gray-400 uppercase tracking-wide">Testnets</h4>
              {Object.entries(TESTNET_NETWORKS).map(([key, network]) => (
                <button
                  key={key}
                  onClick={() => handleNetworkSwitch(key)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all hover:opacity-80 ${
                    currentNetwork === network.chainId
                      ? `${network.bgColor} ${network.borderColor} ${network.color}`
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{network.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{network.name}</div>
                      <div className="text-xs opacity-75">{network.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-400">{network.fees}</div>
                    <div className="text-xs opacity-75">{network.speed}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Preferred Network Setting */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Default Network</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPreferredNetwork('polygon')}
                  className={`flex-1 p-2 rounded text-xs font-medium transition-all ${
                    preferredNetwork === 'polygon'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🟣 Polygon (Cheap)
                </button>
                <button
                  onClick={() => setPreferredNetwork('ethereum')}
                  className={`flex-1 p-2 rounded text-xs font-medium transition-all ${
                    preferredNetwork === 'ethereum'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🔷 Ethereum (Full DeFi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}