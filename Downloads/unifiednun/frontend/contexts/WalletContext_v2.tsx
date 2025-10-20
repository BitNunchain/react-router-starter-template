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

  // Wait for MetaMask to be fully loaded
  const waitForMetaMask = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false)
        return
      }

      if (window.ethereum && window.ethereum.isMetaMask) {
        resolve(true)
        return
      }

      let attempts = 0
      const maxAttempts = 50 // 5 seconds total
      
      const checkMetaMask = () => {
        attempts++
        if (window.ethereum && window.ethereum.isMetaMask) {
          resolve(true)
        } else if (attempts >= maxAttempts) {
          resolve(false)
        } else {
          setTimeout(checkMetaMask, 100)
        }
      }
      
      checkMetaMask()
    })
  }

  useEffect(() => {
    const initializeWallet = async () => {
      const metaMaskReady = await waitForMetaMask()
      setIsMetaMaskInstalled(metaMaskReady)
      
      if (metaMaskReady) {
        checkConnection()
        setupEventListeners()
      }
    }

    initializeWallet()
  }, [])

  const setupEventListeners = () => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.on) {
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
        // Don't reload, just clear the connection state
        setIsConnected(false)
        setAccount('')
        setError('')
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
    return () => {}
  }

  const checkConnection = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        }
      }
    } catch (err) {
      console.error('Failed to check connection:', err)
    }
  }

  const addUnifiedNunNetwork = async () => {
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x20D8A4' }], // 2151908 in hex
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
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
          console.error('Failed to add network:', addError)
          // Don't throw - this is optional
        }
      } else {
        console.error('Failed to switch network:', switchError)
        // Don't throw - this is optional
      }
    }
  }

  const connectWallet = async () => {
    try {
      setError('')
      setIsLoading(true)
      
      if (typeof window === 'undefined') {
        throw new Error('Please wait for page to load')
      }
      
      // Wait for MetaMask to be ready
      const metaMaskReady = await waitForMetaMask()
      
      if (!metaMaskReady) {
        throw new Error('MetaMask not detected. Please install MetaMask extension and refresh the page.')
      }

      // Additional check for MetaMask readiness
      if (!window.ethereum.isMetaMask) {
        throw new Error('Please use MetaMask browser extension')
      }

      // Check if MetaMask is unlocked and ready
      try {
        await window.ethereum.request({ method: 'eth_accounts' })
      } catch (checkError: any) {
        if (checkError.code === -32002) {
          throw new Error('MetaMask is busy. Please wait and try again.')
        }
      }

      // Request account access with proper error handling
      let accounts: string[] = []
      
      try {
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
      } catch (requestError: any) {
        console.error('MetaMask request error:', requestError)
        
        if (requestError.code === 4001) {
          throw new Error('Connection request was rejected')
        } else if (requestError.code === -32002) {
          throw new Error('MetaMask is already processing a request. Please check MetaMask window.')
        } else if (requestError.code === -32603) {
          throw new Error('MetaMask internal error. Please try refreshing the page.')
        } else {
          throw new Error(`Connection failed: ${requestError.message || 'Unknown error'}`)
        }
      }
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        
        // Try to add/switch to UnifiedNun network after a delay
        setTimeout(async () => {
          try {
            await addUnifiedNunNetwork()
          } catch (networkError) {
            console.warn('Network switching failed:', networkError)
            // Don't set error state for network issues
          }
        }, 1000)
      } else {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }
      
    } catch (err: any) {
      console.error('Wallet connection error:', err)
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