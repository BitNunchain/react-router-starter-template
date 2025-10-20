interface Window {
  ethereum?: {
    isMetaMask?: boolean
    request: (request: { method: string; params?: any[] }) => Promise<any>
    on?: (event: string, handler: (accounts: string[]) => void) => void
    removeListener?: (event: string, handler: (accounts: string[]) => void) => void
    selectedAddress?: string | null
  }
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on?: (event: string, handler: (accounts: string[]) => void) => void
      removeListener?: (event: string, handler: (accounts: string[]) => void) => void
      selectedAddress?: string | null
    }
  }
}

export {}