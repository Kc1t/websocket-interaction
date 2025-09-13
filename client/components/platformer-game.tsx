'use client'

import { useState, useEffect, useCallback } from "react"
import { useSocketConnection } from "@/hooks/use-socket-connection"

interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  onGround: boolean
}

interface Platform {
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface Point {
  id: number
  x: number
  y: number
  width: number
  height: number
  collected: boolean
  type: "coin" | "gem"
}

interface NPC {
  id: number
  x: number
  y: number
  width: number
  height: number
  name: string
  dialogue: string
  emoji: string
}

export default function PlatformerGame() {
  // Adicionar logs para debug do WebSocket
  const { socket, players, myPlayerId, points: serverPoints, npcs: serverNpcs } = useSocketConnection()
  
  console.log("🔍 Debug Info:")
  console.log("Socket connected:", !!socket)
  console.log("My Player ID:", myPlayerId)
  console.log("Players array:", players)
  console.log("Players length:", players.length)
  console.log("Server Points:", serverPoints)
  console.log("Server NPCs:", serverNpcs)

  const [player, setPlayer] = useState<Player>({
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
  })

  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [score, setScore] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [currentNPC, setCurrentNPC] = useState<NPC | null>(null)
  const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null)

  const [points, setPoints] = useState<Point[]>([
    { id: 1, x: 250, y: 420, width: 20, height: 20, collected: false, type: "coin" },
    { id: 2, x: 450, y: 320, width: 20, height: 20, collected: false, type: "gem" },
    { id: 3, x: 650, y: 220, width: 20, height: 20, collected: false, type: "coin" },
    { id: 4, x: 100, y: 500, width: 20, height: 20, collected: false, type: "gem" },
    { id: 5, x: 350, y: 200, width: 20, height: 20, collected: false, type: "coin" },
  ])

  const npcs: NPC[] = [
    {
      id: 1,
      x: 150,
      y: 510,
      width: 30,
      height: 30,
      name: "Friendly Guard",
      dialogue:
        "Welcome to our magical world! I've been guarding this area for years. The platforms above hold many treasures - be careful jumping around!",
      emoji: "🛡️",
    },
    {
      id: 2,
      x: 300,
      y: 410,
      width: 30,
      height: 30,
      name: "Wise Merchant",
      dialogue:
        "Ah, a fellow adventurer! I see you're collecting coins and gems. Did you know the purple gems are worth twice as much as the golden coins?",
      emoji: "🧙‍♂️",
    },
    {
      id: 3,
      x: 550,
      y: 210,
      width: 30,
      height: 30,
      name: "Sky Watcher",
      dialogue:
        "From up here, I can see the whole world! The view is amazing, but it took me many tries to reach this high platform. Keep practicing your jumps!",
      emoji: "🔭",
    },
  ]

  // Define the 4 interactive platforms
  const platforms: Platform[] = [
    { x: 0, y: 550, width: 800, height: 50, color: "bg-green-500" }, // Ground
    { x: 200, y: 450, width: 150, height: 20, color: "bg-blue-500" }, // Platform 1
    { x: 400, y: 350, width: 120, height: 20, color: "bg-red-500" }, // Platform 2
    { x: 600, y: 250, width: 100, height: 20, color: "bg-purple-500" }, // Platform 3
  ]

  // Game constants
  const GRAVITY = 0.8
  const JUMP_FORCE = -15
  const MOVE_SPEED = 5
  const FRICTION = 0.8

  // Collision detection
  const checkCollision = useCallback((player: Player, platform: Platform) => {
    return (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y
    )
  }, [])

  const checkPointCollision = useCallback((player: Player, point: Point) => {
    return (
      player.x < point.x + point.width &&
      player.x + player.width > point.x &&
      player.y < point.y + point.height &&
      player.y + player.height > point.y
    )
  }, [])

  const checkNPCProximity = useCallback((player: Player, npc: NPC) => {
    const distance = Math.sqrt(
      Math.pow(player.x + player.width / 2 - (npc.x + npc.width / 2), 2) +
        Math.pow(player.y + player.height / 2 - (npc.y + npc.height / 2), 2)
    )
    return distance < 60 // Within 60 pixels
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b") {
        if (nearbyNPC) {
          setCurrentNPC(nearbyNPC)
          setShowModal(true)
        }
        return
      }
      setKeys((prev) => new Set(prev).add(e.key.toLowerCase()))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = new Set(prev)
        newKeys.delete(e.key.toLowerCase())
        return newKeys
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [nearbyNPC])

  const handleMobileControl = (action: string, pressed: boolean) => {
    if (action === "talk") {
      if (pressed && nearbyNPC) {
        setCurrentNPC(nearbyNPC)
        setShowModal(true)
      }
      return
    }

    setKeys((prev) => {
      const newKeys = new Set(prev)
      if (pressed) {
        newKeys.add(action)
      } else {
        newKeys.delete(action)
      }
      return newKeys
    })
  }

