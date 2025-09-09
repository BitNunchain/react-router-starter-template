import type { Blockchain, Block, Transaction } from "./blockchain"
import type { AIConsensusEngine } from "./ai-consensus"

export interface Peer {
  id: string
  address: string
  lastSeen: number
  isConnected: boolean
  latency: number
  trustScore: number
  version: string
  capabilities: string[]
}

export interface NetworkMessage<T = Record<string, unknown>> {
  id: string;
  type: "block" | "transaction" | "peer_discovery" | "sync_request" | "sync_response" | "consensus" | "heartbeat";
  data: T;
  sender: string;
  timestamp: number;
  signature?: string;
  ttl: number;
}

export interface NetworkTopology {
  totalNodes: number
  connectedNodes: number
  networkDiameter: number
  clusteringCoefficient: number
  averageLatency: number
}

export class P2PNetwork {
  private blockchain: Blockchain
  private aiConsensus: AIConsensusEngine | null
  private peers: Map<string, Peer>
  private connections: Map<string, WebSocket | null>
  private messageQueue: NetworkMessage[]
  private isConnected: boolean
  private nodeId: string
  private networkTopology: NetworkTopology
  private messageHandlers: Map<string, (message: NetworkMessage) => void>
  private discoveryInterval: NodeJS.Timeout | null
  private heartbeatInterval: NodeJS.Timeout | null
  private syncInterval: NodeJS.Timeout | null
  private bootstrapNodes: string[]
  private maxConnections: number
  private messageHistory: Set<string>

  constructor(blockchain: Blockchain, aiConsensus?: AIConsensusEngine) {
    this.blockchain = blockchain
    this.aiConsensus = aiConsensus || null
    this.peers = new Map()
    this.connections = new Map()
    this.messageQueue = []
    this.isConnected = false
    this.nodeId = this.generateNodeId()
    this.messageHandlers = new Map()
    this.discoveryInterval = null
    this.heartbeatInterval = null
    this.syncInterval = null
    this.maxConnections = 8
    this.messageHistory = new Set()

    this.networkTopology = {
      totalNodes: 1,
      connectedNodes: 0,
      networkDiameter: 1,
      clusteringCoefficient: 0,
      averageLatency: 0,
    }

    this.bootstrapNodes = [
      `btn-node-${this.nodeId.slice(-8)}-1`,
      `btn-node-${this.nodeId.slice(-8)}-2`,
      `btn-node-${this.nodeId.slice(-8)}-3`,
      `btn-bootstrap-${this.nodeId.slice(-8)}`,
    ]

    this.initializeMessageHandlers()
    this.initializeNetwork()
  }

