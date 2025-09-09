  // ...existing code...
import type { NetworkMessage } from "./p2p"

export interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  timestamp: number
  signature?: string
}

export interface Block {
  index: number
  timestamp: number
  transactions: Transaction[]
  previousHash: string
  hash: string
  nonce: number
  reward: number
  miner: string
}

export interface NativeStorage {
  blocks: Block[]
  transactions: Transaction[]
  balances: Map<string, number>
  messages: Map<string, NetworkMessage[]>
    userProfiles: Map<string, Record<string, unknown>>
    contracts: Map<string, Record<string, unknown>>
    nfts: Map<string, Record<string, unknown>>
    analytics: Map<string, Record<string, unknown>>
}

export class Blockchain {
  public getNativeStorage(): NativeStorage {
    return this.nativeStorage;
  }
  /**
   * Directly add to the balance of an address (used for rewards, airdrops, etc.)
   */
  public addBalance(address: string, amount: number): void {
    this.balances.set(address, (this.balances.get(address) || 0) + amount)
    this.saveToNativeStorage()
  }
  private chain: Block[]
  private difficulty: number
  private miningReward: number
  private pendingTransactions: Transaction[]
  private balances: Map<string, number>
  private nativeStorage: NativeStorage
  private storageKey = "btn_native_blockchain"

  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 2 // Low difficulty for browser mining
    this.miningReward = 0.1
    this.pendingTransactions = []
    this.balances = new Map()
    this.balances.set("user", 0)

    this.nativeStorage = {
      blocks: [],
      transactions: [],
      balances: new Map(),
      userProfiles: new Map(),
      contracts: new Map(),
      nfts: new Map(),
      messages: new Map(),
      analytics: new Map(),
    }

