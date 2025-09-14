'use client'

import { forwardRef } from 'react'
import Ball from './ball'

interface BallData {
  id: number
  x: number
  y: number
  color: string
}

interface GameCanvasProps {
  balls: BallData[]
  myBallId: number | null
  onCanvasClick: (event: React.MouseEvent<HTMLDivElement>) => void
  width?: number
  height?: number
  className?: string
}

const GameCanvas = forwardRef<HTMLDivElement, GameCanvasProps>(({ 
  balls, 
  myBallId, 
  onCanvasClick,
  width = 300,
  height = 300,
  className = ""
}, ref) => {
  
  // Debug logs para GameCanvas
  console.log("=== GAME CANVAS DEBUG ===")
  console.log("Balls recebidas:", balls)
  console.log("Total de balls:", balls.length)
  console.log("Meu Ball ID:", myBallId)
  console.log("Canvas dimensions:", { width, height })
  console.log("=========================")
  return (
    <div
      ref={ref}
      className={`relative bg-white border-4 border-gray-800 cursor-crosshair overflow-visible ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        position: 'relative',
        zIndex: 1
      }}
      onClick={onCanvasClick}
    >
      {/* Debug: mostrar se há balls */}
      {balls.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold">
          Nenhuma ball encontrada
        </div>
      )}
      
      {/* Bolinhas */}
      {balls.map((ball) => (
        <Ball
          key={ball.id}
          id={ball.id}
          x={ball.x}
          y={ball.y}
          color={ball.color}
          isMyBall={ball.id === myBallId}
        />
      ))}
    </div>
  )
})

GameCanvas.displayName = 'GameCanvas'

export default GameCanvas
