import type { Blockchain } from "./blockchain"
import { MultiChainManager } from "./multi-chain-manager"

export class MiningEngine {
  private multiChainManager: MultiChainManager | null = null
  private blockchain: Blockchain
  private isActive: boolean
  private hashRate: number
  private miningInterval: NodeJS.Timeout | null
  private hashRateInterval: NodeJS.Timeout | null
  private actionMultipliers: Map<string, number>
  private miningWorkers: Worker[]
  private difficulty: number
  private targetHashRate: number
  private performanceMetrics: {
    cpuCores: number
    memoryUsage: number
    batteryLevel: number
    thermalState: string
  }

  constructor(blockchain: Blockchain, multiChainManager?: MultiChainManager) {
    this.blockchain = blockchain
    this.isActive = false
    this.hashRate = 0
    this.miningInterval = null
    this.hashRateInterval = null
    this.miningWorkers = []
    this.difficulty = 2
    this.targetHashRate = 1000
    this.actionMultipliers = new Map([
      ["click", 1.1],
      ["share", 2.0],
      ["invite", 5.0],
      ["visit", 1.5],
      ["form", 1.3],
      ["scroll", 1.05],
      ["hover", 1.02],
      ["focus", 1.08],
    ])

    this.performanceMetrics = {
      cpuCores: navigator.hardwareConcurrency || 4,
      memoryUsage: 0,
      batteryLevel: 100,
      thermalState: "normal",
    }

    this.initializePerformanceMonitoring()
    this.multiChainManager = multiChainManager || null
  }

  private initializePerformanceMonitoring(): void {
    // BatteryManager type declaration for TypeScript
    type BatteryManager = {
  level: number
  addEventListener: (type: string, listener: (this: BatteryManager, ev: Event) => void) => void
    }

    // Define PerformanceMemory interface for compatibility
    interface PerformanceMemory {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
    }
    
        // Monitor battery status if available
        if ("getBattery" in navigator) {
          ;(navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }).getBattery?.().then((battery: BatteryManager) => {
            battery.addEventListener("levelchange", () => {
              this.performanceMetrics.batteryLevel = battery.level * 100
              this.adjustMiningIntensity()
            })
          })
        }

