'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Book, Code, Terminal, Rocket, Settings, Globe, Shield } from 'lucide-react'
import Link from 'next/link'

export default function Documentation() {
  const sections = [
    {
      title: 'Getting Started',
      icon: Rocket,
      items: [
        { name: 'Installation', href: '#installation' },
        { name: 'Quick Start', href: '#quick-start' },
        { name: 'First Project', href: '#first-project' }
      ]
    },
    {
      title: 'CLI Commands',
      icon: Terminal,
      items: [
        { name: 'bitnun init', href: '#init' },
        { name: 'bitnun dev', href: '#dev' },
        { name: 'bitnun deploy', href: '#deploy' },
        { name: 'bitnun list', href: '#list' }
      ]
    },
    {
      title: 'Configuration',
      icon: Settings,
      items: [
        { name: 'Project Config', href: '#project-config' },
        { name: 'Network Settings', href: '#network-settings' },
        { name: 'Environment Variables', href: '#env-vars' }
      ]
    },
    {
      title: 'Deployment',
      icon: Globe,
      items: [
        { name: 'Production Deploy', href: '#production' },
        { name: 'Network Selection', href: '#networks' },
        { name: 'Smart Contracts', href: '#contracts' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Book className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold">BITNUN Documentation</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-4 gap-12">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                  <section.icon size={18} />
                  <span>{section.title}</span>
                </div>
                <div className="space-y-2 ml-6">
                  {section.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Installation Section */}
          <motion.section
            id="installation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
              <Rocket className="text-blue-400" />
              <span>Installation</span>
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg">
                Get started with BITNUN by installing it globally on your system.
              </p>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="font-mono text-sm space-y-2">
                  <div className="text-gray-400"># Install BITNUN globally</div>
                  <div className="text-white">npm install -g bitnun</div>
                  <div className="text-gray-400 mt-4"># Verify installation</div>
                  <div className="text-white">bitnun --version</div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Quick Start Section */}
          <motion.section
            id="quick-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
              <Terminal className="text-green-400" />
              <span>Quick Start</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                Create your first dApp in minutes with these simple commands:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="font-mono text-sm space-y-3">
                  <div>
                    <span className="text-gray-400"># Create a new project</span>
                    <br />
                    <span className="text-white">bitnun init my-dapp --template typescript</span>
                  </div>
                  <div>
                    <span className="text-gray-400"># Navigate to project</span>
                    <br />
                    <span className="text-white">cd my-dapp</span>
                  </div>
                  <div>
                    <span className="text-gray-400"># Start development server</span>
                    <br />
                    <span className="text-white">bitnun dev</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* CLI Commands Section */}
          <motion.section
            id="init"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
              <Code className="text-purple-400" />
              <span>CLI Commands</span>
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-400">bitnun init</h3>
                <p className="text-gray-300">Initialize a new BITNUN project with smart contracts and frontend.</p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <code className="text-white">bitnun init [project-name] [options]</code>
                </div>
                <div className="text-sm text-gray-400">
                  <strong>Options:</strong>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><code>--template</code> - Choose template (javascript, typescript)</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4" id="dev">
                <h3 className="text-xl font-semibold text-green-400">bitnun dev</h3>
                <p className="text-gray-300">Start local development environment with blockchain and frontend.</p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <code className="text-white">bitnun dev [options]</code>
                </div>
                <div className="text-sm text-gray-400">
                  <strong>Options:</strong>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><code>--fork-network-name</code> - Fork from network (ethereum, polygonPos, polygonZkevm)</li>
                    <li><code>--reset-on-change</code> - Reset blockchain on code changes</li>
                    <li><code>--enable-explorer</code> - Enable blockchain explorer</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4" id="deploy">
                <h3 className="text-xl font-semibold text-orange-400">bitnun deploy</h3>
                <p className="text-gray-300">Deploy smart contracts and frontend to production.</p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <code className="text-white">bitnun deploy [options]</code>
                </div>
                <div className="text-sm text-gray-400">
                  <strong>Options:</strong>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><code>--network-name</code> - Deploy to network (ethereum, sepolia, polygonPos, etc.)</li>
                    <li><code>--only-smart-contracts</code> - Deploy only smart contracts</li>
                    <li><code>--only-frontend</code> - Deploy only frontend</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Network Configuration */}
          <motion.section
            id="networks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
              <Globe className="text-cyan-400" />
              <span>Supported Networks</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'Ethereum Mainnet', key: 'ethereum', color: 'blue' },
                { name: 'Polygon PoS', key: 'polygonPos', color: 'purple' },
                { name: 'Polygon zkEVM', key: 'polygonZkevm', color: 'green' },
                { name: 'Sepolia Testnet', key: 'sepolia', color: 'orange' }
              ].map((network) => (
                <div key={network.key} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h4 className={`text-lg font-semibold text-${network.color}-400 mb-2`}>
                    {network.name}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Deploy and test your dApps on {network.name}
                  </p>
                  <div className="font-mono text-xs text-gray-400">
                    --network-name {network.key}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Security & Best Practices */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
              <Shield className="text-yellow-400" />
              <span>Security & Best Practices</span>
            </h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Important Security Notes</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Never commit private keys or sensitive credentials to version control</li>
                  <li>• Always test on testnets before mainnet deployment</li>
                  <li>• Use environment variables for configuration</li>
                  <li>• Audit smart contracts before production deployment</li>
                </ul>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-green-400 font-semibold mb-2">✅ Best Practices</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Use TypeScript templates for better type safety</li>
                  <li>• Enable blockchain explorer during development</li>
                  <li>• Test deployments on multiple networks</li>
                  <li>• Keep BITNUN updated to latest version</li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}