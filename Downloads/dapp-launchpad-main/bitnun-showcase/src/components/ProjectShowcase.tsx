'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Code, Rocket, Layers, Wallet, Shield, Zap, GitBranch } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  category: string
  tech: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
  features: string[]
  icon: React.ElementType
  color: string
}

export default function ProjectShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [realProjects, setRealProjects] = useState<any[]>([])
  
  // Fetch real BITNUN projects
  const fetchRealProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      if (data.success) {
        setRealProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch real projects:', error)
    }
  }
  
  // Create a new real project
  const createRealProject = async () => {
    try {
      const projectName = prompt('Enter project name:')
      if (!projectName) return
      
      const template = confirm('Use TypeScript template? (Cancel for JavaScript)') ? 'typescript' : 'javascript'
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: projectName,
          template: template
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Project "${projectName}" created successfully!`)
        fetchRealProjects() // Refresh the project list
      } else {
        alert(`Failed to create project: ${result.error}`)
      }
    } catch (error) {
      alert(`Error creating project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  useEffect(() => {
    fetchRealProjects()
    // Refresh every 30 seconds
    const interval = setInterval(fetchRealProjects, 30000)
    return () => clearInterval(interval)
  }, [])

  const projects: Project[] = [
    {
      id: 'defi-exchange',
      name: 'DeFi Exchange',
      description: 'Full-featured decentralized exchange with AMM, liquidity pools, and yield farming',
      category: 'defi',
      tech: ['Solidity', 'Next.js', 'TypeScript', 'Hardhat'],
      image: '/api/placeholder/400/250',
      liveUrl: 'https://defi-exchange-demo.bitnun.dev',
      githubUrl: 'https://github.com/example/defi-exchange',
      features: ['Automated Market Making', 'Liquidity Pools', 'Yield Farming', 'Governance Token'],
      icon: Wallet,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'nft-marketplace',
      name: 'NFT Marketplace',
      description: 'Complete NFT trading platform with minting, auctions, and collection management',
      category: 'nft',
      tech: ['Solidity', 'React', 'IPFS', 'OpenSea API'],
      image: '/api/placeholder/400/250',
      liveUrl: 'https://nft-market-demo.bitnun.dev',
      githubUrl: 'https://github.com/example/nft-marketplace',
      features: ['NFT Minting', 'Auction System', 'Collection Management', 'Royalty Distribution'],
      icon: Shield,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'dao-governance',
      name: 'DAO Governance',
      description: 'Decentralized autonomous organization with voting, proposals, and treasury management',
      category: 'dao',
      tech: ['Solidity', 'Next.js', 'Ethers.js', 'Graph Protocol'],
      image: '/api/placeholder/400/250',
      liveUrl: 'https://dao-demo.bitnun.dev',
      githubUrl: 'https://github.com/example/dao-governance',
      features: ['Proposal Creation', 'Voting System', 'Treasury Management', 'Multi-sig Execution'],
      icon: Zap,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'gaming-assets',
      name: 'Gaming Assets',
      description: 'Blockchain-based gaming platform with tradeable assets and player rewards',
      category: 'gaming',
      tech: ['Solidity', 'Unity', 'Web3.js', 'Polygon'],
      image: '/api/placeholder/400/250',
      liveUrl: 'https://gaming-demo.bitnun.dev',
      githubUrl: 'https://github.com/example/gaming-assets',
      features: ['In-game NFTs', 'Player Rewards', 'Asset Trading', 'Cross-game Compatibility'],
      icon: Layers,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Projects', count: projects.length },
    { id: 'defi', name: 'DeFi', count: projects.filter(p => p.category === 'defi').length },
    { id: 'nft', name: 'NFTs', count: projects.filter(p => p.category === 'nft').length },
    { id: 'dao', name: 'DAOs', count: projects.filter(p => p.category === 'dao').length },
    { id: 'gaming', name: 'Gaming', count: projects.filter(p => p.category === 'gaming').length }
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Built with BITNUN
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Real projects created by developers using BITNUN. From concept to production in record time.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Real Projects Section */}
      {realProjects.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-center">Your UnifiedNun Projects</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {realProjects.map((project: any, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">{project.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'deployed' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'building' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Template: {project.template} | Network: {project.network || 'Not specified'}
                </p>
                <p className="text-gray-500 text-xs">
                  Created: {project.createdAt ? new Date(project.createdAt).toLocaleString() : project.lastUpdated}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Demo Projects Grid */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">Demo Projects Built with UnifiedNun Launchpad</h3>
        <motion.div 
          layout
          className="grid md:grid-cols-2 gap-8"
        >
          {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 group"
          >
            {/* Project Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <project.icon className="text-white/60" size={64} />
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${project.color} text-white`}>
                  {project.category.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <div className="text-xs text-gray-400 mb-2">Tech Stack:</div>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-black/30 text-gray-300 text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <div className="text-xs text-gray-400 mb-2">Key Features:</div>
                <ul className="space-y-1">
                  {project.features.slice(0, 3).map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-300 text-sm flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {project.liveUrl && (
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                    <ExternalLink size={14} />
                    <span>Live Demo</span>
                  </button>
                )}
                {project.githubUrl && (
                  <button className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2">
                    <Code size={14} />
                    <span>Source</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-blue-500/20"
      >
        <Rocket className="text-blue-400 mx-auto mb-6" size={48} />
        <h3 className="text-3xl font-bold text-white mb-4">
          Build Your Next Project with BITNUN
        </h3>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of developers who've launched their dApps using BITNUN. 
          From idea to production in minutes, not months.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={createRealProject}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Building Now
          </button>
          <button 
            onClick={fetchRealProjects}
            className="px-8 py-4 bg-white/10 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
          >
            <GitBranch size={20} />
            <span>Refresh Projects</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}