import { NextResponse } from "next/server"
import { NativeContractDeployer } from "@/lib/contract-deployer"

const deployer = new NativeContractDeployer()

export async function GET() {
  try {
  const deployedContracts = await deployer.getAllDeployedContracts()

    return NextResponse.json({
      success: true,
      count: deployedContracts.length,
      contracts: deployedContracts.map((contract) => ({
        id: contract.id,
        name: contract.name,
        address: contract.address,
        status: contract.status,
        deployedAt: contract.deployedAt,
        blockNumber: contract.blockNumber,
      })),
    })
  } catch (error) {
    console.error("[API] Failed to get deployed contracts:", error)
    return NextResponse.json({ success: false, error: "Failed to get deployed contracts" }, { status: 500 })
  }
}
