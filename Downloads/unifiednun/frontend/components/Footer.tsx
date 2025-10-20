'use client'

export function Footer() {


  return (
    <footer className="bg-black/30 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">UnifiedNun</h3>
            <p className="text-gray-400 mb-4">
              The next generation blockchain with ultra-low fees and lightning-fast transactions.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Chain ID: 2151908</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>RPC: http://127.0.0.1:59987</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/bridge" className="hover:text-purple-400 transition-colors">Bridge</a></li>
              <li><a href="/explorer" className="hover:text-purple-400 transition-colors">Explorer</a></li>
              <li><a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">MetaMask Wallet</a></li>
              <li><a href="/features" className="hover:text-purple-400 transition-colors">Features</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Developers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://docs.polygon.technology/cdk/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Documentation</a></li>
              <li><a href="https://github.com/0xPolygon/cdk" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a></li>
              <li><a href="http://127.0.0.1:59987" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">RPC API</a></li>
              <li><a href="https://web3js.org/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Web3 SDK</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Network</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium">Chain ID</span>
                  <span className="font-mono text-sm">2151908</span>
                </div>
              </li>
              <li>
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium">RPC URL</span>
                  <span className="font-mono text-sm break-all">http://127.0.0.1:59987</span>
                </div>
              </li>
              <li>
                <div className="flex flex-col">
                  <span className="text-gray-300 font-medium">Currency</span>
                  <span className="font-mono text-sm">NUN</span>
                </div>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (window.ethereum) {
                      window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                          chainId: '0x20D8A4',
                          chainName: 'UnifiedNun',
                          rpcUrls: ['http://127.0.0.1:59987'],
                          nativeCurrency: {
                            name: 'UnifiedNun Token',
                            symbol: 'NUN',
                            decimals: 18
                          }
                        }]
                      })
                    }
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors text-sm underline"
                >
                  Add to MetaMask
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 UnifiedNun Chain. Built with ❤️ for the future of DeFi.</p>
        </div>
      </div>
    </footer>
  )
}