use wasm_bindgen::prelude::*;
use js_sys::Date;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use std::collections::HashMap;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[wasm_bindgen]
pub struct Transaction {
    from: String,
    to: String,
    amount: f64,
    timestamp: f64,
    signature: String,
}

#[wasm_bindgen]
impl Transaction {
    #[wasm_bindgen(constructor)]
    pub fn new(from: String, to: String, amount: f64) -> Transaction {
        Transaction {
            from,
            to,
            amount,
            timestamp: Date::now(),
            signature: String::new(),
        }
    }

    #[wasm_bindgen(getter)]
    pub fn from(&self) -> String {
        self.from.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn to(&self) -> String {
        self.to.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn amount(&self) -> f64 {
        self.amount
    }

    pub fn calculate_hash(&self) -> String {
        let data = format!("{}{}{}{}", self.from, self.to, self.amount, self.timestamp);
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        format!("{:x}", hasher.finalize())
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[wasm_bindgen]
pub struct Block {
    index: u32,
    timestamp: f64,
    transactions: Vec<Transaction>,
    previous_hash: String,
    nonce: u64,
    hash: String,
    merkle_root: String,
}

#[wasm_bindgen]
impl Block {
    #[wasm_bindgen(constructor)]
    pub fn new(index: u32, transactions: Vec<Transaction>, previous_hash: String) -> Block {
        let mut block = Block {
            index,
            timestamp: Date::now(),
            transactions,
            previous_hash,
            nonce: 0,
            hash: String::new(),
            merkle_root: String::new(),
        };
        block.merkle_root = block.calculate_merkle_root();
        block.hash = block.calculate_hash();
        block
    }

    #[wasm_bindgen(getter)]
    pub fn index(&self) -> u32 {
        self.index
    }

    #[wasm_bindgen(getter)]
    pub fn hash(&self) -> String {
        self.hash.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn previous_hash(&self) -> String {
        self.previous_hash.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn nonce(&self) -> u64 {
        self.nonce
    }

    pub fn calculate_hash(&self) -> String {
        let data = format!(
            "{}{}{}{}{}{}",
            self.index, self.timestamp, self.previous_hash, self.merkle_root, self.nonce,
            serde_json::to_string(&self.transactions).unwrap_or_default()
        );
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        format!("{:x}", hasher.finalize())
    }

    pub fn calculate_merkle_root(&self) -> String {
        if self.transactions.is_empty() {
            return String::new();
        }

        let mut hashes: Vec<String> = self.transactions
            .iter()
            .map(|tx| tx.calculate_hash())
            .collect();

        while hashes.len() > 1 {
            let mut next_level = Vec::new();
            for chunk in hashes.chunks(2) {
                let combined = if chunk.len() == 2 {
                    format!("{}{}", chunk[0], chunk[1])
                } else {
                    format!("{}{}", chunk[0], chunk[0])
                };
                let mut hasher = Sha256::new();
                hasher.update(combined.as_bytes());
                next_level.push(format!("{:x}", hasher.finalize()));
            }
            hashes = next_level;
        }

        hashes[0].clone()
    }

    pub fn mine_block(&mut self, difficulty: u32) -> bool {
        let target = "0".repeat(difficulty as usize);
        let mut attempts = 0;
        const MAX_ATTEMPTS: u64 = 1000000;

        while !self.hash.starts_with(&target) && attempts < MAX_ATTEMPTS {
            self.nonce += 1;
            self.hash = self.calculate_hash();
            attempts += 1;

            if attempts % 10000 == 0 {
                console_log!("Mining attempt: {}, nonce: {}", attempts, self.nonce);
            }
        }

        attempts < MAX_ATTEMPTS
    }
}

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct NativeBlockchain {
    chain: Vec<Block>,
    difficulty: u32,
    pending_transactions: Vec<Transaction>,
    mining_reward: f64,
    balances: HashMap<String, f64>,
}

#[wasm_bindgen]
impl NativeBlockchain {
    #[wasm_bindgen(constructor)]
    pub fn new() -> NativeBlockchain {
        let mut blockchain = NativeBlockchain {
            chain: Vec::new(),
            difficulty: 2,
            pending_transactions: Vec::new(),
            mining_reward: 100.0,
            balances: HashMap::new(),
        };
        blockchain.create_genesis_block();
        blockchain
    }

    fn create_genesis_block(&mut self) {
        let genesis_block = Block::new(0, Vec::new(), "0".to_string());
        self.chain.push(genesis_block);
    }

    pub fn get_latest_block(&self) -> Option<Block> {
        self.chain.last().cloned()
    }

    pub fn add_transaction(&mut self, transaction: Transaction) {
        // Validate transaction
        if transaction.from != "system" {
            let balance = self.get_balance(&transaction.from);
            if balance < transaction.amount {
                console_log!("Insufficient balance for transaction");
                return;
            }
        }
        self.pending_transactions.push(transaction);
    }

    pub fn mine_pending_transactions(&mut self, mining_reward_address: String) -> bool {
        // Add mining reward transaction
        let reward_transaction = Transaction::new(
            "system".to_string(),
            mining_reward_address.clone(),
            self.mining_reward,
        );
        self.pending_transactions.push(reward_transaction);

        let latest_block = self.get_latest_block().unwrap();
        let mut block = Block::new(
            latest_block.index + 1,
            self.pending_transactions.clone(),
            latest_block.hash,
        );

        console_log!("Mining block {}...", block.index);
        let success = block.mine_block(self.difficulty);

        if success {
            console_log!("Block mined successfully! Hash: {}", block.hash);
            
            // Update balances
            for transaction in &block.transactions {
                if transaction.from != "system" {
                    let from_balance = self.balances.get(&transaction.from).unwrap_or(&0.0);
                    self.balances.insert(transaction.from.clone(), from_balance - transaction.amount);
                }
                
                let to_balance = self.balances.get(&transaction.to).unwrap_or(&0.0);
                self.balances.insert(transaction.to.clone(), to_balance + transaction.amount);
            }

            self.chain.push(block);
            self.pending_transactions.clear();
            true
        } else {
            console_log!("Mining failed - too many attempts");
            false
        }
    }

    pub fn get_balance(&self, address: &str) -> f64 {
        *self.balances.get(address).unwrap_or(&0.0)
    }

    pub fn get_chain_length(&self) -> usize {
        self.chain.len()
    }

    pub fn is_chain_valid(&self) -> bool {
        for i in 1..self.chain.len() {
            let current_block = &self.chain[i];
            let previous_block = &self.chain[i - 1];

            if current_block.hash != current_block.calculate_hash() {
                return false;
            }

            if current_block.previous_hash != previous_block.hash {
                return false;
            }
        }
        true
    }

    pub fn adjust_difficulty(&mut self) {
        if self.chain.len() % 10 == 0 && self.chain.len() > 0 {
            // Simple difficulty adjustment every 10 blocks
            self.difficulty = if self.difficulty < 6 { self.difficulty + 1 } else { 6 };
            console_log!("Difficulty adjusted to: {}", self.difficulty);
        }
    }

    pub fn get_blockchain_stats(&self) -> String {
        let stats = serde_json::json!({
            "blocks": self.chain.len(),
            "difficulty": self.difficulty,
            "pending_transactions": self.pending_transactions.len(),
            "total_addresses": self.balances.len(),
            "is_valid": self.is_chain_valid()
        });
        stats.to_string()
    }
}

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen(start)]
pub fn main() {
    init_panic_hook();
    console_log!("BTN Native Blockchain WASM module loaded successfully!");
}
