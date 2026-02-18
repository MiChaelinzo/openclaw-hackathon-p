export function AnimatedGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, oklch(0.55 0.24 250 / 0.15) 0%, transparent 70%)',
          animationDelay: '0s',
          animationDuration: '8s'
        }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, oklch(0.75 0.15 195 / 0.12) 0%, transparent 70%)',
          animationDelay: '2s',
          animationDuration: '10s'
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-float"
        style={{
          background: 'radial-gradient(circle, oklch(0.70 0.18 145 / 0.08) 0%, transparent 70%)',
          animationDelay: '4s',
          animationDuration: '12s'
        }}
      />
    </div>
  )
}
