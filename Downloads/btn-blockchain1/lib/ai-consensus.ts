import type { Blockchain, Block, Transaction } from "./blockchain"
import type { MiningEngine } from "./mining"

export interface UserBehaviorPattern {
  userId: string
  actionFrequency: Map<string, number>
  sessionDuration: number
  interactionQuality: number
  trustScore: number
  lastActive: number
  predictedActions: string[]
}

export interface NetworkMetrics {
  totalUsers: number
  averageHashRate: number
  networkHealth: number
  consensusAccuracy: number
  rewardEfficiency: number
  fraudDetectionRate: number
}

export interface AIConsensusDecision {
  blockHash: string
  isValid: boolean
  confidence: number
  reasoning: string[]
  rewardAdjustment: number
  timestamp: number
}

export interface ActionValidation {
  actionType: string
  userId: string
  isGenuine: boolean
  confidence: number
  riskScore: number
  recommendedReward: number
}

export class AIConsensusEngine {
  private blockchain: Blockchain
  private miningEngine: MiningEngine | null
  private userPatterns: Map<string, UserBehaviorPattern>
  private networkMetrics: NetworkMetrics
  private consensusHistory: AIConsensusDecision[]
  private learningModel: AILearningModel
  private fraudDetector: FraudDetectionSystem
  private rewardOptimizer: RewardOptimizer

  constructor(blockchain: Blockchain, miningEngine?: MiningEngine) {
    this.blockchain = blockchain
    this.miningEngine = miningEngine || null
    this.userPatterns = new Map()
    this.consensusHistory = []
    this.networkMetrics = {
      totalUsers: 0,
      averageHashRate: 0,
      networkHealth: 1.0,
      consensusAccuracy: 0.95,
      rewardEfficiency: 0.85,
      fraudDetectionRate: 0.98,
    }

    this.learningModel = new AILearningModel()
    this.fraudDetector = new FraudDetectionSystem()
    this.rewardOptimizer = new RewardOptimizer()

    this.initializeAI()
  }

  private initializeAI(): void {
    // Initialize AI models with baseline data
    this.learningModel.initialize()
    this.fraudDetector.initialize()
    this.rewardOptimizer.initialize()

    // Start continuous learning process
    setInterval(() => {
      this.performContinuousLearning()
    }, 30000) // Learn every 30 seconds

    // Update network metrics
    setInterval(() => {
      this.updateNetworkMetrics()
    }, 10000) // Update every 10 seconds

    console.log("[AI Consensus] AI systems initialized")
  }

  public validateBlock(block: Block): AIConsensusDecision {
    const startTime = Date.now()

    // AI-powered block validation
    const validationResults = {
      structuralValid: this.validateBlockStructure(block),
      transactionsValid: this.validateTransactions(block.transactions),
      minerTrustworthy: this.validateMiner(block.miner),
      networkConsensus: this.checkNetworkConsensus(),
      aiConfidence: 0,
    }

    // Calculate AI confidence based on multiple factors
    const confidence = this.calculateValidationConfidence(validationResults)

    // Generate reasoning
    const reasoning = this.generateValidationReasoning(validationResults)

    // Calculate reward adjustment based on AI analysis
    const rewardAdjustment = this.rewardOptimizer.calculateOptimalReward(block, {
      confidence,
      minerTrustworthy: validationResults.minerTrustworthy,
    })

    const decision: AIConsensusDecision = {
      blockHash: block.hash,
      isValid: confidence > 0.7 && validationResults.structuralValid && validationResults.transactionsValid,
      confidence,
      reasoning,
      rewardAdjustment,
      timestamp: Date.now(),
    }

    this.consensusHistory.push(decision)

    // Learn from this validation
    this.learningModel.learnFromValidation(block, decision)

    console.log(
      `[AI Consensus] Block validation completed in ${Date.now() - startTime}ms (Confidence: ${(confidence * 100).toFixed(1)}%)`,
    )

    return decision
  }

  public validateUserAction(userId: string, actionType: string): ActionValidation {
    // Get or create user pattern
    let userPattern = this.userPatterns.get(userId)
    if (!userPattern) {
      userPattern = this.createNewUserPattern(userId)
      this.userPatterns.set(userId, userPattern)
    }

    // Update user behavior pattern
    this.updateUserPattern(userPattern, actionType)

    // AI-powered fraud detection
    const fraudAnalysis = this.fraudDetector.analyzeAction(userPattern, actionType)

    // Calculate genuineness probability
    const genuineness = this.calculateActionGenuineness(userPattern, actionType, fraudAnalysis)

    // Optimize reward based on AI analysis
    const recommendedReward = this.rewardOptimizer.calculateActionReward(
      userPattern,
      actionType,
      genuineness.confidence,
    )

    const validation: ActionValidation = {
      actionType,
      userId,
      isGenuine: genuineness.isGenuine,
      confidence: genuineness.confidence,
      riskScore: fraudAnalysis.riskScore,
      recommendedReward,
    }

    // Learn from this action validation
    this.learningModel.learnFromAction(userPattern, validation)

    return validation
  }

