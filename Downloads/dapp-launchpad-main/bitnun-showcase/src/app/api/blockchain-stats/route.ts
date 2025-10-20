import { NextResponse } from 'next/server'

// Real blockchain RPC endpoints (free tiers)
const RPC_ENDPOINTS = {
  ethereum: 'https://ethereum-rpc.publicnode.com',
  polygon: 'https://polygon-rpc.com',
  sepolia: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // Public Infura
  unifiednun: 'http://localhost:63886' // Your live UnifiedNun blockchain
}

async function fetchBlockchainData(rpcUrl: string, networkName: string) {
  try {
    // Get latest block number
    const blockResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    })

    // Get gas price
    const gasResponse = await fetch(rpcUrl, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 2
      })
    })

    const blockData = await blockResponse.json()
    const gasData = await gasResponse.json()

    const blockNumber = blockData.result ? parseInt(blockData.result, 16) : 0
    const gasPriceWei = gasData.result ? parseInt(gasData.result, 16) : 0
    const gasPriceGwei = Math.round(gasPriceWei / 1e9)

    // Calculate approximate TPS based on network
    const tpsMap: Record<string, number> = {
      ethereum: 15,
      polygon: 65,
      sepolia: 15,
      unifiednun: 1000 // Ultra-fast UnifiedNun chain
    }

    return {
      network: networkName,
      blockNumber,
      gasPrice: `${gasPriceGwei} gwei`,
      gasPriceWei,
      tps: tpsMap[networkName] || 15,
      status: 'online',
      lastUpdated: new Date().toISOString()
    }

  } catch (error) {
    console.error(`Error fetching ${networkName} data:`, error)
    return {
      network: networkName,
      blockNumber: 0,
      gasPrice: 'N/A',
      gasPriceWei: 0,
      tps: 0,
      status: 'error',
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function GET() {
  try {
    // Fetch data from multiple networks in parallel
    const [ethereumData, polygonData, sepoliaData, unifiednunData] = await Promise.all([
      fetchBlockchainData(RPC_ENDPOINTS.ethereum, 'ethereum'),
      fetchBlockchainData(RPC_ENDPOINTS.polygon, 'polygon'),
      fetchBlockchainData(RPC_ENDPOINTS.sepolia, 'sepolia'),
      fetchBlockchainData(RPC_ENDPOINTS.unifiednun, 'unifiednun')
    ])

    // Simulated BITNUN usage stats (you can replace with real database queries)
    const usageStats = {
      projectsCreated: Math.floor(1200 + Math.random() * 100),
      activeDevelopers: Math.floor(800 + Math.random() * 100),
      deploymentsToday: Math.floor(30 + Math.random() * 20),
      networksSupported: 7, // Including UnifiedNun
      unifiednunDeployments: Math.floor(50 + Math.random() * 30),
      nunTransactions: Math.floor(5000 + Math.random() * 1000),
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({
      networks: {
        ethereum: ethereumData,
        polygon: polygonData,
        sepolia: sepoliaData,
        unifiednun: unifiednunData
      },
      stats: usageStats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in blockchain stats API:', error)
    return NextResponse.json({
      error: 'Failed to fetch blockchain data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}