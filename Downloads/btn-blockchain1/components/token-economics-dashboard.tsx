"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TokenEconomics, TokenMetrics, StakingPool } from "@/lib/token-economics"
import type { Blockchain } from "@/lib/blockchain"
import { toast } from "sonner"

interface TokenEconomicsDashboardProps {
  tokenEconomics: TokenEconomics | null
  blockchain: Blockchain | null
}

export function TokenEconomicsDashboard({ tokenEconomics, blockchain }: TokenEconomicsDashboardProps) {
  const [metrics, setMetrics] = useState<TokenMetrics | null>(null)
  const [analytics, setAnalytics] = useState<ReturnType<TokenEconomics['getEconomicAnalytics']> | null>(null)
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([])
  const [userStakes, setUserStakes] = useState<{ poolId: string; amount: number; rewards: number; canUnstake: boolean }[]>([])
  const [stakeAmount, setStakeAmount] = useState("")
  const [selectedPool, setSelectedPool] = useState("")

  useEffect(() => {
    if (!tokenEconomics) return

    const updateData = () => {
      setMetrics(tokenEconomics.getTokenMetrics())
      setAnalytics(tokenEconomics.getEconomicAnalytics())
      setStakingPools(tokenEconomics.getAllStakingPools())
      setUserStakes(tokenEconomics.getUserStakes("user"))
    }

    updateData()
    const interval = setInterval(updateData, 5000)
    return () => clearInterval(interval)
  }, [tokenEconomics])

  const handleStake = () => {
    if (!tokenEconomics || !selectedPool || !stakeAmount) return

    const amount = Number.parseFloat(stakeAmount)
    const userBalance = blockchain?.getBalance("user") || 0

    if (amount > userBalance) {
      toast.error("Insufficient BTN balance")
      return
    }

    if (tokenEconomics.stakeTokens("user", selectedPool, amount)) {
      blockchain?.addBalance("user", -amount)
      toast.success(`Staked ${amount} BTN successfully!`)
      setStakeAmount("")
    } else {
      toast.error("Staking failed. Check minimum requirements.")
    }
  }

  const handleUnstake = (poolId: string, amount: number) => {
    if (!tokenEconomics) return

    if (tokenEconomics.unstakeTokens("user", poolId, amount)) {
      blockchain?.addBalance("user", amount)
      toast.success(`Unstaked ${amount} BTN successfully!`)
    } else {
      toast.error("Unstaking failed. Check lock period.")
    }
  }

  if (!metrics || !analytics) {
    return <div>Loading token economics...</div>
  }

  return (
    <div className="dashboard-card">
      <Card>
      <CardHeader>
        <CardTitle>Token Economics & Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Token Supply Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{(metrics.totalSupply / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-muted-foreground">Total Supply</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {(metrics.circulatingSupply / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-muted-foreground">Circulating</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">{(metrics.burnedTokens / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">Burned</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{(metrics.stakedTokens / 1000).toFixed(1)}K</div>
                <div className="text-xs text-muted-foreground">Staked</div>
              </div>
            </div>

            {/* Economic Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Inflation Rate</span>
                  <Badge variant="outline">{(metrics.inflationRate * 100).toFixed(1)}%</Badge>
                </div>
                <Progress value={metrics.inflationRate * 100} className="h-2" />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Burn Rate</span>
                  <Badge variant="destructive">{(metrics.burnRate * 100).toFixed(1)}%</Badge>
                </div>
                <Progress value={metrics.burnRate * 100} className="h-2" />
              </div>
            </div>

            {/* Network Value */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${(analytics.networkValue / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">Total Network Value</div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <span>Velocity: {analytics.tokenVelocity.toFixed(2)}</span>
                  <span>Stability: {(analytics.priceStability * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staking" className="space-y-4">
            {/* Staking Interface */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3">Stake BTN Tokens</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label htmlFor="staking-pool-select" className="font-medium">
                  Select Staking Pool
                </label>
                <select
                  id="staking-pool-select"
                  title="Select Staking Pool"
                  value={selectedPool}
                  onChange={(e) => setSelectedPool(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="">Select Pool</option>
                  {stakingPools.map((pool) => (
                    <option key={pool.id} value={pool.id}>
                      {pool.name} - {pool.apy}% APY
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Amount to stake"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
                <Button onClick={handleStake} disabled={!selectedPool || !stakeAmount}>
                  Stake BTN
                </Button>
              </div>
            </div>

            {/* Staking Pools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stakingPools.map((pool) => (
                <div key={pool.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{pool.name}</div>
                      <div className="text-sm text-muted-foreground">Min: {pool.minStake} BTN</div>
                    </div>
                    <Badge variant="secondary" className="text-lg">
                      {pool.apy}% APY
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Staked:</span>
                      <span>{pool.totalStaked.toFixed(2)} BTN</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Lock Period:</span>
                      <span>
                        {pool.lockPeriod === 0 ? "Flexible" : `${pool.lockPeriod / (24 * 60 * 60 * 1000)} days`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* User Stakes */}
            {userStakes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Your Stakes</h4>
                <div className="space-y-2">
                  {userStakes.map((stake, index) => {
                    const pool = stakingPools.find((p) => p.id === stake.poolId)
                    return (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{pool?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {stake.amount.toFixed(2)} BTN • Rewards: {stake.rewards.toFixed(4)} BTN
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!stake.canUnstake}
                          onClick={() => handleUnstake(stake.poolId, stake.amount)}
                        >
                          {stake.canUnstake ? "Unstake" : "Locked"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            {/* Reward Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Reward Distribution</h4>
              <div className="space-y-3">
                {Object.entries(tokenEconomics?.getRewardDistribution() || {}).map(([category, percentage]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={percentage * 100} className="w-24 h-2" />
                      <span className="text-sm font-medium">{(percentage * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yield Farming */}
            <div>
              <h4 className="font-semibold mb-3">Yield Farming Opportunities</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tokenEconomics?.getYieldFarmingOpportunities().map((farm) => (
                  <div key={farm.id} className="p-4 border rounded-lg">
                    <div className="font-semibold">{farm.name}</div>
                    <div className="text-2xl font-bold text-green-600 my-2">{farm.apy}% APY</div>
                    <div className="text-sm text-muted-foreground mb-3">TVL: ${(farm.tvl / 1000000).toFixed(1)}M</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {farm.rewards.map((reward) => (
                        <Badge key={reward} variant="outline" className="text-xs">
                          {reward}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full">
                      Add Liquidity
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Economic Health Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{(analytics.stakingRatio * 100).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Staking Ratio</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{analytics.tokenVelocity.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Token Velocity</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{(analytics.rewardEfficiency * 100).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Reward Efficiency</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold">{(analytics.priceStability * 100).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Price Stability</div>
              </div>
            </div>

            {/* Deflationary Status */}
            <div
              className={`p-4 rounded-lg ${analytics.burnDeflationary ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-center gap-2">
                <div className={`text-2xl ${analytics.burnDeflationary ? "text-green-600" : "text-red-600"}`}>
                  {analytics.burnDeflationary ? "🔥" : "📈"}
                </div>
                <div>
                  <div className="font-semibold">
                    {analytics.burnDeflationary ? "Deflationary Mode" : "Inflationary Mode"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {analytics.burnDeflationary
                      ? "Burn rate exceeds inflation - token supply decreasing"
                      : "Inflation exceeds burn rate - token supply increasing"}
                  </div>
                </div>
              </div>
            </div>

            {/* Economic Projections */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3">Economic Projections (30 days)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Projected Supply Change</div>
                  <div className="text-lg font-bold">
                    {analytics.burnDeflationary ? "-" : "+"}
                    {(((metrics.inflationRate - metrics.burnRate) * metrics.circulatingSupply * 30) / 365).toFixed(0)}{" "}
                    BTN
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Projected Staking Rewards</div>
                  <div className="text-lg font-bold">+{((metrics.stakedTokens * 0.25 * 30) / 365).toFixed(0)} BTN</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      </Card>
    </div>
  )
}
