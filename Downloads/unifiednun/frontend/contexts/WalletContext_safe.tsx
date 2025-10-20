'use client'

import React, { useState, useEffect } from 'react'

interface WalletContextType {
  isConnected: boolean
  account: string
  error: string
  isLoading: boolean
  isMetaMaskInstalled: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  clearError: () => void
}

const WalletContext = React.createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = React.useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  // Passive MetaMask detection - no interaction with MetaMask APIs
  useEffect(() => {
    // Only check for MetaMask presence, don't interact with it
    const checkMetaMaskPresence = () => {
      if (typeof window !== 'undefined') {
        // Simple presence check without API calls
        const hasEthereum = typeof window.ethereum !== 'undefined'
        const isMetaMask = hasEthereum && window.ethereum.isMetaMask === true
        setIsMetaMaskInstalled(isMetaMask)
      }
    }

    // Check after a delay to ensure page is fully loaded
    const timer = setTimeout(checkMetaMaskPresence, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  // Minimal event listener setup - only after user initiates connection
  const setupEventListeners = () => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.on) {
      try {
        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
            setIsConnected(true)
            setError('')
          } else {
            setIsConnected(false)
            setAccount('')
          }
        }

        const handleChainChanged = () => {
          // Just clear state, don't reload
          setError('')
        }

        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)

        return () => {
          try {
            if (window.ethereum?.removeListener) {
              window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
              window.ethereum.removeListener('chainChanged', handleChainChanged)
            }
          } catch (err) {
            // Ignore cleanup errors
          }
        }
      } catch (err) {
        console.warn('Could not setup MetaMask event listeners:', err)
        return () => {}
      }
    }
    return () => {}
  }

  const connectWallet = async () => {
    try {
      setError('')
      setIsLoading(true)
      
      // Basic environment checks
      if (typeof window === 'undefined') {
        throw new Error('Browser environment required')
      }
      
      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask extension.')
      }

      if (!window.ethereum.isMetaMask) {
        throw new Error('Please use the MetaMask browser extension')
      }

      // Wrap all MetaMask calls in try-catch with timeouts
      let accounts: string[] = []
      
      try {
        // Create a promise that times out after 8 seconds
        const connectPromise = window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Connection request timed out after 8 seconds')), 8000)
        )
        
        accounts = await Promise.race([connectPromise, timeoutPromise])
      } catch (requestError: any) {
        console.error('MetaMask connection error:', requestError)
        
        // Handle specific MetaMask error codes
        if (requestError.code === 4001) {
          throw new Error('Connection was rejected by user')
        } else if (requestError.code === -32002) {
          throw new Error('MetaMask is busy. Please check the MetaMask popup and try again.')
        } else if (requestError.code === -32603) {
          throw new Error('MetaMask internal error. Please refresh the page and try again.')
        } else if (requestError.message?.includes('timed out')) {
          throw new Error('MetaMask is not responding. Please refresh the page and try again.')
        } else {
          throw new Error(`MetaMask error: ${requestError.message || 'Connection failed'}`)
        }
      }
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        
        // Setup event listeners only after successful connection
        setupEventListeners()
        
        // Optional: Try to switch to UnifiedNun network (non-blocking)
        setTimeout(async () => {
          try {
            await window.ethereum?.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x20D8A4' }], // 2151908 in hex
            })
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              // Network doesn't exist, try to add it
              try {
                await window.ethereum?.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x20D8A4',
                    chainName: 'UnifiedNun',
                    rpcUrls: ['http://127.0.0.1:59987'],
                    nativeCurrency: {
                      name: 'UnifiedNun Token',
                      symbol: 'NUN',
                      decimals: 18
                    },
                    blockExplorerUrls: ['http://127.0.0.1:59987']
                  }]
                })
              } catch (addError) {
                // Ignore network addition errors
                console.warn('Could not add UnifiedNun network:', addError)
              }
            }
            // Ignore all network switching errors - connection is still successful
          }
        }, 2000)
      } else {
        throw new Error('No accounts available. Please unlock MetaMask and try again.')
      }
      
    } catch (err: any) {
      console.error('Wallet connection failed:', err)
      setError(err.message || 'Failed to connect to MetaMask')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAccount('')
    setError('')
  }

  const clearError = () => {
    setError('')
  }

  const value: WalletContextType = {
    isConnected,
    account,
    error,
    isLoading,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    clearError
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}