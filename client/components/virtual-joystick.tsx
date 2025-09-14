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
  className = ""
}: VirtualJoystickProps) {
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  const maxDistance = 40 // Aumentei um pouco o raio

  const updatePosition = useCallback((clientX: number, clientY: number) => {
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
  }, [maxDistance, onJoystickMove])

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsActive(true)
    onJoystickStart()
    updatePosition(clientX, clientY)
  }, [onJoystickStart, updatePosition])

  const handleEnd = useCallback(() => {
    setIsActive(false)
    setJoystickPosition({ x: 0, y: 0 })
    onJoystickEnd()
  }, [onJoystickEnd])

  // Mouse events
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    handleStart(event.clientX, event.clientY)
  }, [handleStart])

  // Touch events
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    const touch = event.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }, [handleStart])

  // Global move events
  useEffect(() => {
    if (!isActive) return

    const handleMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY)
    }

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault()
      if (event.touches[0]) {
        updatePosition(event.touches[0].clientX, event.touches[0].clientY)
      }
    }

    const handleMouseUp = () => handleEnd()
    const handleTouchEnd = () => handleEnd()

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isActive, updatePosition, handleEnd])

  return (
    <div
      ref={joystickRef}
      className={`w-20 h-20 rounded-full flex items-center justify-center select-none touch-none ${className}`}
      style={{
        background: isActive 
          ? 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 70%, transparent 100%)'
          : 'radial-gradient(circle, rgba(156, 163, 175, 0.2) 0%, rgba(156, 163, 175, 0.1) 70%, transparent 100%)',
        border: `2px solid ${isActive ? 'rgba(99, 102, 241, 0.5)' : 'rgba(156, 163, 175, 0.3)'}`,
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Knob */}
      <div
        ref={knobRef}
        className="w-8 h-8 rounded-full pointer-events-none"
        style={{
          background: isActive 
            ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
            : 'linear-gradient(135deg, #9ca3af, #6b7280)',
          border: `2px solid ${isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'}`,
          boxShadow: isActive 
            ? '0 2px 8px rgba(99, 102, 241, 0.4)' 
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
          transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
          transition: isActive ? 'none' : 'all 0.3s ease',
        }}
      />

      {/* Direction indicator lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <div
            key={angle}
            className="absolute w-0.5 h-3"
            style={{
              background: isActive 
                ? 'rgba(99, 102, 241, 0.4)' 
                : 'rgba(156, 163, 175, 0.2)',
              left: '50%',
              top: '10px',
              transformOrigin: '50% 30px',
              transform: `translateX(-50%) rotate(${angle}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
