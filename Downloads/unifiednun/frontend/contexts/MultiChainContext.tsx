'use client'

import React, { useState, useEffect } from 'react'

// Network configurations
export const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: '0x1',
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrls: ['https://eth-mainnet.g.alchemy.com/v2/demo'],
    blockExplorerUrls: ['https://etherscan.io'],
    icon: '🔷',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    fees: 'High ($10-50)',
    speed: 'Medium (12s)',
    description: 'Largest DeFi ecosystem'
  },
  polygon: {
    chainId: '0x89',
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    icon: '🟣',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    fees: 'Ultra-Low ($0.01)',
    speed: 'Fast (2s)',
    description: 'Best for cheap transactions'
  },
  unifiednun: {
    chainId: '0x20d5e4',
    name: 'UnifiedNun',
    symbol: 'NUN',
    rpcUrls: ['http://localhost:63886'],
    blockExplorerUrls: [],
    icon: '🚀',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    fees: 'Ultra-Cheap ($0.0001)',
    speed: 'Lightning (1s)',
    description: 'Your own blockchain with NUN cryptocurrency'
  }
}

// Testnet configurations
export const TESTNET_NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7',
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    icon: '🧪',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    fees: 'Free',
    speed: 'Medium (12s)',
    description: 'Ethereum testnet'
  },
  mumbai: {
    chainId: '0x13881',
    name: 'Polygon Mumbai',
    symbol: 'MATIC',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    icon: '🧪',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    fees: 'Free',
    speed: 'Fast (2s)',
    description: 'Polygon testnet'
  }
}

interface MultiChainContextType {
  // Wallet state
  isConnected: boolean
  account: string
  error: string
  isLoading: boolean
  
  // Network state
  currentNetwork: string | null
  preferredNetwork: 'ethereum' | 'polygon' | 'unifiednun'
  
  // Functions
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchToNetwork: (networkKey: string) => Promise<boolean>
  setPreferredNetwork: (network: 'ethereum' | 'polygon' | 'unifiednun') => void
  clearError: () => void
  
  // Network utils
  getNetworkInfo: (chainId: string) => any
  getSupportedNetworks: () => any
  getCurrentNetworkInfo: () => any
}

const MultiChainContext = React.createContext<MultiChainContextType | undefined>(undefined)

export function useMultiChain() {
  const context = React.useContext(MultiChainContext)
  if (context === undefined) {
    throw new Error('useMultiChain must be used within a MultiChainProvider')
  }
  return context
}

interface MultiChainProviderProps {
  children: React.ReactNode
}

export function MultiChainProvider({ children }: MultiChainProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null)
  const [preferredNetwork, setPreferredNetwork] = useState<'ethereum' | 'polygon' | 'unifiednun'>('unifiednun') // Default to UnifiedNun - our own chain!

  // Network utility functions
  const getNetworkInfo = (chainId: string) => {
    const allNetworks = { ...SUPPORTED_NETWORKS, ...TESTNET_NETWORKS }
    return Object.values(allNetworks).find(network => network.chainId === chainId) || null
  }

  const getSupportedNetworks = () => SUPPORTED_NETWORKS

  const getCurrentNetworkInfo = () => {
    if (!currentNetwork) return null
    return getNetworkInfo(currentNetwork)
  }

  // Check current network
  const checkCurrentNetwork = async () => {
    try {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        setCurrentNetwork(chainId)
      }
    } catch (err) {
      console.error('Failed to check network:', err)
    }
  }

  // Switch to specific network
  const switchToNetwork = async (networkKey: string): Promise<boolean> => {
    const networks = { ...SUPPORTED_NETWORKS, ...TESTNET_NETWORKS }
    const network = networks[networkKey as keyof typeof networks]
    
    if (!network || !window.ethereum) {
      return false
    }

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }]
      })
      return true
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Network doesn't exist, try to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: network.chainId,
              chainName: network.name,
              rpcUrls: network.rpcUrls,
              nativeCurrency: {
                name: network.name,
                symbol: network.symbol,
                decimals: 18
              },
              blockExplorerUrls: network.blockExplorerUrls
            }]
          })
          return true
        } catch (addError) {
          console.error('Failed to add network:', addError)
          return false
        }
      }
      return false
    }
  }

  // Connect wallet function
  const connectWallet = async () => {
    setIsLoading(true)
    setError('')

    try {
      if (typeof window === 'undefined') {
        throw new Error('Browser environment required')
      }

      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask extension.')
      }

      if (!window.ethereum.isMetaMask) {
        throw new Error('Please use MetaMask browser extension')
      }

      // Connect to wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        
        // Check current network
        await checkCurrentNetwork()
        
        // Suggest preferred network after a delay
        setTimeout(async () => {
          const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
          const preferredChainId = SUPPORTED_NETWORKS[preferredNetwork].chainId
          
          if (currentChainId !== preferredChainId) {
            // Ask user if they want to switch to preferred network
            const switchSuccess = await switchToNetwork(preferredNetwork)
            if (!switchSuccess) {
              setError(`Consider switching to ${SUPPORTED_NETWORKS[preferredNetwork].name} for ${SUPPORTED_NETWORKS[preferredNetwork].fees} fees`)
            }
          }
        }, 2000)
      } else {
        throw new Error('No accounts available')
      }

    } catch (err: any) {
      let errorMessage = 'Connection failed'
      
      if (err.code === 4001) {
        errorMessage = 'Connection rejected by user'
      } else if (err.code === -32002) {
        errorMessage = 'MetaMask is busy. Please wait.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAccount('')
    setError('')
    setCurrentNetwork(null)
  }

  const clearError = () => {
    setError('')
  }

  // Event listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        } else {
          disconnectWallet()
        }
      }

      const handleChainChanged = (chainId: string) => {
        setCurrentNetwork(chainId)
        checkCurrentNetwork()
      }

      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        // Type cast for chainChanged event
        window.ethereum.on('chainChanged', handleChainChanged as any)
      }

      // Initial network check
      checkCurrentNetwork()

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [])

  const value: MultiChainContextType = {
    isConnected,
    account,
    error,
    isLoading,
    currentNetwork,
    preferredNetwork,
    connectWallet,
    disconnectWallet,
    switchToNetwork,
    setPreferredNetwork,
    clearError,
    getNetworkInfo,
    getSupportedNetworks,
    getCurrentNetworkInfo
  }

  return (
    <MultiChainContext.Provider value={value}>
      {children}
    </MultiChainContext.Provider>
  )
}