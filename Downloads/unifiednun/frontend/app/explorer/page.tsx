'use client'

import { Navigation } from '../../components/Navigation'
import { Explorer } from '../../components/Explorer'
import { Footer } from '../../components/Footer'
import { ParticleBackground } from '../../components/ParticleBackground'

export default function ExplorerPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-16">
        <div className="py-20">
          <Explorer />
        </div>
      </main>

      <Footer />
    </div>
  )
}