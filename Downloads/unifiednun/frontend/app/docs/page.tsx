'use client'

import { Navigation } from '../../components/Navigation'
import { Footer } from '../../components/Footer'
import { ParticleBackground } from '../../components/ParticleBackground'

export default function DocsPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6 gradient-text">
                UnifiedNun Documentation
              </h1>
              <p className="text-xl text-gray-400">
                Everything you need to know about the UnifiedNun blockchain
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="glass-effect rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Getting Started</h2>
                <ul className="space-y-3 text-gray-300">
                  <li>• <a href="#wallet-setup" className="hover:text-purple-400 transition-colors">Wallet Setup</a></li>
                  <li>• <a href="#network-config" className="hover:text-purple-400 transition-colors">Network Configuration</a></li>
                  <li>• <a href="#first-transaction" className="hover:text-purple-400 transition-colors">Your First Transaction</a></li>
                  <li>• <a href="#bridge-assets" className="hover:text-purple-400 transition-colors">Bridging Assets</a></li>
                </ul>
              </div>

              <div className="glass-effect rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Developer Resources</h2>
                <ul className="space-y-3 text-gray-300">
                  <li>• <a href="#api-reference" className="hover:text-purple-400 transition-colors">API Reference</a></li>
                  <li>• <a href="#smart-contracts" className="hover:text-purple-400 transition-colors">Smart Contracts</a></li>
                  <li>• <a href="#sdk-integration" className="hover:text-purple-400 transition-colors">SDK Integration</a></li>
                  <li>• <a href="#examples" className="hover:text-purple-400 transition-colors">Code Examples</a></li>
                </ul>
              </div>
            </div>

            <div className="space-y-12">
              <section id="wallet-setup" className="glass-effect rounded-xl p-8">
                <h2 className="text-3xl font-semibold mb-6 text-purple-400">Wallet Setup</h2>
                <div className="space-y-4 text-gray-300">
                  <p>UnifiedNun works with live blockchain networks. Connect your wallet to get started:</p>
                  
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-green-400 mb-2">✅ Recommended Live Networks:</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Polygon:</strong> Low fees, fast transactions</div>
                      <div><strong>Ethereum:</strong> Main network with full DeFi ecosystem</div>
                      <div><strong>Arbitrum:</strong> L2 with reduced gas costs</div>
                      <div><strong>Optimism:</strong> Optimistic rollup technology</div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="text-blue-400 mb-2">🧪 Testnet Options:</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Polygon Mumbai:</strong> Free testnet tokens</div>
                      <div><strong>Sepolia:</strong> Ethereum testnet</div>
                      <div><strong>Goerli:</strong> Ethereum testnet (legacy)</div>
                    </div>
                  </div>

                  <p className="text-yellow-400">
                    💡 The application will automatically suggest Polygon mainnet for the best experience with low fees.
                  </p>
                </div>
              </section>

              <section id="network-config" className="glass-effect rounded-xl p-8">
                <h2 className="text-3xl font-semibold mb-6 text-purple-400">Live Network Features</h2>
                <div className="space-y-4 text-gray-300">
                  <p>UnifiedNun frontend works with real blockchain networks providing:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Real cryptocurrency transactions</li>
                    <li>Live DeFi protocol interactions</li>
                    <li>Actual NFT and token trading</li>
                    <li>Cross-chain bridge functionality</li>
                    <li>Real-time market data</li>
                  </ul>
                  
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mt-4">
                    <h3 className="text-purple-400 font-semibold mb-2">Network Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-green-400">Polygon (Recommended)</div>
                        <div>• ~$0.01 transaction cost</div>
                        <div>• 2-second confirmations</div>
                        <div>• Full Ethereum compatibility</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-400">Ethereum</div>
                        <div>• $5-50 transaction cost</div>
                        <div>• 12-second confirmations</div>
                        <div>• Largest DeFi ecosystem</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="first-transaction" className="glass-effect rounded-xl p-8">
                <h2 className="text-3xl font-semibold mb-6 text-purple-400">Your First Transaction</h2>
                <div className="space-y-4 text-gray-300">
                  <p>Once your wallet is configured:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Connect your wallet using the "Connect Wallet" button</li>
                    <li>Ensure you're on the UnifiedNun network</li>
                    <li>Use the Bridge to transfer assets from Ethereum</li>
                    <li>Start enjoying very cheap transactions!</li>
                  </ol>
                </div>
              </section>

              <section id="bridge-assets" className="glass-effect rounded-xl p-8">
                <h2 className="text-3xl font-semibold mb-6 text-purple-400">Bridging Assets</h2>
                <div className="space-y-4 text-gray-300">
                  <p>Transfer assets between Ethereum L1 and UnifiedNun L2:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Visit the <a href="/bridge" className="text-purple-400 hover:text-purple-300">Bridge page</a></li>
                    <li>Select the asset and amount to transfer</li>
                    <li>Confirm the transaction in your wallet</li>
                    <li>Wait for the bridge confirmation (usually ~7 days for withdrawals)</li>
                  </ul>
                </div>
              </section>

              <section id="api-reference" className="glass-effect rounded-xl p-8">
                <h2 className="text-3xl font-semibold mb-6 text-purple-400">API Reference</h2>
                <div className="space-y-4 text-gray-300">
                  <p>UnifiedNun provides standard Ethereum JSON-RPC API endpoints:</p>
                  
                  <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                    <div className="text-purple-400 mb-2">Common API Calls:</div>
                    <div>eth_getBalance</div>
                    <div>eth_sendTransaction</div>
                    <div>eth_call</div>
                    <div>eth_getTransactionReceipt</div>
                    <div>eth_getLogs</div>
                  </div>
                </div>
              </section>

              <section id="smart-contracts" className="glass-effect rounded-xl p-8">
                <h2 className="text-3xl font-semibold mb-6 text-purple-400">Smart Contracts</h2>
                <div className="space-y-4 text-gray-300">
                  <p>Deploy and interact with smart contracts exactly like on Ethereum:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use familiar tools like Hardhat, Truffle, or Remix</li>
                    <li>Deploy with extremely low gas costs</li>
                    <li>Full Solidity compatibility</li>
                    <li>Access to all Ethereum libraries and frameworks</li>
                  </ul>
                </div>
              </section>
            </div>

            <div className="text-center mt-16">
              <div className="glass-effect rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-400">Need Help?</h3>
                <p className="text-gray-300 mb-6">
                  Join our community for support and updates
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Discord
                  </a>
                  <a href="#" className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                    GitHub
                  </a>
                  <a href="#" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}