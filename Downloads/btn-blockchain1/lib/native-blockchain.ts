// Native blockchain interface for WASM integration

export interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

export interface FallbackBlockchain {
  chain: Array<{ index: number; transactions: Transaction[]; timestamp: number; hash: string }>;
  balances: Map<string, number>;
}

export interface ExtendedBlockchain extends FallbackBlockchain {
  pendingTransactions: Transaction[];
  add_transaction: (from: string, to: string, amount: number) => void;
  mine_pending_transactions: (rewardAddress: string) => boolean;
  get_balance: (address: string) => number;
  get_chain_length: () => number;
  is_chain_valid: () => boolean;
  get_blockchain_stats: () => string | object;
}

class NativeBlockchainWrapper {
  private blockchain: ExtendedBlockchain | null = null;
  private isWasmLoaded: boolean = false;

  async initialize(): Promise<void> {
    // Initialization logic for WASM or fallback blockchain
    // For demonstration, fallback is used
    this.blockchain = {
      chain: [],
      balances: new Map<string, number>(),
      pendingTransactions: [],
      add_transaction: (from: string, to: string, amount: number) => {
        if (this.blockchain) {
          this.blockchain.pendingTransactions.push({ from, to, amount, timestamp: Date.now() });
        }
      },
      mine_pending_transactions: (rewardAddress: string) => {
        // Mining logic (simplified)
        const block = {
          index: this.blockchain ? this.blockchain.chain.length : 0,
          transactions: this.blockchain ? [...this.blockchain.pendingTransactions] : [],
          timestamp: Date.now(),
          hash: Math.random().toString(36).substring(2)
        };
        if (this.blockchain) {
          this.blockchain.chain.push(block);
          this.blockchain.pendingTransactions = [];
        }
        // Update balances
        block.transactions.forEach((tx: Transaction) => {
          if (this.blockchain) {
            this.blockchain.balances.set(tx.from, (this.blockchain.balances.get(tx.from) || 0) - tx.amount);
            this.blockchain.balances.set(tx.to, (this.blockchain.balances.get(tx.to) || 0) + tx.amount);
          }
        });
        if (this.blockchain) {
          this.blockchain.balances.set(rewardAddress, (this.blockchain.balances.get(rewardAddress) || 0) + 1);
        }
        return true;
      },
      get_balance: (address: string) => {
        if (this.blockchain) {
          return this.blockchain.balances.get(address) || 0;
        }
        return 0;
      },
      get_chain_length: () => this.blockchain ? this.blockchain.chain.length : 0,
      is_chain_valid: () => true,
      get_blockchain_stats: () => ({
        blocks: this.blockchain ? this.blockchain.chain.length : 0,
        pending: this.blockchain ? this.blockchain.pendingTransactions.length : 0,
        addresses: this.blockchain ? this.blockchain.balances.size : 0,
        native: false,
      }),
    };
    this.isWasmLoaded = false;
    console.log("[v0] Fallback blockchain initialized");
  }

  addTransaction(from: string, to: string, amount: number): void {
    if (this.blockchain) {
      this.blockchain.add_transaction(from, to, amount);
    }
  }

  minePendingTransactions(rewardAddress: string): boolean {
    if (this.blockchain) {
      return this.blockchain.mine_pending_transactions(rewardAddress);
    }
    return false;
  }

  getBalance(address: string): number {
    if (this.blockchain) {
      return this.blockchain.get_balance(address);
    }
    return 0;
  }

  getChainLength(): number {
    if (this.blockchain) {
      return this.blockchain.get_chain_length();
    }
    return 0;
  }

  isChainValid(): boolean {
    if (this.blockchain) {
      return this.blockchain.is_chain_valid();
    }
    return false;
  }

  getBlockchainStats(): { blocks: number; pending: number; addresses: number; native: boolean } {
    if (this.blockchain) {
      const stats = this.blockchain.get_blockchain_stats();
      if (typeof stats === "object") {
        return stats as { blocks: number; pending: number; addresses: number; native: boolean };
      }
    }
    return { blocks: 0, pending: 0, addresses: 0, native: false };
  }

  isNativeWasm(): boolean {
    return this.isWasmLoaded;
  }
}

export const NativeBlockchain = NativeBlockchainWrapper;

// Global instance
let globalBlockchain: NativeBlockchainWrapper | null = null;

export async function getNativeBlockchain(): Promise<NativeBlockchainWrapper> {
  if (!globalBlockchain) {
    globalBlockchain = new NativeBlockchainWrapper();
    await globalBlockchain.initialize();
  }
  return globalBlockchain;
}
