import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-40 transition-opacity duration-300"
      style={{
        width: '600px',
        height: '600px',
        marginLeft: '-300px',
        marginTop: '-300px',
        background: 'radial-gradient(circle, oklch(0.55 0.24 250 / 0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  )
}
