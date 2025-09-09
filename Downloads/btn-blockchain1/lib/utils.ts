import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Wallet utilities
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import CryptoJS from "crypto-js";

/**
 * Generates a secure 12-word mnemonic using BIP39.
 * @returns {string} A randomly generated mnemonic phrase.
 */
export function generateMnemonic(): string {
  return bip39.generateMnemonic();
}

/**
 * Validates a mnemonic phrase using BIP39.
 * @param {string} mnemonic - The mnemonic phrase to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Derives an Ethereum address from a mnemonic phrase using BIP32/BIP44.
 * @param {string} mnemonic - The mnemonic phrase.
 * @returns {string} The derived Ethereum address (0x... format).
 * @throws {Error} If the mnemonic is invalid.
 */
export function mnemonicToAddress(mnemonic: string): string {
  if (!validateMnemonic(mnemonic)) throw new Error("Invalid mnemonic");
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const node = bip32.fromSeed(seed);
  // Ethereum derivation path m/44'/60'/0'/0/0
  const child = node.derivePath("m/44'/60'/0'/0/0");
  // Get public key, hash to address
  const pubkey = child.publicKey;
  // Ethereum address: last 20 bytes of keccak256(pubkey)
  const address = CryptoJS.SHA3(pubkey.toString("hex"), { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(-40);
  return "0x" + address;
}

/**
 * Encrypts a mnemonic phrase using AES encryption.
 * @param {string} mnemonic - The mnemonic to encrypt.
 * @param {string} password - The password to use for encryption.
 * @returns {string} The encrypted mnemonic (ciphertext).
 */
export function encryptMnemonic(mnemonic: string, password: string): string {
  return CryptoJS.AES.encrypt(mnemonic, password).toString();
}

/**
 * Decrypts an AES-encrypted mnemonic phrase.
 * @param {string} ciphertext - The encrypted mnemonic.
 * @param {string} password - The password used for encryption.
 * @returns {string} The decrypted mnemonic phrase.
 */
export function decryptMnemonic(ciphertext: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}
