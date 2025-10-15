'use client'

import { useState, useRef, useEffect } from 'react'
import { Terminal, Play, Copy, Check } from 'lucide-react'

interface Command {
  command: string
  output: string
  isRunning: boolean
  timestamp: string
  executionTime?: string
}

export default function LiveTerminal() {
  const [commands, setCommands] = useState<Command[]>([
    {
      command: 'bitnun --version',
      output: '1.0.0',
      isRunning: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const predefinedCommands = [
    'bitnun --help',
    'bitnun init my-dapp --template typescript',
    'bitnun dev --help',
    'bitnun deploy --help',
    'bitnun list scaffold-templates'
  ]

  const executeCommand = async (cmd: string) => {
    setIsRunning(true)
    
    // Add command to history immediately
    const newCommand: Command = {
      command: cmd,
      output: '',
      isRunning: true,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setCommands(prev => [...prev, newCommand])

    try {
      // Make real API call to execute BITNUN command
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: cmd })
      })

      const result = await response.json()
      
      // Update with real output
      setCommands(prev => 
        prev.map((c, i) => 
          i === prev.length - 1 
            ? { 
                ...c, 
                output: result.output || result.error || 'Command executed',
                isRunning: false,
                executionTime: result.executionTime 
              }
            : c
        )
      )

    } catch (error) {
      // Handle API errors
      setCommands(prev => 
        prev.map((c, i) => 
          i === prev.length - 1 
            ? { 
                ...c, 
                output: `Error: Unable to execute command. ${error instanceof Error ? error.message : 'Network error'}`,
                isRunning: false 
              }
            : c
        )
      )
    }
    
    setIsRunning(false)
    setCurrentCommand('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentCommand.trim() && !isRunning) {
      executeCommand(currentCommand.trim())
    }
  }

  const copyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commands])

  return (
    <div className="bg-black/90 rounded-2xl overflow-hidden border border-green-500/30">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="text-green-400" size={16} />
          <span className="text-green-400 font-mono text-sm">BITNUN Live Terminal</span>
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="bg-gray-900/50 px-6 py-3 border-b border-green-500/20">
        <div className="text-xs text-gray-400 mb-2">Quick Commands:</div>
        <div className="flex flex-wrap gap-2">
          {predefinedCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => !isRunning && executeCommand(cmd)}
              disabled={isRunning}
              className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-96 overflow-y-auto p-6 font-mono text-sm scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-green-500/30"
      >
        {commands.map((cmd, index) => (
          <div key={index} className="mb-4">
            {/* Command Input */}
            <div className="flex items-center space-x-2 mb-2 group">
              <span className="text-green-400">bitnun@terminal:~$</span>
              <span className="text-white flex-1">{cmd.command}</span>
              <span className="text-gray-500 text-xs">{cmd.timestamp}</span>
              <button
                onClick={() => copyCommand(cmd.command, index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-green-500/20 rounded"
              >
                {copiedIndex === index ? (
                  <Check className="text-green-400" size={12} />
                ) : (
                  <Copy className="text-gray-400" size={12} />
                )}
              </button>
            </div>
            
            {/* Command Output */}
            {cmd.isRunning ? (
              <div className="text-yellow-400 flex items-center space-x-2">
                <div className="animate-spin w-3 h-3 border border-yellow-400 border-t-transparent rounded-full"></div>
                <span>Executing...</span>
              </div>
            ) : cmd.output && (
              <div className="text-gray-300 whitespace-pre-line pl-4 border-l-2 border-green-500/30 ml-4">
                {cmd.output}
              </div>
            )}
          </div>
        ))}
        
        {/* Current Input */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <span className="text-green-400">bitnun@terminal:~$</span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            disabled={isRunning}
            placeholder="Type a BITNUN command..."
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 disabled:opacity-50"
          />
          {isRunning && (
            <div className="animate-spin w-3 h-3 border border-green-400 border-t-transparent rounded-full"></div>
          )}
        </form>
      </div>
    </div>
  )
}