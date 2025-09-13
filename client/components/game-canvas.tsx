'use client'

import { forwardRef } from 'react'
import Ball from './Ball'

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
  return (
    <div
      ref={ref}
      className={`relative bg-white border-4 border-gray-800 cursor-crosshair ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={onCanvasClick}
    >
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
