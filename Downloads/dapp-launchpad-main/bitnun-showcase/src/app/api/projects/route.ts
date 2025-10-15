import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

// This would typically connect to a database
// For demo purposes, we'll use a simple JSON file
const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json')

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function getProjects() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    // Return default projects if file doesn't exist
    return {
      projects: [
        {
          id: 'defi-demo',
          name: 'DeFi Exchange Demo',
          description: 'Built with BITNUN - Full DEX with AMM',
          category: 'defi',
          status: 'deployed',
          network: 'polygon',
          deployedAt: new Date().toISOString(),
          contractAddress: '0x742d35Cc6634C0532925a3b8D93fDA9f8EB5DE1A',
          frontendUrl: 'https://defi-demo.bitnun.dev'
        }
      ]
    }
  }
}

async function saveProjects(projectsData: any) {
  await ensureDataDirectory()
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projectsData, null, 2))
}

export async function GET() {
  try {
    const projectsData = await getProjects()
    return NextResponse.json(projectsData)
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, projectName, template, network } = await request.json()

    if (action === 'create') {
      // Create a real BITNUN project (in a temporary directory)
      const tempDir = path.join(process.cwd(), 'temp', projectName)
      
      try {
        // Create temp directory
        await fs.mkdir(tempDir, { recursive: true })
        
        // Simulate BITNUN project creation
        const createCommand = `cd "${tempDir}" && bitnun init ${projectName} --template ${template || 'javascript'}`
        
        const { stdout, stderr } = await execAsync(createCommand, {
          timeout: 30000 // 30 second timeout
        })

        // Add project to our database
        const projectsData = await getProjects()
        const newProject = {
          id: `${projectName}-${Date.now()}`,
          name: projectName,
          description: `BITNUN project created with ${template || 'javascript'} template`,
          category: 'custom',
          status: 'created',
          network: network || 'localhost',
          createdAt: new Date().toISOString(),
          template: template || 'javascript',
          path: tempDir
        }

        projectsData.projects.push(newProject)
        await saveProjects(projectsData)

        return NextResponse.json({
          success: true,
          project: newProject,
          output: stdout || stderr,
          message: `Project ${projectName} created successfully!`
        })

      } catch (execError: any) {
        return NextResponse.json({
          success: false,
          error: 'Failed to create project',
          message: execError.message,
          suggestion: 'Make sure BITNUN CLI is installed globally: npm install -g bitnun'
        }, { status: 400 })
      }
    }

    if (action === 'deploy') {
      // Deploy a project to testnet
      const { projectId } = await request.json()
      
      // In a real implementation, this would:
      // 1. Build the project
      // 2. Deploy smart contracts to testnet
      // 3. Deploy frontend to Vercel/Netlify
      // 4. Update project status
      
      const projectsData = await getProjects()
      const project = projectsData.projects.find((p: any) => p.id === projectId)
      
      if (!project) {
        return NextResponse.json({
          error: 'Project not found'
        }, { status: 404 })
      }

      // Simulate deployment
      project.status = 'deploying'
      project.deployStartedAt = new Date().toISOString()
      await saveProjects(projectsData)

      // Simulate deployment completion after a delay
      setTimeout(async () => {
        try {
          project.status = 'deployed'
          project.deployedAt = new Date().toISOString()
          project.contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`
          project.frontendUrl = `https://${project.name.toLowerCase()}.bitnun.dev`
          await saveProjects(projectsData)
        } catch (error) {
          console.error('Error updating project after deployment:', error)
        }
      }, 5000) // 5 second simulated deployment

      return NextResponse.json({
        success: true,
        message: `Deployment started for ${project.name}`,
        project
      })
    }

    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({
      error: 'Invalid request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}