'use client'

import { forwardRef } from 'react'
import Player from './player'
import Platform from './platform'
import Point from './point'
import NPC from './npc'

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

interface GameWorldProps {
  players: Player[]
  myPlayerId: number | null
  platforms: Platform[]
  points: Point[]
  npcs: NPC[]
  nearbyNPC: NPC | null
  score: number
  className?: string
}

const GameWorld = forwardRef<HTMLDivElement, GameWorldProps>(({ 
  players,
  myPlayerId,
  platforms,
  points,
  npcs,
  nearbyNPC,
  score,
  className = ""
}, ref) => {
  return (
    <div className={`fixed inset-0 bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col ${className}`}>
      {/* Game Container - Full Screen */}
      <div ref={ref} className="relative flex-1 bg-gradient-to-b from-sky-300 to-sky-100 overflow-hidden">
        {/* In-Game UI Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
          <div className="text-xl font-bold mb-1">Score: {score}</div>
          <div className="text-xs opacity-90">WASD/Arrows: Move • Space: Jump • B: Talk</div>
        </div>

        {/* NPC Interaction Prompt */}
        {nearbyNPC && (
          <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg animate-bounce">
            <p className="text-sm font-bold text-gray-800">Press B to talk to {nearbyNPC.name}</p>
          </div>
        )}

        {/* Platforms */}
        {platforms.map((platform, index) => (
          <Platform
            key={index}
            x={platform.x}
            y={platform.y}
            width={platform.width}
            height={platform.height}
            color={platform.color}
            index={index}
          />
        ))}

        {/* Points */}
        {points.map((point) => (
          <Point
            key={point.id}
            id={point.id}
            x={point.x}
            y={point.y}
            width={point.width}
            height={point.height}
            collected={point.collected}
            type={point.type}
          />
        ))}

        {/* Players */}
        {players.map((player) => (
          <Player
            key={player.id}
            id={player.id}
            x={player.x}
            y={player.y}
            width={player.width}
            height={player.height}
            velocityX={player.velocityX}
            velocityY={player.velocityY}
            onGround={player.onGround}
            isMyPlayer={player.id === myPlayerId}
            name={player.name}
          />
        ))}

        {/* NPCs */}
        {npcs.map((npc) => (
          <NPC
            key={npc.id}
            id={npc.id}
            x={npc.x}
            y={npc.y}
            width={npc.width}
            height={npc.height}
            name={npc.name}
            dialogue={npc.dialogue}
            emoji={npc.emoji}
            isNearby={nearbyNPC?.id === npc.id}
          />
        ))}

        {/* Clouds for decoration */}
        <div className="absolute top-[8%] left-[10%] w-[8%] h-[5%] bg-white/60 rounded-full"></div>
        <div className="absolute top-[15%] right-[20%] w-[10%] h-[6%] bg-white/60 rounded-full"></div>
        <div className="absolute top-[5%] right-[50%] w-[6%] h-[4%] bg-white/60 rounded-full"></div>
      </div>
    </div>
  )
})

GameWorld.displayName = 'GameWorld'

export default GameWorld
