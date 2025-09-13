'use client'

interface PlayerProps {
  id: number
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  onGround: boolean
  isMyPlayer?: boolean
  name?: string
}

export default function Player({ 
  id, 
  x, 
  y, 
  width, 
  height, 
  velocityX, 
  velocityY, 
  onGround, 
  isMyPlayer = false,
  name = `Player ${id}`
}: PlayerProps) {
  return (
    <div
      className={`absolute bg-yellow-400 border-2 border-yellow-600 rounded-sm shadow-lg transition-all duration-75 ease-linear ${
        isMyPlayer ? "ring-2 ring-blue-400 ring-opacity-50 scale-110" : ""
      }`}
      style={{
        left: `${(x / 800) * 100}%`,
        top: `${(y / 600) * 100}%`,
        width: `${(width / 800) * 100}%`,
        height: `${(height / 600) * 100}%`,
      }}
    >
      {/* Player face */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-xs">😊</div>
      </div>
      
      {/* Name tag */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        {name}
      </div>
    </div>
  )
}
