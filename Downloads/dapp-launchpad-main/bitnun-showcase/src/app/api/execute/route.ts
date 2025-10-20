import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json()

    // Security: Only allow specific UnifiedNun Launchpad commands
    const allowedCommands = [
      'unifiednun --help',
      'unifiednun --version', 
      'unifiednun list scaffold-templates',
      'unifiednun init --help',
      'unifiednun dev --help',
      'unifiednun deploy --help',
      'unifiednun generate --help'
    ]

    // Check if command starts with allowed patterns
    const isAllowed = allowedCommands.some(allowed => 
      command === allowed || 
      (command.startsWith('unifiednun init ') && command.includes('--help')) ||
      (command.startsWith('unifiednun ') && command.endsWith(' --help'))
    )

    if (!isAllowed) {
      return NextResponse.json({
        error: 'Command not allowed for security reasons',
        output: `Security: Command '${command}' is not in the allowed list.\nAllowed UnifiedNun Launchpad commands: ${allowedCommands.join(', ')}`
      }, { status: 400 })
    }

    // Execute the real UnifiedNun Launchpad command
    const startTime = Date.now()
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 10000, // 10 second timeout
        maxBuffer: 1024 * 1024 // 1MB buffer
      })
      
      const executionTime = Date.now() - startTime

      return NextResponse.json({
        command,
        output: stdout || stderr || 'Command executed successfully',
        executionTime,
        timestamp: new Date().toISOString(),
        success: true
      })

    } catch (execError: any) {
      // If BITNUN command fails, provide helpful error
      const errorMessage = execError.message || 'Command execution failed'
      
      return NextResponse.json({
        command,
        output: `Error executing command: ${errorMessage}\n\nMake sure BITNUN is installed globally:\nnpm install -g bitnun\n\nOr install the BITNUN CLI from the main project directory.`,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        success: false,
        error: errorMessage
      })
    }

  } catch (error: any) {
    return NextResponse.json({
      error: 'Invalid request',
      message: error.message
    }, { status: 500 })
  }
}