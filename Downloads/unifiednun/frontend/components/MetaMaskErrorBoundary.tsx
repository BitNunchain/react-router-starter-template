'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>
}

export class MetaMaskErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if this is a MetaMask-related error
    const isMetaMaskError = 
      error.message?.includes('MetaMask') ||
      error.message?.includes('chrome-extension') ||
      error.stack?.includes('chrome-extension') ||
      error.stack?.includes('inpage.js')
    
    if (isMetaMaskError) {
      console.warn('MetaMask error caught by boundary:', error)
      return { hasError: true, error }
    }
    
    // Let other errors bubble up
    throw error
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MetaMask Error Boundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 m-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-yellow-400 font-semibold">MetaMask Connection Issue</h3>
              <p className="text-gray-400 text-sm mt-1">
                There was a temporary issue with MetaMask. This is usually harmless.
              </p>
            </div>
            <button 
              onClick={this.resetError}
              className="text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded border border-yellow-500/30 hover:border-yellow-500/50"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}