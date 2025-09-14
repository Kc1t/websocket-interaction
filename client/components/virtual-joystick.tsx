'use client'

import { useCallback, useRef, useState, useEffect } from 'react'

interface VirtualJoystickProps {
  onJoystickMove: (position: { x: number; y: number }) => void
  onJoystickStart: () => void
  onJoystickEnd: () => void
  className?: string
}

export default function VirtualJoystick({ 
  onJoystickMove, 
  onJoystickStart, 
  onJoystickEnd,
  className = "absolute bottom-4 right-4"
}: VirtualJoystickProps) {
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef({ x: 0, y: 0 })

  const maxDistance = 35 // Raio máximo do joystick

  const updateJoystickPosition = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current) return

    const rect = joystickRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    let newX = deltaX
    let newY = deltaY
    
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX)
      newX = Math.cos(angle) * maxDistance
      newY = Math.sin(angle) * maxDistance
    }
    
    setJoystickPosition({ x: newX, y: newY })
    onJoystickMove({ x: newX, y: newY })
    
    console.log('🕹️ Joystick posição:', { x: newX, y: newY, distance })
  }, [maxDistance, onJoystickMove])

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current) return
    
    setIsActive(true)
    setIsDragging(true)
    onJoystickStart()
    
    const rect = joystickRef.current.getBoundingClientRect()
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
    
    updateJoystickPosition(clientX, clientY)
    console.log('🕹️ Joystick iniciado')
  }, [onJoystickStart, updateJoystickPosition])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return
    updateJoystickPosition(clientX, clientY)
  }, [isDragging, updateJoystickPosition])

  const handleEnd = useCallback(() => {
    setIsActive(false)
    setIsDragging(false)
    setJoystickPosition({ x: 0, y: 0 })
    onJoystickEnd()
    console.log('🕹️ Joystick finalizado')
  }, [onJoystickEnd])

  // Eventos de mouse
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleStart(event.clientX, event.clientY)
  }, [handleStart])

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return
    event.preventDefault()
    handleMove(event.clientX, event.clientY)
  }, [isDragging, handleMove])

  // Eventos de touch
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const touch = event.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }, [handleStart])

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!isDragging) return
    event.preventDefault()
    const touch = event.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }, [isDragging, handleMove])

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    handleEnd()
  }, [handleEnd])

  // Event listeners globais para mouse
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        handleMove(event.clientX, event.clientY)
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd()
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, handleMove, handleEnd])

  // Event listeners globais para touch
  useEffect(() => {
    const handleGlobalTouchMove = (event: TouchEvent) => {
      if (isDragging && event.touches[0]) {
        event.preventDefault()
        handleMove(event.touches[0].clientX, event.touches[0].clientY)
      }
    }

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        handleEnd()
      }
    }

    if (isDragging) {
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
      document.addEventListener('touchend', handleGlobalTouchEnd)
    }

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [isDragging, handleMove, handleEnd])

  return (
    <div
      ref={joystickRef}
      className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer select-none touch-none ${className}`}
      style={{
        background: `radial-gradient(circle, ${isActive ? '#4F46E5' : '#6B7280'} 20%, ${isActive ? '#6366F1' : '#9CA3AF'} 60%, ${isActive ? '#E0E7FF' : '#F3F4F6'} 100%)`,
        border: `3px solid ${isActive ? '#4F46E5' : '#9CA3AF'}`,
        boxShadow: isActive 
          ? '0 8px 32px rgba(79, 70, 229, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)' 
          : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.2s ease-out',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Knob do joystick */}
      <div
        ref={knobRef}
        className="w-10 h-10 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${isActive ? '#FFFFFF' : '#F9FAFB'}, ${isActive ? '#E0E7FF' : '#E5E7EB'})`,
          border: `2px solid ${isActive ? '#FFFFFF' : '#D1D5DB'}`,
          boxShadow: isActive 
            ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.8)' 
            : '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
          transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px) ${isActive ? 'scale(1.1)' : 'scale(1)'}`,
          transition: isDragging ? 'none' : 'all 0.2s ease-out',
        }}
      >
        {/* Indicador de direção */}
        <div className="w-full h-full rounded-full flex items-center justify-center">
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              isActive ? 'bg-indigo-500 shadow-lg' : 'bg-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Indicador de intensidade */}
      <div className="absolute inset-0 rounded-full pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full opacity-60"
          style={{
            transform: `translate(-50%, -50%) translate(${joystickPosition.x * 0.3}px, ${joystickPosition.y * 0.3}px)`,
            transition: isDragging ? 'none' : 'all 0.2s ease-out',
          }}
        />
      </div>
    </div>
  )
}
