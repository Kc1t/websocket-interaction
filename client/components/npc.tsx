'use client'

interface NPCProps {
  id: string
  x: number
  y: number
  name: string
  isInRange?: boolean
  onClick?: () => void
}

export default function NPC({ id, x, y, name, isInRange = false, onClick }: NPCProps) {
  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{
        left: x - 20,
        top: y - 20,
        zIndex: 10,
      }}
      onClick={onClick}
    >
      {/* NPC Body */}
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          border: isInRange ? '3px solid #fbbf24' : '2px solid #065f46',
          boxShadow: isInRange 
            ? '0 0 20px rgba(251, 191, 36, 0.6), 0 4px 12px rgba(16, 185, 129, 0.4)' 
            : '0 4px 8px rgba(16, 185, 129, 0.3)',
          transform: isInRange ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <div className="text-white font-bold text-xs">?</div>
      </div>

      {/* Name tag */}
      <div 
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
        style={{
          background: isInRange ? '#1f2937' : 'rgba(31, 41, 55, 0.8)',
          color: isInRange ? '#fbbf24' : '#d1d5db',
          fontSize: '10px',
          transition: 'all 0.3s ease',
        }}
      >
        {name}
      </div>

      {/* Interaction prompt */}
      {isInRange && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium animate-bounce">
          💬 Pressione F
        </div>
      )}

      {/* Glow effect when in range */}
      {isInRange && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, transparent 60%, rgba(251, 191, 36, 0.2) 80%)',
            transform: 'scale(2)',
            zIndex: -1,
          }}
        />
      )}
    </div>
  )
}