    // Monitor memory usage
    if ("memory" in performance) {
      setInterval(() => {
        const memory = (performance as Performance & { memory: PerformanceMemory }).memory
        this.performanceMetrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
        this.adjustMiningIntensity()
      }, 5000)
    }
  }

  private adjustMiningIntensity(): void {
    let intensityFactor = 1.0

    // Reduce intensity on low battery
    if (this.performanceMetrics.batteryLevel < 20) {
      intensityFactor *= 0.3
    } else if (this.performanceMetrics.batteryLevel < 50) {
      intensityFactor *= 0.7
    }

    // Reduce intensity on high memory usage
    if (this.performanceMetrics.memoryUsage > 0.8) {
      intensityFactor *= 0.5
    }

    // Adjust target hash rate
    this.targetHashRate = Math.floor(1000 * intensityFactor)

    // Adjust difficulty dynamically
    if (this.hashRate > this.targetHashRate * 1.2) {
      this.difficulty = Math.min(this.difficulty + 1, 6)
    } else if (this.hashRate < this.targetHashRate * 0.8) {
      this.difficulty = Math.max(this.difficulty - 1, 1)
    }
  }

  public startBrowserMining(): void {
    if (this.isActive) return

    this.isActive = true

    this.initializeMiningWorkers()

    // Mine blocks with dynamic interval based on performance
    const miningInterval = Math.max(5000, 15000 - this.performanceMetrics.cpuCores * 1000)
    this.miningInterval = setInterval(() => {
      this.mineBlock()
      // Automatic 24/7 multi-chain mining
      if (this.multiChainManager) {
        const baseReward = 0.001
        const reward = baseReward * 0.5
        this.multiChainManager.mineOnAllChains("user", reward)
      }
    }, miningInterval)

    // Update hash rate simulation with more realistic calculations
    this.hashRateInterval = setInterval(() => {
      this.updateHashRate()
    }, 1000)

    this.startActionMiningListener()
  }

  private initializeMiningWorkers(): void {
    const workerCount = Math.min(this.performanceMetrics.cpuCores, 4)

    for (let i = 0; i < workerCount; i++) {
      try {
        // Use external mining-worker.js for CSP compliance
        const worker = new Worker(new URL('./mining-worker.js', import.meta.url), { type: 'module' });

        worker.onmessage = (e) => {
          if (e.data.type === "solution") {
            console.log(`[Mining Worker ${i}] Found solution:`, e.data.hash)
          } else if (e.data.type === "hashCount") {
            this.hashRate += e.data.count
          }
        }

        this.miningWorkers.push(worker)
      } catch (error) {
        console.warn(`[Mining] Could not create worker ${i}:`, error)
      }
    }
  }

  private startActionMiningListener(): void {
    if (typeof window === "undefined") return

    // Track various user interactions
    const actions = ["click", "scroll", "mousemove", "keypress", "touchstart", "focus", "blur"]

    actions.forEach((action) => {
      document.addEventListener(
        action,
        (e) => {
          this.processUserAction(action, e)
        },
        { passive: true },
      )
    })

    // Track page visibility for mining optimization
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.reduceMiningIntensity()
      } else {
        this.restoreMiningIntensity()
      }
    })
  }

  private reduceMiningIntensity(): void {
    this.targetHashRate *= 0.3 // Reduce to 30% when tab is hidden
  }

  private restoreMiningIntensity(): void {
    this.targetHashRate = 1000 * this.getIntensityFactor()
  }

  private getIntensityFactor(): number {
    let factor = 1.0
    if (this.performanceMetrics.batteryLevel < 50) factor *= 0.7
    if (this.performanceMetrics.memoryUsage > 0.8) factor *= 0.5
    return factor
  }

  public stopMining(): void {
    this.isActive = false

    this.miningWorkers.forEach((worker) => {
      worker.postMessage({ type: "stop" })
      worker.terminate()
    })
    this.miningWorkers = []

    if (this.miningInterval) {
      clearInterval(this.miningInterval)
      this.miningInterval = null
    }
    if (this.hashRateInterval) {
      clearInterval(this.hashRateInterval)
      this.hashRateInterval = null
    }
    this.hashRate = 0
  }

  private mineBlock(): void {
    if (!this.isActive) return

    try {
      const block = this.blockchain.addBlock("user")

      const blockData = `${block.index}${block.timestamp}${block.previousHash}`
      this.miningWorkers.forEach((worker) => {
        worker.postMessage({
          type: "start",
          blockData,
          difficulty: this.difficulty,
        })
      })

      console.log(`[BTN] Mined block #${block.index} with reward ${block.reward} BTN (Difficulty: ${this.difficulty})`)
    } catch (error) {
      console.error("[BTN] Mining error:", error)
    }
  }

  private updateHashRate(): void {
    if (!this.isActive) {
      this.hashRate = 0
      return
    }

    // Get hash counts from workers
    this.miningWorkers.forEach((worker) => {
      worker.postMessage({ type: "getHashCount" })
    })

    // Base hash rate calculation with device-specific factors
    const baseHashRate = this.targetHashRate * 0.8 + Math.random() * this.targetHashRate * 0.4
    const cpuFactor = this.performanceMetrics.cpuCores / 4
    const batteryFactor = this.performanceMetrics.batteryLevel / 100
    const memoryFactor = 1 - this.performanceMetrics.memoryUsage * 0.5

    this.hashRate = Math.floor(baseHashRate * cpuFactor * batteryFactor * memoryFactor)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public processUserAction(actionType: string, e?: Event): void {
    // BTN Unique Concept: Every event mines at 50% BTN on all chains
    const baseReward = 0.001
    const reward = baseReward * 0.5 // Always 50% BTN for every event

    // Add immediate reward for every event on all chains
    if (this.multiChainManager) {
      this.multiChainManager.mineOnAllChains("user", reward)
    } else {
      const transaction = {
        id: `action_${Date.now()}_${Math.random()}`,
        from: "network",
        to: "user",
        amount: reward,
        timestamp: Date.now(),
      }
      this.blockchain.addTransaction(transaction)
    }

    // Temporary hash rate boost for feedback
    const boostDuration = 2000 // 2 seconds
    const originalHashRate = this.hashRate
    this.hashRate = Math.floor(this.hashRate * 1.5)

    setTimeout(() => {
      this.hashRate = originalHashRate
    }, boostDuration)

    console.log(`[BTN] Unique Mine: Every event = new mine, +${reward.toFixed(6)} BTN (50% BTN) on all chains`)
  }

  public getMiningStats(): {
    hashRate: number
    difficulty: number
    targetHashRate: number
    workerCount: number
    performance: {
      cpuCores: number
      memoryUsage: number
      batteryLevel: number
      thermalState: string
    }
    efficiency: number
  } {
    const efficiency = this.targetHashRate > 0 ? (this.hashRate / this.targetHashRate) * 100 : 0

    return {
      hashRate: this.hashRate,
      difficulty: this.difficulty,
      targetHashRate: this.targetHashRate,
      workerCount: this.miningWorkers.length,
      performance: { ...this.performanceMetrics },
      efficiency: Math.min(efficiency, 100),
    }
  }

  public getHashRate(): number {
    return this.hashRate
  }

  public isMining(): boolean {
    return this.isActive
  }

  public getActionMultiplier(actionType: string): number {
    return this.actionMultipliers.get(actionType) || 1.0
  }

  public joinMiningPool(poolId: string): void {
    console.log(`[BTN] Joining mining pool: ${poolId}`)
    // Simulate joining a mining pool for increased rewards
    this.targetHashRate *= 1.5
  }

  public leaveMiningPool(): void {
    console.log(`[BTN] Leaving mining pool`)
    this.targetHashRate = 1000 * this.getIntensityFactor()
  }
}
