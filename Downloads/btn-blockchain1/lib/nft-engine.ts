import type { Blockchain, Transaction } from "./blockchain"

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
  animation_url?: string
}

export interface NFT {
  id: string
  tokenId: number
  contractAddress: string
  owner: string
  metadata: NFTMetadata
  createdAt: number
  lastTransfer: number
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  generatedLocally: boolean
}

export interface NFTCollection {
  id: string
  name: string
  symbol: string
  description: string
  owner: string
  totalSupply: number
  maxSupply: number
  baseURI: string
  createdAt: number
}

export class NFTEngine {
  private nfts: Map<string, NFT>
  private collections: Map<string, NFTCollection>
  private blockchain: Blockchain
  private tokenIdCounter: number

  constructor(blockchain: Blockchain) {
    this.nfts = new Map()
    this.collections = new Map()
    this.blockchain = blockchain
    this.tokenIdCounter = 1
    this.initializeDefaultCollections()
  }

  private initializeDefaultCollections(): void {
    // BTN Mining Achievements Collection
    this.createCollection({
      name: "BTN Mining Achievements",
      symbol: "BTNMA",
      description: "Exclusive NFTs for BTN blockchain miners and contributors",
      owner: "system",
      maxSupply: 10000,
      baseURI: "https://btn.network/nft/achievements/",
    })

    // BTN Action Rewards Collection
    this.createCollection({
      name: "BTN Action Rewards",
      symbol: "BTNAR",
      description: "Dynamic NFTs earned through platform interactions",
      owner: "system",
      maxSupply: 50000,
      baseURI: "https://btn.network/nft/actions/",
    })
  }

  public createCollection(params: {
    name: string
    symbol: string
    description: string
    owner: string
    maxSupply: number
    baseURI: string
  }): string {
    const collectionId = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const collection: NFTCollection = {
      id: collectionId,
      name: params.name,
      symbol: params.symbol,
      description: params.description,
      owner: params.owner,
      totalSupply: 0,
      maxSupply: params.maxSupply,
      baseURI: params.baseURI,
      createdAt: Date.now(),
    }

    this.collections.set(collectionId, collection)

    // Add collection creation transaction
    const transaction: Transaction = {
      id: `nft_collection_${collectionId}`,
      from: params.owner,
      to: "nft_engine",
      amount: 0,
      timestamp: Date.now(),
    }

    this.blockchain.addTransaction(transaction)

    console.log(`[NFT] Created collection: ${params.name}`)
    return collectionId
  }

  public mintNFT(params: {
    collectionId: string
    owner: string
    metadata: NFTMetadata
    rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary"
  }): string {
    const collection = this.collections.get(params.collectionId)
    if (!collection) {
      throw new Error(`Collection ${params.collectionId} not found`)
    }

    if (collection.totalSupply >= collection.maxSupply) {
      throw new Error(`Collection ${collection.name} has reached max supply`)
    }

    const nftId = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const tokenId = this.tokenIdCounter++

    const nft: NFT = {
      id: nftId,
      tokenId,
      contractAddress: params.collectionId,
      owner: params.owner,
      metadata: params.metadata,
      createdAt: Date.now(),
      lastTransfer: Date.now(),
      rarity: params.rarity || this.calculateRarity(),
      generatedLocally: true,
    }

    this.nfts.set(nftId, nft)
    collection.totalSupply++

    // Add minting transaction
    const transaction: Transaction = {
      id: `nft_mint_${nftId}`,
      from: "nft_engine",
      to: params.owner,
      amount: 0,
      timestamp: Date.now(),
    }

    this.blockchain.addTransaction(transaction)

    console.log(`[NFT] Minted NFT: ${params.metadata.name} (${nft.rarity})`)
    return nftId
  }

  private calculateRarity(): "common" | "uncommon" | "rare" | "epic" | "legendary" {
    const random = Math.random()
    if (random < 0.5) return "common"
    if (random < 0.75) return "uncommon"
    if (random < 0.9) return "rare"
    if (random < 0.98) return "epic"
    return "legendary"
  }

  public transferNFT(nftId: string, from: string, to: string): boolean {
    const nft = this.nfts.get(nftId)
    if (!nft) {
      throw new Error(`NFT ${nftId} not found`)
    }

    if (nft.owner !== from) {
      throw new Error(`NFT ${nftId} is not owned by ${from}`)
    }

    nft.owner = to
    nft.lastTransfer = Date.now()

    // Add transfer transaction
    const transaction: Transaction = {
      id: `nft_transfer_${nftId}`,
      from,
      to,
      amount: 0,
      timestamp: Date.now(),
    }

    this.blockchain.addTransaction(transaction)

    console.log(`[NFT] Transferred NFT ${nftId} from ${from} to ${to}`)
    return true
  }

