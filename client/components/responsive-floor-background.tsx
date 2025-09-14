'use client'

import React from 'react'

interface ResponsiveFloorBackgroundProps {
  width: number
  height: number
  className?: string
}

const ResponsiveFloorBackground: React.FC<ResponsiveFloorBackgroundProps> = ({ 
  width, 
  height, 
  className = "" 
}) => {
  // Calculate tile size based on screen dimensions for optimal responsiveness
  const tileSize = Math.max(24, Math.min(48, Math.floor(Math.min(width, height) / 20)))
  const tilesX = Math.ceil(width / tileSize) + 2 // Extra tiles for seamless coverage
  const tilesY = Math.ceil(height / tileSize) + 2
  const patternSize = tileSize * 4 // 4x4 pattern repeat

  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(248,246,244,0.2) 100%),
          url("data:image/svg+xml,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" 
               viewBox="0 0 ${patternSize} ${patternSize}" 
               style="image-rendering: auto;">
            <defs>
              <!-- Gradientes suaves -->
              <linearGradient id="softGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#fdfcfb;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f8f6f4;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="softGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#fbfaf9;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f6f4f2;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="softGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f4f2f0;stop-opacity:1" />
              </linearGradient>
              
              <!-- Padrões suaves -->
              <pattern id="office_floor" patternUnits="userSpaceOnUse" width="${tileSize}" height="${tileSize}">
                <rect width="${tileSize}" height="${tileSize}" fill="url(#softGrad1)" />
                <rect x="0.5" y="0.5" width="${tileSize-1}" height="${tileSize-1}" fill="none" stroke="#f5f3f1" stroke-width="0.5" opacity="0.3" />
              </pattern>
              <pattern id="office_floor_alt" patternUnits="userSpaceOnUse" width="${tileSize}" height="${tileSize}">
                <rect width="${tileSize}" height="${tileSize}" fill="url(#softGrad2)" />
                <rect x="0.5" y="0.5" width="${tileSize-1}" height="${tileSize-1}" fill="none" stroke="#f3f1ef" stroke-width="0.5" opacity="0.3" />
              </pattern>
              <pattern id="carpet_tile" patternUnits="userSpaceOnUse" width="${tileSize}" height="${tileSize}">
                <rect width="${tileSize}" height="${tileSize}" fill="url(#softGrad3)" />
                <rect x="0.5" y="0.5" width="${tileSize-1}" height="${tileSize-1}" fill="none" stroke="#f1efed" stroke-width="0.5" opacity="0.2" />
                <circle cx="${tileSize/4}" cy="${tileSize/4}" r="0.5" fill="#f0eeec" opacity="0.4" />
                <circle cx="${tileSize*3/4}" cy="${tileSize*3/4}" r="0.5" fill="#f0eeec" opacity="0.4" />
              </pattern>
              <pattern id="concrete_floor" patternUnits="userSpaceOnUse" width="${tileSize}" height="${tileSize}">
                <rect width="${tileSize}" height="${tileSize}" fill="#fbf9f7" />
                <rect x="1" y="1" width="${tileSize-2}" height="${tileSize-2}" fill="#fdfbf9" opacity="0.8" />
              </pattern>
              <pattern id="marble_floor" patternUnits="userSpaceOnUse" width="${tileSize}" height="${tileSize}">
                <rect width="${tileSize}" height="${tileSize}" fill="#ffffff" />
                <path d="M0,${tileSize/3} Q${tileSize/2},${tileSize/4} ${tileSize},${tileSize/2}" stroke="#f8f6f4" stroke-width="0.5" fill="none" opacity="0.6" />
                <path d="M0,${tileSize*2/3} Q${tileSize/3},${tileSize*3/4} ${tileSize},${tileSize*5/6}" stroke="#f6f4f2" stroke-width="0.3" fill="none" opacity="0.4" />
              </pattern>
            </defs>
            <!-- Background fill para garantir cobertura completa -->
            <rect width="${patternSize}" height="${patternSize}" fill="#fdfcfb" />
            ${Array.from({ length: 4 }, (_, i) => 
              Array.from({ length: 4 }, (_, j) => {
                const patterns = ['office_floor', 'office_floor_alt', 'carpet_tile', 'concrete_floor', 'marble_floor'];
                const patternIndex = (i + j) % patterns.length;
                const pattern = patterns[patternIndex];
                return `<rect x="${i * tileSize}" y="${j * tileSize}" width="${tileSize}" height="${tileSize}" fill="url(#${pattern})" />`;
              }).join('')
            ).join('')}
          </svg>
        `)}")
        `,
        backgroundSize: `${patternSize}px ${patternSize}px`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'local',
        zIndex: 1,
        filter: 'brightness(1.02) contrast(0.98)',
        boxShadow: 'inset 0 0 200px rgba(248,246,244,0.3)',
        transform: 'translateZ(0)' // Force hardware acceleration
      }}
    />
  )
}

export default ResponsiveFloorBackground