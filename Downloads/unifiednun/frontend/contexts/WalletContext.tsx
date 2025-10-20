'use client'

import React, { useState } from 'react'

interface WalletContextType {
  isConnected: boolean
  account: string
  error: string
  isLoading: boolean
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

  const connectWallet = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('Browser environment required')
      }

      // Check MetaMask availability with try-catch
      let ethereum: any
      try {
        ethereum = window.ethereum
      } catch (err) {
        throw new Error('MetaMask not accessible')
      }

      if (!ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask extension.')
      }

      if (!ethereum.isMetaMask) {
        throw new Error('Please use MetaMask browser extension')
      }

      // First, try to connect without adding network
      const connectPromise = ethereum.request({ method: 'eth_requestAccounts' })
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 15000)
      )

      const accounts = await Promise.race([connectPromise, timeoutPromise])

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        
        // Try to add/switch to a live network (with better error handling)
        setTimeout(async () => {
          try {
            // Try to switch to Polygon mainnet as a live alternative
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }] // Polygon mainnet
            })
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                // Add Polygon mainnet if it doesn't exist
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x89',
                    chainName: 'Polygon',
                    rpcUrls: ['https://polygon-rpc.com'],
                    nativeCurrency: {
                      name: 'MATIC',
                      symbol: 'MATIC',
                      decimals: 18
                    },
                    blockExplorerUrls: ['https://polygonscan.com']
                  }]
                })
              } catch (addError: any) {
                console.warn('Could not add Polygon network:', addError)
                // Try Ethereum mainnet as fallback
                try {
                  await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }] // Ethereum mainnet
                  })
                } catch (ethError) {
                  console.warn('Could not switch to Ethereum mainnet:', ethError)
                }
              }
            } else {
              console.warn('Network switching failed:', switchError)
            }
          }
        }, 1000)
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
  }

  const clearError = () => {
    setError('')
  }

  const value: WalletContextType = {
    isConnected,
    account,
    error,
    isLoading,
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