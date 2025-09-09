export interface TokenMetrics {
  totalSupply: number
  circulatingSupply: number
  burnedTokens: number
  stakedTokens: number
  rewardPool: number
  inflationRate: number
  burnRate: number
}

export interface StakingPool {
  id: string
  name: string
  apy: number
  minStake: number
  lockPeriod: number
  totalStaked: number
  rewards: number
}

export interface RewardDistribution {
  mining: number
  staking: number
  referrals: number
  social: number
  governance: number
}

export class TokenEconomics {
  private totalSupply = 21000000 // 21M BTN tokens max supply
  private circulatingSupply = 0
  private burnedTokens = 0
  private rewardPool = 1000000 // 1M tokens for rewards
  private stakingPools: Map<string, StakingPool> = new Map()
  private userStakes: Map<string, { poolId: string; amount: number; timestamp: number }[]> = new Map()
  private rewardDistribution: RewardDistribution = {
    mining: 0.4, // 40% to mining
    staking: 0.25, // 25% to staking
    referrals: 0.15, // 15% to referrals
    social: 0.1, // 10% to social actions
    governance: 0.1, // 10% to governance
  }

  constructor() {
    this.initializeStakingPools()
    this.startEconomicEngine()
  }

  private initializeStakingPools() {
    const pools: StakingPool[] = [
      {
        id: "flexible",
        name: "Flexible Staking",
        apy: 8.5,
        minStake: 10,
        lockPeriod: 0,
        totalStaked: 0,
        rewards: 0,
      },
      {
        id: "30day",
        name: "30-Day Lock",
        apy: 15.2,
        minStake: 50,
        lockPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
        totalStaked: 0,
        rewards: 0,
      },
      {
        id: "90day",
        name: "90-Day Lock",
        apy: 25.8,
        minStake: 100,
        lockPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days in ms
        totalStaked: 0,
        rewards: 0,
      },
      {
        id: "365day",
        name: "1-Year Lock",
        apy: 45.0,
        minStake: 500,
        lockPeriod: 365 * 24 * 60 * 60 * 1000, // 365 days in ms
        totalStaked: 0,
        rewards: 0,
      },
    ]

    pools.forEach((pool) => this.stakingPools.set(pool.id, pool))
  }

  private startEconomicEngine() {
    // Run economic calculations every minute
    setInterval(() => {
      this.calculateStakingRewards()
      this.adjustInflationRate()
      this.processBurning()
      this.rebalanceRewardPools()
    }, 60000)
  }

  // Token Supply Management
  getTokenMetrics(): TokenMetrics {
    const stakedTokens = Array.from(this.stakingPools.values()).reduce((sum, pool) => sum + pool.totalStaked, 0)

    return {
      totalSupply: this.totalSupply,
      circulatingSupply: this.circulatingSupply,
      burnedTokens: this.burnedTokens,
      stakedTokens,
      rewardPool: this.rewardPool,
      inflationRate: this.calculateInflationRate(),
      burnRate: this.calculateBurnRate(),
    }
  }

  private calculateInflationRate(): number {
    // Dynamic inflation based on network activity
    const utilizationRate = this.circulatingSupply / this.totalSupply
    return Math.max(0.02, 0.08 - utilizationRate * 0.06) // 2-8% range
  }

  private calculateBurnRate(): number {
    // Burn rate increases with network activity
    const activityScore = this.getNetworkActivityScore()
    return Math.min(0.05, activityScore * 0.001) // Max 5% burn rate
  }

  private getNetworkActivityScore(): number {
    // Simulate network activity score
    return Math.random() * 100
  }

  // Staking System
  stakeTokens(userId: string, poolId: string, amount: number): boolean {
    const pool = this.stakingPools.get(poolId)
    if (!pool || amount < pool.minStake) return false

    if (!this.userStakes.has(userId)) {
      this.userStakes.set(userId, [])
    }

    const userStakes = this.userStakes.get(userId)!
    userStakes.push({
      poolId,
      amount,
      timestamp: Date.now(),
    })

    pool.totalStaked += amount
    this.stakingPools.set(poolId, pool)

    return true
  }

  unstakeTokens(userId: string, poolId: string, amount: number): boolean {
    const pool = this.stakingPools.get(poolId)
    const userStakes = this.userStakes.get(userId)

    if (!pool || !userStakes) return false

    const stakeIndex = userStakes.findIndex(
      (stake) =>
        stake.poolId === poolId &&
        stake.amount >= amount &&
        (pool.lockPeriod === 0 || Date.now() - stake.timestamp >= pool.lockPeriod),
    )

    if (stakeIndex === -1) return false

    const stake = userStakes[stakeIndex]
    if (stake.amount === amount) {
      userStakes.splice(stakeIndex, 1)
    } else {
      stake.amount -= amount
    }

    pool.totalStaked -= amount
    this.stakingPools.set(poolId, pool)

    return true
  }

  getUserStakes(userId: string): { poolId: string; amount: number; rewards: number; canUnstake: boolean }[] {
    const userStakes = this.userStakes.get(userId) || []

    return userStakes.map((stake) => {
      const pool = this.stakingPools.get(stake.poolId)!
      const stakingDuration = Date.now() - stake.timestamp
      const canUnstake = pool.lockPeriod === 0 || stakingDuration >= pool.lockPeriod

      // Calculate rewards based on APY and time staked
      const yearlyReward = stake.amount * (pool.apy / 100)
      const timeRatio = stakingDuration / (365 * 24 * 60 * 60 * 1000)
      const rewards = yearlyReward * timeRatio

      return {
        poolId: stake.poolId,
        amount: stake.amount,
        rewards,
        canUnstake,
      }
    })
  }

