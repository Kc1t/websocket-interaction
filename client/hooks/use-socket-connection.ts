'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

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

export function useSocketConnection() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [myPlayerId, setMyPlayerId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [points, setPoints] = useState<Point[]>([
    { id: 1, x: 250, y: 420, width: 20, height: 20, collected: false, type: "coin" },
    { id: 2, x: 450, y: 320, width: 20, height: 20, collected: false, type: "gem" },
    { id: 3, x: 650, y: 220, width: 20, height: 20, collected: false, type: "coin" },
    { id: 4, x: 100, y: 500, width: 20, height: 20, collected: false, type: "gem" },
    { id: 5, x: 350, y: 200, width: 20, height: 20, collected: false, type: "coin" },
  ])
  const [npcs] = useState<NPC[]>([
    {
      id: 1,
      x: 150,
      y: 510,
      width: 30,
      height: 30,
      name: "Friendly Guard",
      dialogue: "Welcome to our magical world! I've been guarding this area for years. The platforms above hold many treasures - be careful jumping around!",
      emoji: "🛡️",
    },
    {
      id: 2,
      x: 300,
      y: 410,
      width: 30,
      height: 30,
      name: "Wise Merchant",
      dialogue: "Ah, a fellow adventurer! I see you're collecting coins and gems. Did you know the purple gems are worth twice as much as the golden coins?",
      emoji: "🧙‍♂️",
    },
    {
      id: 3,
      x: 550,
      y: 210,
      width: 30,
      height: 30,
      name: "Sky Watcher",
      dialogue: "From up here, I can see the whole world! The view is amazing, but it took me many tries to reach this high platform. Keep practicing your jumps!",
      emoji: "🔭",
    },
  ])

  useEffect(() => {
    // Conectar ao servidor Socket.IO
    const socketUrl =
      typeof window !== "undefined" && window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : `http://${window.location.hostname}:3001`
    const newSocket = io(socketUrl)
    setSocket(newSocket)

    // Eventos de conexão
    newSocket.on("connect", () => {
      console.log("Conectado ao servidor")
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      console.log("Desconectado do servidor")
      setIsConnected(false)
    })

    // Receber ID do jogador atribuído
    newSocket.on("playerAssigned", (data: { playerId: number; name: string }) => {
      console.log("Jogador atribuído:", data)
      setMyPlayerId(data.playerId)
      // Adiciona o jogador local à lista
      setPlayers(prev => [...prev, {
        id: data.playerId,
        x: 50,
        y: 300,
        width: 30,
        height: 30,
        velocityX: 0,
        velocityY: 0,
        onGround: false,
        name: data.name
      }])
    })

    // Receber jogadores iniciais
    newSocket.on("initialPlayers", (initialPlayers: Record<string, Player>) => {
      console.log("Jogadores iniciais:", initialPlayers)
      setPlayers(Object.values(initialPlayers))
    })

    // Receber estado inicial dos pontos
    newSocket.on("initialPoints", (initialPoints: Record<number, Point>) => {
      console.log("Estado inicial dos pontos:", initialPoints)
      setPoints(Object.values(initialPoints))
    })

    // Receber estado inicial dos NPCs
    newSocket.on("initialNPCs", (initialNPCs: NPC[]) => {
      console.log("Estado inicial dos NPCs:", initialNPCs)
    })

    // Receber novo jogador adicionado
    newSocket.on("playerAdded", (newPlayer: Player) => {
      console.log("Novo jogador adicionado:", newPlayer)
      setPlayers((prev) => [...prev, newPlayer])
    })

    // Receber atualização de jogador
    newSocket.on("playerUpdated", (data: { playerId: number; x: number; y: number; velocityX: number; velocityY: number; onGround: boolean }) => {
      setPlayers((prev) => prev.map((player) => 
        player.id === data.playerId 
          ? { ...player, x: data.x, y: data.y, velocityX: data.velocityX, velocityY: data.velocityY, onGround: data.onGround }
          : player
      ))
    })

    // Receber remoção de jogador
    newSocket.on("playerRemoved", (playerId: number) => {
      console.log("Jogador removido:", playerId)
      setPlayers((prev) => prev.filter((player) => player.id !== playerId))
    })

    // Receber atualização de pontos
    newSocket.on("pointCollected", (data: { pointId: number; playerId: number }) => {
      setPoints((prev) => prev.map((point) => 
        point.id === data.pointId 
          ? { ...point, collected: true }
          : point
      ))
    })

    // Cleanup
    return () => {
      newSocket.close()
    }
  }, [])

  return {
    socket,
    players,
    myPlayerId,
    isConnected,
    points,
    npcs
  }
}