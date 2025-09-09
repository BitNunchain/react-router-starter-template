/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MiningDashboard } from "@/components/mining-dashboard"
import { SmartContractsDashboard } from "@/components/smart-contracts-dashboard"
import { AIConsensusDashboard } from "@/components/ai-consensus-dashboard"
import { P2PNetworkDashboard } from "@/components/p2p-network-dashboard"
import { TokenEconomicsDashboard } from "@/components/token-economics-dashboard"
import { ContractDeploymentDashboard } from "@/components/contract-deployment-dashboard"
import { Blockchain } from "@/lib/blockchain"
import { MiningEngine } from "@/lib/mining"
import { P2PNetwork } from "@/lib/p2p"
import { SmartContractEngine } from "@/lib/smart-contracts"
import { NFTEngine } from "@/lib/nft-engine"
import { AIConsensusEngine } from "@/lib/ai-consensus"
import { TokenEconomics } from "@/lib/token-economics"
import { UserProfile } from "@/components/user-profile"
import { Leaderboard } from "@/components/leaderboard"
import { ViralSharing } from "@/components/viral-sharing"
import { ChartContainer } from "@/components/ui/chart"
import * as RechartsPrimitive from "recharts"

import Link from "next/link"

export default function BTNBlockchainDashboard() {
  const [blockchain, setBlockchain] = useState<Blockchain | null>(null)
  const [mining, setMining] = useState<MiningEngine | null>(null)
  const [network, setNetwork] = useState<P2PNetwork | null>(null)
  const [contracts, setContracts] = useState<SmartContractEngine | null>(null)
  const [nfts, setNfts] = useState<NFTEngine | null>(null)
  const [aiConsensus, setAiConsensus] = useState<AIConsensusEngine | null>(null)
  const [tokenEconomics, setTokenEconomics] = useState<TokenEconomics | null>(null)
  const [stats, setStats] = useState({
    blocks: 0,
    tokens: 0,
    hashRate: 0,
    peers: 0,
    isMining: false,
    contracts: 0,
    nfts: 0,
    consensusAccuracy: 0.95,
    networkHealth: 1.0,
    deployedContracts: 0,
  })

  useEffect(() => {
    const btnBlockchain = new Blockchain()
    const miningEngine = new MiningEngine(btnBlockchain)
    const aiConsensusEngine = new AIConsensusEngine(btnBlockchain, miningEngine)
    const p2pNetwork = new P2PNetwork(btnBlockchain, aiConsensusEngine)
    const contractEngine = new SmartContractEngine(btnBlockchain)
    const nftEngine = new NFTEngine(btnBlockchain)
    const tokenEconomicsEngine = new TokenEconomics()

    // Connect to production P2P network
  // if (process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK === "mainnet") {
  //   p2pNetwork.connectToBootstrapNodes()
  // }

    setBlockchain(btnBlockchain)
    setMining(miningEngine)
    setAiConsensus(aiConsensusEngine)
    setNetwork(p2pNetwork)
    setContracts(contractEngine)
    setNfts(nftEngine)
    setTokenEconomics(tokenEconomicsEngine)

    // Start production mining
    miningEngine.startBrowserMining()

    let errorCount = 0;
    const interval = setInterval(async () => {
      try {
        // Fetch real-time stats from API
        const response = await fetch("/api/blockchain?action=stats")
        const apiStats = await response.json()

        const contractsResponse = await fetch("/api/contracts/deployed")
        const contractsData = await contractsResponse.json()

        const networkMetrics = aiConsensusEngine.getNetworkMetrics()
        const networkStats = p2pNetwork.getNetworkStats()

        setStats({
          blocks: apiStats.blocks || btnBlockchain.getChainLength(),
          tokens: apiStats.balance || btnBlockchain.getBalance("user"),
          hashRate: apiStats.hashRate || miningEngine.getHashRate(),
          peers: p2pNetwork.getPeerCount(),
          isMining: miningEngine.isMining(),
          contracts: contractEngine.getAllContracts().length,
          nfts: nftEngine.getAllNFTs().length,
          consensusAccuracy: apiStats.consensusAccuracy || networkMetrics.consensusAccuracy,
          networkHealth: apiStats.networkHealth || networkStats.networkHealth,
          deployedContracts: contractsData.count || 0,
        })
        errorCount = 0;
      } catch (error) {
        errorCount++;
        console.error("[Production] Stats update failed:", error)
        if (errorCount > 5) {
          clearInterval(interval);
          alert("Stats update failed repeatedly. Please reload or contact support.");
          return;
        }
        const networkMetrics = aiConsensusEngine.getNetworkMetrics()
        const networkStats = p2pNetwork.getNetworkStats()

        setStats({
          blocks: btnBlockchain.getChainLength(),
          tokens: btnBlockchain.getBalance("user"),
          hashRate: miningEngine.getHashRate(),
          peers: p2pNetwork.getPeerCount(),
          isMining: miningEngine.isMining(),
          contracts: contractEngine.getAllContracts().length,
          nfts: nftEngine.getAllNFTs().length,
          consensusAccuracy: networkMetrics.consensusAccuracy,
          networkHealth: networkStats.networkHealth,
          deployedContracts: 0,
        })
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      mining?.stopMining()
      network?.disconnect()
    }
  }, [mining, network])

  const handleUserAction = async (actionType: string) => {
    if (mining && aiConsensus && tokenEconomics) {
      try {
        const response = await fetch("/api/blockchain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "mine",
            data: {
              userId: "user",
              actionType,
              metadata: { timestamp: Date.now(), userAgent: navigator.userAgent },
            },
          }),
        })

        const result = await response.json()

        if (result.success) {
          console.log(
            `[Production] Action ${actionType} processed - Reward: ${result.reward.toFixed(4)} BTN (Confidence: ${(result.confidence * 100).toFixed(1)}%)`,
          )

          // Broadcast to P2P network
          await fetch("/api/p2p", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "message",
              data: {
                type: "user_action",
                payload: { actionType, reward: result.reward, timestamp: Date.now() },
              },
            }),
          })
        } else {
          console.log(`[Production] Action ${actionType} rejected: ${result.reason}`)
        }
      } catch (error) {
        console.error("[Production] Action processing failed:", error)
        const validation = aiConsensus.validateUserAction("user", actionType)
        if (validation.isGenuine) {
          mining.processUserAction(actionType)
          const userLevel = Math.floor(blockchain?.getBalance("user") || 0 / 10) + 1
          const actionReward = tokenEconomics.calculateActionReward(actionType, userLevel)
          blockchain?.addBalance("user", actionReward)
          // Show tooltip/popover for balance change
          window.dispatchEvent(new CustomEvent("btn-balance-changed", {
            detail: {
              amount: actionReward,
              action: actionType,
              newBalance: blockchain?.getBalance("user"),
            }
          }))
        }
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated SVG Background Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 animate-fade-in" aria-hidden="true">
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e42" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <circle cx="60%" cy="40%" r="600" fill="url(#bgGradient)" />
        <circle cx="20%" cy="80%" r="400" fill="url(#bgGradient)" />
        <ellipse cx="80%" cy="20%" rx="300" ry="120" fill="#a78bfa22" />
      </svg>
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header & Showcase Navigation */}
        <div className="flex justify-center items-center gap-4 mt-6 animate-fade-in">
          <Badge variant="default">Platform Wallet</Badge>
          <span className="font-mono text-xs">PLATFORM_WALLET_SECURE_UNIQUE</span>
          <span className="text-xs text-muted-foreground">Receives 50% mining & all fees</span>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-orange-400 drop-shadow-lg animate-gradient-x">BTN Token Blockchain</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium animate-fade-in">Revolutionary Browser-Based Mining & AI Consensus</p>
          <div className="flex justify-center gap-2 animate-fade-in">
            <Badge variant={stats.isMining ? "default" : "secondary"} className="text-sm shadow-lg">
              {stats.isMining ? "Mining Active" : "Mining Stopped"}
            </Badge>
            <Badge variant="outline" className="text-sm shadow-lg">
              AI Consensus: {(stats.consensusAccuracy * 100).toFixed(1)}%
            </Badge>
            <Badge variant="outline" className="text-sm shadow-lg">
              Network: {(stats.networkHealth * 100).toFixed(1)}%
            </Badge>
            <Badge variant="outline" className="text-sm shadow-lg">
              Native Contracts: {stats.deployedContracts}
            </Badge>
          </div>
          {/* Showcase Navigation Grid */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
            <Link href="/owner-console" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-orange-400 to-indigo-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">🛡️</span>
                  <span className="font-semibold mt-2">Owner Console</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/leaderboard" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-indigo-400 to-purple-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">🏆</span>
                  <span className="font-semibold mt-2">Leaderboard</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/mining" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-yellow-400 to-orange-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">⛏️</span>
                  <span className="font-semibold mt-2">Mining</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/wallet" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-orange-400 to-pink-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">🪙</span>
                  <span className="font-semibold mt-2">Wallet</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/profile" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-teal-400 to-blue-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">👤</span>
                  <span className="font-semibold mt-2">Profile</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/contracts" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-purple-400 to-indigo-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">📜</span>
                  <span className="font-semibold mt-2">Contracts</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/p2p" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-green-400 to-blue-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">🌐</span>
                  <span className="font-semibold mt-2">P2P Network</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/nft" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-pink-400 to-teal-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">🖼️</span>
                  <span className="font-semibold mt-2">NFTs</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/user" className="group">
              <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-2 border-gradient-to-r from-blue-400 to-indigo-400 animate-fade-in">
                <CardContent className="flex flex-col items-center py-4">
                  <span className="text-3xl">🧑‍💻</span>
                  <span className="font-semibold mt-2">User</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {blockchain && mining && <UserProfile blockchain={blockchain} mining={mining} />}
          {blockchain && (
            <Leaderboard
              blockchain={{
                nativeStorage: blockchain.getNativeStorage(),
                getBalance: (address: string) => blockchain.getBalance(address)
              }}
              mining={mining}
            />
          )}
          {blockchain && <ViralSharing blockchain={blockchain} />}
        </div>

  <TokenEconomicsDashboard tokenEconomics={tokenEconomics} blockchain={blockchain} />
  <ContractDeploymentDashboard />

        {/* Next-Gen Stats Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          {/* Blocks Mined Card */}
          <Card className="bg-gradient-to-br from-blue-200/60 to-indigo-300/40 shadow-xl backdrop-blur-lg border-none relative overflow-hidden">
            <CardHeader className="pb-2 flex items-center gap-2">
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/golden-mining-pickaxe-with-blockchain-background.jpg" alt="Blocks" className="w-8 h-8 rounded-full shadow" />
              <CardTitle className="text-sm font-medium">Blocks Mined</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {stats.blocks}
                <span className="animate-pulse text-yellow-500">⛏️</span>
              </div>
              <div className="mt-2">
                <ChartContainer config={{ blocks: { color: '#6366f1', label: 'Blocks' } }}>
                  <RechartsPrimitive.LineChart data={[{ value: stats.blocks }]}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <RechartsPrimitive.Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={true} />
                  </RechartsPrimitive.LineChart>
                </ChartContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">+{Math.floor(stats.hashRate / 1000)} per minute</p>
            </CardContent>
          </Card>

          {/* BTN Tokens Card */}
          <Card className="bg-gradient-to-br from-yellow-100/60 to-orange-200/40 shadow-xl backdrop-blur-lg border-none relative overflow-hidden">
            // eslint-disable-next-line react/jsx-no-comment-textnodes, react/jsx-no-comment-textnodes
            <CardHeader className="pb-2 flex items-center gap-2">
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/glowing-action-buttons-with-energy-effects.jpg" alt="Tokens" className="w-8 h-8 rounded-full shadow" />
              <CardTitle className="text-sm font-medium">BTN Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {stats.tokens.toFixed(4)}
                <span className="animate-pulse text-orange-500">🪙</span>
              </div>
              <div className="mt-2">
                <ChartContainer config={{ tokens: { color: '#f59e42', label: 'Tokens' } }}>
                  <RechartsPrimitive.BarChart data={[{ value: stats.tokens }]}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <RechartsPrimitive.Bar dataKey="value" fill="#f59e42" isAnimationActive={true} />
                  </RechartsPrimitive.BarChart>
                </ChartContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">AI-optimized rewards</p>
            </CardContent>
          </Card>

          {/* Hash Rate Card */}
          <Card className="bg-gradient-to-br from-indigo-100/60 to-blue-300/40 shadow-xl backdrop-blur-lg border-none relative overflow-hidden">
            // eslint-disable-next-line react/jsx-no-comment-textnodes
            <CardHeader className="pb-2 flex items-center gap-2">
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/interconnected-network-nodes-with-glowing-connecti.jpg" alt="Hash Rate" className="w-8 h-8 rounded-full shadow" />
              <CardTitle className="text-sm font-medium">Hash Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {stats.hashRate.toLocaleString()}
                <span className="animate-pulse text-indigo-500">⚡</span>
              </div>
              <div className="mt-2">
                <ChartContainer config={{ hashRate: { color: '#6366f1', label: 'Hash Rate' } }}>
                  <RechartsPrimitive.AreaChart data={[{ value: stats.hashRate }]}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <RechartsPrimitive.Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" isAnimationActive={true} />
                  </RechartsPrimitive.AreaChart>
                </ChartContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">H/s in browser</p>
            </CardContent>
          </Card>

          {/* Network Peers Card */}
          <Card className="bg-gradient-to-br from-green-100/60 to-blue-200/40 shadow-xl backdrop-blur-lg border-none relative overflow-hidden">
            <CardHeader className="pb-2 flex items-center gap-2">
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/blockchain-miner-avatar.jpg" alt="Peers" className="w-8 h-8 rounded-full shadow" />
              <CardTitle className="text-sm font-medium">Network Peers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {stats.peers}
                <span className="animate-pulse text-green-500">🌐</span>
              </div>
              <div className="mt-2">
                <ChartContainer config={{ peers: { color: '#22c55e', label: 'Peers' } }}>
                  <RechartsPrimitive.LineChart data={[{ value: stats.peers }]}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <RechartsPrimitive.Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={true} />
                  </RechartsPrimitive.LineChart>
                </ChartContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">P2P connected</p>
            </CardContent>
          </Card>

          {/* Smart Contracts Card */}
          <Card className="bg-gradient-to-br from-purple-100/60 to-indigo-200/40 shadow-xl backdrop-blur-lg border-none relative overflow-hidden">
            <CardHeader className="pb-2 flex items-center gap-2">
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/diamond-mining-trophy-with-blockchain-crystals.jpg" alt="Contracts" className="w-8 h-8 rounded-full shadow" />
              <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {stats.contracts}
                <span className="animate-pulse text-purple-500">📜</span>
              </div>
              <div className="mt-2">
                <ChartContainer config={{ contracts: { color: '#a78bfa', label: 'Contracts' } }}>
                  <RechartsPrimitive.BarChart data={[{ value: stats.contracts }]}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <RechartsPrimitive.Bar dataKey="value" fill="#a78bfa" isAnimationActive={true} />
                  </RechartsPrimitive.BarChart>
                </ChartContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Local contracts</p>
            </CardContent>
          </Card>

          {/* Native Deployed Card */}
          <Card className="bg-gradient-to-br from-pink-100/60 to-purple-200/40 shadow-xl backdrop-blur-lg border-none relative overflow-hidden">
            <CardHeader className="pb-2 flex items-center gap-2">
              <img src="/placeholder-logo.png" alt="Native" className="w-8 h-8 rounded-full shadow" />
              <CardTitle className="text-sm font-medium">Native Deployed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {stats.deployedContracts}
                <span className="animate-pulse text-pink-500">🖥️</span>
              </div>
              <div className="mt-2">
                <ChartContainer config={{ deployed: { color: '#ec4899', label: 'Deployed' } }}>
                  <RechartsPrimitive.LineChart data={[{ value: stats.deployedContracts }]}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <RechartsPrimitive.Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} isAnimationActive={true} />
                  </RechartsPrimitive.LineChart>
                </ChartContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">On native nodes</p>
            </CardContent>
          </Card>

          {/* NFTs Card */}
          <Card className="bg-gradient-to-br from-teal-100/60 to-blue-200/40 shadow-xl backdrop-blur-lg border-none relative overflow-hidden">
            <CardHeader className="pb-2 flex items-center gap-2">
              <img src="/placeholder-user.jpg" alt="NFTs" className="w-8 h-8 rounded-full shadow" />
              <CardTitle className="text-sm font-medium">NFTs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                {stats.nfts}
                <span className="animate-pulse text-teal-500">🖼️</span>
              </div>
              <div className="mt-2">
                <ChartContainer config={{ nfts: { color: '#14b8a6', label: 'NFTs' } }}>
                  <RechartsPrimitive.AreaChart data={[{ value: stats.nfts }]}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <RechartsPrimitive.Area type="monotone" dataKey="value" stroke="#14b8a6" fill="#14b8a6" isAnimationActive={true} />
                  </RechartsPrimitive.AreaChart>
                </ChartContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Generated locally</p>
            </CardContent>
          </Card>
        </div>

  <P2PNetworkDashboard p2pNetwork={network} />
  <AIConsensusDashboard aiConsensus={aiConsensus} />
  <MiningDashboard miningEngine={mining} />
  <SmartContractsDashboard contractEngine={contracts} nftEngine={nfts} />

        {/* Action Mining */}
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>AI-Validated Action Mining</CardTitle>
            <CardDescription>Actions are validated by AI and broadcast to P2P network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "👆", label: "Click Mine", action: "click" },
                { icon: "📤", label: "Share Mine", action: "share" },
                { icon: "👥", label: "Invite Mine", action: "invite" },
                { icon: "🌐", label: "Visit Mine", action: "visit" },
              ].map(({ icon, label, action }) => (
                <Button
                  key={action}
                  onClick={() => handleUserAction(action)}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 transition-transform duration-300 hover:scale-110 hover:shadow-xl focus:scale-110 focus:shadow-xl border-2 border-gradient-to-r from-indigo-400 to-orange-400 animate-fade-in"
                >
                  <span className="text-2xl">{icon}</span>
                  <span>{label}</span>
                  <span className="text-xs text-muted-foreground">P2P Broadcast</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blocks */}
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Recent Blocks</CardTitle>
            <CardDescription>Latest blocks validated by AI consensus and synchronized via P2P</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {blockchain?.getRecentBlocks(5).map((block, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                  <div>
                    <div className="font-mono text-sm">Block #{block.index}</div>
                    <div className="text-xs text-muted-foreground">Hash: {block.hash.substring(0, 16)}...</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">+{block.reward} BTN</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs animate-fade-in">AI Validated</Badge>
                      <Badge variant="outline" className="text-xs animate-fade-in">P2P Synced</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
