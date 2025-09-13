'use client'

interface NPCProps {
  id: number
  x: number
  y: number
  width: number
  height: number
  name: string
  dialogue: string
  emoji: string
  isNearby?: boolean
}

export default function NPC({ 
  id, 
  x, 
  y, 
  width, 
  height, 
  name, 
  dialogue, 
  emoji, 
  isNearby = false 
}: NPCProps) {
  return (
    <div
      className={`absolute bg-orange-400 border-2 border-orange-600 rounded-sm shadow-lg transition-all duration-200 ${
        isNearby ? "scale-110 animate-pulse" : ""
      }`}
      style={{
        left: `${(x / 800) * 100}%`,
        top: `${(y / 600) * 100}%`,
        width: `${(width / 800) * 100}%`,
        height: `${(height / 600) * 100}%`,
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-lg">{emoji}</div>
      {/* Name tag */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        {name}
      </div>
    </div>
  )
}
