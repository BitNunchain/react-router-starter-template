"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SmartContractEngine, SmartContract, ContractEvent } from "@/lib/smart-contracts"
import type { NFTEngine, NFT, NFTCollection } from "@/lib/nft-engine"

interface SmartContractsDashboardProps {
  contractEngine: SmartContractEngine | null
  nftEngine: NFTEngine | null
}

export function SmartContractsDashboard({ contractEngine, nftEngine }: SmartContractsDashboardProps) {
  const [contracts, setContracts] = useState<SmartContract[]>([])
  const [nfts, setNfts] = useState<NFT[]>([])
  const [collections, setCollections] = useState<NFTCollection[]>([])
  const [events, setEvents] = useState<ContractEvent[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [deployForm, setDeployForm] = useState({
    name: "",
    code: "",
    owner: "user",
  })

  useEffect(() => {
    if (contractEngine) {
      setContracts(contractEngine.getAllContracts())
      setEvents(contractEngine.getContractEvents())
    }
    if (nftEngine) {
      setNfts(nftEngine.getAllNFTs())
      setCollections(nftEngine.getAllCollections())
    }
  }, [contractEngine, nftEngine])

  const handleDeployContract = () => {
    if (!contractEngine || !deployForm.name || !deployForm.code) return

    try {
      // Try to get ABI from contract template if available
  let abi: import("@/lib/smart-contracts").ContractABI[] = [];
      if (contractEngine && deployForm.name) {
        const templates = contractEngine.getContractTemplates();
        const template = templates.find((t) => t.name === deployForm.name);
        if (template && template.abi) {
          abi = template.abi;
        }
      }
      const contractId = contractEngine.deployContract({
        name: deployForm.name,
        code: deployForm.code,
        abi,
        owner: deployForm.owner,
      });
      setContracts(contractEngine.getAllContracts());
      setDeployForm({ name: "", code: "", owner: "user" });
      console.log(`Contract deployed: ${contractId}`);
    } catch (error) {
      console.error("Failed to deploy contract:", error);
    }
  }

  const handleUseTemplate = (templateName: string) => {
    if (!contractEngine) return

    const templates = contractEngine.getContractTemplates()
    const template = templates.find((t) => t.name === templateName)
    if (template) {
      setDeployForm({
        name: template.name,
        code: template.code,
        owner: "user",
      })
    }
  }

  const handleMintAchievementNFT = () => {
    if (!nftEngine) return

    const nftId = nftEngine.generateAchievementNFT("user", {
      type: "first_block",
    })

    setNfts(nftEngine.getAllNFTs())
    console.log(`Achievement NFT minted: ${nftId}`)
  }

  const handleMintActionNFT = () => {
    if (!nftEngine) return

    const nftId = nftEngine.generateActionRewardNFT("user", "click", 100)

    setNfts(nftEngine.getAllNFTs())
    console.log(`Action NFT minted: ${nftId}`)
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "bg-gray-500",
      uncommon: "bg-green-500",
      rare: "bg-blue-500",
      epic: "bg-purple-500",
      legendary: "bg-yellow-500",
    }
    return colors[rarity as keyof typeof colors] || "bg-gray-500"
  }

  return (
  <div className="dashboard-card space-y-6">
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="deploy">Deploy Contract</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployed Smart Contracts</CardTitle>
              <CardDescription>Local smart contracts running on the BTN blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{contract.id}</h3>
                        <p className="text-sm text-muted-foreground">Owner: {contract.owner}</p>
                      </div>
                      <Badge variant="outline">{contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : "N/A"}</Badge>
                    </div>
                    <div className="text-xs font-mono bg-muted p-2 rounded">ID: {contract.id}</div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline">
                        View Code
                      </Button>
                      <Button size="sm" variant="outline">
                        Interact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deploy Smart Contract</CardTitle>
              <CardDescription>Create and deploy a new smart contract locally</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template">Use Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SimpleToken">Simple Token</SelectItem>
                        <SelectItem value="Voting">Voting Contract</SelectItem>
                        <SelectItem value="custom">Custom Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedTemplate && selectedTemplate !== "custom" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() => handleUseTemplate(selectedTemplate)}
                      >
                        Load Template
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="name">Contract Name</Label>
                    <Input
                      id="name"
                      value={deployForm.name}
                      onChange={(e) => setDeployForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="MyContract"
                    />
                  </div>

                  <div>
                    <Label htmlFor="owner">Owner Address</Label>
                    <Input
                      id="owner"
                      value={deployForm.owner}
                      onChange={(e) => setDeployForm((prev) => ({ ...prev, owner: e.target.value }))}
                      placeholder="user"
                    />
                  </div>

                  <Button onClick={handleDeployContract} className="w-full">
                    Deploy Contract
                  </Button>
                </div>

                <div>
                  <Label htmlFor="code">Contract Code</Label>
                  <Textarea
                    id="code"
                    value={deployForm.code}
                    onChange={(e) => setDeployForm((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="class MyContract { ... }"
                    className="h-64 font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>NFT Collections</CardTitle>
                <CardDescription>Local NFT collections on BTN blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collections.map((collection) => (
                    <div key={collection.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{collection.name}</h3>
                          <p className="text-sm text-muted-foreground">{collection.symbol}</p>
                        </div>
                        <Badge variant="secondary">
                          {collection.totalSupply}/{collection.maxSupply}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{collection.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your NFTs</CardTitle>
                <CardDescription>NFTs you own on the BTN network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {nfts
                    .filter((nft) => nft.owner === "user")
                    .map((nft) => (
                      <div key={nft.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-sm">{nft.metadata.name}</h3>
                            <p className="text-xs text-muted-foreground">#{nft.tokenId}</p>
                          </div>
                          <Badge className={`text-white ${getRarityColor(nft.rarity)}`}>{nft.rarity}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{nft.metadata.description}</p>
                      </div>
                    ))}
                </div>

                <div className="mt-4 space-y-2">
                  <Button onClick={handleMintAchievementNFT} size="sm" className="w-full">
                    Mint Achievement NFT
                  </Button>
                  <Button onClick={handleMintActionNFT} size="sm" variant="outline" className="w-full bg-transparent">
                    Mint Action Reward NFT
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>NFT Gallery</CardTitle>
              <CardDescription>All NFTs on the BTN network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nfts.slice(0, 6).map((nft) => (
                  <div key={nft.id} className="border rounded-lg p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm">{nft.metadata.name}</h3>
                      <p className="text-xs text-muted-foreground">Owner: {nft.owner}</p>
                      <div className="flex justify-between items-center">
                        <Badge className={`text-white text-xs ${getRarityColor(nft.rarity)}`}>{nft.rarity}</Badge>
                        <span className="text-xs text-muted-foreground">#{nft.tokenId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Events</CardTitle>
              <CardDescription>Recent events from smart contracts and NFT operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events
                  .slice(-20)
                  .reverse()
                  .map((event, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm">{event.event}</h3>
                          <p className="text-xs text-muted-foreground">
                            Contract: {event.contractId.substring(0, 16)}...
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Block #{event.blockNumber}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                        {JSON.stringify(event.data, null, 2)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
