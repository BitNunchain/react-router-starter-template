import type { Blockchain, Transaction } from "./blockchain"

export interface SmartContract {
  id: string;
  name: string;
  code: string;
  abi: ContractABI[];
  owner: string;
  createdAt: number;
  state: Record<string, unknown>;
  balance: number;
}
  
export interface ContractABI {
  name: string;
  type: "function" | "event" | "constructor";
  inputs: { name: string; type: string }[];
  outputs?: { name: string; type: string }[];
  stateMutability?: "pure" | "view" | "nonpayable" | "payable";
}

export interface ContractCall {
  contractId: string;
  method: string;
  params: unknown[];
  caller: string;
  value?: number;
}

export interface ContractEvent {
  contractId: string;
  event: string;
  data: Record<string, unknown>;
  blockNumber: number;
  timestamp: number;
}

// Base interface for contract classes
export interface IContract {
  // Add common contract methods/properties here if needed
}

// Registry of safe contract classes
export const contractRegistry: Record<string, { new(): object }> = {
  BTNToken: class BTNToken {
    public name: string;
    public symbol: string;
    public decimals: number;
    public totalSupply: number;
    public balances: Map<string, number>;
    public allowances: Map<string, number>;
    constructor() {
      this.name = "BTN Token";
      this.symbol = "BTN";
      this.decimals = 18;
      this.totalSupply = 0;
      this.balances = new Map();
      this.allowances = new Map();
    }
    mint(to: string, amount: number) {
      this.totalSupply += amount;
      const balance = this.balances.get(to) || 0;
      this.balances.set(to, balance + amount);
    }
    transfer(from: string, to: string, amount: number) {
      const fromBalance = this.balances.get(from) || 0;
      if (fromBalance < amount) throw new Error("Insufficient balance");
      this.balances.set(from, fromBalance - amount);
      const toBalance = this.balances.get(to) || 0;
      this.balances.set(to, toBalance + amount);
    }
  },
  MiningRewards: class MiningRewards {
    public rewards: Map<string, number>;
    constructor() {
      this.rewards = new Map();
    }
    addReward(user: string, amount: number) {
      const current = this.rewards.get(user) || 0;
      this.rewards.set(user, current + amount);
    }
    getReward(user: string): number {
      return this.rewards.get(user) || 0;
    }
  },
  // Add more contract classes here
};

export class SmartContractEngine {
  private contracts: Map<string, SmartContract>
  private blockchain: Blockchain
  private events: ContractEvent[]

  constructor(blockchain: Blockchain) {
    this.contracts = new Map()
    this.blockchain = blockchain
    this.events = []
    this.initializeBuiltinContracts()
  }