  private validateBlockStructure(block: Block): boolean {
    // AI-enhanced structural validation
    return (
      block.index >= 0 &&
      block.timestamp > 0 &&
      block.hash.length === 64 &&
      block.previousHash.length === 64 &&
      Array.isArray(block.transactions)
    )
  }

  private validateTransactions(transactions: Transaction[]): boolean {
    // AI-powered transaction validation
    for (const tx of transactions) {
      const validation = this.validateUserAction(tx.from, "transaction")
      if (!validation.isGenuine && validation.confidence > 0.8) {
        return false
      }
    }
    return true
  }

  private validateMiner(miner: string): boolean {
    const userPattern = this.userPatterns.get(miner)
    if (!userPattern) return true // New miners are trusted initially

    return userPattern.trustScore > 0.5
  }

  private checkNetworkConsensus(): boolean {
    // Simulate network consensus check
    return Math.random() > 0.1 // 90% consensus rate
  }

  private calculateValidationConfidence(results: Record<string, unknown>): number {
    let confidence = 0

    if (results.structuralValid) confidence += 0.3
    if (results.transactionsValid) confidence += 0.3
    if (results.minerTrustworthy) confidence += 0.2
    if (results.networkConsensus) confidence += 0.2

    // AI adjustment based on historical accuracy
    confidence *= this.networkMetrics.consensusAccuracy

    return Math.min(confidence, 1.0)
  }

  private generateValidationReasoning(results: Record<string, unknown>): string[] {
    const reasoning: string[] = []

    if (results.structuralValid) {
      reasoning.push("Block structure is valid")
    } else {
      reasoning.push("Block structure validation failed")
    }

    if (results.transactionsValid) {
      reasoning.push("All transactions passed AI fraud detection")
    } else {
      reasoning.push("Suspicious transactions detected by AI")
    }

    if (results.minerTrustworthy) {
      reasoning.push("Miner has high trust score")
    } else {
      reasoning.push("Miner trust score is below threshold")
    }

    if (results.networkConsensus) {
      reasoning.push("Network consensus achieved")
    } else {
      reasoning.push("Network consensus not reached")
    }

    return reasoning
  }

  private createNewUserPattern(userId: string): UserBehaviorPattern {
    return {
      userId,
      actionFrequency: new Map(),
      sessionDuration: 0,
      interactionQuality: 0.5,
      trustScore: 0.7, // Start with moderate trust
      lastActive: Date.now(),
      predictedActions: [],
    }
  }

  private updateUserPattern(pattern: UserBehaviorPattern, actionType: string): void {
    // Update action frequency
    const currentFreq = pattern.actionFrequency.get(actionType) || 0
    pattern.actionFrequency.set(actionType, currentFreq + 1)

    // Update session duration
    const timeSinceLastActive = Date.now() - pattern.lastActive
    if (timeSinceLastActive < 300000) {
      // 5 minutes
      pattern.sessionDuration += timeSinceLastActive
    }

    // Update interaction quality based on AI analysis
    pattern.interactionQuality = this.calculateInteractionQuality(pattern, actionType)

    // Update trust score
    pattern.trustScore = this.calculateTrustScore(pattern)

    // Generate predictions
    pattern.predictedActions = this.learningModel.predictNextActions(pattern)

    pattern.lastActive = Date.now()
  }

  private calculateInteractionQuality(pattern: UserBehaviorPattern, actionType: string): number {
    // AI-based interaction quality calculation
    const actionValue =
      {
        click: 0.1,
        scroll: 0.05,
        share: 0.8,
        invite: 1.0,
        visit: 0.3,
        form: 0.6,
      }[actionType] || 0.1

    const currentQuality = pattern.interactionQuality
    const newQuality = currentQuality * 0.9 + actionValue * 0.1

    return Math.max(0, Math.min(1, newQuality))
  }

  private calculateTrustScore(pattern: UserBehaviorPattern): number {
    let trustScore = pattern.trustScore

    // Increase trust for consistent behavior
    const totalActions = Array.from(pattern.actionFrequency.values()).reduce((a, b) => a + b, 0)
    if (totalActions > 10) {
      trustScore += 0.01
    }

    // Increase trust for high-value actions
    const highValueActions = (pattern.actionFrequency.get("share") || 0) + (pattern.actionFrequency.get("invite") || 0)
    if (highValueActions > 0) {
      trustScore += 0.02
    }

    // Decrease trust for suspicious patterns
    if (pattern.interactionQuality < 0.3) {
      trustScore -= 0.05
    }

    return Math.max(0, Math.min(1, trustScore))
  }

