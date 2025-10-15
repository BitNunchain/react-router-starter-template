'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Github, Star, GitFork, Eye, Download, Code, Users, Activity } from 'lucide-react'
import Link from 'next/link'

export default function GitHubPage() {
  const repositoryStats = {
    stars: 2847,
    forks: 456,
    watchers: 123,
    issues: 28,
    pullRequests: 12,
    contributors: 34,
    releases: 15
  }

  const recentCommits = [
    {
      message: "feat: Add real blockchain integration to showcase app",
      author: "BITNUN Team",
      date: "2 hours ago",
      hash: "a1b2c3d"
    },
    {
      message: "fix: Resolve API endpoint security issues",
      author: "Security Team", 
      date: "5 hours ago",
      hash: "e4f5g6h"
    },
    {
      message: "docs: Update installation instructions",
      author: "Documentation Team",
      date: "1 day ago", 
      hash: "i7j8k9l"
    },
    {
      message: "refactor: Improve CLI command structure",
      author: "Core Team",
      date: "2 days ago",
      hash: "m0n1o2p"
    }
  ]

  const features = [
    {
      title: "Open Source",
      description: "Completely open source and free to use",
      icon: Code,
      color: "text-green-400"
    },
    {
      title: "Community Driven", 
      description: "Built by developers, for developers",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Active Development",
      description: "Regular updates and new features",
      icon: Activity,
      color: "text-purple-400"
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
            <Github className="text-white" size={24} />
            <h1 className="text-2xl font-bold">BITNUN Repository</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Repository Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">sadekwhop/bitnuns</h1>
              <p className="text-gray-300 text-lg">
                Revolutionary dApp development framework for the modern web3 era
              </p>
            </div>
            <div className="flex space-x-3">
              <a
                href="https://github.com/sadekwhop/bitnuns"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Github size={18} />
                <span>View on GitHub</span>
              </a>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 rounded-lg flex items-center space-x-2 transition-opacity">
                <Download size={18} />
                <span>Clone Repository</span>
              </button>
            </div>
          </div>

          {/* Repository Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {[
              { label: 'Stars', value: repositoryStats.stars, icon: Star, color: 'text-yellow-400' },
              { label: 'Forks', value: repositoryStats.forks, icon: GitFork, color: 'text-blue-400' },
              { label: 'Watchers', value: repositoryStats.watchers, icon: Eye, color: 'text-green-400' },
              { label: 'Issues', value: repositoryStats.issues, icon: Activity, color: 'text-red-400' },
              { label: 'Pull Requests', value: repositoryStats.pullRequests, icon: Code, color: 'text-purple-400' },
              { label: 'Contributors', value: repositoryStats.contributors, icon: Users, color: 'text-cyan-400' },
              { label: 'Releases', value: repositoryStats.releases, icon: Download, color: 'text-orange-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center"
              >
                <stat.icon className={`${stat.color} mx-auto mb-2`} size={24} />
                <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Why BITNUN?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              >
                <feature.icon className={`${feature.color} mb-4`} size={32} />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Recent Activity */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Recent Commits</h2>
            <div className="space-y-4">
              {recentCommits.map((commit, index) => (
                <motion.div
                  key={commit.hash}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">{commit.message}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{commit.author}</span>
                        <span>•</span>
                        <span>{commit.date}</span>
                        <span>•</span>
                        <code className="bg-gray-700 px-2 py-1 rounded text-xs">{commit.hash}</code>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-white">Get Involved</h2>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Clone Repository</h3>
                <div className="bg-black/50 rounded-lg p-4 border border-gray-600">
                  <code className="text-white font-mono text-sm">
                    git clone https://github.com/sadekwhop/bitnuns.git
                  </code>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Install from Source</h3>
                <div className="bg-black/50 rounded-lg p-4 border border-gray-600">
                  <div className="font-mono text-sm space-y-1 text-white">
                    <div>cd bitnuns</div>
                    <div>npm install</div>
                    <div>npm run build</div>
                    <div>npm link</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Contributing</h3>
                <p className="text-gray-300 text-sm mb-4">
                  We welcome contributions! Check out our contributing guidelines and open issues.
                </p>
                <div className="flex space-x-3">
                  <a
                    href="https://github.com/sadekwhop/bitnuns/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    View Issues
                  </a>
                  <a
                    href="https://github.com/sadekwhop/bitnuns/pulls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                  >
                    Pull Requests
                  </a>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* License & Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>Licensed under MIT License</p>
              <p>© 2024 BITNUN. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Code of Conduct
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Security Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contributing Guide
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}