  private initializeBuiltinContracts(): void {
    // BTN Token Contract
    this.deployContract({
      name: "BTNToken",
      code: `
        class BTNToken {
          constructor() {
            this.name = "BTN Token";
            this.symbol = "BTN";
            this.decimals = 18;
            this.totalSupply = 0;
            this.balances = new Map();
            this.allowances = new Map();
          }

          mint(to, amount) {
            this.totalSupply += amount;
            const balance = this.balances.get(to) || 0;
            this.balances.set(to, balance + amount);
            this.emit('Transfer', { from: '0x0', to, value: amount });
            return true;
          }

          transfer(from, to, amount) {
            const fromBalance = this.balances.get(from) || 0;
            if (fromBalance < amount) return false;
            
            this.balances.set(from, fromBalance - amount);
            const toBalance = this.balances.get(to) || 0;
            this.balances.set(to, toBalance + amount);
            
            this.emit('Transfer', { from, to, value: amount });
            return true;
          }

          balanceOf(account) {
            return this.balances.get(account) || 0;
          }

          approve(owner, spender, amount) {
            if (!this.allowances.has(owner)) {
              this.allowances.set(owner, new Map());
            }
            this.allowances.get(owner).set(spender, amount);
            this.emit('Approval', { owner, spender, value: amount });
            return true;
          }
        }
      `,
      abi: [
        {
          name: "mint",
          type: "function",
          inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          stateMutability: "nonpayable",
        },
        {
          name: "transfer",
          type: "function",
          inputs: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          outputs: [{ name: "", type: "bool" }],
          stateMutability: "nonpayable",
        },
        {
          name: "balanceOf",
          type: "function",
          inputs: [{ name: "account", type: "address" }],
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
        },
      ],
      owner: "system",
    })

    // Mining Rewards Contract
    this.deployContract({
      name: "MiningRewards",
      code: `
        class MiningRewards {
          constructor() {
            this.rewardRate = 0.1;
            this.actionMultipliers = new Map([
              ['click', 1.1],
              ['share', 2.0],
              ['invite', 5.0],
              ['visit', 1.5],
              ['form', 1.3]
            ]);
            this.userRewards = new Map();
          }

          calculateReward(action, user) {
            const multiplier = this.actionMultipliers.get(action) || 1.0;
            const reward = this.rewardRate * multiplier;
            
            const currentRewards = this.userRewards.get(user) || 0;
            this.userRewards.set(user, currentRewards + reward);
            
            this.emit('RewardCalculated', { user, action, reward, multiplier });
            return reward;
          }

          claimRewards(user) {
            const rewards = this.userRewards.get(user) || 0;
            if (rewards > 0) {
              this.userRewards.set(user, 0);
              this.emit('RewardsClaimed', { user, amount: rewards });
              return rewards;
            }
            return 0;
          }

          getUserRewards(user) {
            return this.userRewards.get(user) || 0;
          }
        }
      `,
      abi: [
        {
          name: "calculateReward",
          type: "function",
          inputs: [
            { name: "action", type: "string" },
            { name: "user", type: "address" },
          ],
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "nonpayable",
        },
        {
          name: "claimRewards",
          type: "function",
          inputs: [{ name: "user", type: "address" }],
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "nonpayable",
        },
      ],
      owner: "system",
    })
  }

  public deployContract(params: {
    name: string
    code: string
    abi: ContractABI[]
    owner: string
  }): string {
    const contractId = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const contract: SmartContract = {
      id: contractId,
      name: params.name,
      code: params.code,
      abi: params.abi,
      owner: params.owner,
      createdAt: Date.now(),
      state: {},
      balance: 0,
    }

    this.contracts.set(contractId, contract)

    // Add deployment transaction to blockchain
    const deployTransaction: Transaction = {
      id: `deploy_${contractId}`,
      from: params.owner,
      to: contractId,
      amount: 0,
      timestamp: Date.now(),
    }

    this.blockchain.addTransaction(deployTransaction)

    console.log(`[SmartContract] Deployed contract ${params.name} with ID: ${contractId}`)
    return contractId
  }

  public callContract(call: ContractCall): unknown {
    const contract = this.contracts.get(call.contractId)
    if (!contract) {
      throw new Error(`Contract ${call.contractId} not found`)
    }

    try {
      // Create a sandboxed execution environment
      const contractInstance = this.createContractInstance(contract)

      // Execute the method
      const method = (contractInstance as Record<string, (...args: unknown[]) => unknown>)[call.method]
      if (typeof method !== "function") {
        throw new Error(`Method ${call.method} is not a function on contract ${contract.name}`)
      }
      const result = method(...call.params)

      // Update contract state
      contract.state = { ...contractInstance }
      delete contract.state.emit // Remove the emit function from state

      // Add transaction to blockchain
      const callTransaction: Transaction = {
        id: `call_${Date.now()}_${Math.random()}`,
        from: call.caller,
        to: call.contractId,
        amount: call.value || 0,
        timestamp: Date.now(),
      }

      this.blockchain.addTransaction(callTransaction)

      console.log(`[SmartContract] Called ${call.method} on ${contract.name}`)
      return result
    } catch (error) {
      console.error(`[SmartContract] Error calling ${call.method}:`, error)
      throw error
    }
  }

