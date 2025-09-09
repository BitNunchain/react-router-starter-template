import { type NextRequest, NextResponse } from "next/server"
import { SmartContractEngine } from "@/lib/smart-contracts"
import { Blockchain } from "@/lib/blockchain"

const blockchain = new Blockchain()
const contractEngine = new SmartContractEngine(blockchain)

export async function POST(request: NextRequest) {
  try {
    const syncData = await request.json()

    const contractId = contractEngine.deployContract({
      name: syncData.name,
      code: syncData.code,
      abi: syncData.abi,
      owner: syncData.owner,
    })

    console.log(`[API] Synced contract ${syncData.name} from peer node`)

    return NextResponse.json({
      success: true,
      contractId,
      synced: true,
    })
  } catch (error) {
    console.error("[API] Contract sync failed:", error)
    return NextResponse.json({ success: false, error: "Contract sync failed" }, { status: 500 })
  }
}