  // Game loop - Versão local funcionando
  useEffect(() => {
    console.log("🎮 Game loop started")
    console.log("Current keys:", Array.from(keys))
    
    const gameLoop = () => {
      setPlayer((prevPlayer) => {
        const newPlayer = { ...prevPlayer }

        // Handle horizontal movement
        if (keys.has("a") || keys.has("arrowleft")) {
          newPlayer.velocityX = -MOVE_SPEED
        } else if (keys.has("d") || keys.has("arrowright")) {
          newPlayer.velocityX = MOVE_SPEED
        } else {
          newPlayer.velocityX *= FRICTION
        }

        // Handle jumping
        if ((keys.has(" ") || keys.has("w") || keys.has("arrowup")) && newPlayer.onGround) {
          newPlayer.velocityY = JUMP_FORCE
          newPlayer.onGround = false
        }

        // Apply gravity
        newPlayer.velocityY += GRAVITY

        // Update position
        newPlayer.x += newPlayer.velocityX
        newPlayer.y += newPlayer.velocityY

        // Keep player within screen bounds
        if (newPlayer.x < 0) newPlayer.x = 0
        if (newPlayer.x + newPlayer.width > 800) newPlayer.x = 800 - newPlayer.width

        // Reset ground status
        newPlayer.onGround = false

        // Check collisions with platforms
        platforms.forEach((platform) => {
          if (checkCollision(newPlayer, platform)) {
            // Landing on top of platform
            if (prevPlayer.y + prevPlayer.height <= platform.y && newPlayer.velocityY > 0) {
              newPlayer.y = platform.y - newPlayer.height
              newPlayer.velocityY = 0
              newPlayer.onGround = true
            }
            // Hitting platform from below
            else if (prevPlayer.y >= platform.y + platform.height && newPlayer.velocityY < 0) {
              newPlayer.y = platform.y + platform.height
              newPlayer.velocityY = 0
            }
            // Hitting platform from the side
            else if (prevPlayer.x + prevPlayer.width <= platform.x || prevPlayer.x >= platform.x + platform.width) {
              newPlayer.x = prevPlayer.x
              newPlayer.velocityX = 0
            }
          }
        })

        setPoints((prevPoints) => {
          let scoreIncrease = 0
          const newPoints = prevPoints.map((point) => {
            if (!point.collected && checkPointCollision(newPlayer, point)) {
              scoreIncrease += point.type === "gem" ? 20 : 10
              return { ...point, collected: true }
            }
            return point
          })

          if (scoreIncrease > 0) {
            setScore((prevScore) => prevScore + scoreIncrease)
          }

          return newPoints
        })

        let foundNearbyNPC = null
        npcs.forEach((npc) => {
          if (checkNPCProximity(newPlayer, npc)) {
            foundNearbyNPC = npc
          }
        })
        setNearbyNPC(foundNearbyNPC)

        // Prevent falling through the bottom
        if (newPlayer.y > 600) {
          newPlayer.y = 300
          newPlayer.x = 50
          newPlayer.velocityX = 0
          newPlayer.velocityY = 0
        }

        return newPlayer
      })
    }

    const intervalId = setInterval(gameLoop, 16) // ~60 FPS
    return () => clearInterval(intervalId)
  }, [keys, checkCollision, checkPointCollision, checkNPCProximity])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col">
      {/* Game Container - Full Screen */}
      <div className="relative flex-1 bg-gradient-to-b from-sky-300 to-sky-100 overflow-hidden">
        {/* In-Game UI Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
          <div className="text-xl font-bold mb-1">Score: {score}</div>
          <div className="text-xs opacity-90">WASD/Arrows: Move • Space: Jump • B: Talk</div>
          
          {/* Debug Info */}
          <div className="mt-2 text-xs border-t border-white/20 pt-2">
            <div>🔍 Debug:</div>
            <div>Socket: {socket ? '✅ Connected' : '❌ Disconnected'}</div>
            <div>My ID: {myPlayerId || 'None'}</div>
            <div>WS Players: {players.length}</div>
            <div>Local Player: {player.x.toFixed(0)}, {player.y.toFixed(0)}</div>
          </div>
        </div>

        {/* NPC Interaction Prompt */}
        {nearbyNPC && (
          <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg animate-bounce">
            <p className="text-sm font-bold text-gray-800">Press B to talk to {nearbyNPC.name}</p>
          </div>
        )}

        {/* Platforms */}
        {platforms.map((platform, index) => (
          <div
            key={index}
            className={`absolute ${platform.color} rounded-sm shadow-lg`}
            style={{
              left: `${(platform.x / 800) * 100}%`,
              top: `${(platform.y / 600) * 100}%`,
              width: `${(platform.width / 800) * 100}%`,
              height: `${(platform.height / 600) * 100}%`,
            }}
          />
        ))}

