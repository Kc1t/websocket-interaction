'use client'

interface BallProps {
  id: number
  x: number
  y: number
  color: string
  isMyBall?: boolean
}

export default function Ball({ id, x, y, color, isMyBall = false }: BallProps) {
  // Debug logs para Ball
  console.log("=== BALL COMPONENT DEBUG ===")
  console.log(`Renderizando Ball ID: ${id}`)
  console.log(`Posição: x=${x}, y=${y}`)
  console.log(`Cor: ${color}`)
  console.log(`É minha ball: ${isMyBall}`)
  console.log(`Posição final: left=${x - 24}, top=${y - 24}`)
  console.log("============================")
  return (
    <div
      className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-200 ease-out z-10 ${
        isMyBall ? "ring-2 ring-gray-400 ring-opacity-50 scale-110" : ""
      }`}
      style={{
        left: x - 24,
        top: y - 24,
        backgroundColor: color,
        boxShadow: `0 0 20px ${color}40`,
        minWidth: '48px',
        minHeight: '48px',
        border: '2px solid rgba(0,0,0,0.2)', // Borda para debug
      }}
    >
      {id}
    </div>
  )
}
    