  private calculateStakingRewards() {
    // Distribute staking rewards to all pools
    this.stakingPools.forEach((pool) => {
      const dailyReward = (pool.totalStaked * pool.apy) / 100 / 365
      pool.rewards += dailyReward
      this.rewardPool -= dailyReward
    })
  }

  // Reward Distribution
  calculateMiningReward(hashRate: number, difficulty: number): number {
    const baseReward = 10 // Base BTN reward per block
    const hashRateBonus = Math.log10(hashRate / 1000) * 0.5
    const difficultyAdjustment = Math.max(0.5, 2 - difficulty / 1000000)

    return baseReward * (1 + hashRateBonus) * difficultyAdjustment
  }

  calculateActionReward(actionType: string, userLevel: number): number {
    const baseRewards: { [key: string]: number } = {
      click: 0.1,
      share: 2.0,
      invite: 5.0,
      visit: 0.5,
      stake: 1.0,
      vote: 3.0,
    }

    const baseReward = baseRewards[actionType] || 0.1
    const levelMultiplier = 1 + (userLevel - 1) * 0.1

    return baseReward * levelMultiplier
  }

  calculateReferralReward(referredUserLevel: number): number {
    // Referral rewards increase with referred user's level
    return 10 + referredUserLevel * 2
  }

  // Token Burning Mechanism
  private processBurning() {
    const burnAmount = (this.circulatingSupply * this.calculateBurnRate()) / 365 // Daily burn
    this.burnedTokens += burnAmount
    this.circulatingSupply -= burnAmount

    console.log(`[Economics] Burned ${burnAmount.toFixed(4)} BTN tokens`)
  }

  burnTokens(amount: number, reason: string) {
    this.burnedTokens += amount
    this.circulatingSupply -= amount

    console.log(`[Economics] Manual burn: ${amount} BTN (${reason})`)
  }

  // Economic Balancing
  private adjustInflationRate() {
    const metrics = this.getTokenMetrics()

    // Adjust reward distribution based on network health
    if (metrics.circulatingSupply / metrics.totalSupply > 0.8) {
      // Increase burn rate when supply is high
      this.rewardDistribution.mining *= 0.95
    } else if (metrics.circulatingSupply / metrics.totalSupply < 0.3) {
      // Increase mining rewards when supply is low
      this.rewardDistribution.mining *= 1.05
    }
  }

  private rebalanceRewardPools() {
    // Ensure reward pool doesn't go negative
    if (this.rewardPool < 1000) {
      // Mint new tokens for rewards (controlled inflation)
      const newTokens = Math.min(10000, this.totalSupply * 0.001)
      this.rewardPool += newTokens
      this.circulatingSupply += newTokens

      console.log(`[Economics] Minted ${newTokens} BTN for reward pool`)
    }
  }

  // Governance and Voting
  calculateVotingPower(stakedAmount: number, stakingDuration: number): number {
    const baseVotingPower = stakedAmount
    const durationBonus = Math.min(2, stakingDuration / (365 * 24 * 60 * 60 * 1000))

    return baseVotingPower * (1 + durationBonus)
  }

  // Yield Farming
  getYieldFarmingOpportunities() {
    return [
      {
        id: "btn-eth",
        name: "BTN-ETH LP",
        apy: 85.2,
        tvl: 2500000,
        rewards: ["BTN", "Trading Fees"],
      },
      {
        id: "btn-usdc",
        name: "BTN-USDC LP",
        apy: 65.8,
        tvl: 1800000,
        rewards: ["BTN", "Trading Fees"],
      },
      {
        id: "btn-mining",
        name: "Mining Pool",
        apy: 120.5,
        tvl: 5000000,
        rewards: ["BTN", "NFTs", "Governance Tokens"],
      },
    ]
  }

  // Analytics
  getEconomicAnalytics() {
    const metrics = this.getTokenMetrics()

    return {
      tokenVelocity: this.calculateTokenVelocity(),
      stakingRatio: metrics.stakedTokens / metrics.circulatingSupply,
      burnDeflationary: metrics.burnRate > metrics.inflationRate,
      rewardEfficiency: this.calculateRewardEfficiency(),
      networkValue: this.calculateNetworkValue(),
      priceStability: this.calculatePriceStability(),
    }
  }

  private calculateTokenVelocity(): number {
    // Simulate token velocity (transactions per token per day)
    return 0.15 + Math.random() * 0.1
  }

  private calculateRewardEfficiency(): number {
    // How efficiently rewards are distributed
    return 0.85 + Math.random() * 0.1
  }

  private calculateNetworkValue(): number {
    // Total network value in USD (simulated)
    return this.circulatingSupply * (50 + Math.random() * 20) // $50-70 per BTN
  }

  private calculatePriceStability(): number {
    // Price stability score (0-1)
    return 0.7 + Math.random() * 0.2
  }

  getAllStakingPools(): StakingPool[] {
    return Array.from(this.stakingPools.values())
  }

  getRewardDistribution(): RewardDistribution {
    return { ...this.rewardDistribution }
  }
}
