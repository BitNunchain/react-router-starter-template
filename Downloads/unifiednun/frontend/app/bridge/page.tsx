'use client'

import { Navigation } from '../../components/Navigation'
import { Bridge } from '../../components/Bridge'
import { Footer } from '../../components/Footer'
import { ParticleBackground } from '../../components/ParticleBackground'

export default function BridgePage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-16">
        <div className="py-20">
          <Bridge />
        </div>
      </main>

      <Footer />
    </div>
  )
}