  private createContractInstance(contract: SmartContract): IContract {
    // Use registry instead of dynamic code execution
    const ContractClass = contractRegistry[contract.name.replace(/[^a-zA-Z0-9]/g, "")];
    if (!ContractClass) {
      throw new Error(`Contract class ${contract.name} not found in registry.`);
    }
    const instance = new ContractClass();

    // Restore previous state
    Object.assign(instance, contract.state)

    return instance
  }

  public getContract(contractId: string): SmartContract | undefined {
    return this.contracts.get(contractId)
  }

  public getContractsByOwner(owner: string): SmartContract[] {
    return Array.from(this.contracts.values()).filter((contract) => contract.owner === owner)
  }

  public getAllContracts(): SmartContract[] {
    return Array.from(this.contracts.values())
  }

  public getContractEvents(contractId?: string): ContractEvent[] {
    if (contractId) {
      return this.events.filter((event) => event.contractId === contractId)
    }
    return [...this.events]
  }

  public getContractTemplates(): Array<{
    name: string
    description: string
    code: string
    abi: ContractABI[]
  }> {
    return [
      {
        name: "SimpleToken",
        description: "Basic ERC-20 compatible token contract",
        code: `
          class SimpleToken {
            constructor(name, symbol, initialSupply) {
              this.name = name || "Simple Token";
              this.symbol = symbol || "SIM";
              this.decimals = 18;
              this.totalSupply = initialSupply || 1000000;
              this.balances = new Map();
              this.balances.set('owner', this.totalSupply);
            }

            transfer(from, to, amount) {
              const fromBalance = this.balances.get(from) || 0;
              if (fromBalance < amount) return false;
              
              this.balances.set(from, fromBalance - amount);
              const toBalance = this.balances.get(to) || 0;
              this.balances.set(to, toBalance + amount);
              
              this.emit('Transfer', { from, to, value: amount });
              return true;
            }

            balanceOf(account) {
              return this.balances.get(account) || 0;
            }
          }
        `,
        abi: [
          {
            name: "transfer",
            type: "function",
            inputs: [
              { name: "from", type: "address" },
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
          },
          {
            name: "balanceOf",
            type: "function",
            inputs: [{ name: "account", type: "address" }],
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
          },
        ],
      },
      {
        name: "Voting",
        description: "Simple voting contract for governance",
        code: `
          class Voting {
            constructor() {
              this.proposals = new Map();
              this.votes = new Map();
              this.proposalCount = 0;
            }

            createProposal(title, description, duration) {
              const proposalId = this.proposalCount++;
              this.proposals.set(proposalId, {
                title,
                description,
                yesVotes: 0,
                noVotes: 0,
                endTime: Date.now() + (duration * 1000),
                active: true
              });
              
              this.emit('ProposalCreated', { proposalId, title, description });
              return proposalId;
            }

            vote(proposalId, voter, support) {
              const proposal = this.proposals.get(proposalId);
              if (!proposal || !proposal.active || Date.now() > proposal.endTime) {
                return false;
              }

              const voteKey = \`\${proposalId}_\${voter}\`;
              if (this.votes.has(voteKey)) {
                return false; // Already voted
              }

              this.votes.set(voteKey, support);
              if (support) {
                proposal.yesVotes++;
              } else {
                proposal.noVotes++;
              }

              this.emit('VoteCast', { proposalId, voter, support });
              return true;
            }

            getProposal(proposalId) {
              return this.proposals.get(proposalId);
            }
          }
        `,
        abi: [
          {
            name: "createProposal",
            type: "function",
            inputs: [
              { name: "title", type: "string" },
              { name: "description", type: "string" },
              { name: "duration", type: "uint256" },
            ],
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "nonpayable",
          },
          {
            name: "vote",
            type: "function",
            inputs: [
              { name: "proposalId", type: "uint256" },
              { name: "voter", type: "address" },
              { name: "support", type: "bool" },
            ],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
          },
        ],
      },
    ]
  }
}
