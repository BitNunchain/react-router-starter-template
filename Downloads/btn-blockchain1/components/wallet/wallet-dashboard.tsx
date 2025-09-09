"use client"
// Add global type for window.ethereum
declare global {
  interface EthereumProvider {
    request(args: { method: string }): Promise<unknown>;
    // ...add other methods if needed...
  }
  interface Window {
  ethereum?: EthereumProvider;
  }
}

import React, { useState, useMemo, useCallback } from "react"
import type { Transaction } from "../../lib/blockchain";
import Image from "next/image"
// Simple global spinner component
function SpinnerOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
  );
}
import { useToast } from "../../hooks/use-toast"
import { ChartContainer } from "../ui/chart"
import * as RechartsPrimitive from "recharts"
import { generateMnemonic, mnemonicToAddress, encryptMnemonic, decryptMnemonic, validateMnemonic } from "../../lib/utils"
import { Blockchain } from "../../lib/blockchain"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"


export default function WalletDashboard() {
  // Next-gen web3 feature modal states
  // (already declared at the top of the function)
  const { toast } = useToast();
  // Multi-wallet state
  type Wallet = {
    type: string;
    encryptedMnemonic: string; // Store encrypted mnemonic
    address: string;
    blockchain: Blockchain;
  };
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletIdx, setSelectedWalletIdx] = useState<number | null>(null);
  const [passwordPrompt, setPasswordPrompt] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [decryptedMnemonic, setDecryptedMnemonic] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  // UI states
  const [connected, setConnected] = useState<boolean>(false);
  const [importMnemonic, setImportMnemonic] = useState<string>("");
  const [importError, setImportError] = useState<string>("");
  const [metaMaskError, setMetaMaskError] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // Loading states
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingImport, setLoadingImport] = useState<boolean>(false);
  const [loadingMetaMask, setLoadingMetaMask] = useState<boolean>(false);

  // Modal states for NFT and Smart Contract dashboards

  // Helper to get current wallet
  const currentWallet = selectedWalletIdx !== null ? wallets[selectedWalletIdx] : null;
  const address = currentWallet?.address || "";
  const encryptedMnemonic = currentWallet?.encryptedMnemonic || "";
  // Backup/export mnemonic
  // Prompt for password to decrypt mnemonic
  const handleShowMnemonic = useCallback(() => {
    setShowPasswordModal(true);
    setPasswordPrompt("");
    setPasswordError("");
  }, []);

  const handleDecryptMnemonic = useCallback(() => {
    if (!encryptedMnemonic) return;
    try {
      const decrypted = decryptMnemonic(encryptedMnemonic, passwordPrompt);
      if (!decrypted || !validateMnemonic(decrypted)) {
        setPasswordError("Incorrect password or corrupted mnemonic.");
        setDecryptedMnemonic("");
        return;
      }
      setDecryptedMnemonic(decrypted);
      setPasswordError("");
      setShowPasswordModal(false);
      toast({
        title: "Mnemonic Decrypted",
        description: "Your wallet mnemonic is now visible."
      });
    } catch {
      setPasswordError("Incorrect password or corrupted mnemonic.");
      setDecryptedMnemonic("");
    }
  }, [encryptedMnemonic, passwordPrompt, toast]);

  const handleCopyMnemonic = useCallback(() => {
    if (decryptedMnemonic) {
      navigator.clipboard.writeText(decryptedMnemonic);
      toast({
        title: "Mnemonic Copied",
        description: "Your wallet mnemonic has been copied to clipboard. Store it securely!"
      });
    }
  }, [decryptedMnemonic, toast]);
  const blockchain = currentWallet?.blockchain || null;

  // Always fetch live wallet data
  const fetchWalletData = useCallback(() => {
    if (blockchain && address) {
  // Removed setBalance (unused)
      setTransactions(blockchain.getTransactionsForAddress(address));
    }
  }, [blockchain, address]);

  // Add missing handler for creating wallet
  // Prompt for password before creating wallet
  const [createWalletPassword, setCreateWalletPassword] = useState<string>("");
  const [showCreateWalletModal, setShowCreateWalletModal] = useState<boolean>(false);
  const [createWalletError, setCreateWalletError] = useState<string>("");

  const handleCreateWallet = useCallback(() => {
    setShowCreateWalletModal(true);
    setCreateWalletPassword("");
    setCreateWalletError("");
  }, []);

  const handleConfirmCreateWallet = useCallback(() => {
    if (!createWalletPassword || createWalletPassword.length < 6) {
      setCreateWalletError("Password must be at least 6 characters.");
      return;
    }
    setLoadingCreate(true);
    setTimeout(() => {
      try {
        const mnemonic = generateMnemonic();
        const encryptedMnemonic = encryptMnemonic(mnemonic, createWalletPassword);
        const address = mnemonicToAddress(mnemonic);
        const newWallet: Wallet = {
          type: "Local",
          encryptedMnemonic,
          address,
          blockchain: new Blockchain()
        };
        setWallets(prev => [...prev, newWallet]);
        setSelectedWalletIdx(wallets.length);
        setConnected(true);
        setImportError("");
        setMetaMaskError("");
        setShowCreateWalletModal(false);
        setTimeout(fetchWalletData, 0);
        toast({
          title: "Wallet Created",
          description: `New wallet created. Address: ${address}`
        });
  } catch (err: unknown) {
        toast({
          title: "Wallet Creation Error",
          description: typeof err === "object" && err && "message" in err ? (err as { message?: string }).message : "Failed to create wallet."
        });
      } finally {
        setLoadingCreate(false);
      }
    }, 600);
  }, [createWalletPassword, wallets.length, toast, fetchWalletData]);

  // Add missing handler for importing wallet
  // Prompt for password before importing wallet
  const [importWalletPassword, setImportWalletPassword] = useState<string>("");
  const [showImportWalletModal, setShowImportWalletModal] = useState<boolean>(false);
  const [importWalletError, setImportWalletError] = useState<string>("");

  const handleImportWallet = useCallback(() => {
    if (!importMnemonic || importMnemonic.trim().split(" ").length !== 12) {
      setImportError("Please enter a valid 12-word mnemonic.");
      toast({
        title: "Import Error",
        description: "Please enter a valid 12-word mnemonic."
      });
      return;
    }
    setShowImportWalletModal(true);
    setImportWalletPassword("");
    setImportWalletError("");
  }, [importMnemonic, toast]);

  const handleConfirmImportWallet = useCallback(() => {
    if (!importWalletPassword || importWalletPassword.length < 6) {
      setImportWalletError("Password must be at least 6 characters.");
      return;
    }
    setLoadingImport(true);
    setTimeout(() => {
      try {
        const address = mnemonicToAddress(importMnemonic.trim());
        const encryptedMnemonic = encryptMnemonic(importMnemonic.trim(), importWalletPassword);
        const newWallet: Wallet = {
          type: "Local",
          encryptedMnemonic,
          address,
          blockchain: new Blockchain()
        };
        setWallets(prev => [...prev, newWallet]);
        setSelectedWalletIdx(wallets.length);
        setConnected(true);
        setImportError("");
        setMetaMaskError("");
        setShowImportWalletModal(false);
        setTimeout(fetchWalletData, 0);
        toast({
          title: "Wallet Imported",
          description: `Wallet imported. Address: ${address}`
        });
  } catch (err: unknown) {
  setImportWalletError("Failed to import wallet: " + (typeof err === "object" && err && "message" in err ? (err as { message?: string }).message : ""));
        toast({
          title: "Import Error",
          description: `Failed to import wallet: ${typeof err === "object" && err && "message" in err ? (err as { message?: string }).message : ""}`
        });
      } finally {
        setLoadingImport(false);
      }
    }, 600);
  }, [importMnemonic, importWalletPassword, wallets.length, toast, fetchWalletData]);

  // Add missing handler for connecting MetaMask
  const handleConnectMetaMask = useCallback(async () => {
    setLoadingMetaMask(true);
    if (!window.ethereum) {
      setMetaMaskError("MetaMask not detected.");
      toast({
  title: "MetaMask Error",
  description: "MetaMask not detected."
      });
      setLoadingMetaMask(false);
      return;
    }
    try {
      // Fix: Type assertion to EthereumProvider
      const accounts = await (window.ethereum as EthereumProvider).request({ method: "eth_requestAccounts" }) as string[];
      const newWallet: Wallet = {
        type: "MetaMask",
        encryptedMnemonic: "",
        address: accounts[0],
        blockchain: new Blockchain()
      };
      setWallets(prev => [...prev, newWallet]);
      setSelectedWalletIdx(wallets.length);
      setConnected(true);
      setMetaMaskError("");
      setImportError("");
      setTimeout(fetchWalletData, 0);
      toast({
  title: "MetaMask Connected",
  description: `Connected to MetaMask. Address: ${accounts[0]}`
      });
  } catch (err: unknown) {
  setMetaMaskError("Failed to connect MetaMask: " + (typeof err === "object" && err && "message" in err ? (err as { message?: string }).message : ""));
      toast({
  title: "MetaMask Error",
  description: `Failed to connect MetaMask: ${typeof err === "object" && err && "message" in err ? (err as { message?: string }).message : ""}`
      });
    } finally {
      setLoadingMetaMask(false);
    }
  }, [toast, fetchWalletData, wallets.length]);

  // Next-gen wallet dashboard UI
  // Next-gen wallet dashboard UI
  // Prepare transaction analytics data
  const txChartData = useMemo(() =>
    transactions
      .map(tx => ({
        date: new Date(tx.timestamp).toLocaleDateString(),
        count: 1
      }))
      .reduce<{ date: string; count: number }[]>((acc, curr) => {
        const found = acc.find(item => item.date === curr.date);
        if (found) found.count += 1;
        else acc.push({ ...curr });
        return acc;
      }, []),
    [transactions]
  );

  // Global loading state for any async action
  const globalLoading = loadingCreate || loadingImport || loadingMetaMask;

  return (
    <>
      <SpinnerOverlay show={globalLoading} />
      <Card className="bg-white/60 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-2">
    <CardHeader className="flex flex-col items-center gap-2 border-b border-gradient-to-r from-indigo-300 via-blue-300 to-purple-300">
      <CardTitle className="flex items-center gap-3 text-3xl font-extrabold tracking-tight">
  <Image src="/placeholder-logo.png" alt="Wallet" width={40} height={40} className="rounded-full shadow-lg border-2 border-indigo-300 animate-pulse" />
        <span>Wallet</span>
      </CardTitle>
      {/* Multi-wallet selector */}
      {wallets.length > 1 && (
        <div className="mt-4 flex gap-2 items-center">
          <label htmlFor="wallet-selector" className="font-semibold text-sm">Switch Wallet:</label>
          <select
            id="wallet-selector"
            title="Select wallet"
            className="p-2 rounded border bg-white text-sm shadow transition-transform hover:scale-105"
            value={selectedWalletIdx ?? ""}
            onChange={e => {
              setSelectedWalletIdx(Number(e.target.value));
              setTimeout(fetchWalletData, 0);
            }}
          >
            {wallets.map((w, idx) => (
              <option key={w.address} value={idx}>
                {w.type} - {w.address.slice(0, 8)}...
              </option>
            ))}
          </select>
        </div>
      )}
    </CardHeader>
    <CardContent>
      <div className="space-y-8">
        {/* Transaction Analytics Chart */}
        <div className="bg-white/60 rounded-xl shadow p-4">
          <div className="font-semibold mb-2 text-lg" id="tx-activity-label">Transaction Activity</div>
          <ChartContainer config={{ tx: { color: '#6366f1', label: 'Transactions' } }} aria-label="Transaction Activity Chart" aria-labelledby="tx-activity-label">
            <RechartsPrimitive.BarChart data={txChartData} height={200} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <RechartsPrimitive.XAxis dataKey="date" stroke="#6366f1" fontSize={12} />
              <RechartsPrimitive.YAxis stroke="#6366f1" fontSize={12} />
              <RechartsPrimitive.Bar dataKey="count" fill="#6366f1" isAnimationActive={true} />
            </RechartsPrimitive.BarChart>
          </ChartContainer>
        </div>
        {/* ...existing UI... */}
        {!connected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet creation */}
            <div className="flex flex-col items-start gap-2">
              <Button onClick={handleCreateWallet} aria-label="Create Wallet" disabled={globalLoading}>{loadingCreate ? "Creating..." : "Create Wallet"}</Button>
              {/* Password modal for wallet creation */}
              {showCreateWalletModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
                    <div className="font-bold text-lg">Set Wallet Password</div>
                    <input
                      type="password"
                      placeholder="Enter password (min 6 chars)"
                      value={createWalletPassword}
                      onChange={e => setCreateWalletPassword(e.target.value)}
                      className="p-2 rounded border w-full"
                      aria-label="Wallet password"
                    />
                    {createWalletError && <span className="text-red-500 text-xs">{createWalletError}</span>}
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setShowCreateWalletModal(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleConfirmCreateWallet}>Confirm</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Wallet import */}
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="mnemonic-input" className="font-semibold text-sm">Import Wallet (Mnemonic)</label>
              <input
                id="mnemonic-input"
                type="text"
                placeholder="Enter 12-word mnemonic"
                aria-label="mnemonic"
                aria-describedby={importError ? "mnemonic-error" : undefined}
                value={importMnemonic}
                onChange={e => setImportMnemonic(e.target.value)}
                className="p-2 rounded border w-full"
              />
              <Button onClick={handleImportWallet} aria-label="Import Wallet" disabled={globalLoading}>{loadingImport ? "Importing..." : "Import Wallet"}</Button>
              {importError && <span id="mnemonic-error" role="alert" className="text-red-500 text-xs">{importError}</span>}
              {/* Password modal for wallet import */}
              {showImportWalletModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
                    <div className="font-bold text-lg">Set Wallet Password</div>
                    <input
                      type="password"
                      placeholder="Enter password (min 6 chars)"
                      value={importWalletPassword}
                      onChange={e => setImportWalletPassword(e.target.value)}
                      className="p-2 rounded border w-full"
                      aria-label="Wallet password"
                    />
                    {importWalletError && <span className="text-red-500 text-xs">{importWalletError}</span>}
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setShowImportWalletModal(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleConfirmImportWallet}>Confirm</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* MetaMask connect (live) */}
            <div className="flex flex-col items-start gap-2">
              <Button onClick={handleConnectMetaMask} aria-label="Connect MetaMask" disabled={globalLoading}>{loadingMetaMask ? "Connecting..." : "Connect MetaMask"}</Button>
              {metaMaskError && <span role="alert" className="text-red-500 text-xs">{metaMaskError}</span>}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wallet backup/export UI - encrypted mnemonic */}
            {encryptedMnemonic && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 p-2 rounded-xl border border-indigo-200 shadow">
                <span className="font-mono text-xs" aria-label="Wallet mnemonic">
                  Mnemonic: {decryptedMnemonic ? decryptedMnemonic : <Button size="sm" variant="outline" onClick={handleShowMnemonic}>Show</Button>}
                </span>
                {decryptedMnemonic && <Button size="sm" variant="outline" onClick={handleCopyMnemonic} className="ml-2">Copy</Button>}
              </div>
            )}
            {/* Password modal for decrypting mnemonic */}
            {showPasswordModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
                  <div className="font-bold text-lg">Enter Wallet Password</div>
                  <input
                    type="password"
                    placeholder="Enter password to view mnemonic"
                    value={passwordPrompt}
                    onChange={e => setPasswordPrompt(e.target.value)}
                    className="p-2 rounded border w-full"
                    aria-label="Wallet password"
                  />
                  {passwordError && <span className="text-red-500 text-xs">{passwordError}</span>}
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleDecryptMnemonic}>Confirm</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Next-gen Web3 Features */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <Button size="lg" variant="default" aria-label="NFT Dashboard" onClick={() => window.location.assign("/nft")}> 
                NFT Dashboard 
              </Button> 
              <Button size="lg" variant="default" aria-label="Smart Contract Dashboard" onClick={() => window.location.assign("/contracts")}> 
                Smart Contract Dashboard 
              </Button> 
            </div> 
          </div> 
        )} 
      </div> 
    </CardContent> 
  </Card> 
  </> 
 ); 
}
