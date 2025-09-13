'use client'

interface PointProps {
  id: number
  x: number
  y: number
  width: number
  height: number
  collected: boolean
  type: "coin" | "gem"
}

export default function Point({ 
  id, 
  x, 
  y, 
  width, 
  height, 
  collected, 
  type 
}: PointProps) {
  if (collected) return null

  return (
    <div
      className={`absolute rounded-full shadow-lg animate-bounce ${
        type === "gem"
          ? "bg-purple-500 border-2 border-purple-700"
          : "bg-yellow-500 border-2 border-yellow-700"
      }`}
      style={{
        left: `${(x / 800) * 100}%`,
        top: `${(y / 600) * 100}%`,
        width: `${(width / 800) * 100}%`,
        height: `${(height / 600) * 100}%`,
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-xs">
        {type === "gem" ? "💎" : "🪙"}
      </div>
    </div>
  )
}
