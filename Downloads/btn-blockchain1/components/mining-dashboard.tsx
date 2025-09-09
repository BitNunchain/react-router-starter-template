"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
// Removed unused import 'Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MiningEngine } from "@/lib/mining"

interface MiningDashboardProps {
  miningEngine: MiningEngine | null
}

export function MiningDashboard({ miningEngine }: MiningDashboardProps) {
  const [stats, setStats] = useState({
    hashRate: 0,
    difficulty: 2,
    targetHashRate: 1000,
    workerCount: 0,
    performance: {
      cpuCores: 4,
      memoryUsage: 0,
      batteryLevel: 100,
      thermalState: "normal",
    },
    efficiency: 0,
  })

    // Removed unused variable 'setActionHistory'

  useEffect(() => {
    if (!miningEngine) return

    const interval = setInterval(() => {
      const miningStats = miningEngine.getMiningStats()
      setStats(miningStats)
    }, 1000)

    return () => clearInterval(interval)
  }, [miningEngine])


  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return "text-green-600"
    if (efficiency >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getBatteryColor = (level: number) => {
    if (level >= 50) return "text-green-600"
    if (level >= 20) return "text-yellow-600"
    return "text-red-600"
  }

  return (
  <div className="dashboard-card space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="actions">Action Mining</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Hash Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.hashRate.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">H/s</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.difficulty}</div>
                <p className="text-xs text-muted-foreground">Auto-adjusted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Workers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.workerCount}</div>
                <p className="text-xs text-muted-foreground">Background threads</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getEfficiencyColor(stats.efficiency)}`}>
                  {stats.efficiency.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Target performance</p>
              </CardContent>
            </Card>
          </div>


              <Card className="bg-white/60 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-2">
                <CardHeader className="border-b border-gradient-to-r from-yellow-300 via-blue-300 to-purple-300">
                  <CardTitle className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
                    <svg className="w-8 h-8 text-yellow-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20m10-10H2" /></svg>
                    Mining Dashboard
                  </CardTitle>
                  <CardDescription>Your latest mining actions and rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* ...existing code... */}
                </CardContent>
              </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Device capabilities and resource usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPU Cores</span>
                  <Badge variant="secondary">{stats.performance.cpuCores}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{(stats.performance.memoryUsage * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.performance.memoryUsage * 100} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Battery Level</span>
                    <span className={getBatteryColor(stats.performance.batteryLevel)}>
                      {stats.performance.batteryLevel.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={stats.performance.batteryLevel} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Thermal State</span>
                  <Badge variant={stats.performance.thermalState === "normal" ? "default" : "destructive"}>
                    {stats.performance.thermalState}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mining Optimization</CardTitle>
                <CardDescription>Adaptive performance adjustments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Auto-Adjustment:</strong> Mining intensity automatically adjusts based on:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Battery level (reduces at &lt;50%)</li>
                    <li>Memory usage (reduces at &gt;80%)</li>
                    <li>Tab visibility (reduces when hidden)</li>
                    <li>Device thermal state</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm">
                    <strong>Current Status:</strong>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.performance.batteryLevel < 50 && "⚡ Low battery mode active"}
                    {stats.performance.memoryUsage > 0.8 && "🧠 High memory usage detected"}
                    {stats.performance.thermalState !== "normal" && "🌡️ Thermal throttling active"}
                    {stats.performance.batteryLevel >= 50 &&
                      stats.performance.memoryUsage <= 0.8 &&
                      stats.performance.thermalState === "normal" &&
                      "✅ Optimal mining conditions"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Action Mining Multipliers</CardTitle>
              <CardDescription>Earn extra BTN tokens through interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { action: "click", multiplier: 1.1, icon: "👆" },
                  { action: "scroll", multiplier: 1.05, icon: "📜" },
                  { action: "share", multiplier: 2.0, icon: "📤" },
                  { action: "invite", multiplier: 5.0, icon: "👥" },
                  { action: "visit", multiplier: 1.5, icon: "🌐" },
                  { action: "form", multiplier: 1.3, icon: "📝" },
                  { action: "hover", multiplier: 1.02, icon: "🖱️" },
                  { action: "focus", multiplier: 1.08, icon: "🎯" },
                ].map(({ action, multiplier, icon }) => (
                  <div key={action} className="text-center p-3 border rounded-lg">
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-sm font-medium capitalize">{action}</div>
                    <div className="text-xs text-muted-foreground">{multiplier}x</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Actions</CardTitle>
              <CardDescription>Your latest mining actions and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <p>Start interacting with the page to see your action mining history!</p>
                <p className="text-xs mt-2">Click, scroll, hover, and more to earn BTN tokens</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
