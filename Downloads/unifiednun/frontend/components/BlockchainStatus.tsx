'use client'

import { useState, useEffect } from 'react'

export function BlockchainStatus() {
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          
          // Map chain IDs to network names
          const networks: { [key: string]: string } = {
            '0x1': 'Ethereum Mainnet',
            '0x89': 'Polygon',
            '0xa': 'Optimism',
            '0xa4b1': 'Arbitrum One',
            '0x38': 'BSC',
            '0xfa': 'Fantom',
            '0xa86a': 'Avalanche',
            '0x5': 'Goerli Testnet',
            '0xaa36a7': 'Sepolia Testnet',
            '0x13881': 'Polygon Mumbai',
            '0x20D8A4': 'UnifiedNun (Local)'
          }
          
          setCurrentNetwork(networks[chainId] || `Unknown Network (${chainId})`)
        } else {
          setCurrentNetwork('No wallet connected')
        }
      } catch (error) {
        setCurrentNetwork('Unable to detect network')
      } finally {
        setLoading(false)
      }
    }

    checkNetwork()
    
    // Listen for network changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', checkNetwork)
      return () => window.ethereum.removeListener('chainChanged', checkNetwork)
    }
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span className="text-blue-400 text-sm">Detecting network...</span>
        </div>
      </div>
    )
  }

  const isLiveNetwork = currentNetwork && !currentNetwork.includes('Local') && !currentNetwork.includes('Unable') && !currentNetwork.includes('No wallet')
  const isTestnet = currentNetwork && (currentNetwork.includes('Testnet') || currentNetwork.includes('Mumbai'))

  return (
    <div className={`${
      isLiveNetwork 
        ? isTestnet 
          ? 'bg-yellow-500/10 border-yellow-500/20' 
          : 'bg-green-500/10 border-green-500/20'
        : 'bg-gray-500/10 border-gray-500/20'
    } border rounded-lg p-4`}>
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${
          isLiveNetwork 
            ? isTestnet 
              ? 'bg-yellow-400' 
              : 'bg-green-400'
            : 'bg-gray-400'
        }`}></div>
        <div>
          <div className={`text-sm font-medium ${
            isLiveNetwork 
              ? isTestnet 
                ? 'text-yellow-400' 
                : 'text-green-400'
              : 'text-gray-400'
          }`}>
            {currentNetwork || 'No network detected'}
          </div>
          {isLiveNetwork && (
            <div className="text-xs text-gray-400 mt-1">
              {isTestnet ? 'Connected to testnet' : 'Connected to live network'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}