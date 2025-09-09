/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ContractABI } from "./smart-contracts"

export interface DeploymentConfig {
  name: string
  code: string
  abi: ContractABI[]
  owner: string
  constructorArgs?: unknown[]
  gasLimit?: number
  value?: number
}

export interface DeployedContract {
  id: string
  address: string
  name: string
  owner: string
  deployedAt: number
  blockNumber: number
  transactionHash: string
  gasUsed: number
  status: "pending" | "deployed" | "failed"
}

export class NativeContractDeployer {
  private deployedContracts: Map<string, DeployedContract>
  private nodeEndpoints: string[]
  private currentNodeIndex: number

  constructor(nodeEndpoints: string[] = ["http://localhost:3001", "http://localhost:3002"]) {
    this.deployedContracts = new Map()
    this.nodeEndpoints = nodeEndpoints
    this.currentNodeIndex = 0
  }

  async deployContract(config: DeploymentConfig): Promise<DeployedContract> {
    const contractId = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const contractAddress = `0x${contractId.slice(-40)}`

    const deployment: DeployedContract = {
      id: contractId,
      address: contractAddress,
      name: config.name,
      owner: config.owner,
      deployedAt: Date.now(),
      blockNumber: 0,
      transactionHash: "",
      gasUsed: 0,
      status: "pending",
    }

    this.deployedContracts.set(contractId, deployment)

    try {
      const deploymentResult = await this.deployToNodes(config, contractId)

      deployment.status = "deployed"
      deployment.blockNumber = deploymentResult.blockNumber
      deployment.transactionHash = deploymentResult.transactionHash
      deployment.gasUsed = deploymentResult.gasUsed

      console.log(`[ContractDeployer] Successfully deployed ${config.name} to native blockchain`)
      return deployment
    } catch (error) {
      deployment.status = "failed"
      console.error(`[ContractDeployer] Failed to deploy ${config.name}:`, error)
      throw error
    }
  }

  private async deployToNodes(
    config: DeploymentConfig,
    contractId: string,
  ): Promise<{
    blockNumber: number
    transactionHash: string
    gasUsed: number
  }> {
    const deploymentData = {
      contractId,
      name: config.name,
      code: config.code,
      abi: config.abi,
      owner: config.owner,
      constructorArgs: config.constructorArgs || [],
      gasLimit: config.gasLimit || 1000000,
      value: config.value || 0,
    }

    const primaryNode = this.nodeEndpoints[this.currentNodeIndex]
    const response = await fetch(`${primaryNode}/api/contracts/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deploymentData),
    })

    if (!response.ok) {
      throw new Error(`Deployment failed: ${response.statusText}`)
    }

    const result = await response.json()

    await this.propagateToNodes(deploymentData, contractId)

    return {
      blockNumber: result.blockNumber,
      transactionHash: result.transactionHash,
      gasUsed: result.gasUsed,
    }
  }

  private async propagateToNodes(deploymentData: Record<string, unknown>, contractId: string): Promise<void> {
    const propagationPromises = this.nodeEndpoints.map(async (endpoint, index) => {
      if (index === this.currentNodeIndex) return // Skip primary node

      try {
        await fetch(`${endpoint}/api/contracts/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deploymentData),
        })
      } catch (error) {
        console.warn(`[ContractDeployer] Failed to sync to node ${endpoint}:`, error)
      }
    })

    await Promise.allSettled(propagationPromises)

    this.currentNodeIndex = (this.currentNodeIndex + 1) % this.nodeEndpoints.length
  }

  async getDeployedContract(contractId: string): Promise<DeployedContract | undefined> {
    return this.deployedContracts.get(contractId)
  }

  async getAllDeployedContracts(): Promise<DeployedContract[]> {
    return Array.from(this.deployedContracts.values())
  }

  async getContractsByOwner(owner: string): Promise<DeployedContract[]> {
    return Array.from(this.deployedContracts.values()).filter((contract) => contract.owner === owner)
  }

  async verifyContractDeployment(contractId: string): Promise<boolean> {
    const contract = this.deployedContracts.get(contractId)
    if (!contract) return false

    const verificationPromises = this.nodeEndpoints.map(async (endpoint) => {
      try {
        const response = await fetch(`${endpoint}/api/contracts/${contractId}`)
        return response.ok
      } catch {
        return false
      }
    })

    const results = await Promise.all(verificationPromises)
    return results.every((result) => result === true)
  }
}
