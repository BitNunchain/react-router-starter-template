'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'

// UnifiedNun Chain Configuration
const unifiedNunChain = {
  id: 1001,
  name: 'UnifiedNun',
  network: 'unifiednun',
  nativeCurrency: {
    decimals: 18,
    name: 'UnifiedNun',
    symbol: 'NUN',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:9545'],
    },
    public: {
      http: ['http://127.0.0.1:9545'],
    },
  },
  blockExplorers: {
    default: { name: 'UnifiedNun Explorer', url: '' },
  },
  testnet: false,
}

const { chains, publicClient } = configureChains(
  [unifiedNunChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'UnifiedNun Chain',
  projectId: 'unifiednun-chain-app',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}