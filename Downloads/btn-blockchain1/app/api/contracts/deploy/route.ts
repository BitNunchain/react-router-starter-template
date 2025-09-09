
import { type NextRequest, NextResponse } from "next/server";
import { SmartContractEngine } from "@/lib/smart-contracts";
import { Blockchain } from "@/lib/blockchain";

// Use a singleton Blockchain instance for demo purposes
const blockchain = new Blockchain();
const contractEngine = new SmartContractEngine(blockchain);

export async function POST(request: NextRequest) {
  try {
    const deploymentData = await request.json();

    const contractId = contractEngine.deployContract({
      name: deploymentData.name,
      code: deploymentData.code,
      abi: deploymentData.abi,
      owner: deploymentData.owner,
    });

    // Add a block for the contract deployment
    blockchain.addBalance(deploymentData.owner, deploymentData.value || 0);
    const block = {
      index: blockchain.getChainLength(),
      timestamp: Date.now(),
      transactions: [
        {
          id: `deploy_${contractId}`,
          from: deploymentData.owner,
          to: contractId,
          amount: deploymentData.value || 0,
          timestamp: Date.now(),
          type: "contract_deployment",
          data: {
            contractId,
            name: deploymentData.name,
            gasUsed: Math.floor(deploymentData.code.length * 0.1),
          },
        },
      ],
      previousHash: "",
      hash: Math.random().toString(36).substring(2),
      nonce: 0,
      reward: 0,
      miner: deploymentData.owner,
    };
    blockchain['chain'].push(block); // Directly push for demo; use proper method in production

    return NextResponse.json({
      success: true,
      contractId,
      blockNumber: blockchain.getChainLength(),
      transactionHash: `deploy_${contractId}`,
      gasUsed: Math.floor(deploymentData.code.length * 0.1),
    });
  } catch (error) {
    console.error("[API] Contract deployment failed:", error);
    return NextResponse.json({ success: false, error: "Contract deployment failed" }, { status: 500 });
  }
}
