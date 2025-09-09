// Native Node.js blockchain server
import { createServer } from "http"
import { WebSocketServer } from "ws"
import * as crypto from "crypto"
import { Level } from "level"

interface Transaction {
  from: string
  to: string
  amount: number
  timestamp: number
  signature: string
}

interface Block {
  index: number
  timestamp: number
  transactions: Transaction[]
  previousHash: string
  nonce: number
  hash: string
  merkleRoot: string
}

export class NativeNodeServer {
  private db: Level<string, string>
  private blockchain: Block[] = []
  private pendingTransactions: Transaction[] = []
  private peers: Set<any> = new Set()
  private difficulty = 4
  private miningReward = 100
  private balances: Map<string, number> = new Map()

  constructor(dbPath = "./blockchain-db") {
    this.db = new Level(dbPath, { valueEncoding: "json" })
    this.initializeBlockchain()
  }

  private async initializeBlockchain(): Promise<void> {
    try {
      // Load existing blockchain from database
      const chainData = await this.db.get("blockchain")
      this.blockchain = JSON.parse(chainData)
      console.log(`[Native Node] Loaded ${this.blockchain.length} blocks from database`)
    } catch (error) {
      // Create genesis block if no blockchain exists
      console.log("[Native Node] Creating genesis block...")
      this.createGenesisBlock()
      await this.saveBlockchain()
    }

    // Rebuild balances from blockchain
    this.rebuildBalances()
  }

  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: "0",
      nonce: 0,
      hash: "",
      merkleRoot: "",
    }

    genesisBlock.hash = this.calculateHash(genesisBlock)
    this.blockchain.push(genesisBlock)
  }

  private calculateHash(block: Block): string {
    const data = `${block.index}${block.timestamp}${block.previousHash}${block.merkleRoot}${block.nonce}${JSON.stringify(block.transactions)}`
    return crypto.createHash("sha256").update(data).digest("hex")
  }

  private calculateMerkleRoot(transactions: Transaction[]): string {
    if (transactions.length === 0) return ""

    let hashes = transactions.map((tx) => crypto.createHash("sha256").update(JSON.stringify(tx)).digest("hex"))

    while (hashes.length > 1) {
      const nextLevel: string[] = []
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i]
        const right = hashes[i + 1] || left
        const combined = crypto
          .createHash("sha256")
          .update(left + right)
          .digest("hex")
        nextLevel.push(combined)
      }
      hashes = nextLevel
    }

    return hashes[0]
  }

  private mineBlock(block: Block): boolean {
    const target = "0".repeat(this.difficulty)
    let attempts = 0
    const maxAttempts = 1000000

    while (!block.hash.startsWith(target) && attempts < maxAttempts) {
      block.nonce++
      block.hash = this.calculateHash(block)
      attempts++

      if (attempts % 10000 === 0) {
        console.log(`[Native Node] Mining attempt: ${attempts}, nonce: ${block.nonce}`)
      }
    }

    return attempts < maxAttempts
  }

  public addTransaction(transaction: Transaction): boolean {
    // Validate transaction
    if (transaction.from !== "system") {
      const balance = this.getBalance(transaction.from)
      if (balance < transaction.amount) {
        console.log("[Native Node] Insufficient balance for transaction")
        return false
      }
    }

    this.pendingTransactions.push(transaction)
    this.broadcastToNetwork("new_transaction", transaction)
    return true
  }

  public async minePendingTransactions(rewardAddress: string): Promise<boolean> {
    // Add mining reward
    const rewardTransaction: Transaction = {
      from: "system",
      to: rewardAddress,
      amount: this.miningReward,
      timestamp: Date.now(),
      signature: "system",
    }
    this.pendingTransactions.push(rewardTransaction)

    const previousBlock = this.blockchain[this.blockchain.length - 1]
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      previousHash: previousBlock.hash,
      nonce: 0,
      hash: "",
      merkleRoot: this.calculateMerkleRoot(this.pendingTransactions),
    }

    console.log(`[Native Node] Mining block ${newBlock.index}...`)
    const success = this.mineBlock(newBlock)

    if (success) {
      console.log(`[Native Node] Block ${newBlock.index} mined successfully! Hash: ${newBlock.hash}`)

      // Update balances
      newBlock.transactions.forEach((tx) => {
        if (tx.from !== "system") {
          const fromBalance = this.balances.get(tx.from) || 0
          this.balances.set(tx.from, fromBalance - tx.amount)
        }
        const toBalance = this.balances.get(tx.to) || 0
        this.balances.set(tx.to, toBalance + tx.amount)
      })

      this.blockchain.push(newBlock)
      this.pendingTransactions = []

      await this.saveBlockchain()
      this.broadcastToNetwork("new_block", newBlock)

      return true
    }

    console.log("[Native Node] Mining failed - too many attempts")
    return false
  }

  private async saveBlockchain(): Promise<void> {
    try {
      await this.db.put("blockchain", JSON.stringify(this.blockchain))
    } catch (error) {
      console.error("[Native Node] Failed to save blockchain:", error)
    }
  }

  private rebuildBalances(): void {
    this.balances.clear()

    for (const block of this.blockchain) {
      for (const tx of block.transactions) {
        if (tx.from !== "system") {
          const fromBalance = this.balances.get(tx.from) || 0
          this.balances.set(tx.from, fromBalance - tx.amount)
        }
        const toBalance = this.balances.get(tx.to) || 0
        this.balances.set(tx.to, toBalance + tx.amount)
      }
    }
  }

  public getBalance(address: string): number {
    return this.balances.get(address) || 0
  }

  public getBlockchainStats(): any {
    return {
      blocks: this.blockchain.length,
      difficulty: this.difficulty,
      pendingTransactions: this.pendingTransactions.length,
      totalAddresses: this.balances.size,
      isValid: this.isChainValid(),
      peers: this.peers.size,
      native: true,
    }
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i]
      const previousBlock = this.blockchain[i - 1]

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  private broadcastToNetwork(type: string, data: any): void {
    const message = JSON.stringify({ type, data, timestamp: Date.now() })
    this.peers.forEach((peer) => {
      if (peer.readyState === 1) {
        // WebSocket.OPEN
        peer.send(message)
      }
    })
  }

  public startServer(port = 8080): void {
    const server = createServer()
    const wss = new WebSocketServer({ server })

    wss.on("connection", (ws) => {
      console.log("[Native Node] New peer connected")
      this.peers.add(ws)

      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message.toString())
          this.handlePeerMessage(ws, data)
        } catch (error) {
          console.error("[Native Node] Invalid message from peer:", error)
        }
      })

      ws.on("close", () => {
        console.log("[Native Node] Peer disconnected")
        this.peers.delete(ws)
      })

      // Send current blockchain stats to new peer
      ws.send(
        JSON.stringify({
          type: "blockchain_stats",
          data: this.getBlockchainStats(),
        }),
      )
    })

    server.listen(port, () => {
      console.log(`[Native Node] BTN Blockchain node running on port ${port}`)
      console.log(`[Native Node] WebSocket server ready for P2P connections`)
    })
  }

  private handlePeerMessage(ws: any, message: any): void {
    switch (message.type) {
      case "get_blockchain":
        ws.send(
          JSON.stringify({
            type: "blockchain_data",
            data: this.blockchain,
          }),
        )
        break

      case "new_transaction":
        this.addTransaction(message.data)
        break

      case "request_mining":
        this.minePendingTransactions(message.data.rewardAddress)
        break

      case "get_balance":
        ws.send(
          JSON.stringify({
            type: "balance_response",
            data: {
              address: message.data.address,
              balance: this.getBalance(message.data.address),
            },
          }),
        )
        break

      default:
        console.log("[Native Node] Unknown message type:", message.type)
    }
  }
}

// Start the native node server if this file is run directly
if (require.main === module) {
  const node = new NativeNodeServer()
  node.startServer(process.env.PORT ? Number.parseInt(process.env.PORT) : 8080)
}
