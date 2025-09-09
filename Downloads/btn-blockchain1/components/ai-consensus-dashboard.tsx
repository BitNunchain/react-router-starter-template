"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { AIConsensusEngine, NetworkMetrics, AIConsensusDecision } from "@/lib/ai-consensus"

interface AIConsensusDashboardProps {
  aiConsensus: AIConsensusEngine | null
}

interface AIInsightUser {
  userId: string
  trustScore: number
  interactionQuality: number
}

interface AIInsights {
  topUsers: AIInsightUser[]
  fraudulentActions: number
  networkOptimizations: string[]
  predictedTrends: string[]
}

export function AIConsensusDashboard({ aiConsensus }: AIConsensusDashboardProps) {
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    totalUsers: 0,
    averageHashRate: 0,
    networkHealth: 1.0,
    consensusAccuracy: 0.95,
    rewardEfficiency: 0.85,
    fraudDetectionRate: 0.98,
  })

  const [consensusHistory, setConsensusHistory] = useState<AIConsensusDecision[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsights>({
    topUsers: [],
    fraudulentActions: 0,
    networkOptimizations: [],
    predictedTrends: [],
  })

  const [chartData, setChartData] = useState({
    consensusAccuracy: [] as Array<{ time: string; accuracy: number }>,
    networkHealth: [] as Array<{ time: string; health: number }>,
    userTrust: [] as Array<{ name: string; value: number }>,
    actionDistribution: [] as Array<{ action: string; count: number }>,
  })

  useEffect(() => {
    if (!aiConsensus) return

    const interval = setInterval(() => {
      const currentMetrics = aiConsensus.getNetworkMetrics()
      const history = aiConsensus.getConsensusHistory(20)
      const insights = aiConsensus.getAIInsights()

      setMetrics(currentMetrics)
      setConsensusHistory(history)
      setAiInsights(insights)

      // Update chart data
      const now = new Date().toLocaleTimeString()
      setChartData((prev) => ({
        consensusAccuracy: [
          ...prev.consensusAccuracy.slice(-19),
          { time: now, accuracy: currentMetrics.consensusAccuracy * 100 },
        ],
        networkHealth: [...prev.networkHealth.slice(-19), { time: now, health: currentMetrics.networkHealth * 100 }],
        userTrust: insights.topUsers.slice(0, 5).map((user) => ({
          name: user.userId.substring(0, 8),
          value: user.trustScore * 100,
        })),
        actionDistribution: [
          { action: "Click", count: Math.floor(Math.random() * 100) + 50 },
          { action: "Share", count: Math.floor(Math.random() * 50) + 20 },
          { action: "Invite", count: Math.floor(Math.random() * 30) + 10 },
          { action: "Visit", count: Math.floor(Math.random() * 80) + 40 },
          { action: "Form", count: Math.floor(Math.random() * 40) + 15 },
        ],
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [aiConsensus])

  const getHealthColor = (value: number) => {
    if (value >= 0.8) return "text-green-600"
    if (value >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500"
    if (confidence >= 0.6) return "bg-yellow-500"
    return "bg-red-500"
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
  <div className="dashboard-card space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">AI Overview</TabsTrigger>
          <TabsTrigger value="consensus">Consensus</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Consensus Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getHealthColor(metrics.consensusAccuracy)}`}>
                  {(metrics.consensusAccuracy * 100).toFixed(1)}%
                </div>
                <Progress value={metrics.consensusAccuracy * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Network Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getHealthColor(metrics.networkHealth)}`}>
                  {(metrics.networkHealth * 100).toFixed(1)}%
                </div>
                <Progress value={metrics.networkHealth * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reward Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getHealthColor(metrics.rewardEfficiency)}`}>
                  {(metrics.rewardEfficiency * 100).toFixed(1)}%
                </div>
                <Progress value={metrics.rewardEfficiency * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fraud Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getHealthColor(metrics.fraudDetectionRate)}`}>
                  {(metrics.fraudDetectionRate * 100).toFixed(1)}%
                </div>
                <Progress value={metrics.fraudDetectionRate * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Consensus Accuracy Trend</CardTitle>
                <CardDescription>AI consensus accuracy over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData.consensusAccuracy}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Health</CardTitle>
                <CardDescription>Overall network health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData.networkHealth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="health" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consensus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Consensus Decisions</CardTitle>
              <CardDescription>AI-powered block validation results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {consensusHistory
                  .slice(-10)
                  .reverse()
                  .map((decision, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-mono text-sm">Block: {decision.blockHash.substring(0, 16)}...</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={decision.isValid ? "default" : "destructive"}>
                              {decision.isValid ? "Valid" : "Invalid"}
                            </Badge>
                            <div
                              className={`px-2 py-1 rounded text-xs text-white ${getConfidenceColor(decision.confidence)}`}
                            >
                              {(decision.confidence * 100).toFixed(1)}% confidence
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(decision.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="text-xs space-y-1">
                        <div className="font-semibold">AI Reasoning:</div>
                        {decision.reasoning.map((reason, i) => (
                          <div key={i} className="text-muted-foreground">
                            • {reason}
                          </div>
                        ))}
                      </div>

                      {decision.rewardAdjustment !== 0 && (
                        <div className="mt-2 text-xs">
                          <span className="font-semibold">Reward Adjustment: </span>
                          <span className={decision.rewardAdjustment > 0 ? "text-green-600" : "text-red-600"}>
                            {decision.rewardAdjustment > 0 ? "+" : ""}
                            {(decision.rewardAdjustment * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Trusted Users</CardTitle>
                <CardDescription>Users with highest AI trust scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData.userTrust}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Distribution</CardTitle>
                <CardDescription>User action patterns analyzed by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.actionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : "0"}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {chartData.actionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Behavior Analysis</CardTitle>
              <CardDescription>AI-powered user behavior insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{metrics.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{aiInsights.fraudulentActions}</div>
                  <div className="text-sm text-muted-foreground">Fraud Attempts Blocked</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor(metrics.averageHashRate / 1000)}K
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Hash Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Network Optimizations</CardTitle>
                <CardDescription>AI-driven network improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiInsights.networkOptimizations.map((optimization, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{optimization}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predicted Trends</CardTitle>
                <CardDescription>AI predictions for network behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiInsights.predictedTrends.map((trend, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{trend}</span>
                    </div>
                  ))}
                  {aiInsights.predictedTrends.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      <p>AI is analyzing patterns...</p>
                      <p className="text-xs mt-1">Predictions will appear as data accumulates</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Learning Status</CardTitle>
              <CardDescription>Current state of AI learning systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">Active</div>
                  <div className="text-sm text-muted-foreground">Learning Model</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">Active</div>
                  <div className="text-sm text-muted-foreground">Fraud Detection</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">Active</div>
                  <div className="text-sm text-muted-foreground">Reward Optimizer</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">Learning</div>
                  <div className="text-sm text-muted-foreground">Pattern Analysis</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="text-sm font-semibold mb-2">AI System Status:</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Continuous learning from user interactions</div>
                  <div>• Real-time fraud detection and prevention</div>
                  <div>• Dynamic reward optimization based on behavior</div>
                  <div>• Predictive analytics for network trends</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
