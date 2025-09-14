"use client"

import type React from "react"
import { useRef } from "react"
import GameCanvas from "@/components/game-canvas"
import VirtualJoystick from "@/components/virtual-joystick"
import { useMovement } from "@/hooks/useMovement"
import { useSocketConnection } from "@/hooks/use-socket-connection"

export default function Home() {
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const { socket, balls, myBallId, isConnected } = useSocketConnection()
  const { moveBall, handleJoystickMove, handleJoystickStart, handleJoystickEnd } = useMovement({
    socket,
    myBallId,
    balls
  })

  // Debug logs para verificar os dados
  console.log("=== HOME COMPONENT DEBUG ===")
  console.log("Socket conectado:", !!socket)
  console.log("Está conectado:", isConnected)
  console.log("Meu Ball ID:", myBallId)
  console.log("Total de balls:", balls.length)
  console.log("Balls data:", balls)
  console.log("=============================")

  // Função para criar ball de teste
  const createTestBall = () => {
    console.log("🧪 Criando ball de teste...")
    if (socket) {
      console.log("🏓 Enviando ping de teste...")
      socket.emit('ping', { message: 'Test from button!', timestamp: Date.now() })
      
      console.log("🔄 Solicitando dados...")
      socket.emit('requestData')
    } else {
      console.log("❌ Socket não disponível para teste")
    }
  }

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

        {/* Debug info */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">
          <div>Balls: {balls.length}</div>
          <div>Meu ID: {myBallId || 'N/A'}</div>
          <div>Socket: {socket ? 'OK' : 'NULL'}</div>
          <button 
            onClick={createTestBall}
            className="mt-1 px-2 py-1 bg-yellow-500 text-black rounded text-xs"
          >
            Teste
          </button>
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
