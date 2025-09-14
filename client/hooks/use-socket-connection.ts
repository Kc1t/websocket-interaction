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
        
    console.log("🌐 Tentando conectar no servidor:", socketUrl)
    console.log("🌐 Hostname atual:", typeof window !== "undefined" ? window.location.hostname : "server-side")
    
    const newSocket = io(socketUrl, {
      autoConnect: false // Não conectar automaticamente
    })
    
    // Registrar todos os event listeners ANTES de conectar
    console.log("📝 Registrando event listeners...")
    
    // Eventos de conexão
    newSocket.on("connect", () => {
      console.log("✅ Conectado ao servidor com ID:", newSocket.id)
      setIsConnected(true)
      
      // Solicitar dados após conectar (caso o servidor não os envie automaticamente)
      setTimeout(() => {
        console.log("🔄 Solicitando dados do servidor...")
        newSocket.emit('requestData')
        
        // Teste de ping
        console.log("🏓 Enviando ping para servidor...")
        newSocket.emit('ping', { message: 'Hello from client!', timestamp: Date.now() })
      }, 200)
    })

    newSocket.on("disconnect", () => {
      console.log("❌ Desconectado do servidor")
      setIsConnected(false)
    })

    newSocket.on("connect_error", (error) => {
      console.error("🚨 Erro de conexão:", error)
      setIsConnected(false)
    })

    // Receber ID da bolinha atribuída
    newSocket.on("ballAssigned", (data: { ballId: number; color: string }) => {
      console.log("🎯 Bolinha atribuída:", data)
      setMyBallId(data.ballId)
    })

    // Receber estado inicial das bolinhas
    newSocket.on("initialBalls", (initialBalls: Record<number, Ball>) => {
      console.log("🔄 Estado inicial das bolinhas:", initialBalls)
      console.log("🔄 Convertendo para array:", Object.values(initialBalls))
      setBalls(Object.values(initialBalls))
    })

    // Receber nova bolinha adicionada
    newSocket.on("ballAdded", (newBall: Ball) => {
      console.log("➕ Nova bolinha adicionada:", newBall)
      setBalls((prev) => {
        console.log("➕ Balls antes:", prev)
        const updated = [...prev, newBall]
        console.log("➕ Balls depois:", updated)
        return updated
      })
    })

    // Receber movimento de bolinha
    newSocket.on("ballMoved", (data: { ballId: number; x: number; y: number }) => {
      console.log("🔄 Movimento de bolinha:", data)
      setBalls((prev) => prev.map((ball) => (ball.id === data.ballId ? { ...ball, x: data.x, y: data.y } : ball)))
    })

    // Receber remoção de bolinha
    newSocket.on("ballRemoved", (ballId: number) => {
      console.log("➖ Bolinha removida:", ballId)
      setBalls((prev) => prev.filter((ball) => ball.id !== ballId))
    })

    // Debug: capturar TODOS os eventos
    const originalOn = newSocket.on.bind(newSocket)
    newSocket.onAny((eventName, ...args) => {
      console.log(`🎭 Evento recebido: "${eventName}"`, args)
    })

    // Listener para teste de ping-pong
    newSocket.on("pong", (data) => {
      console.log("🏓 Pong recebido do servidor:", data)
    })

    console.log("🔗 Event listeners registrados, conectando...")
    setSocket(newSocket)
    
    // Verificar se os listeners foram registrados
    console.log("🔍 Listeners registrados:", newSocket.listeners('ballAssigned').length, newSocket.listeners('initialBalls').length)
    
    // Conectar após registrar os listeners
    newSocket.connect()

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

