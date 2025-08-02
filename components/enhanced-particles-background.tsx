"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  originalX: number
  originalY: number
}

export default function EnhancedParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 12000))

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height

        particlesRef.current.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.2,
        })
      }
    }

    initParticles()

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Mouse repulsion effect
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const repulsionRadius = 120

        if (distance < repulsionRadius && distance > 0) {
          const force = (repulsionRadius - distance) / repulsionRadius
          const repulsionForce = force * 0.8

          // Repel particles away from cursor
          particle.vx -= (dx / distance) * repulsionForce
          particle.vy -= (dy / distance) * repulsionForce
        }

        // Return to original position (spring effect)
        const returnForce = 0.02
        const dxOriginal = particle.originalX - particle.x
        const dyOriginal = particle.originalY - particle.y

        particle.vx += dxOriginal * returnForce
        particle.vy += dyOriginal * returnForce

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Friction
        particle.vx *= 0.95
        particle.vy *= 0.95

        // Boundary check with soft bounce
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.5
          particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.5
          particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        }

        // Dynamic opacity based on movement
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        const dynamicOpacity = Math.min(particle.opacity + speed * 2, 1)

        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)
        gradient.addColorStop(0, `rgba(34, 197, 94, ${dynamicOpacity})`)
        gradient.addColorStop(0.5, `rgba(34, 197, 94, ${dynamicOpacity * 0.5})`)
        gradient.addColorStop(1, `rgba(34, 197, 94, 0)`)

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw core particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34, 197, 94, ${dynamicOpacity})`
        ctx.fill()

        // Connect nearby particles with dynamic lines
        particlesRef.current.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 100

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            const gradient = ctx.createLinearGradient(particle.x, particle.y, otherParticle.x, otherParticle.y)
            gradient.addColorStop(0, `rgba(34, 197, 94, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(34, 197, 94, ${opacity * 0.5})`)
            gradient.addColorStop(1, `rgba(34, 197, 94, ${opacity})`)

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
