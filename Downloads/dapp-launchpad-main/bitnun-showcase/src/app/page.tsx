'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Rocket, 
  Code, 
  Globe, 
  Zap, 
  Layers, 
  Terminal, 
  Wallet, 
  Shield,
  ChevronRight,
  Play,
  Download,
  Github,
  Monitor,
  DollarSign
} from 'lucide-react'
import LiveTerminal from '@/components/LiveTerminal'
import LiveStats from '@/components/LiveStats'
import ProjectShowcase from '@/components/ProjectShowcase'
import Link from 'next/link'

export default function Home() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('overview')

  const features = [
    {
      id: 'init',
      title: 'Project Initialization',
      description: 'Create full-stack dApps in seconds',
      icon: Rocket,
      color: 'from-blue-500 to-purple-600',
      command: 'bitnun init my-dapp --template typescript',
      demo: 'Creates complete project structure with frontend & smart contracts'
    },
    {
      id: 'dev',
      title: 'Local Development',
      description: 'Live blockchain environment with hot reload',
      icon: Code,
      color: 'from-green-500 to-blue-500',
      command: 'bitnun dev',
      demo: 'Starts local blockchain + Next.js server with auto-reload'
    },
    {
      id: 'deploy',
      title: 'Production Deployment',
      description: 'Deploy to mainnet/testnets with one command',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      command: 'bitnun deploy -n ethereum',
      demo: 'Deploys contracts to blockchain & frontend to Vercel'
    },
    {
      id: 'networks',
      title: 'Multi-Chain Support',
      description: 'Ethereum, Polygon, zkEVM and more',
      icon: Layers,
      color: 'from-orange-500 to-red-500',
      command: 'bitnun dev -n polygonZkevm',
      demo: 'Fork any supported blockchain for development'
    }
  ]

  const navItems = [
    { id: 'overview', name: 'Overview', icon: Monitor },
    { id: 'terminal', name: 'Live Terminal', icon: Terminal },
    { id: 'projects', name: 'Showcase', icon: Rocket },
    { id: 'stats', name: 'Live Stats', icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-2xl font-bold text-white">BITNUN</h1>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/documentation" className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              Documentation
            </Link>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center space-x-2">
              <Monitor size={16} />
              <span>Dashboard</span>
            </Link>
            <Link href="/business-dashboard" className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center space-x-2">
              <DollarSign size={16} />
              <span>Revenue</span>
            </Link>
            <Link href="/github" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
              <Github size={16} />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`p-3 rounded-lg transition-colors flex flex-col items-center space-y-1 ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-gray-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-20 md:pb-6">
        {activeSection === 'overview' && (
          <>
            {/* Hero Section */}
            <section className="pt-12 pb-20 px-6">
              <div className="max-w-7xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
                    Build <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Web3</span>
                    <br />Apps Instantly
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    BITNUN is the next-generation CLI tool for creating full-stack decentralized applications. 
                    From zero to deployed dApp in minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/install" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                      <Download size={20} />
                      <span>Install BITNUN</span>
                    </Link>
                    <button 
                      onClick={() => setActiveSection('terminal')}
                      className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play size={20} />
                      <span>Try Live Demo</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Installation */}
            <section className="py-20 px-6">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Get Started in Seconds
                  </h2>
                  <p className="text-xl text-gray-300">
                    One command to install, one command to create your dApp
                  </p>
                </motion.div>

                <div className="bg-black/30 rounded-2xl p-8 backdrop-blur-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-4">
                    <Terminal className="text-green-400" size={20} />
                    <span className="text-green-400 font-mono text-sm">bitnun@terminal:~$</span>
                  </div>
                  <div className="space-y-4 font-mono">
                    <div className="text-gray-300">
                      <span className="text-blue-400"># Install BITNUN globally</span>
                      <br />
                      <span className="text-white">npm install -g bitnun</span>
                    </div>
                    <div className="text-gray-300">
                      <span className="text-blue-400"># Create your first dApp</span>
                      <br />
                      <span className="text-white">bitnun init my-awesome-dapp --template typescript</span>
                    </div>
                    <div className="text-gray-300">
                      <span className="text-blue-400"># Start development</span>
                      <br />
                      <span className="text-white">cd my-awesome-dapp && bitnun dev</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Premium Services */}
            <section className="py-20 px-6 bg-gradient-to-r from-gray-900/50 to-black/50">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
                    <span className="text-green-400 font-semibold">🔥 ULTRA-COMPETITIVE PRICING</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    💰 Affordable Web3 Services
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Professional Web3 services at 70-95% below competitor pricing - same quality, better value
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link href="/launchpad" className="block bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">🚀</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                        Premium Launchpad
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Launch crypto projects with guaranteed funding, marketing, and community access
                      </p>
                      <div className="text-yellow-400 font-semibold">Starting at 0.29 ETH</div>
                      <div className="text-xs text-gray-500 mt-1">vs 1.5+ ETH elsewhere</div>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link href="/nft-creator" className="block bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">🎨</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                        NFT Creator Suite
                      </h3>
                      <p className="text-gray-300 mb-4">
                        AI-powered NFT generation, smart contracts, and marketplace deployment
                      </p>
                      <div className="text-purple-400 font-semibold">Starting at 0.04 ETH</div>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/defi-generator" className="block bg-gradient-to-br from-green-500/10 to-blue-500/10 p-8 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">💎</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                        DeFi Protocol Generator
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Build DEX, lending, staking, and yield farming protocols without coding
                      </p>
                      <div className="text-green-400 font-semibold">Starting at 1.2 ETH</div>
                    </Link>
                  </motion.div>
                </div>

                {/* Additional Revenue Services */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/audits" className="block bg-gradient-to-br from-red-500/10 to-pink-500/10 p-8 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors">
                        Smart Contract Audits
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Professional security audits and vulnerability assessments
                      </p>
                      <div className="text-red-400 font-semibold">$99-$699 per audit</div>
                      <div className="text-xs text-gray-500 mt-1">vs $2,000+ elsewhere</div>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link href="/academy" className="block bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">🎓</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                        BITNUN Academy
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Premium courses, mentorship, and certification programs
                      </p>
                      <div className="text-blue-400 font-semibold">$5/month or $19-$79 courses</div>
                      <div className="text-xs text-gray-500 mt-1">vs $200+ elsewhere</div>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link href="/enterprise" className="block bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">🏢</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
                        Enterprise Solutions
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Custom blockchain solutions for Fortune 500 companies
                      </p>
                      <div className="text-indigo-400 font-semibold">$1,499-$9,999/project</div>
                    </Link>
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                  >
                    <Link href="/white-label" className="block bg-gradient-to-br from-orange-500/10 to-red-500/10 p-8 rounded-2xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">⚡</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                        White-Label Licensing
                      </h3>
                      <p className="text-gray-300 mb-4">
                        License our platform technology to other businesses
                      </p>
                      <div className="text-orange-400 font-semibold">$499-$4,999/setup</div>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    <Link href="/insurance" className="block bg-gradient-to-br from-teal-500/10 to-green-500/10 p-8 rounded-2xl border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">🛡️</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">
                        Insurance Services
                      </h3>
                      <p className="text-gray-300 mb-4">
                        DeFi protocol insurance and smart contract protection
                      </p>
                      <div className="text-teal-400 font-semibold">$39-$399/month</div>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                  >
                    <Link href="/cross-chain" className="block bg-gradient-to-br from-violet-500/10 to-purple-500/10 p-8 rounded-2xl border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group">
                      <div className="text-4xl mb-4">🌉</div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors">
                        Cross-Chain Tools
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Premium cross-chain infrastructure and bridge solutions
                      </p>
                      <div className="text-violet-400 font-semibold">$149-$799/tool</div>
                    </Link>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.0 }}
                  className="text-center mt-12"
                >
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 border border-yellow-500/30">
                    <h3 className="text-3xl font-bold text-white mb-4">🎯 We Beat Any Competitor's Price by 20%!</h3>
                    <p className="text-gray-300 max-w-3xl mx-auto mb-6">
                      Complete ecosystem of ultra-competitive Web3 services. Same professional quality as industry leaders, 
                      but at prices that are 70-95% cheaper. Free tiers available for every service!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/pricing" className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                        Compare All Pricing →
                      </Link>
                      <Link href="/audits" className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors">
                        Start Free Audit
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Powerful Features
                  </h2>
                  <p className="text-xl text-gray-300">
                    Everything you need to build, test, and deploy Web3 applications
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                           onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                            <feature.icon className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                            <p className="text-gray-300">{feature.description}</p>
                          </div>
                          <ChevronRight 
                            className={`text-gray-400 transition-transform ${activeDemo === feature.id ? 'rotate-90' : ''}`} 
                            size={20} 
                          />
                        </div>
                        
                        {activeDemo === feature.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-white/10 pt-6"
                          >
                            <div className="bg-black/50 rounded-lg p-4 mb-4">
                              <code className="text-green-400 font-mono text-sm">{feature.command}</code>
                            </div>
                            <p className="text-gray-300">{feature.demo}</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeSection === 'terminal' && (
          <section className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Try BITNUN Live
                </h2>
                <p className="text-xl text-gray-300">
                  Interactive terminal with real BITNUN commands. Click the quick commands or type your own!
                </p>
              </div>
              <LiveTerminal />
            </div>
          </section>
        )}

        {activeSection === 'projects' && (
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <ProjectShowcase />
            </div>
          </section>
        )}

        {activeSection === 'stats' && (
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <LiveStats />
            </div>
          </section>
        )}
      </div>

      {/* Pricing Call-to-Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="inline-flex items-center bg-red-500/10 border border-red-500/30 rounded-full px-6 py-3 mb-8">
              <DollarSign className="w-6 h-6 text-red-400 mr-2" />
              <span className="text-red-400 font-bold text-lg">FLOOR PRICING GUARANTEE</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              We Beat Any
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Competitor's Price
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12">
              Professional Web3 services starting from $0. We guarantee to beat any legitimate 
              competitor's price by 20% or give you the service for free.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-black/20 rounded-2xl p-8 border border-green-500/30">
                <div className="text-4xl font-bold text-green-400 mb-2">$99</div>
                <div className="text-gray-300 mb-2">Smart Contract Audits</div>
                <div className="text-sm text-gray-400">vs $2,000+ elsewhere</div>
              </div>
              <div className="bg-black/20 rounded-2xl p-8 border border-blue-500/30">
                <div className="text-4xl font-bold text-blue-400 mb-2">$5/mo</div>
                <div className="text-gray-300 mb-2">Full Web3 Academy</div>
                <div className="text-sm text-gray-400">vs $200+ elsewhere</div>
              </div>
              <div className="bg-black/20 rounded-2xl p-8 border border-purple-500/30">
                <div className="text-4xl font-bold text-purple-400 mb-2">0.29 ETH</div>
                <div className="text-gray-300 mb-2">Token Launchpad</div>
                <div className="text-sm text-gray-400">vs 1.5+ ETH elsewhere</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                <DollarSign size={20} />
                <span>View All Pricing</span>
              </Link>
              <Link href="/audits" className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2">
                <Shield size={20} />
                <span>Start Free Audit</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <span className="text-white font-bold">BITNUN</span>
            <span className="text-gray-400">v1.0.0</span>
          </div>
          <div className="text-gray-400 text-sm">
            Built with ❤️ for the Web3 community
          </div>
        </div>
      </footer>
    </div>
  )
}