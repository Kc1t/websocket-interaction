'use client'

interface BallProps {
  id: number
  x: number
  y: number
  color: string
  isMyBall?: boolean
}

export default function Ball({ id, x, y, color, isMyBall = false }: BallProps) {
  return (
    <div
      className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-200 ease-out ${
        isMyBall ? "ring-2 ring-gray-400 ring-opacity-50 scale-110" : ""
      }`}
      style={{
        left: x - 24,
        top: y - 24,
        backgroundColor: color,
        boxShadow: `0 0 20px ${color}40`,
      }}
    >
      {id}
    </div>
  )
}
    