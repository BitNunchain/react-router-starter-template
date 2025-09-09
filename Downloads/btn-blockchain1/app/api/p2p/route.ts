import { type NextRequest, NextResponse } from "next/server"
import { P2PNetwork } from "@/lib/p2p"

// Global P2P network for production
let globalP2P: P2PNetwork | null = null

export async function GET(request: NextRequest) {
  try {
    if (!globalP2P) {
      // Initialize with production WebSocket server
      globalP2P = new P2PNetwork(null, null)
      await globalP2P.connectToBootstrapNodes()
    }

    const url = new URL(request.url)
    const action = url.searchParams.get("action")

    switch (action) {
      case "peers":
        return NextResponse.json({
          peers: globalP2P.getConnectedPeers(),
          peerCount: globalP2P.getPeerCount(),
          networkStats: globalP2P.getNetworkStats(),
        })

      case "broadcast":
        const message = url.searchParams.get("message")
        if (message) {
          await globalP2P.broadcastMessage("user_action", { message, timestamp: Date.now() })
          return NextResponse.json({ success: true, broadcasted: true })
        }
        return NextResponse.json({ error: "No message provided" }, { status: 400 })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[API] P2P error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (!globalP2P) {
      globalP2P = new P2PNetwork(null, null)
      await globalP2P.connectToBootstrapNodes()
    }

    switch (action) {
      case "join":
        await globalP2P.connectToPeer(data.peerId)
        return NextResponse.json({ success: true, joined: true })

      case "leave":
        globalP2P.disconnect()
        return NextResponse.json({ success: true, left: true })

      case "message":
        await globalP2P.broadcastMessage(data.type, data.payload)
        return NextResponse.json({ success: true, sent: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[API] P2P POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