  public generateAchievementNFT(
    user: string,
    achievement: {
      type: "first_block" | "mining_milestone" | "action_master" | "network_contributor"
      milestone?: number
    },
  ): string {
    const achievementCollectionId = Array.from(this.collections.keys())[0] // BTN Mining Achievements

    const metadata = this.generateAchievementMetadata(achievement)

    return this.mintNFT({
      collectionId: achievementCollectionId,
      owner: user,
      metadata,
      rarity: this.getAchievementRarity(achievement.type),
    })
  }

  private generateAchievementMetadata(achievement: {
    type: "first_block" | "mining_milestone" | "action_master" | "network_contributor"
    milestone?: number
  }): NFTMetadata {
    const achievements = {
      first_block: {
        name: "First Block Miner",
        description: "Congratulations on mining your first block on the BTN network!",
        image: "/golden-mining-pickaxe-with-blockchain-background.jpg",
        attributes: [
          { trait_type: "Achievement Type", value: "Mining" },
          { trait_type: "Rarity", value: "Uncommon" },
          { trait_type: "Date Earned", value: new Date().toISOString().split("T")[0] },
        ],
      },
      mining_milestone: {
        name: `Mining Milestone: ${achievement.milestone} Blocks`,
        description: `Achieved the milestone of mining ${achievement.milestone} blocks on the BTN network!`,
        image: "/diamond-mining-trophy-with-blockchain-crystals.jpg",
        attributes: [
          { trait_type: "Achievement Type", value: "Mining Milestone" },
          { trait_type: "Blocks Mined", value: achievement.milestone || 0 },
          { trait_type: "Rarity", value: "Rare" },
          { trait_type: "Date Earned", value: new Date().toISOString().split("T")[0] },
        ],
      },
      action_master: {
        name: "Action Mining Master",
        description: "Master of action mining - earned through consistent platform interactions!",
        image: "/glowing-action-buttons-with-energy-effects.jpg",
        attributes: [
          { trait_type: "Achievement Type", value: "Action Mining" },
          { trait_type: "Rarity", value: "Epic" },
          { trait_type: "Date Earned", value: new Date().toISOString().split("T")[0] },
        ],
      },
      network_contributor: {
        name: "Network Contributor",
        description: "Valuable contributor to the BTN network ecosystem!",
        image: "/interconnected-network-nodes-with-glowing-connecti.jpg",
        attributes: [
          { trait_type: "Achievement Type", value: "Network" },
          { trait_type: "Rarity", value: "Legendary" },
          { trait_type: "Date Earned", value: new Date().toISOString().split("T")[0] },
        ],
      },
    }

    return achievements[achievement.type]
  }

  private getAchievementRarity(type: string): "common" | "uncommon" | "rare" | "epic" | "legendary" {
    const rarityMap = {
      first_block: "uncommon" as const,
      mining_milestone: "rare" as const,
      action_master: "epic" as const,
      network_contributor: "legendary" as const,
    }
    return rarityMap[type as keyof typeof rarityMap] || "common"
  }

  public generateActionRewardNFT(user: string, actionType: string, count: number): string {
    const actionCollectionId = Array.from(this.collections.keys())[1] // BTN Action Rewards

    const metadata: NFTMetadata = {
      name: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Master`,
      description: `Earned through ${count} ${actionType} actions on the BTN platform!`,
      image: `/placeholder.svg?height=400&width=400&query=${actionType} action reward badge with BTN logo`,
      attributes: [
        { trait_type: "Action Type", value: actionType },
        { trait_type: "Action Count", value: count },
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Generated", value: "Locally" },
        { trait_type: "Date Earned", value: new Date().toISOString().split("T")[0] },
      ],
    }

    return this.mintNFT({
      collectionId: actionCollectionId,
      owner: user,
      metadata,
      rarity: count > 1000 ? "rare" : count > 100 ? "uncommon" : "common",
    })
  }

  public getNFT(nftId: string): NFT | undefined {
    return this.nfts.get(nftId)
  }

  public getNFTsByOwner(owner: string): NFT[] {
    return Array.from(this.nfts.values()).filter((nft) => nft.owner === owner)
  }

  public getNFTsByCollection(collectionId: string): NFT[] {
    return Array.from(this.nfts.values()).filter((nft) => nft.contractAddress === collectionId)
  }

  public getCollection(collectionId: string): NFTCollection | undefined {
    return this.collections.get(collectionId)
  }

  public getAllCollections(): NFTCollection[] {
    return Array.from(this.collections.values())
  }

  public getAllNFTs(): NFT[] {
    return Array.from(this.nfts.values())
  }

  public getNFTStats(): {
    totalNFTs: number
    totalCollections: number
    rarityDistribution: Record<string, number>
    recentMints: NFT[]
  } {
    const nfts = this.getAllNFTs()
    const rarityDistribution = nfts.reduce(
      (acc, nft) => {
        acc[nft.rarity] = (acc[nft.rarity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const recentMints = nfts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10)

    return {
      totalNFTs: nfts.length,
      totalCollections: this.collections.size,
      rarityDistribution,
      recentMints,
    }
  }
}
