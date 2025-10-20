'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMultiChain } from '../contexts/MultiChainContext'
import { NetworkSelector } from './NetworkSelector'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isConnected, account, connectWallet, getCurrentNetworkInfo } = useMultiChain()

  const currentNetwork = getCurrentNetworkInfo()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/bridge', label: 'Bridge' },
    { href: '/explorer', label: 'Explorer' },
    { href: '/docs', label: 'Docs' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UN</span>
            </div>
            <span className="text-xl font-bold gradient-text">UnifiedNun</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Network & Wallet Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Network Selector */}
            <NetworkSelector />

            {/* Current Network Indicator */}
            {isConnected && currentNetwork && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-black/40 rounded-lg border border-gray-700">
                <span className="text-sm">{currentNetwork.icon}</span>
                <span className="text-sm text-gray-300">{currentNetwork.name}</span>
              </div>
            )}

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-300">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Network Selector */}
              <div className="pt-4 border-t border-gray-800">
                <div className="mb-3">
                  <NetworkSelector />
                </div>
                
                {/* Mobile Current Network */}
                {isConnected && currentNetwork && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-black/40 rounded-lg border border-gray-700 mb-3">
                    <span>{currentNetwork.icon}</span>
                    <span className="text-gray-300">{currentNetwork.name}</span>
                  </div>
                )}
                
                {/* Mobile Wallet */}
                {isConnected ? (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-300">
                      {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}