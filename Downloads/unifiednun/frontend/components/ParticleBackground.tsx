'use client'

import { useState, useEffect } from 'react'

interface Particle {
  id: number
  x: number
  delay: number
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const particleArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 6,
    }))
    setParticles(particleArray)
  }, [])

  return (
    <div className="particle-bg">
      {particles.map((particle: Particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}