  private generateNodeId(): string {
    return `btn_node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeMessageHandlers(): void {
    this.messageHandlers.set("block", this.handleBlockMessage.bind(this))
    this.messageHandlers.set("transaction", this.handleTransactionMessage.bind(this))
    this.messageHandlers.set("peer_discovery", this.handlePeerDiscoveryMessage.bind(this))
    this.messageHandlers.set("sync_request", this.handleSyncRequestMessage.bind(this))
    this.messageHandlers.set("sync_response", this.handleSyncResponseMessage.bind(this))
    this.messageHandlers.set("consensus", this.handleConsensusMessage.bind(this))
    this.messageHandlers.set("heartbeat", this.handleHeartbeatMessage.bind(this))
  }

  private initializeNetwork(): void {
    this.connectToBootstrapNodes()
    this.startPeerDiscovery()
    this.startHeartbeat()
    this.startSynchronization()

    console.log(`[P2P] Node ${this.nodeId} initialized`)
  }

  private async connectToBootstrapNodes(): Promise<void> {
    this.simulateNativeConnections()
  }

  private simulateNativeConnections(): void {
    const nativePeers = [
      {
        id: `btn_native_node_1_${this.nodeId.slice(-6)}`,
        address: `native://btn-node-1-${this.nodeId.slice(-8)}`,
        capabilities: ["mining", "consensus", "storage", "native"],
      },
      {
        id: `btn_native_node_2_${this.nodeId.slice(-6)}`,
        address: `native://btn-node-2-${this.nodeId.slice(-8)}`,
        capabilities: ["mining", "relay", "discovery", "native"],
      },
      {
        id: `btn_native_node_3_${this.nodeId.slice(-6)}`,
        address: `native://btn-node-3-${this.nodeId.slice(-8)}`,
        capabilities: ["consensus", "storage", "analytics", "native"],
      },
    ]

    nativePeers.forEach((peerData) => {
      const peer: Peer = {
        id: peerData.id,
        address: peerData.address,
        lastSeen: Date.now(),
        isConnected: true,
        latency: Math.random() * 50 + 5, // Lower latency for native connections
        trustScore: 0.9 + Math.random() * 0.1, // Higher trust for native nodes
        version: "1.0.0-native",
        capabilities: peerData.capabilities,
      }
      this.addPeer(peer)
    })

    this.isConnected = true
    console.log(`[P2P] Connected to ${nativePeers.length} native blockchain nodes`)
  }

  private async connectToPeer(address: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (address.startsWith("native://")) {
          // Simulate native connection
          console.log(`[P2P] Connected to native peer: ${address}`)

          // Store native connection reference
          this.connections.set(address, null) // Native connections don't use WebSocket

          resolve()
        } else {
          // Legacy WebSocket support for compatibility
          const ws = new WebSocket(address)
          ws.onopen = () => {
            console.log(`[P2P] Connected to peer: ${address}`)
            this.connections.set(address, ws)

            // Send introduction message
            this.sendMessage(
              {
                id: this.generateMessageId(),
                type: "peer_discovery",
                data: {
                  nodeId: this.nodeId,
                  capabilities: ["mining", "consensus", "storage"],
                  version: "1.0.0",
                },
                sender: this.nodeId,
                timestamp: Date.now(),
                ttl: 3,
              },
              address,
            )

            resolve()
          }

          ws.onerror = (error) => {
            console.error(`[P2P] Connection error to ${address}:`, error)
            reject(error)
          }

          ws.onmessage = (event) => {
            try {
              const message: NetworkMessage = JSON.parse(event.data)
              this.handleIncomingMessage(message)
            } catch (error) {
              console.error("[P2P] Failed to parse message:", error)
            }
          }

          ws.onclose = () => {
            console.log(`[P2P] Connection closed to ${address}`)
            this.connections.delete(address)
            this.markPeerDisconnected(address)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private startPeerDiscovery(): void {
    this.discoveryInterval = setInterval(() => {
      this.performPeerDiscovery()
      this.optimizeNetworkTopology()
    }, 30000) // Discover peers every 30 seconds
  }

  private performPeerDiscovery(): void {
    // Request peer lists from connected peers
    const discoveryMessage: NetworkMessage = {
      id: this.generateMessageId(),
      type: "peer_discovery",
      data: {
        nodeId: this.nodeId,
        requestPeerList: true,
        maxPeers: this.maxConnections - this.getConnectedPeerCount(),
      },
      sender: this.nodeId,
      timestamp: Date.now(),
      ttl: 2,
    }

    this.broadcastMessage(discoveryMessage)

    // Simulate discovering new peers
    if (Math.random() > 0.7 && this.peers.size < 20) {
      const newPeer: Peer = {
        id: `btn_node_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        address: `wss://peer-${Math.random().toString(36).substr(2, 8)}.btn.network:${8000 + Math.floor(Math.random() * 100)}`,
        lastSeen: Date.now(),
        isConnected: Math.random() > 0.3,
        latency: Math.random() * 200 + 10,
        trustScore: 0.5 + Math.random() * 0.5,
        version: "1.0.0",
        capabilities: this.generateRandomCapabilities(),
      }
      this.addPeer(newPeer)
    }

    // Simulate peer disconnections
    this.peers.forEach((peer) => {
      if (Math.random() > 0.95 && peer.isConnected) {
        peer.isConnected = false
        peer.lastSeen = Date.now() - 60000
      }
    })
  }

  private generateRandomCapabilities(): string[] {
    const allCapabilities = ["mining", "consensus", "storage", "relay", "discovery", "analytics", "native"]
    const count = Math.floor(Math.random() * 4) + 2
    return allCapabilities.sort(() => 0.5 - Math.random()).slice(0, count)
  }

  private optimizeNetworkTopology(): void {
    const connectedPeers = this.getConnectedPeers()

    // Calculate network metrics
    this.networkTopology = {
      totalNodes: this.peers.size + 1, // +1 for this node
      connectedNodes: connectedPeers.length,
      networkDiameter: this.calculateNetworkDiameter(),
      clusteringCoefficient: this.calculateClusteringCoefficient(),
      averageLatency: this.calculateAverageLatency(connectedPeers),
    }

    // Optimize connections based on latency and trust
    this.optimizeConnections(connectedPeers)
  }

  private calculateNetworkDiameter(): number {
    const totalNodes = this.peers.size + 1 // +1 for this node
    return Math.ceil(Math.log2(totalNodes)) + 1
  }

  private calculateClusteringCoefficient(): number {
    // Simplified calculation
    const connectedCount = this.networkTopology.connectedNodes
    const totalCount = this.networkTopology.totalNodes
    return totalCount > 0 ? connectedCount / totalCount : 0
  }

  private calculateAverageLatency(peers: Peer[]): number {
    if (peers.length === 0) return 0
    return peers.reduce((sum, peer) => sum + peer.latency, 0) / peers.length
  }

  private optimizeConnections(peers: Peer[]): void {
    // Disconnect from high-latency, low-trust peers if we have too many connections
    if (peers.length > this.maxConnections) {
      const sortedPeers = peers.sort((a, b) => {
        const scoreA = a.trustScore - a.latency / 1000
        const scoreB = b.trustScore - b.latency / 1000
        return scoreB - scoreA
      })

      // Disconnect from worst peers
      const peersToDisconnect = sortedPeers.slice(this.maxConnections)
      peersToDisconnect.forEach((peer) => {
        this.disconnectFromPeer(peer.id)
      })
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat()
      this.checkPeerHealth()
    }, 15000) // Heartbeat every 15 seconds
  }

  private sendHeartbeat(): void {
    const heartbeatMessage: NetworkMessage = {
      id: this.generateMessageId(),
      type: "heartbeat",
      data: {
        nodeId: this.nodeId,
        timestamp: Date.now(),
        blockHeight: this.blockchain.getChainLength(),
        hashRate: 0, // Would get from mining engine
        capabilities: ["mining", "consensus", "storage"],
      },
      sender: this.nodeId,
      timestamp: Date.now(),
      ttl: 1,
    }

    this.broadcastMessage(heartbeatMessage)
  }

  private checkPeerHealth(): void {
    const now = Date.now()
    const timeout = 60000 // 1 minute timeout

    this.peers.forEach((peer) => {
      if (peer.isConnected && now - peer.lastSeen > timeout) {
        console.log(`[P2P] Peer ${peer.id} timed out`)
        peer.isConnected = false
        peer.trustScore = Math.max(0, peer.trustScore - 0.1)
      }
    })
  }

  private startSynchronization(): void {
    this.syncInterval = setInterval(() => {
      this.synchronizeBlockchain()
    }, 45000) // Sync every 45 seconds
  }

  private synchronizeBlockchain(): void {
    const syncMessage: NetworkMessage = {
      id: this.generateMessageId(),
      type: "sync_request",
      data: {
        nodeId: this.nodeId,
        currentHeight: this.blockchain.getChainLength(),
        lastBlockHash: this.blockchain.getLatestBlock().hash,
      },
      sender: this.nodeId,
      timestamp: Date.now(),
      ttl: 2,
    }

    this.broadcastMessage(syncMessage)
  }

  private handleIncomingMessage(message: NetworkMessage): void {
    // Check if we've already processed this message
    if (this.messageHistory.has(message.id)) {
      return
    }

    this.messageHistory.add(message.id)

    // Clean old message history
    if (this.messageHistory.size > 1000) {
      const oldMessages = Array.from(this.messageHistory).slice(0, 500)
      oldMessages.forEach((id) => this.messageHistory.delete(id))
    }

    // Update peer last seen
    const peer = Array.from(this.peers.values()).find((p) => p.id === message.sender)
    if (peer) {
      peer.lastSeen = Date.now()
    }

    // Handle message based on type
    const handler = this.messageHandlers.get(message.type)
    if (handler) {
      handler(message)
    }

    // Forward message if TTL > 0
    if (message.ttl > 0) {
      message.ttl--
      this.forwardMessage(message)
    }
  }

  private handleBlockMessage(message: NetworkMessage): void {
  const block = (message as NetworkMessage<{ block: Block }>).data.block

    // Validate block with AI consensus if available
    if (this.aiConsensus) {
      const validation = this.aiConsensus.validateBlock(block)
      if (!validation.isValid) {
        console.log(`[P2P] Rejected block from network: ${validation.reasoning.join(", ")}`)
        return
      }
    }

    // Add block to blockchain if valid
    try {
      // In a real implementation, we'd validate and add the block
      console.log(`[P2P] Received valid block #${block.index} from network`)
    } catch (error) {
      console.error("[P2P] Failed to process block:", error)
    }
  }

  private handleTransactionMessage(message: NetworkMessage): void {
  const transaction = (message as unknown as NetworkMessage<Transaction>).data

    // Validate transaction with AI if available
    if (this.aiConsensus) {
      const validation = this.aiConsensus.validateUserAction(transaction.from, "transaction")
      if (!validation.isGenuine) {
        console.log(`[P2P] Rejected suspicious transaction from ${transaction.from}`)
        return
      }
    }

    // Add to pending transactions
    this.blockchain.addTransaction(transaction)
    console.log(`[P2P] Received transaction: ${transaction.id}`)
  }

  private handlePeerDiscoveryMessage(message: NetworkMessage): void {
  const data = (message as NetworkMessage<{ requestPeerList?: boolean; maxPeers?: number; peers?: Array<{ id: string; address: string; capabilities?: string[] }> }> ).data

    if (data.requestPeerList) {
      // Send our peer list
      const maxPeers = typeof data.maxPeers === "number" ? data.maxPeers : 5
      const peerList = this.getConnectedPeers().slice(0, maxPeers)
      const responseMessage: NetworkMessage = {
        id: this.generateMessageId(),
        type: "peer_discovery",
        data: {
          nodeId: this.nodeId,
          peers: peerList.map((p) => ({
            id: p.id,
            address: p.address,
            capabilities: p.capabilities,
          })),
        },
        sender: this.nodeId,
        timestamp: Date.now(),
        ttl: 1,
      }

      this.sendMessageToPeer(responseMessage, message.sender)
    } else if (Array.isArray(data.peers)) {
      // Process received peer list
      data.peers.forEach((peerData: { id: string; address: string; capabilities?: string[] }) => {
        if (!this.peers.has(peerData.id) && this.peers.size < 50) {
          const newPeer: Peer = {
            id: peerData.id,
            address: peerData.address,
            lastSeen: Date.now(),
            isConnected: false,
            latency: 0,
            trustScore: 0.5,
            version: "1.0.0",
            capabilities: peerData.capabilities || [],
          }
          this.addPeer(newPeer)
        }
      })
    }
  }

  private handleSyncRequestMessage(message: NetworkMessage): void {
  const data = (message as NetworkMessage<{ currentHeight?: number }> ).data
    const ourHeight = this.blockchain.getChainLength()

    if (typeof data.currentHeight === "number" && data.currentHeight < ourHeight) {
      // Send blocks to sync the requesting peer
      const currentHeight = data.currentHeight
      const blocksToSend = this.blockchain.getRecentBlocks(Math.min(10, ourHeight - currentHeight))

      const responseMessage: NetworkMessage = {
        id: this.generateMessageId(),
        type: "sync_response",
        data: {
          nodeId: this.nodeId,
          blocks: blocksToSend,
          currentHeight: ourHeight,
        },
        sender: this.nodeId,
        timestamp: Date.now(),
        ttl: 1,
      }

      this.sendMessageToPeer(responseMessage, message.sender)
    }
  }

  private handleSyncResponseMessage(message: NetworkMessage): void {
  const data = (message as NetworkMessage<{ blocks?: Block[] }> ).data

    if (data.blocks && Array.isArray(data.blocks)) {
      console.log(`[P2P] Received ${data.blocks.length} blocks for synchronization`)
      // In a real implementation, we'd validate and add these blocks
    }
  }

  private handleConsensusMessage(message: NetworkMessage): void {
  const data = (message as NetworkMessage<{ type?: string }> ).data
    console.log(`[P2P] Received consensus message from ${message.sender}:`, data.type)
  }

  private handleHeartbeatMessage(message: NetworkMessage): void {
  const data = (message as NetworkMessage<{ nodeId?: string; capabilities?: string[] }> ).data
    const peer = typeof data.nodeId === "string" ? this.peers.get(data.nodeId) : undefined

    if (peer) {
      peer.lastSeen = Date.now()
      peer.isConnected = true

      // Update peer capabilities if provided
      if (data.capabilities) {
        if (Array.isArray(data.capabilities)) {
          peer.capabilities = data.capabilities as string[]
        }
      }
    }
  }

  public broadcastMessage(message: NetworkMessage): void {
    const connectedPeers = this.getConnectedPeers()

    connectedPeers.forEach((peer) => {
      this.sendMessageToPeer(message, peer.id)
    })

    console.log(`[P2P] Broadcasted ${message.type} message to ${connectedPeers.length} peers`)
  }

  private sendMessageToPeer(message: NetworkMessage, peerId: string): void {
    const peer = this.peers.get(peerId)
    if (!peer || !peer.isConnected) return

    if (peer.address.startsWith("native://")) {
      // Store message in native blockchain for peer retrieval
      this.blockchain.addNativeMessage(message, peerId)
      console.log(`[P2P] Sent ${message.type} to native peer ${peerId}`)
    } else {
      // Legacy WebSocket support
      const connection = this.connections.get(peer.address)
      if (connection && connection.readyState === WebSocket.OPEN) {
        try {
          connection.send(JSON.stringify(message))
        } catch (error) {
          console.error(`[P2P] Failed to send message to ${peerId}:`, error)
          peer.isConnected = false
        }
      }
    }
  }

  private sendMessage(message: NetworkMessage, address: string): void {
    const connection = this.connections.get(address)
    if (connection && connection.readyState === WebSocket.OPEN) {
      try {
        connection.send(JSON.stringify(message))
      } catch (error) {
        console.error(`[P2P] Failed to send message to ${address}:`, error)
      }
    }
  }

  private forwardMessage(message: NetworkMessage): void {
    // Forward to a subset of peers to prevent message flooding
    const connectedPeers = this.getConnectedPeers()
    const forwardCount = Math.min(3, connectedPeers.length)
    const peersToForward = connectedPeers.sort(() => 0.5 - Math.random()).slice(0, forwardCount)

    peersToForward.forEach((peer) => {
      if (peer.id !== message.sender) {
        this.sendMessageToPeer(message, peer.id)
      }
    })
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  public addPeer(peer: Peer): void {
    this.peers.set(peer.id, peer)
    console.log(`[P2P] Added peer: ${peer.id} (${peer.address})`)
  }

  public removePeer(peerId: string): void {
    const peer = this.peers.get(peerId)
    if (peer) {
      this.disconnectFromPeer(peerId)
      this.peers.delete(peerId)
      console.log(`[P2P] Removed peer: ${peerId}`)
    }
  }

  private disconnectFromPeer(peerId: string): void {
    const peer = this.peers.get(peerId)
    if (peer) {
      const connection = this.connections.get(peer.address)
      if (connection) {
        connection.close()
        this.connections.delete(peer.address)
      }
      peer.isConnected = false
    }
  }

  private markPeerDisconnected(address: string): void {
    this.peers.forEach((peer) => {
      if (peer.address === address) {
        peer.isConnected = false
        peer.trustScore = Math.max(0, peer.trustScore - 0.05)
      }
    })
  }

  public broadcastBlock(block: Block): void {
    const message: NetworkMessage = {
      id: this.generateMessageId(),
      type: "block",
      data: { block },
      sender: this.nodeId,
      timestamp: Date.now(),
      ttl: 3,
    }

    this.broadcastMessage(message)
  }

  public broadcastTransaction(transaction: Transaction): void {
    const message: NetworkMessage = {
      id: this.generateMessageId(),
      type: "transaction",
      data: { ...transaction },
      sender: this.nodeId,
      timestamp: Date.now(),
      ttl: 2,
    }

    this.broadcastMessage(message)
  }

  public syncChain(): void {
    this.synchronizeBlockchain()
  }

  public getPeerCount(): number {
    return Array.from(this.peers.values()).filter((peer) => peer.isConnected).length
  }

  public getConnectedPeerCount(): number {
    return this.getPeerCount()
  }

  public getConnectedPeers(): Peer[] {
    return Array.from(this.peers.values()).filter((peer) => peer.isConnected)
  }

  public getAllPeers(): Peer[] {
    return Array.from(this.peers.values())
  }

  public getNetworkTopology(): NetworkTopology {
    return { ...this.networkTopology }
  }

  public getNetworkStats(): {
    totalPeers: number
    connectedPeers: number
    avgLatency: number
    networkHealth: number
    messagesSent: number
    messagesReceived: number
    topology: NetworkTopology
  } {
    const connectedPeers = this.getConnectedPeers()
    const totalPeers = this.peers.size
    const avgLatency = this.calculateAverageLatency(connectedPeers)
    const networkHealth = totalPeers > 0 ? connectedPeers.length / totalPeers : 0

    return {
      totalPeers,
      connectedPeers: connectedPeers.length,
      avgLatency,
      networkHealth,
      messagesSent: this.messageHistory.size, // Simplified metric
      messagesReceived: this.messageHistory.size,
      topology: this.networkTopology,
    }
  }

  public getPeersByCapability(capability: string): Peer[] {
    return this.getConnectedPeers().filter((peer) => peer.capabilities.includes(capability))
  }

  public getHighTrustPeers(minTrust = 0.8): Peer[] {
    return this.getConnectedPeers().filter((peer) => peer.trustScore >= minTrust)
  }

  public disconnect(): void {
    // Stop all intervals
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval)
      this.discoveryInterval = null
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }

    // Close all connections
    this.connections.forEach((connection) => {
      if (connection) {
        connection.close()
      }
    })
    this.connections.clear()

    // Mark all peers as disconnected
    this.peers.forEach((peer) => {
      peer.isConnected = false
    })

    this.isConnected = false
    console.log("[P2P] Disconnected from network")
  }

  public isNetworkConnected(): boolean {
    return this.isConnected && this.getConnectedPeers().length > 0
  }

  public getNodeId(): string {
    return this.nodeId
  }
}
