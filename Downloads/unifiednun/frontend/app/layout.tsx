import '../styles/globals.css'
import '../styles/fallback.css'
import { MultiChainProvider } from '../contexts/MultiChainContext'
import { MetaMaskErrorBoundary } from '../components/MetaMaskErrorBoundary'
import { ClientOnly } from '../components/ClientOnly'

export const metadata = {
  title: 'UnifiedNun - Multi-Chain DeFi Platform',
  description: 'Experience the best of Ethereum and Polygon networks. Choose between maximum security or ultra-low fees ($0.01) for your DeFi transactions.',
  keywords: 'UnifiedNun, multi-chain, Ethereum, Polygon, DeFi, very cheap transactions, blockchain, Web3, cryptocurrency, bridge',
}

export default function RootLayout({
  children,
}: {
  children: any
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans">
        <ClientOnly 
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
            </div>
          }
        >
          <MetaMaskErrorBoundary>
            <MultiChainProvider>
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                {children}
              </div>
            </MultiChainProvider>
          </MetaMaskErrorBoundary>
        </ClientOnly>
      </body>
    </html>
  )
}