'use client'

import { Navigation } from '../../components/Navigation'
import { Features } from '../../components/Features'
import { Stats } from '../../components/Stats'
import { Footer } from '../../components/Footer'
import { ParticleBackground } from '../../components/ParticleBackground'

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      
      <main className="relative z-10 pt-16">
        <div className="py-20">
          <div className="container mx-auto px-6 mb-20">
            <h1 className="text-5xl font-bold text-center mb-8 gradient-text">
              UnifiedNun Features
            </h1>
            <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto mb-12">
              Discover the powerful features that make UnifiedNun the next generation blockchain platform
            </p>
          </div>
          <Stats />
          <Features />
        </div>
      </main>

      <Footer />
    </div>
  )
}