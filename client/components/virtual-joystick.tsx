'use client'

import { useCallback, useRef, useState } from 'react'

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
  const joystickRef = useRef<HTMLDivElement>(null)

  const handleJoystickStart = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsActive(true)
    onJoystickStart()
    console.log('Joystick started')
  }, [onJoystickStart])

  const handleJoystickMove = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (!isActive || !joystickRef.current) return
    
    event.preventDefault()
    event.stopPropagation()
    
    const rect = joystickRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
    
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = 30 // Raio máximo do joystick
    
    let newX = deltaX
    let newY = deltaY
    
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX)
      newX = Math.cos(angle) * maxDistance
      newY = Math.sin(angle) * maxDistance
    }
    
    setJoystickPosition({ x: newX, y: newY })
    onJoystickMove({ x: newX, y: newY })
    console.log('Joystick position:', { x: newX, y: newY })
  }, [isActive, onJoystickMove])

  const handleJoystickEnd = useCallback(() => {
    setIsActive(false)
    setJoystickPosition({ x: 0, y: 0 })
    onJoystickEnd()
    console.log('Joystick ended')
  }, [onJoystickEnd])

  return (
    <div
      ref={joystickRef}
      className={`w-20 h-20 rounded-full border-4 border-gray-400 bg-gray-200 bg-opacity-80 flex items-center justify-center cursor-pointer ${className}`}
      onMouseDown={handleJoystickStart}
      onMouseMove={handleJoystickMove}
      onMouseUp={handleJoystickEnd}
      onMouseLeave={handleJoystickEnd}
      onTouchStart={handleJoystickStart}
      onTouchMove={handleJoystickMove}
      onTouchEnd={handleJoystickEnd}
    >
      <div
        className="w-8 h-8 bg-gray-600 rounded-full transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`
        }}
      />
    </div>
  )
}
