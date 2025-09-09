import { type NextRequest, NextResponse } from "next/server"
import { SmartContractEngine } from "@/lib/smart-contracts"
import { NFTEngine } from "@/lib/nft-engine"

// Global contract engines for production
let globalContracts: SmartContractEngine | null = null
let globalNFTs: NFTEngine | null = null

function getGlobalEngines() {
  if (!globalContracts) {
    globalContracts = new SmartContractEngine(null)
    globalNFTs = new NFTEngine(null)
  }
  return { contracts: globalContracts, nfts: globalNFTs }
}

export async function GET(request: NextRequest) {
  try {
    const { contracts, nfts } = getGlobalEngines()
    const url = new URL(request.url)
    const action = url.searchParams.get("action")

    switch (action) {
      case "contracts":
        return NextResponse.json({
          contracts: contracts.getAllContracts(),
          count: contracts.getAllContracts().length,
        })

      case "nfts":
        return NextResponse.json({
          nfts: nfts.getAllNFTs(),
          count: nfts.getAllNFTs().length,
        })

      case "contract":
        const contractId = url.searchParams.get("id")
        if (contractId) {
          const contract = contracts.getContract(contractId)
          return NextResponse.json({ contract })
        }
        return NextResponse.json({ error: "Contract ID required" }, { status: 400 })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[API] Contracts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { contracts, nfts } = getGlobalEngines()
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "deploy":
        const contractId = contracts.deployContract(data.name, data.code, data.owner || "user")
        return NextResponse.json({
          success: true,
          contractId,
          contract: contracts.getContract(contractId),
        })

      case "execute":
        const result = contracts.executeContract(data.contractId, data.method, data.params || [])
        return NextResponse.json({
          success: true,
          result,
          gasUsed: Math.floor(Math.random() * 1000) + 100,
        })

      case "mint_nft":
        const nftId = nfts.mintNFT(data.owner || "user", data.metadata)
        return NextResponse.json({
          success: true,
          nftId,
          nft: nfts.getNFT(nftId),
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[API] Contracts POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
