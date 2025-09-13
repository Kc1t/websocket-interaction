"use client"

import type React from "react"
import { useRef } from "react"
import GameCanvas from "@/components/game-canvas"
import VirtualJoystick from "@/components/virtual-joystick"
import { useSocketConnection } from "@/hooks/useSocketConnection"
import { useMovement } from "@/hooks/useMovement"

export default function Home() {
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const { socket, balls, myBallId, isConnected } = useSocketConnection()
  const { moveBall, handleJoystickMove, handleJoystickStart, handleJoystickEnd } = useMovement({
    socket,
    myBallId,
    balls
  })

  const handleGameAreaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!socket || !myBallId || !gameAreaRef.current) return

    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const ballRadius = 24

    // Canvas fixa de 300x300
    const canvasWidth = 300
    const canvasHeight = 300

    console.log('Click debug:')
    console.log('Rect:', rect)
    console.log('Click position:', { x, y })
    console.log('Canvas size:', { width: canvasWidth, height: canvasHeight })

    // Validar se está dentro da área visível
    const validX = Math.max(ballRadius, Math.min(canvasWidth - ballRadius, x))
    const validY = Math.max(ballRadius, Math.min(canvasHeight - ballRadius, y))

    console.log('Valid position:', { validX, validY })

    // Enviar movimento para o servidor
    socket.emit("moveBall", {
      ballId: myBallId,
      x: validX,
      y: validY,
    })
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="relative">
        {/* Canvas de jogo */}
        <GameCanvas
          ref={gameAreaRef}
          balls={balls}
          myBallId={myBallId}
          onCanvasClick={handleGameAreaClick}
          width={300}
          height={300}
        />

        {/* Status de conexão */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs ${
          isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </div>

        {/* Joystick Virtual */}
        <VirtualJoystick
          onJoystickMove={handleJoystickMove}
          onJoystickStart={handleJoystickStart}
          onJoystickEnd={handleJoystickEnd}
        />

        {/* Instruções */}
        <div className="absolute bottom-2 left-2 text-gray-600 text-xs">
          <div>WASD / Setas: Mover</div>
          <div>Clique: Teleportar</div>
          <div>Joystick: Arraste</div>
        </div>
      </div>
    </div>
  )
}
