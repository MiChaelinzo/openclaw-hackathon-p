import { useEffect, useRef } from 'react'

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const trails: TrailPoint[] = []
    const maxTrails = 20

    interface TrailPoint {
      x: number
      y: number
      life: number
      maxLife: number
    }

    const handleMouseMove = (e: MouseEvent) => {
      trails.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        maxLife: 1
      })

      if (trails.length > maxTrails) {
        trails.shift()
      }
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < trails.length; i++) {
        const trail = trails[i]
        trail.life -= 0.05

        if (trail.life <= 0) {
          trails.splice(i, 1)
          i--
          continue
        }

        const size = 20 * trail.life
        const gradient = ctx.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, size)
        gradient.addColorStop(0, `oklch(0.75 0.15 195 / ${0.3 * trail.life})`)
        gradient.addColorStop(0.5, `oklch(0.55 0.24 250 / ${0.2 * trail.life})`)
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(trail.x, trail.y, size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('mousemove', handleMouseMove)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
}
