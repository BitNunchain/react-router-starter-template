"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NativeContractDeployer, type DeployedContract, type DeploymentConfig } from "@/lib/contract-deployer"

export function ContractDeploymentDashboard() {
  const [deployer] = useState(() => new NativeContractDeployer())
  const [deployedContracts, setDeployedContracts] = useState<DeployedContract[]>([])
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentForm, setDeploymentForm] = useState({
    name: "",
    code: "",
    owner: "user_" + Math.random().toString(36).substr(2, 9),
  })


  const loadDeployedContracts = useCallback(async () => {
    try {
      const contracts = await deployer.getAllDeployedContracts()
      setDeployedContracts(contracts)
    } catch (error) {
      console.error("Failed to load deployed contracts:", error)
    }
  }, [deployer])

  useEffect(() => {
    loadDeployedContracts()
  }, [loadDeployedContracts])


  const deployContract = async () => {
    if (!deploymentForm.name || !deploymentForm.code) return

    setIsDeploying(true)
    try {
      const config: DeploymentConfig = {
        name: deploymentForm.name,
        code: deploymentForm.code,
        abi: [], // Auto-generate ABI from code analysis
        owner: deploymentForm.owner,
        gasLimit: 1000000,
      }

      const deployment = await deployer.deployContract(config)
      console.log("[Dashboard] Contract deployed:", deployment)

      await loadDeployedContracts()
      setDeploymentForm({ name: "", code: "", owner: deploymentForm.owner })
    } catch (error) {
      console.error("[Dashboard] Deployment failed:", error)
    } finally {
      setIsDeploying(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
  <div className="dashboard-card space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Native Contract Deployment</CardTitle>
          <CardDescription>Deploy smart contracts to your native BTN blockchain nodes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deploy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deploy">Deploy Contract</TabsTrigger>
              <TabsTrigger value="deployed">Deployed Contracts</TabsTrigger>
            </TabsList>

            <TabsContent value="deploy" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Contract Name</label>
                  <Input
                    value={deploymentForm.name}
                    onChange={(e) => setDeploymentForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="MyContract"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Contract Code</label>
                  <Textarea
                    value={deploymentForm.code}
                    onChange={(e) => setDeploymentForm((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="class MyContract { constructor() { ... } }"
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Owner Address</label>
                  <Input
                    value={deploymentForm.owner}
                    onChange={(e) => setDeploymentForm((prev) => ({ ...prev, owner: e.target.value }))}
                    placeholder="0x..."
                  />
                </div>

                <Button
                  onClick={deployContract}
                  disabled={isDeploying || !deploymentForm.name || !deploymentForm.code}
                  className="w-full"
                >
                  {isDeploying ? "Deploying to Native Nodes..." : "Deploy Contract"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="deployed" className="space-y-4">
              <div className="grid gap-4">
                {deployedContracts.map((contract) => (
                  <Card key={contract.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{contract.name}</h3>
                          <p className="text-sm text-muted-foreground">{contract.address}</p>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Block:</span>
                          <span className="ml-2">{contract.blockNumber}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gas Used:</span>
                          <span className="ml-2">{contract.gasUsed.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Owner:</span>
                          <span className="ml-2 font-mono">{contract.owner}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deployed:</span>
                          <span className="ml-2">{new Date(contract.deployedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {deployedContracts.length === 0 && (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      No contracts deployed yet. Deploy your first contract to get started.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
