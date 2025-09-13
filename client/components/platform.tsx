'use client'

interface PlatformProps {
  x: number
  y: number
  width: number
  height: number
  color: string
  index: number
}

export default function Platform({ 
  x, 
  y, 
  width, 
  height, 
  color, 
  index 
}: PlatformProps) {
  return (
    <div
      className={`absolute ${color} rounded-sm shadow-lg`}
      style={{
        left: `${(x / 800) * 100}%`,
        top: `${(y / 600) * 100}%`,
        width: `${(width / 800) * 100}%`,
        height: `${(height / 600) * 100}%`,
      }}
    />
  )
}
