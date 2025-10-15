'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Download, Terminal, CheckCircle, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Installation() {
  const [copied, setCopied] = useState('')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const installMethods = [
    {
      title: 'NPM (Recommended)',
      description: 'Install BITNUN globally using npm package manager',
      command: 'npm install -g bitnun',
      id: 'npm'
    },
    {
      title: 'Yarn',
      description: 'Install BITNUN globally using yarn package manager',
      command: 'yarn global add bitnun',
      id: 'yarn'
    },
    {
      title: 'PNPM',
      description: 'Install BITNUN globally using pnpm package manager',
      command: 'pnpm add -g bitnun',
      id: 'pnpm'
    }
  ]

  const verificationSteps = [
    {
      command: 'bitnun --version',
      description: 'Check if BITNUN is installed correctly',
      expectedOutput: '1.0.0'
    },
    {
      command: 'bitnun --help',
      description: 'View available commands and options',
      expectedOutput: 'Usage: bitnun [options] [command]...'
    },
    {
      command: 'bitnun list scaffold-templates',
      description: 'List available project templates',
      expectedOutput: 'Available templates: javascript, typescript'
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
            <Download className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold">Install BITNUN</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Get Started with BITNUN
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Install BITNUN globally and start building decentralized applications in minutes.
            One command installs everything you need.
          </p>
        </motion.div>

        {/* Prerequisites */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Prerequisites</h2>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Node.js</h3>
                <p className="text-gray-300 text-sm mb-2">Version 18.0 or higher</p>
                <a 
                  href="https://nodejs.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <span>Download Node.js</span>
                  <ExternalLink size={14} />
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">Git</h3>
                <p className="text-gray-300 text-sm mb-2">For project templates and version control</p>
                <a 
                  href="https://git-scm.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <span>Download Git</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Installation Methods */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Installation Methods</h2>
          <div className="space-y-6">
            {installMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{method.title}</h3>
                  {method.id === 'npm' && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-4">{method.description}</p>
                <div className="bg-black/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between">
                    <code className="text-white font-mono">{method.command}</code>
                    <button
                      onClick={() => copyToClipboard(method.command, method.id)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {copied === method.id ? (
                        <>
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-400 text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Verification */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Verify Installation</h2>
          <p className="text-gray-300 mb-6">
            Run these commands to verify that BITNUN has been installed correctly:
          </p>
          
          <div className="space-y-4">
            {verificationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-blue-400">Step {index + 1}</h4>
                  <button
                    onClick={() => copyToClipboard(step.command, `verify-${index}`)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                  >
                    {copied === `verify-${index}` ? (
                      <>
                        <CheckCircle size={14} className="text-green-400" />
                        <span className="text-green-400 text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                <div className="bg-black/50 rounded-lg p-4 border border-gray-600">
                  <div className="font-mono text-sm space-y-2">
                    <div className="text-gray-400">$ {step.command}</div>
                    <div className="text-green-400">{step.expectedOutput}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Start */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Quick Start</h2>
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-8 border border-blue-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Create Your First dApp</h3>
            <p className="text-gray-300 mb-6">
              Now that BITNUN is installed, create your first decentralized application:
            </p>
            
            <div className="bg-black/50 rounded-lg p-6 border border-gray-600">
              <div className="font-mono text-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-400"># Create a new dApp project</span>
                    <br />
                    <span className="text-white">bitnun init my-first-dapp --template typescript</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('bitnun init my-first-dapp --template typescript', 'quickstart-1')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-400"># Navigate to your project</span>
                    <br />
                    <span className="text-white">cd my-first-dapp</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('cd my-first-dapp', 'quickstart-2')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-400"># Start the development server</span>
                    <br />
                    <span className="text-white">bitnun dev</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('bitnun dev', 'quickstart-3')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Link
                href="/documentation"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
              >
                <Terminal size={20} />
                <span>View Full Documentation</span>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Troubleshooting */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <h4 className="text-yellow-400 font-semibold mb-2">Permission Errors</h4>
              <p className="text-gray-300 text-sm mb-2">
                If you encounter permission errors on macOS/Linux, try:
              </p>
              <code className="text-white bg-black/30 px-2 py-1 rounded text-sm">
                sudo npm install -g bitnun
              </code>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h4 className="text-red-400 font-semibold mb-2">Command Not Found</h4>
              <p className="text-gray-300 text-sm">
                If 'bitnun' command is not found after installation, restart your terminal or add npm global bin to your PATH.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}