    this.loadFromNativeStorage()
  }

  private loadFromNativeStorage(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(this.storageKey)
        if (stored) {
          const data = JSON.parse(stored)
          this.chain = data.blocks || [this.createGenesisBlock()]
          this.balances = new Map(data.balances || [])
          this.pendingTransactions = data.pendingTransactions || []
          this.nativeStorage = {
            blocks: data.blocks || [],
            transactions: data.transactions || [],
            balances: new Map(data.balances || []),
            userProfiles: new Map(data.userProfiles || []),
            contracts: new Map(data.contracts || []),
            nfts: new Map(data.nfts || []),
            messages: new Map(data.messages || []),
            analytics: new Map(data.analytics || []),
          }
          console.log(`[Blockchain] Loaded ${this.chain.length} blocks from native storage`)
        }
      } catch (error) {
        console.warn("[Blockchain] Failed to load from native storage:", error)
      }
    }
  }

  private saveToNativeStorage(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const data = {
          blocks: this.chain,
          transactions: this.nativeStorage.transactions,
          balances: Array.from(this.balances.entries()),
          pendingTransactions: this.pendingTransactions,
          userProfiles: Array.from(this.nativeStorage.userProfiles.entries()),
          contracts: Array.from(this.nativeStorage.contracts.entries()),
          nfts: Array.from(this.nativeStorage.nfts.entries()),
          messages: Array.from(this.nativeStorage.messages.entries()),
          analytics: Array.from(this.nativeStorage.analytics.entries()),
          timestamp: Date.now(),
        }
        window.localStorage.setItem(this.storageKey, JSON.stringify(data))
        console.log("[Blockchain] Saved to native storage")
      } catch (error) {
        console.warn("[Blockchain] Failed to save to native storage:", error)
      }
    }
  }

  public storeUserProfile(address: string, profile: Record<string, unknown>): void {
  this.nativeStorage.userProfiles.set(address, profile)
    this.saveToNativeStorage()
  }

  public getUserProfile(address: string): Record<string, unknown> | undefined {
  // returns Record<string, unknown> | undefined
  return this.nativeStorage.userProfiles.get(address)
  }

  public storeContract(contractId: string, contract: Record<string, unknown>): void {
  // contract type is now Record<string, unknown>
  this.nativeStorage.contracts.set(contractId, contract)
    this.saveToNativeStorage()
  }

  public getContract(contractId: string): Record<string, unknown> | undefined {
  // returns Record<string, unknown> | undefined
  return this.nativeStorage.contracts.get(contractId)
  }

  public getAllContracts(): Record<string, unknown>[] {
  // returns Record<string, unknown>[]
  return Array.from(this.nativeStorage.contracts.values())
  }

  public storeNFT(nftId: string, nft: Record<string, unknown>): void {
  // nft type is now Record<string, unknown>
  this.nativeStorage.nfts.set(nftId, nft)
    this.saveToNativeStorage()
  }

  public getNFT(nftId: string): Record<string, unknown> | undefined {
  // returns Record<string, unknown> | undefined
  return this.nativeStorage.nfts.get(nftId)
  }

  public getAllNFTs(): Record<string, unknown>[] {
  // returns Record<string, unknown>[]
  return Array.from(this.nativeStorage.nfts.values())
  }

  public addNativeMessage(message: NetworkMessage, peerId: string): void {
    const peerMessages = this.nativeStorage.messages.get(peerId) || []
    peerMessages.push(message)
    this.nativeStorage.messages.set(peerId, peerMessages)
    this.saveToNativeStorage()
  }

  public getNativeMessages(peerId: string): NetworkMessage[] {
    return this.nativeStorage.messages.get(peerId) || []
  }

  public storeAnalytics(key: string, data: Record<string, unknown>): void {
  // data type is now Record<string, unknown>
  this.nativeStorage.analytics.set(key, data)
    this.saveToNativeStorage()
  }

  public getAnalytics(key: string): Record<string, unknown> | undefined {
  // returns Record<string, unknown> | undefined
  return this.nativeStorage.analytics.get(key)
  }

  private createGenesisBlock(): Block {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: "0",
      hash: "",
      nonce: 0,
      reward: 0,
      miner: "genesis",
    }
    genesisBlock.hash = this.calculateHash(genesisBlock)
    return genesisBlock
  }

  private calculateHash(block: Block): string {
    const data = block.index + block.timestamp + JSON.stringify(block.transactions) + block.previousHash + block.nonce
    return this.sha256(data)
  }

  private sha256(message: string): string {
    // Simple hash function for browser compatibility
    let hash = 0
    if (message.length === 0) return hash.toString(16).padStart(64, "0")

    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    // Convert to hex and pad to 64 characters to simulate SHA-256 length
    const hex = Math.abs(hash).toString(16)
    return hex.padStart(64, "0")
  }

  private mineBlock(block: Block): Block {
    const target = Array(this.difficulty + 1).join("0")

    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++
      block.hash = this.calculateHash(block)
    }

    return block
  }

  public addBlock(miner = "user"): Block {
    const previousBlock = this.getLatestBlock()
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      previousHash: previousBlock.hash,
      hash: "",
      nonce: 0,
      reward: this.miningReward,
      miner,
    }

    const minedBlock = this.mineBlock(newBlock)
    this.chain.push(minedBlock)

    this.nativeStorage.blocks.push(minedBlock)

    // Reward the miner
    this.balances.set(miner, (this.balances.get(miner) || 0) + this.miningReward)

    // Process pending transactions
    this.processPendingTransactions()
    this.pendingTransactions = []

    this.saveToNativeStorage()

    return minedBlock
  }

  private processPendingTransactions(): void {
    for (const transaction of this.pendingTransactions) {
      const fromBalance = this.balances.get(transaction.from) || 0
      const toBalance = this.balances.get(transaction.to) || 0

      if (fromBalance >= transaction.amount) {
        this.balances.set(transaction.from, fromBalance - transaction.amount)
        this.balances.set(transaction.to, toBalance + transaction.amount)

        this.nativeStorage.transactions.push(transaction)
      }
    }
  }

  public addTransaction(transaction: Transaction): void {
    this.pendingTransactions.push(transaction)
    this.saveToNativeStorage()
  }

  public getBalance(address: string): number {
    return this.balances.get(address) || 0
  }

  public getTransactionsForAddress(address: string): Transaction[] {
    // Return all transactions where address is sender or receiver
    return this.nativeStorage.transactions.filter(
      tx => tx.from === address || tx.to === address
    )
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  public getChainLength(): number {
    return this.chain.length
  }

  public getRecentBlocks(count: number): Block[] {
    return this.chain.slice(-count).reverse()
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  public getChain(): Block[] {
    return [...this.chain]
  }

  public getNativeStorageStats(): {
    totalBlocks: number
    totalTransactions: number
    totalUsers: number
    totalContracts: number
    totalNFTs: number
    totalMessages: number
    storageSize: string
  } {
    let storageSize = "0 KB"
    if (typeof window !== "undefined" && window.localStorage) {
      const storageData = window.localStorage.getItem(this.storageKey)
      storageSize = storageData ? (storageData.length / 1024).toFixed(2) + " KB" : "0 KB"
    }

    return {
      totalBlocks: this.nativeStorage.blocks.length,
      totalTransactions: this.nativeStorage.transactions.length,
      totalUsers: this.nativeStorage.userProfiles.size,
      totalContracts: this.nativeStorage.contracts.size,
      totalNFTs: this.nativeStorage.nfts.size,
      totalMessages: Array.from(this.nativeStorage.messages.values()).reduce((sum, msgs) => sum + msgs.length, 0),
      storageSize,
    }
  }
}
