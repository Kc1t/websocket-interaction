'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Socket } from 'socket.io-client'

interface Player {
  id: number
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  onGround: boolean
  name?: string
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

interface UsePhysicsProps {
  socket: Socket | null
  myPlayerId: number | null
  players: Player[]
  platforms: Platform[]
  points: Point[]
  npcs: NPC[]
}

export function usePhysics({ socket, myPlayerId, players, platforms, points, npcs }: UsePhysicsProps) {
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [score, setScore] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [currentNPC, setCurrentNPC] = useState<NPC | null>(null)
  const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

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
        Math.pow(player.y + player.height / 2 - (npc.y + npc.height / 2), 2),
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

  const handleMobileControl = useCallback((action: string, pressed: boolean) => {
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
  }, [nearbyNPC])

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      if (!socket || !myPlayerId) return

      const myPlayer = players.find(p => p.id === myPlayerId)
      if (!myPlayer) return

      const newPlayer = { ...myPlayer }

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
          if (myPlayer.y + myPlayer.height <= platform.y && newPlayer.velocityY > 0) {
            newPlayer.y = platform.y - newPlayer.height
            newPlayer.velocityY = 0
            newPlayer.onGround = true
          }
          // Hitting platform from below
          else if (myPlayer.y >= platform.y + platform.height && newPlayer.velocityY < 0) {
            newPlayer.y = platform.y + platform.height
            newPlayer.velocityY = 0
          }
          // Hitting platform from the side
          else if (myPlayer.x + myPlayer.width <= platform.x || myPlayer.x >= platform.x + platform.width) {
            newPlayer.x = myPlayer.x
            newPlayer.velocityX = 0
          }
        }
      })

      // Send player update to server
      socket.emit("playerUpdate", {
        playerId: myPlayerId,
        x: newPlayer.x,
        y: newPlayer.y,
        velocityX: newPlayer.velocityX,
        velocityY: newPlayer.velocityY,
        onGround: newPlayer.onGround
      })

      // Check point collisions
      points.forEach((point) => {
        if (!point.collected && checkPointCollision(newPlayer, point)) {
          const scoreIncrease = point.type === "gem" ? 20 : 10
          setScore((prevScore) => prevScore + scoreIncrease)
          
          // Send point collection to server
          socket.emit("collectPoint", {
            pointId: point.id,
            playerId: myPlayerId
          })
        }
      })

      // Check NPC proximity
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
        
        // Send respawn to server
        socket.emit("playerRespawn", {
          playerId: myPlayerId,
          x: 50,
          y: 300,
          velocityX: 0,
          velocityY: 0,
          onGround: false
        })
      }
    }

    gameLoopRef.current = setInterval(gameLoop, 16) // ~60 FPS
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [keys, socket, myPlayerId, players, platforms, points, npcs, checkCollision, checkPointCollision, checkNPCProximity])

  return {
    keys,
    score,
    showModal,
    currentNPC,
    nearbyNPC,
    handleMobileControl,
    setShowModal,
    setCurrentNPC
  }
}
