"use client"

import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"
import GameCanvas from "@/components/game-canvas"
import VirtualJoystick from "@/components/virtual-joystick"
import NPC from "@/components/npc"
import DialogModal from "@/components/dialog-modal"
import ResponsiveFloorBackground from "@/components/responsive-floor-background"
import { useMovement } from "@/hooks/useMovement"
import { useSocketConnection } from "@/hooks/use-socket-connection"
import { useWindowSize } from "@/hooks/use-window-size"

export default function Home() {
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const { socket, balls, myBallId, isConnected } = useSocketConnection()
  const { moveBall, handleJoystickMove, handleJoystickStart, handleJoystickEnd } = useMovement({
    socket,
    myBallId,
    balls
  })
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  // Estados para o sistema de NPC
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentNPC, setCurrentNPC] = useState<{ name: string; message: string } | null>(null)
  const [nearbyNPC, setNearbyNPC] = useState<string | null>(null)

  // NPCs fixos no mapa
  const npcs = [
    { id: 'merchant', x: 200, y: 150, name: 'Mercador João', message: 'Bem-vindo ao nosso mundo! Este é um jogo multiplayer onde você pode interagir com outros jogadores em tempo real.' },
    { id: 'guide', x: 400, y: 300, name: 'Guia Maria', message: 'Use as teclas WASD ou as setas para se mover. No mobile, use o joystick no canto da tela!' },
  ]

  // Calcular tamanho do canvas para ocupar 100% da game area
  const gameAreaHeight = windowHeight * 0.8 // 80% da tela para o jogo
  const canvasWidth = windowWidth // 100% da largura
  const canvasHeight = gameAreaHeight // 100% da altura da game area

  // Debug logs para verificar os dados
  console.log("=== HOME COMPONENT DEBUG ===")
  console.log("Socket conectado:", !!socket)
  console.log("Está conectado:", isConnected)
  console.log("Meu Ball ID:", myBallId)
  console.log("Total de balls:", balls.length)
  console.log("Balls data:", balls)
  console.log("=============================")

  // Função para verificar proximidade com NPCs
  const checkNPCProximity = useCallback(() => {
    if (!myBallId) return

    const myBall = balls.find(ball => ball.id === myBallId)
    if (!myBall) return

    const proximityDistance = 60 // pixels
    let closestNPC = null

    for (const npc of npcs) {
      const distance = Math.sqrt(
        Math.pow(myBall.x - npc.x, 2) + Math.pow(myBall.y - npc.y, 2)
      )
      
      if (distance <= proximityDistance) {
        closestNPC = npc.id
        break
      }
    }

    setNearbyNPC(closestNPC)
  }, [myBallId, balls, npcs])

  // Verificar proximidade sempre que a posição mudar
  useEffect(() => {
    checkNPCProximity()
  }, [checkNPCProximity, balls])

  // Função para interagir com NPC
  const handleNPCInteraction = useCallback((npcId: string) => {
    const npc = npcs.find(n => n.id === npcId)
    if (npc && npcId === nearbyNPC) {
      setCurrentNPC({ name: npc.name, message: npc.message })
      setIsDialogOpen(true)
    }
  }, [nearbyNPC, npcs])

  // Listener para tecla F
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'f' || event.key === 'F') {
        if (nearbyNPC && !isDialogOpen) {
          handleNPCInteraction(nearbyNPC)
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [nearbyNPC, isDialogOpen, handleNPCInteraction])

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
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      {/* Game Area - 80% da tela */}
      <div className="flex-1 relative w-full h-full" style={{ height: '80vh' }}>
        {/* Background SVG Responsivo */}
        <ResponsiveFloorBackground 
          width={canvasWidth}
          height={canvasHeight}
          className="absolute inset-0"
        />

        {/* Canvas de jogo - 100% da área com fundo transparente */}
        <GameCanvas
          ref={gameAreaRef}
          balls={balls}
          myBallId={myBallId}
          onCanvasClick={handleGameAreaClick}
          width={canvasWidth}
          height={canvasHeight}
          className="absolute inset-0"
        />

        {/* NPCs */}
        {npcs.map((npc) => (
          <NPC
            key={npc.id}
            id={npc.id}
            x={npc.x}
            y={npc.y}
            name={npc.name}
            isInRange={nearbyNPC === npc.id}
            onClick={() => handleNPCInteraction(npc.id)}
          />
        ))}

        {/* Status de conexão */}
        <div className={`absolute top-4 left-4 px-3 py-2 rounded-lg text-sm font-medium ${
          isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
        </div>

        {/* Debug info */}
        <div className="absolute top-4 right-4 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
          <div>Balls: {balls.length}</div>
          <div>ID: {myBallId || 'N/A'}</div>
          <div>Socket: {socket ? '✅' : '❌'}</div>
          <button 
            onClick={createTestBall}
            className="mt-2 px-3 py-1 bg-yellow-500 text-black rounded-md text-xs font-medium hover:bg-yellow-400 transition-colors"
          >
            Teste
          </button>
        </div>

        {/* Joystick Virtual - Dentro da área do canvas - Apenas em mobile */}
        <div className="absolute bottom-6 right-6 z-20 md:hidden">
          <VirtualJoystick
            onJoystickMove={handleJoystickMove}
            onJoystickStart={handleJoystickStart}
            onJoystickEnd={handleJoystickEnd}
            className="relative"
          />
        </div>

        {/* Instruções de jogo - Atualizada */}
        <div className="absolute bottom-6 left-6 bg-black bg-opacity-60 text-white px-4 py-3 rounded-lg text-sm z-15">
          <div className="font-semibold mb-1">Controles:</div>
          <div>🎮 WASD / Setas: Mover</div>
          <div>🖱️ Clique: Teleportar</div>
          <div>📱 Joystick: Arrastar</div>
          <div>💬 F: Falar com NPC</div>
        </div>
      </div>

      {/* Modal de Diálogo */}
      <DialogModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        npcName={currentNPC?.name || ''}
        npcMessage={currentNPC?.message || ''}
        playerName="Jogador"
      />

      {/* Bottom Bar - 20% da tela */}
      <div className="h-[20vh] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t-2 border-slate-700 flex items-center justify-between px-8">
        {/* Informações do desenvolvedor */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            K
          </div>
          <div className="text-white">
            <h3 className="font-bold text-lg">WebSocket Game</h3>
            <p className="text-slate-300 text-sm">Multiplayer Real-time Game</p>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="flex items-center space-x-6">
          {/* LinkedIn */}
          <a 
            href="https://linkedin.com/in/seu-perfil" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="font-medium">LinkedIn</span>
          </a>

          {/* GitHub */}
          <a 
            href="https://github.com/seu-usuario" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="font-medium">GitHub</span>
          </a>

          {/* Portfolio */}
          <a 
            href="https://seu-portfolio.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
            <span className="font-medium">Portfolio</span>
          </a>

          {/* Stats do jogo */}
          <div className="bg-slate-700 px-4 py-2 rounded-lg">
            <div className="text-slate-300 text-xs">Players Online</div>
            <div className="text-white font-bold text-lg">{balls.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