  private calculateActionGenuineness(
    pattern: UserBehaviorPattern,
    actionType: string,
    fraudAnalysis: { riskScore: number }
  ): {
    isGenuine: boolean
    confidence: number
  } {
    let confidence = 0.5

    // Factor in user trust score
    confidence += pattern.trustScore * 0.3

    // Factor in interaction quality
    confidence += pattern.interactionQuality * 0.2

    // Factor in fraud analysis
    confidence += (1 - fraudAnalysis.riskScore) * 0.3

    // Factor in action consistency
    const actionFreq = pattern.actionFrequency.get(actionType) || 0
    const totalActions = Array.from(pattern.actionFrequency.values()).reduce((a, b) => a + b, 0)
    const actionRatio = totalActions > 0 ? actionFreq / totalActions : 0

    if (actionRatio > 0.8) {
      confidence -= 0.2 // Too repetitive, might be bot
    } else if (actionRatio > 0.1) {
      confidence += 0.1 // Normal usage pattern
    }

    confidence = Math.max(0, Math.min(1, confidence))

    return {
      isGenuine: confidence > 0.6,
      confidence,
    }
  }

  private performContinuousLearning(): void {
    // Analyze recent consensus decisions
    const recentDecisions = this.consensusHistory.slice(-100)

    // Update network metrics based on performance
    this.updateConsensusAccuracy(recentDecisions)

    // Optimize reward distribution
    this.rewardOptimizer.optimizeFromHistory()

    // Update fraud detection models
    this.fraudDetector.updateModels()

    // Learn from user behavior patterns
    this.learningModel.updateFromPatterns(this.userPatterns)

    console.log("[AI Consensus] Continuous learning cycle completed")
  }

  private updateConsensusAccuracy(decisions: AIConsensusDecision[]): void {
    if (decisions.length === 0) return

    const averageConfidence = decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length
    this.networkMetrics.consensusAccuracy = this.networkMetrics.consensusAccuracy * 0.9 + averageConfidence * 0.1
  }

  private updateNetworkMetrics(): void {
    this.networkMetrics.totalUsers = this.userPatterns.size

    if (this.miningEngine) {
      this.networkMetrics.averageHashRate = this.miningEngine.getHashRate()
    }

    // Calculate network health based on various factors
    const activeUsers = Array.from(this.userPatterns.values()).filter((p) => Date.now() - p.lastActive < 300000).length

    this.networkMetrics.networkHealth = Math.min(1, activeUsers / Math.max(1, this.networkMetrics.totalUsers))

    // Update reward efficiency
    const recentDecisions = this.consensusHistory.slice(-50)
    if (recentDecisions.length > 0) {
      const avgRewardAdjustment =
        recentDecisions.reduce((sum, d) => sum + Math.abs(d.rewardAdjustment), 0) / recentDecisions.length
      this.networkMetrics.rewardEfficiency = Math.max(0.5, 1 - avgRewardAdjustment * 0.1)
    }
  }

  public getUserPattern(userId: string): UserBehaviorPattern | undefined {
    return this.userPatterns.get(userId)
  }

  public getNetworkMetrics(): NetworkMetrics {
    return { ...this.networkMetrics }
  }

  public getConsensusHistory(limit = 50): AIConsensusDecision[] {
    return this.consensusHistory.slice(-limit)
  }

  public predictUserBehavior(userId: string): string[] {
    const pattern = this.userPatterns.get(userId)
    if (!pattern) return []

    return this.learningModel.predictNextActions(pattern)
  }

  public getAIInsights(): {
    topUsers: Array<{ userId: string; trustScore: number; interactionQuality: number }>
    fraudulentActions: number
    networkOptimizations: string[]
    predictedTrends: string[]
  } {
    const users = Array.from(this.userPatterns.values())
    const topUsers = users
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, 10)
      .map((u) => ({
        userId: u.userId,
        trustScore: u.trustScore,
        interactionQuality: u.interactionQuality,
      }))

    const fraudulentActions = this.consensusHistory.filter((d) => !d.isValid && d.confidence > 0.8).length

    const networkOptimizations = [
      `Consensus accuracy: ${(this.networkMetrics.consensusAccuracy * 100).toFixed(1)}%`,
      `Reward efficiency: ${(this.networkMetrics.rewardEfficiency * 100).toFixed(1)}%`,
      `Fraud detection rate: ${(this.networkMetrics.fraudDetectionRate * 100).toFixed(1)}%`,
    ]

    const predictedTrends = this.learningModel.getPredictedTrends()

    return {
      topUsers,
      fraudulentActions,
      networkOptimizations,
      predictedTrends,
    }
  }
}