        {/* Points - usando pontos locais para garantir que apareçam */}
        {points.map(
          (point) =>
            !point.collected && (
              <div
                key={point.id}
                className={`absolute rounded-full shadow-lg animate-bounce ${
                  point.type === "gem"
                    ? "bg-purple-500 border-2 border-purple-700"
                    : "bg-yellow-500 border-2 border-yellow-700"
                }`}
                style={{
                  left: `${(point.x / 800) * 100}%`,
                  top: `${(point.y / 600) * 100}%`,
                  width: `${(point.width / 800) * 100}%`,
                  height: `${(point.height / 600) * 100}%`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-xs">
                  {point.type === "gem" ? "💎" : "🪙"}
                </div>
              </div>
            )
        )}

        {/* Jogador LOCAL (sempre visível para testar) */}
        <div
          className="absolute bg-yellow-400 border-2 border-yellow-600 rounded-sm shadow-lg transition-all duration-75 ease-linear ring-2 ring-blue-400 ring-opacity-50 scale-110"
          style={{
            left: `${(player.x / 800) * 100}%`,
            top: `${(player.y / 600) * 100}%`,
            width: `${(player.width / 800) * 100}%`,
            height: `${(player.height / 600) * 100}%`,
          }}
        >
          {/* Player face */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-xs">😊</div>
          </div>
          {/* Name tag */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Local Player (YOU)
          </div>
        </div>

        {/* Jogadores via WebSocket (se conectado) */}
        {players.length > 0 && (
          <>
            {console.log("🎮 Rendering", players.length, "WebSocket players")}
            {players.map((wsPlayer) => (
              <div
                key={`ws-${wsPlayer.id}`}
                className="absolute bg-red-400 border-2 border-red-600 rounded-sm shadow-lg transition-all duration-75 ease-linear"
                style={{
                  left: `${(wsPlayer.x / 800) * 100}%`,
                  top: `${(wsPlayer.y / 600) * 100}%`,
                  width: `${(wsPlayer.width / 800) * 100}%`,
                  height: `${(wsPlayer.height / 600) * 100}%`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-xs">👤</div>
                </div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Player {wsPlayer.id} {wsPlayer.id === myPlayerId ? '(YOU)' : ''}
                </div>
              </div>
            ))}
          </>
        )}

        {/* NPCs - usando NPCs locais */}
        {npcs.map((npc) => (
          <div
            key={npc.id}
            className={`absolute bg-orange-400 border-2 border-orange-600 rounded-sm shadow-lg transition-all duration-200 ${
              nearbyNPC?.id === npc.id ? "scale-110 animate-pulse" : ""
            }`}
            style={{
              left: `${(npc.x / 800) * 100}%`,
              top: `${(npc.y / 600) * 100}%`,
              width: `${(npc.width / 800) * 100}%`,
              height: `${(npc.height / 600) * 100}%`,
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-lg">{npc.emoji}</div>
            {/* Name tag */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {npc.name}
            </div>
          </div>
        ))}

        {/* Clouds for decoration */}
        <div className="absolute top-[8%] left-[10%] w-[8%] h-[5%] bg-white/60 rounded-full"></div>
        <div className="absolute top-[15%] right-[20%] w-[10%] h-[6%] bg-white/60 rounded-full"></div>
        <div className="absolute top-[5%] right-[50%] w-[6%] h-[4%] bg-white/60 rounded-full"></div>
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden bg-black/20 backdrop-blur-sm p-4">
        <div className="flex justify-center gap-4">
          <div className="flex gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all"
              onTouchStart={() => handleMobileControl("a", true)}
              onTouchEnd={() => handleMobileControl("a", false)}
              onMouseDown={() => handleMobileControl("a", true)}
              onMouseUp={() => handleMobileControl("a", false)}
            >
              ←
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all"
              onTouchStart={() => handleMobileControl("d", true)}
              onTouchEnd={() => handleMobileControl("d", false)}
              onMouseDown={() => handleMobileControl("d", true)}
              onMouseUp={() => handleMobileControl("d", false)}
            >
              →
            </button>
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all"
            onTouchStart={() => handleMobileControl(" ", true)}
            onTouchEnd={() => handleMobileControl(" ", false)}
            onMouseDown={() => handleMobileControl(" ", true)}
            onMouseUp={() => handleMobileControl(" ", false)}
          >
            JUMP
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all"
            onTouchStart={() => handleMobileControl("talk", true)}
            onTouchEnd={() => handleMobileControl("talk", false)}
            onMouseDown={() => handleMobileControl("talk", true)}
            onMouseUp={() => handleMobileControl("talk", false)}
          >
            TALK
          </button>
        </div>
      </div>

      {/* NPC Dialog Modal */}
      {showModal && currentNPC && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{currentNPC.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800">{currentNPC.name}</h2>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">{currentNPC.dialogue}</p>
            <div className="text-sm text-gray-500 mb-4">
              Current Score: <span className="font-bold text-yellow-600">{score}</span>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all w-full"
              onClick={() => {
                setShowModal(false)
                setCurrentNPC(null)
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}