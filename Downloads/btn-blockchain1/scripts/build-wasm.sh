#!/bin/bash

# Build script for WASM module
echo "Building BTN Blockchain WASM module..."

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi

# Build WASM module
echo "Compiling Rust to WASM..."
wasm-pack build --target web --out-dir pkg --dev

# Create pkg directory if it doesn't exist
mkdir -p pkg

# Generate TypeScript definitions
echo "Generating TypeScript definitions..."
cat > pkg/btn_blockchain.d.ts << 'EOF'
/* tslint:disable */
/* eslint-disable */
/**
* @returns {void}
*/
export function init_panic_hook(): void;
/**
*/
export function main(): void;
/**
*/
export class Block {
  free(): void;
/**
* @param {number} index
* @param {any[]} transactions
* @param {string} previous_hash
*/
  constructor(index: number, transactions: any[], previous_hash: string);
/**
* @returns {number}
*/
  readonly index: number;
/**
* @returns {string}
*/
  readonly hash: string;
/**
* @returns {string}
*/
  readonly previous_hash: string;
/**
* @returns {bigint}
*/
  readonly nonce: bigint;
/**
* @returns {string}
*/
  calculate_hash(): string;
/**
* @returns {string}
*/
  calculate_merkle_root(): string;
/**
* @param {number} difficulty
* @returns {boolean}
*/
  mine_block(difficulty: number): boolean;
}
/**
*/
export class NativeBlockchain {
  free(): void;
/**
*/
  constructor();
/**
* @returns {Block | undefined}
*/
  get_latest_block(): Block | undefined;
/**
* @param {Transaction} transaction
*/
  add_transaction(transaction: Transaction): void;
/**
* @param {string} mining_reward_address
* @returns {boolean}
*/
  mine_pending_transactions(mining_reward_address: string): boolean;
/**
* @param {string} address
* @returns {number}
*/
  get_balance(address: string): number;
/**
* @returns {number}
*/
  get_chain_length(): number;
/**
* @returns {boolean}
*/
  is_chain_valid(): boolean;
/**
*/
  adjust_difficulty(): void;
/**
* @returns {string}
*/
  get_blockchain_stats(): string;
}
/**
*/
export class Transaction {
  free(): void;
/**
* @param {string} from
* @param {string} to
* @param {number} amount
*/
  constructor(from: string, to: string, amount: number);
/**
* @returns {string}
*/
  readonly from: string;
/**
* @returns {string}
*/
  readonly to: string;
/**
* @returns {number}
*/
  readonly amount: number;
/**
* @returns {string}
*/
  calculate_hash(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_transaction_free: (a: number) => void;
  readonly __wbg_get_transaction_from: (a: number, b: number) => void;
  readonly __wbg_get_transaction_to: (a: number, b: number) => void;
  readonly __wbg_get_transaction_amount: (a: number) => number;
  readonly transaction_new: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly transaction_calculate_hash: (a: number, b: number) => void;
  readonly __wbg_block_free: (a: number) => void;
  readonly __wbg_get_block_index: (a: number) => number;
  readonly __wbg_get_block_hash: (a: number, b: number) => void;
  readonly __wbg_get_block_previous_hash: (a: number, b: number) => void;
  readonly __wbg_get_block_nonce: (a: number) => bigint;
  readonly block_new: (a: number, b: number, c: number, d: number) => number;
  readonly block_calculate_hash: (a: number, b: number) => void;
  readonly block_calculate_merkle_root: (a: number, b: number) => void;
  readonly block_mine_block: (a: number, b: number) => number;
  readonly __wbg_nativeblockchain_free: (a: number) => void;
  readonly nativeblockchain_new: () => number;
  readonly nativeblockchain_get_latest_block: (a: number) => number;
  readonly nativeblockchain_add_transaction: (a: number, b: number) => void;
  readonly nativeblockchain_mine_pending_transactions: (a: number, b: number, c: number) => number;
  readonly nativeblockchain_get_balance: (a: number, b: number, c: number) => number;
  readonly nativeblockchain_get_chain_length: (a: number) => number;
  readonly nativeblockchain_is_chain_valid: (a: number) => number;
  readonly nativeblockchain_adjust_difficulty: (a: number) => void;
  readonly nativeblockchain_get_blockchain_stats: (a: number, b: number) => void;
  readonly init_panic_hook: () => void;
  readonly main: () => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export function __wbg_set_wasm(val: InitOutput): void;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
EOF

echo "WASM build completed successfully!"
echo "Generated files in pkg/ directory:"
ls -la pkg/
