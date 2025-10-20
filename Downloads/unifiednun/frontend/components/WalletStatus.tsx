'use client'

import { useMultiChain } from '../contexts/MultiChainContext'
import { ClientOnly } from './ClientOnly'
import { BlockchainStatus } from './BlockchainStatus'

function WalletStatusContent() {
  const { 
    isConnected, 
    account, 
    error, 
    isLoading, 
    connectWallet,
    disconnectWallet,
    clearError,
    getCurrentNetworkInfo
  } = useMultiChain()
  
  const currentNetwork = getCurrentNetworkInfo()

  const handleConnect = async () => {
    try {
      await connectWallet()
    } catch (err) {
      console.error('Connection failed:', err)
    }
  }

  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4 gradient-text">Multi-Chain Wallet Status</h3>
      
      <div className="space-y-4">
        <BlockchainStatus />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Status:</span>
            <span className={isConnected ? "text-green-400" : "text-gray-500"}>
              {isConnected ? "🟢 Connected" : "⚪ Ready"}
            </span>
          </div>
          
          {isConnected && currentNetwork && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Network:</span>
              <div className="flex items-center space-x-2">
                <span>{currentNetwork.icon}</span>
                <span className="text-blue-400 text-sm">{currentNetwork.name}</span>
              </div>
            </div>
          )}
          
          {account && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Account:</span>
              <span className="text-blue-400 font-mono text-sm">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-red-400 text-sm">{error}</span>
                <button 
                  onClick={clearError}
                  className="text-red-400 hover:text-red-300 ml-2 text-xs"
                  title="Dismiss error"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          <div className="pt-3 border-t border-gray-700">
            {!isConnected ? (
              <button 
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <button 
                onClick={disconnectWallet}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function WalletStatus() {
  return (
    <ClientOnly 
      fallback={
        <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      }
    >
      <WalletStatusContent />
    </ClientOnly>
  )
}