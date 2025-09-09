import { type NextRequest, NextResponse } from "next/server"
import { Blockchain } from "@/lib/blockchain"
import { MiningEngine } from "@/lib/mining"
import { AIConsensusEngine } from "@/lib/ai-consensus"

// Global blockchain instance for production
let globalBlockchain: Blockchain | null = null
let globalMining: MiningEngine | null = null
let globalAI: AIConsensusEngine | null = null

function getGlobalInstances() {
  if (!globalBlockchain) {
    globalBlockchain = new Blockchain()
    globalMining = new MiningEngine(globalBlockchain)
    globalAI = new AIConsensusEngine(globalBlockchain, globalMining)

    // Start production mining
    globalMining.startBrowserMining()
  }
  return { blockchain: globalBlockchain, mining: globalMining, ai: globalAI }
}

export async function GET(request: NextRequest) {
  try {
    const { blockchain, mining, ai } = getGlobalInstances()
    const url = new URL(request.url)
    const action = url.searchParams.get("action")

    switch (action) {
      case "stats":
        return NextResponse.json({
          blocks: blockchain.getChainLength(),
          hashRate: mining?.getHashRate() || 0,
          balance: blockchain.getBalance("user"),
          networkHealth: ai?.getNetworkMetrics().networkHealth || 1.0,
          consensusAccuracy: ai?.getNetworkMetrics().consensusAccuracy || 0.95,
          timestamp: Date.now(),
        })

      case "blocks":
        return NextResponse.json({
          blocks: blockchain.getRecentBlocks(10),
          totalBlocks: blockchain.getChainLength(),
        })

      case "validate":
        return NextResponse.json({
          isValid: blockchain.isChainValid(),
          lastBlock: blockchain.getLatestBlock(),
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[API] Blockchain error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { blockchain, mining, ai } = getGlobalInstances()
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "mine":
        if (mining && ai) {
          const validation = ai.validateUserAction(data.userId || "user", data.actionType, data.metadata || {})

          if (validation.isGenuine) {
            mining.processUserAction(data.actionType)
            const reward = Math.random() * 0.1 + 0.01 // Production reward calculation
            blockchain.addBalance(data.userId || "user", reward)

            return NextResponse.json({
              success: true,
              reward,
              confidence: validation.confidence,
              newBalance: blockchain.getBalance(data.userId || "user"),
            })
          } else {
            return NextResponse.json(
              {
                success: false,
                reason: "Action rejected by AI consensus",
                riskScore: validation.riskScore,
              },
              { status: 403 },
            )
          }
        }
        break

      case "transfer":
        const { from, to, amount } = data
        if (blockchain.getBalance(from) >= amount) {
          blockchain.addBalance(from, -amount)
          blockchain.addBalance(to, amount)

          return NextResponse.json({
            success: true,
            fromBalance: blockchain.getBalance(from),
            toBalance: blockchain.getBalance(to),
          })
        } else {
          return NextResponse.json(
            {
              success: false,
              reason: "Insufficient balance",
            },
            { status: 400 },
          )
        }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[API] Blockchain POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
