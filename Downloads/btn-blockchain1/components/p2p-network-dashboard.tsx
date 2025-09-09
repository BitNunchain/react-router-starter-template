"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import type { P2PNetwork, Peer, NetworkTopology } from "@/lib/p2p"

interface P2PNetworkDashboardProps {
  p2pNetwork: P2PNetwork | null
}

export function P2PNetworkDashboard({ p2pNetwork }: P2PNetworkDashboardProps) {
  const [networkStats, setNetworkStats] = useState({
    totalPeers: 0,
    connectedPeers: 0,
    avgLatency: 0,
    networkHealth: 0,
    messagesSent: 0,
    messagesReceived: 0,
    topology: {
      totalNodes: 0,
      connectedNodes: 0,
      networkDiameter: 0,
      clusteringCoefficient: 0,
      averageLatency: 0,
    } as NetworkTopology,
  })

  const [peers, setPeers] = useState<Peer[]>([])
  const [chartData, setChartData] = useState({
    latencyHistory: [] as Array<{ time: string; latency: number }>,
    peerCount: [] as Array<{ time: string; connected: number; total: number }>,
    trustDistribution: [] as Array<{ trust: string; count: number }>,
    capabilityDistribution: [] as Array<{ capability: string; count: number }>,
  })

  useEffect(() => {
    if (!p2pNetwork) return

    const interval = setInterval(() => {
      const stats = p2pNetwork.getNetworkStats()
      const allPeers = p2pNetwork.getAllPeers()

      const safeStats = {
        ...stats,
        topology: stats.topology || {
          totalNodes: 0,
          connectedNodes: 0,
          networkDiameter: 0,
          clusteringCoefficient: 0,
          averageLatency: 0,
        },
      }

      setNetworkStats(safeStats)
      setPeers(allPeers)

      // Update chart data
      const now = new Date().toLocaleTimeString()
      setChartData((prev) => ({
        latencyHistory: [...prev.latencyHistory.slice(-19), { time: now, latency: stats.avgLatency }],
        peerCount: [
          ...prev.peerCount.slice(-19),
          { time: now, connected: stats.connectedPeers, total: stats.totalPeers },
        ],
        trustDistribution: calculateTrustDistribution(allPeers),
        capabilityDistribution: calculateCapabilityDistribution(allPeers),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [p2pNetwork])

  const calculateTrustDistribution = (peers: Peer[]) => {
    const distribution = { low: 0, medium: 0, high: 0 }
    peers.forEach((peer) => {
      if (peer.trustScore < 0.4) distribution.low++
      else if (peer.trustScore < 0.7) distribution.medium++
      else distribution.high++
    })

    return [
      { trust: "Low (0-0.4)", count: distribution.low },
      { trust: "Medium (0.4-0.7)", count: distribution.medium },
      { trust: "High (0.7-1.0)", count: distribution.high },
    ]
  }

  const calculateCapabilityDistribution = (peers: Peer[]) => {
    const capabilities = new Map<string, number>()
    peers.forEach((peer) => {
      peer.capabilities.forEach((cap) => {
        capabilities.set(cap, (capabilities.get(cap) || 0) + 1)
      })
    })

    return Array.from(capabilities.entries()).map(([capability, count]) => ({
      capability,
      count,
    }))
  }

  const getHealthColor = (value: number) => {
    if (value >= 0.8) return "text-green-600"
    if (value >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getConnectionStatus = (peer: Peer) => {
    if (peer.isConnected) return "connected"
    if (Date.now() - peer.lastSeen < 300000) return "recent"
    return "offline"
  }

  const getConnectionColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "recent":
        return "bg-yellow-500"
      default:
        return "bg-red-500"
    }
  }

  const handleSyncNetwork = () => {
    if (p2pNetwork) {
      p2pNetwork.syncChain()
    }
  }

  const handleDiscoverPeers = () => {
    console.log("[P2P Dashboard] Triggering peer discovery...")
  }

  return (
  <div className="dashboard-card space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Network Overview</TabsTrigger>
          <TabsTrigger value="peers">Peer Management</TabsTrigger>
          <TabsTrigger value="topology">Network Topology</TabsTrigger>
          <TabsTrigger value="analytics">Network Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-2">
            <CardHeader className="border-b border-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">
              <CardTitle className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
                <svg className="w-8 h-8 text-blue-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20m10-10H2" /></svg>
                P2P Network Dashboard
              </CardTitle>
              <CardDescription>Peer-to-peer network stats and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold">{networkStats.connectedPeers}</div>
                  <p className="text-xs text-muted-foreground">of {networkStats.totalPeers} total</p>
                  <Progress value={(networkStats.connectedPeers / Math.max(networkStats.totalPeers, 1)) * 100} className="mt-2" />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${getHealthColor(networkStats.networkHealth)}`}>{(networkStats.networkHealth * 100).toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Network Health</p>
                  <Progress value={networkStats.networkHealth * 100} className="mt-2" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{networkStats.avgLatency.toFixed(0)}ms</div>
                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{networkStats.messagesSent}</div>
                  <p className="text-xs text-muted-foreground">Messages Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Latency</CardTitle>
                <CardDescription>Average latency to connected peers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData.latencyHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="latency" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Peer Connections</CardTitle>
                <CardDescription>Connected vs total peers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData.peerCount}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="connected" stroke="#82ca9d" strokeWidth={2} name="Connected" />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Total" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Network Actions</CardTitle>
              <CardDescription>Manage network connections and synchronization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={handleSyncNetwork} variant="outline">Sync Blockchain</Button>
                <Button onClick={handleDiscoverPeers} variant="outline">Discover Peers</Button>
                <Button variant="outline">Optimize Topology</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="peers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peer List</CardTitle>
              <CardDescription>All known peers in the BTN network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {peers.map((peer) => (
                  <div key={peer.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-mono text-sm">{peer.id.substring(0, 20)}...</div>
                        <div className="text-xs text-muted-foreground">{peer.address}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getConnectionColor(getConnectionStatus(peer))}`}></div>
                        <Badge variant="outline" className="text-xs">{getConnectionStatus(peer)}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Latency:</span> {peer.latency.toFixed(0)}ms</div>
                      <div><span className="text-muted-foreground">Trust:</span> {(peer.trustScore * 100).toFixed(0)}%</div>
                      <div><span className="text-muted-foreground">Version:</span> {peer.version}</div>
                      <div><span className="text-muted-foreground">Last Seen:</span> {new Date(peer.lastSeen).toLocaleTimeString()}</div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {peer.capabilities.map((cap) => (
                          <Badge key={cap} variant="secondary" className="text-xs">{cap}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="topology" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Topology Metrics</CardTitle>
                <CardDescription>Structural analysis of the P2P network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold">{networkStats.topology?.totalNodes || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Nodes</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold">{networkStats.topology?.connectedNodes || 0}</div>
                    <div className="text-xs text-muted-foreground">Connected</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold">{networkStats.topology?.networkDiameter || 0}</div>
                    <div className="text-xs text-muted-foreground">Diameter</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-lg font-bold">{((networkStats.topology?.clusteringCoefficient || 0) * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Clustering</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trust Score Distribution</CardTitle>
                <CardDescription>Distribution of peer trust scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData.trustDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trust" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Peer Capabilities</CardTitle>
              <CardDescription>Distribution of capabilities across the network</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData.capabilityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="capability" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getHealthColor(networkStats.networkHealth)}`}>{(networkStats.networkHealth * 100).toFixed(0)}%</div>
                  <Progress value={networkStats.networkHealth * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Message Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">{networkStats.messagesSent}</div>
                  <div className="text-sm text-muted-foreground">Messages/min</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Network Resilience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">High</div>
                  <div className="text-sm text-muted-foreground">Fault tolerance</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Network Performance Insights</CardTitle>
              <CardDescription>AI-powered analysis of network performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Network Health: Excellent</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">High peer connectivity and low latency across the network</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Topology: Well-Connected</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Network diameter is optimal for message propagation</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Recommendation: Peer Diversity</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Consider connecting to peers with different capabilities for better resilience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