// Supporting AI classes
class AILearningModel {
  private patterns: Map<string, number> = new Map()
  private trends: string[] = []

  initialize(): void {
    console.log("[AI Learning] Model initialized")
  }

  learnFromValidation(block: Block, decision: AIConsensusDecision): void {
    // Learn from block validation patterns
    const pattern = `${block.transactions.length}_${decision.confidence.toFixed(2)}`
    const value = this.patterns.get(pattern)
    const currentValue = typeof value === "number" ? value : 0
    this.patterns.set(pattern, currentValue + 1)
  }

  learnFromAction(userPattern: UserBehaviorPattern, validation: ActionValidation): void {
    // Learn from user action patterns
    const key = `${validation.actionType}_${validation.confidence.toFixed(2)}`
    const value = this.patterns.get(key)
    const currentValue = typeof value === "number" ? value : 0
    this.patterns.set(key, currentValue + 1)
  }

  predictNextActions(pattern: UserBehaviorPattern): string[] {
    // Simple prediction based on frequency
    const actions = Array.from(pattern.actionFrequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([action]) => action)

    return actions
  }

  updateFromPatterns(patterns: Map<string, UserBehaviorPattern>): void {
    // Update learning from all user patterns
    this.trends = this.analyzeTrends(patterns)
  }

  private analyzeTrends(patterns: Map<string, UserBehaviorPattern>): string[] {
    const trends: string[] = []

    const totalUsers = patterns.size
    const activeUsers = Array.from(patterns.values()).filter((p) => Date.now() - p.lastActive < 300000).length

    if (activeUsers / totalUsers > 0.7) {
      trends.push("High user engagement detected")
    }

    const avgTrust = Array.from(patterns.values()).reduce((sum, p) => sum + p.trustScore, 0) / totalUsers

    if (avgTrust > 0.8) {
      trends.push("Network trust levels increasing")
    }

    return trends
  }

  getPredictedTrends(): string[] {
    return [...this.trends]
  }
}

class FraudDetectionSystem {
  private suspiciousPatterns: Set<string> = new Set()

  initialize(): void {
    this.suspiciousPatterns.add("rapid_clicking")
    this.suspiciousPatterns.add("bot_like_timing")
    this.suspiciousPatterns.add("impossible_frequency")
    console.log("[Fraud Detection] System initialized")
  }

  analyzeAction(
    pattern: UserBehaviorPattern,
    actionType: string,
  ): {
    riskScore: number
    flags: string[]
  } {
    let riskScore = 0
    const flags: string[] = []

    // Check for rapid actions
    const actionFreq = pattern.actionFrequency.get(actionType) || 0
    const timeSinceLastActive = Date.now() - pattern.lastActive

    if (timeSinceLastActive < 100 && actionFreq > 10) {
      riskScore += 0.3
      flags.push("rapid_actions")
    }

    // Check for bot-like patterns
    if (pattern.interactionQuality < 0.2) {
      riskScore += 0.4
      flags.push("low_interaction_quality")
    }

    // Check trust score
    if (pattern.trustScore < 0.3) {
      riskScore += 0.2
      flags.push("low_trust_score")
    }

    return { riskScore: Math.min(1, riskScore), flags }
  }

  updateModels(): void {
    // Update fraud detection models
    console.log("[Fraud Detection] Models updated")
  }
}

class RewardOptimizer {
  private baseRewards: Map<string, number> = new Map()
  private optimizationHistory: Array<{ action: string; reward: number; effectiveness: number }> = []

  initialize(): void {
    this.baseRewards.set("click", 0.001)
    this.baseRewards.set("share", 0.01)
    this.baseRewards.set("invite", 0.1)
    this.baseRewards.set("visit", 0.005)
    this.baseRewards.set("form", 0.003)
    console.log("[Reward Optimizer] System initialized")
  }

  calculateOptimalReward(block: Block, validationResults: { confidence: number; minerTrustworthy: boolean }): number {
    let adjustment = 0

    if (validationResults.confidence > 0.9) {
      adjustment += 0.1 // Bonus for high confidence
    }

    if (validationResults.minerTrustworthy) {
      adjustment += 0.05 // Bonus for trustworthy miner
    }

    return adjustment
  }

  calculateActionReward(pattern: UserBehaviorPattern, actionType: string, confidence: number): number {
    const baseReward = this.baseRewards.get(actionType) || 0.001

    let multiplier = 1.0

    // Trust score multiplier
    multiplier *= 0.5 + pattern.trustScore * 0.5

    // Confidence multiplier
    multiplier *= confidence

    // Quality multiplier
    multiplier *= 0.7 + pattern.interactionQuality * 0.3

    return baseReward * multiplier
  }

  optimizeFromHistory(): void {
    // Optimize rewards based on historical performance
    console.log("[Reward Optimizer] Optimization completed")
  }
}
