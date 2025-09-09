import { type NextRequest, NextResponse } from "next/server"
import { SmartContractEngine } from "@/lib/smart-contracts"
import { Blockchain } from "@/lib/blockchain"

const blockchain = new Blockchain()
const contractEngine = new SmartContractEngine(blockchain)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contractId = params.id
    const contract = contractEngine.getContract(contractId)

    if (!contract) {
      return NextResponse.json({ success: false, error: "Contract not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      contract: {
        id: contract.id,
        name: contract.name,
        address: `0x${contract.id.slice(-40)}`,
        owner: contract.owner,
        abi: contract.abi,
        createdAt: contract.createdAt,
        balance: contract.balance,
        state: contract.state,
      },
    })
  } catch (error) {
    console.error("[API] Contract retrieval failed:", error)
    return NextResponse.json({ success: false, error: "Contract retrieval failed" }, { status: 500 })
  }
}
