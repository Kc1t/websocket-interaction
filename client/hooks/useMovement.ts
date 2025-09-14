'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

interface Ball {
  id: number
  x: number
  y: number
  color: string
}

interface UseMovementProps {
  socket: Socket | null
  myBallId: number | null
  balls: Ball[]
}

export function useMovement({ socket, myBallId, balls }: UseMovementProps) {
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set())
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [joystickActive, setJoystickActive] = useState(false)
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const moveBall = useCallback((dx: number, dy: number) => {
    if (!socket || !myBallId) return

    const currentBall = balls.find(ball => ball.id === myBallId)
    if (!currentBall) return

    // Canvas fixa de 300x300
    const canvasWidth = 300
    const canvasHeight = 300
    const ballRadius = 24 // Raio da bolinha
    
    // Debug: log das dimensões e posições
    console.log('Canvas size:', { width: canvasWidth, height: canvasHeight })
    console.log('Current ball position:', { x: currentBall.x, y: currentBall.y })
    console.log('Movement delta:', { dx, dy })
    
    const newX = Math.max(ballRadius, Math.min(canvasWidth - ballRadius, currentBall.x + dx))
    const newY = Math.max(ballRadius, Math.min(canvasHeight - ballRadius, currentBall.y + dy))
    
    console.log('New position:', { newX, newY })
    console.log('Width limits:', { min: ballRadius, max: canvasWidth - ballRadius })
    console.log('Height limits:', { min: ballRadius, max: canvasHeight - ballRadius })

    socket.emit("moveBall", {
      ballId: myBallId,
      x: newX,
      y: newY,
    })
  }, [socket, myBallId, balls])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    const arrowKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright']
    const wasdKeys = ['w', 'a', 's', 'd']
    
    if (arrowKeys.includes(key) || wasdKeys.includes(key)) {
      event.preventDefault()
      setKeysPressed(prev => new Set(prev).add(key))
    }
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    const arrowKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright']
    const wasdKeys = ['w', 'a', 's', 'd']
    
    if (arrowKeys.includes(key) || wasdKeys.includes(key)) {
      event.preventDefault()
      setKeysPressed(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }
  }, [])

  const handleJoystickMove = useCallback((position: { x: number; y: number }) => {
    setJoystickPosition(position)
    console.log('🕹️ Joystick movement received:', position)
  }, [])

  const handleJoystickStart = useCallback(() => {
    setJoystickActive(true)
    console.log('🕹️ Joystick ativo')
  }, [])

  const handleJoystickEnd = useCallback(() => {
    setJoystickActive(false)
    setJoystickPosition({ x: 0, y: 0 })
    console.log('🕹️ Joystick inativo')
  }, [])

  // Event listeners para WASD
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // Event listeners globais para joystick
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (joystickActive) {
        // Lógica do joystick seria implementada aqui se necessário
      }
    }

    const handleGlobalMouseUp = () => {
      if (joystickActive) {
        handleJoystickEnd()
      }
    }

    const handleGlobalTouchMove = (event: TouchEvent) => {
      if (joystickActive) {
        // Lógica do joystick seria implementada aqui se necessário
      }
    }

    const handleGlobalTouchEnd = () => {
      if (joystickActive) {
        handleJoystickEnd()
      }
    }

    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleGlobalMouseUp)
    document.addEventListener("touchmove", handleGlobalTouchMove)
    document.addEventListener("touchend", handleGlobalTouchEnd)

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("touchmove", handleGlobalTouchMove)
      document.removeEventListener("touchend", handleGlobalTouchEnd)
    }
  }, [joystickActive, handleJoystickEnd])

  // Lógica de movimento contínuo com teclado e joystick
  useEffect(() => {
    const hasKeyboardInput = keysPressed.size > 0
    const hasJoystickInput = joystickActive && (joystickPosition.x !== 0 || joystickPosition.y !== 0)
    
    if (!hasKeyboardInput && !hasJoystickInput) {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current)
        moveIntervalRef.current = null
      }
      return
    }

    const moveSpeed = 5 // pixels por frame
    const moveInterval = 16 // ~60fps

    moveIntervalRef.current = setInterval(() => {
      let dx = 0
      let dy = 0

      // Movimento por teclado
      if (keysPressed.has('w') || keysPressed.has('arrowup')) dy -= moveSpeed
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) dy += moveSpeed
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) dx -= moveSpeed
      if (keysPressed.has('d') || keysPressed.has('arrowright')) dx += moveSpeed

      // Movimento por joystick
      if (joystickActive) {
        // Sensibilidade do joystick ajustada para mobile
        const joystickSensitivity = 0.2 // Reduzido para movimento mais suave
        const deadZone = 5 // Zona morta para evitar movimento involuntário
        
        const magnitude = Math.sqrt(joystickPosition.x * joystickPosition.x + joystickPosition.y * joystickPosition.y)
        
        if (magnitude > deadZone) {
          dx += joystickPosition.x * joystickSensitivity
          dy += joystickPosition.y * joystickSensitivity
          console.log('🕹️ Aplicando movimento joystick:', { dx: joystickPosition.x * joystickSensitivity, dy: joystickPosition.y * joystickSensitivity })
        }
      }

      if (dx !== 0 || dy !== 0) {
        moveBall(dx, dy)
      }
    }, moveInterval)

    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current)
        moveIntervalRef.current = null
      }
    }
  }, [keysPressed, joystickActive, joystickPosition, moveBall])

  return {
    moveBall,
    handleJoystickMove,
    handleJoystickStart,
    handleJoystickEnd
  }
}

