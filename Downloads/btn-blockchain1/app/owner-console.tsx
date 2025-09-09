"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MultiChainManager } from "@/lib/multi-chain-manager"
import { NativeBlockchain } from "@/lib/native-blockchain"
import { BotsManager, HealthBot, SecurityBot } from "@/lib/bots-manager"
import GovernanceDashboard from "@/components/governance-dashboard"

export default function OwnerConsole() {
  // Platform wallet address (secure, unique)
  const platformWallet = "PLATFORM_WALLET_SECURE_UNIQUE"

  // Governance Dashboard Card wrapper
  function GovernanceDashboardCard() {
    return (
      <Card className="bg-white/80 shadow-lg">
        <CardHeader>
          <CardTitle>Governance & Voting</CardTitle>
          <CardDescription>Decentralized proposals and community voting</CardDescription>
        </CardHeader>
        <CardContent>
          <GovernanceDashboard />
        </CardContent>
      </Card>
    )
  }

  const [balances, setBalances] = useState<Record<string, number>>({})
  const [aiRecommendations, setAIRecommendations] = useState<string[]>([])
  const [aiAlerts, setAIAlerts] = useState<string[]>([])
  // Hold class instances in refs, not state
  const multiChainManagerRef = React.useRef<MultiChainManager | null>(null)
  const botsManagerRef = React.useRef<BotsManager | null>(null)
  const [securityStatus, setSecurityStatus] = useState<string>("")
  const [securityIncidents, setSecurityIncidents] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        const native = new NativeBlockchain()
        await native.initialize()
        const manager = new MultiChainManager([
          { name: "BTN Native", type: "native", native },
          // Add more chains here
        ])
        multiChainManagerRef.current = manager
        // Initialize bots manager with example bots
        const bots = new BotsManager()
        bots.registerBot(new HealthBot())
        bots.registerBot(new SecurityBot())
        bots.startAll()
        botsManagerRef.current = bots
        // Surface initial security status and incidents
        const securityBot = bots.bots.find(b => b.id === "security-bot") as SecurityBot | undefined
        if (securityBot) {
          setSecurityStatus(securityBot.lastReport)
          setSecurityIncidents(securityBot.incidents ? securityBot.incidents.slice(-5).map(i => `${i.type}: ${i.detail} (${new Date(i.timestamp).toLocaleTimeString()})`) : [])
        }
      })()
      // Simulate AI analytics fetch (replace with real API/engine)
      setAIRecommendations([
        "Increase mining intensity during peak hours for higher BTN yield.",
        "Engage top trusted users for viral sharing to boost network growth.",
        "Optimize contract deployment fees based on AI-predicted gas prices.",
        "Monitor memory usage: reduce mining intensity if >80% for device health.",
        "Reward users with high engagement and low fraud risk for platform loyalty."
      ])
      setAIAlerts([
        "Anomaly detected: Sudden spike in fraudulent actions. Review security bot logs.",
        "Mining efficiency dropped below 70%. Consider scaling backend resources.",
        "Unusual contract deployment pattern detected. Validate new contracts for compliance."
      ])
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      const multiChainManager = multiChainManagerRef.current
      const botsManager = botsManagerRef.current
      if (multiChainManager) {
        const allBalances = await multiChainManager.getAllBalances(platformWallet)
        setBalances(allBalances)
      }
      if (botsManager) {
        botsManager.updateOwnerConsoleReport()
        // Update live security status and incidents
        const securityBot = botsManager.bots.find(b => b.id === "security-bot") as SecurityBot | undefined
        if (securityBot) {
          setSecurityStatus(securityBot.lastReport)
          setSecurityIncidents(securityBot.incidents ? securityBot.incidents.slice(-5).map(i => `${i.type}: ${i.detail} (${new Date(i.timestamp).toLocaleTimeString()})`) : [])
        }
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [platformWallet])

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <Card className="shadow-2xl border-2 border-gradient-to-r from-indigo-400 to-orange-400">
        <CardHeader>
          <CardTitle>Owner Console</CardTitle>
          <CardDescription>Full platform control & 24/7 reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* --- Security Status Section --- */}
            <div className="mt-4">
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle>Live Security Status</CardTitle>
                  <CardDescription>Threat detection, incident response, and recent security events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-mono text-red-700 mb-2">{securityStatus}</div>
                  <div className="text-xs font-semibold mb-1">Recent Security Incidents:</div>
                  <ul className="list-disc pl-4 text-xs text-red-700">
                    {securityIncidents.length === 0 ? (
                      <li>No recent incidents detected.</li>
                    ) : (
                      securityIncidents.map((incident, i) => <li key={i}>{incident}</li>)
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="flex gap-4 items-center">
              <Badge variant="default">Platform Wallet</Badge>
              <span className="font-mono text-xs">{platformWallet}</span>
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(platformWallet)}>Copy</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(balances).map(([chain, balance]) => (
                <div key={chain} className="p-4 bg-muted rounded-lg shadow">
                  <div className="font-bold text-lg">{chain}</div>
                  <div className="text-2xl">{balance.toFixed(4)}</div>
                  <div className="text-xs text-muted-foreground">Mining & Fees</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Card className="bg-white/80 shadow-lg">
                <CardHeader>
                  <CardTitle>Cross-Chain Asset Bridge</CardTitle>
                  <CardDescription>Transfer assets between supported chains</CardDescription>
                </CardHeader>
                <CardContent>
                  <BridgeForm platformWallet={platformWallet} />
                </CardContent>
              </Card>
            </div>
            {/* --- AI Analytics Section --- */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle>AI Recommendations & Alerts</CardTitle>
                  <CardDescription>Automated suggestions and anomaly detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 font-semibold text-yellow-700">Recommendations:</div>
                  <ul className="list-disc pl-4 text-sm text-yellow-700">
                    {aiRecommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                  <div className="mt-2 mb-1 font-semibold text-red-700">Alerts:</div>
                  <ul className="list-disc pl-4 text-sm text-red-700">
                    {aiAlerts.map((alert, i) => (
                      <li key={i}>{alert}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            <div className="mt-8">
              <GovernanceDashboardCard />
            </div>
            </div>
            {/* --- End AI Analytics Section --- */}
            {/* --- Governance Dashboard Section --- */}
            <div className="mt-8">
              <GovernanceDashboardCard />
            </div>
            {/* --- End Governance Dashboard Section --- */}
          </div>
        </CardContent>
      </Card>
    </div>
  )

// Cross-chain bridge form component
interface BridgeFormProps {
  platformWallet: string
}

function BridgeForm({ platformWallet }: BridgeFormProps) {
  const [fromChain, setFromChain] = useState<string>("")
  const [toChain, setToChain] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [manager, setManager] = useState<MultiChainManager | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Instantiate MultiChainManager client-side only
      const native = new NativeBlockchain()
      native.initialize().then(() => {
        const m = new MultiChainManager([
          { name: "BTN Native", type: "native", native },
          // Add more chains here
        ])
        setManager(m)
      })
    }
  }, [])

  const handleBridge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("Bridging...")
    if (!manager) return setStatus("Bridge failed: manager not ready.")
    // bridgeAssets should accept only 3 arguments: fromChain, toChain, and amount
    const success = await manager.bridgeAssets(fromChain, toChain, platformWallet, parseFloat(amount))
    setStatus(success ? "Bridge successful!" : "Bridge failed.")
  }

  return (
    <form onSubmit={handleBridge} className="bridge-form flex flex-col gap-2">
      <label htmlFor="from-chain">From Chain:</label>
      <input id="from-chain" name="fromChain" value={fromChain} onChange={e => setFromChain(e.target.value)} placeholder="e.g. BTN Native" />
      <label htmlFor="to-chain">To Chain:</label>
      <input id="to-chain" name="toChain" value={toChain} onChange={e => setToChain(e.target.value)} placeholder="e.g. Ethereum" />
      <label htmlFor="amount">Amount:</label>
      <input
        id="amount"
        name="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        type="number"
        min="0"
        step="any"
        placeholder="Enter amount"
        title="Amount to bridge"
      />
      <button type="submit">Bridge Assets</button>
      <div>{status}</div>
    </form>
  )
}
}
