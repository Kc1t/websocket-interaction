'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface Ball {
  id: number
  x: number
  y: number
  color: string
}

export function useSocketConnection() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [balls, setBalls] = useState<Ball[]>([])
  const [myBallId, setMyBallId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

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

    // Receber ID da bolinha atribuída
    newSocket.on("ballAssigned", (data: { ballId: number; color: string }) => {
      console.log("Bolinha atribuída:", data)
      setMyBallId(data.ballId)
    })

    // Receber estado inicial das bolinhas
    newSocket.on("initialBalls", (initialBalls: Record<number, Ball>) => {
      console.log("Estado inicial das bolinhas:", initialBalls)
      setBalls(Object.values(initialBalls))
    })

    // Receber nova bolinha adicionada
    newSocket.on("ballAdded", (newBall: Ball) => {
      console.log("Nova bolinha adicionada:", newBall)
      setBalls((prev) => [...prev, newBall])
    })

    // Receber movimento de bolinha
    newSocket.on("ballMoved", (data: { ballId: number; x: number; y: number }) => {
      setBalls((prev) => prev.map((ball) => (ball.id === data.ballId ? { ...ball, x: data.x, y: data.y } : ball)))
    })

    // Receber remoção de bolinha
    newSocket.on("ballRemoved", (ballId: number) => {
      console.log("Bolinha removida:", ballId)
      setBalls((prev) => prev.filter((ball) => ball.id !== ballId))
    })

    // Cleanup
    return () => {
      newSocket.close()
    }
  }, [])

  return {
    socket,
    balls,
    myBallId,
    isConnected
  }
}

