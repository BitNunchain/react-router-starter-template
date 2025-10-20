// Global type declarations for UnifiedNun Frontend

interface EthereumProvider {
  isMetaMask?: boolean
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, callback: (accounts: string[]) => void) => void
  removeListener: (event: string, callback: any) => void
}

interface Window {
  ethereum?: EthereumProvider
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export {}