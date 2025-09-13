'use client'

import { useState, useEffect, useCallback } from "react"
import { useSocketConnection } from "@/hooks/use-socket-connection"

interface Player {
    x: number
    y: number
    width: number
    height: number
    velocityX: number
    velocityY: number
    onGround: boolean
}

interface Platform {
    x: number
    y: number
    width: number
    height: number
    color: string
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

export default function PlatformerGame() {
    // Adicionar logs para debug do WebSocket
    const { socket, players, myPlayerId, points: serverPoints, npcs: serverNpcs } = useSocketConnection()

    console.log("🔍 Debug Info:")
    console.log("Socket connected:", !!socket)
    console.log("My Player ID:", myPlayerId)
    console.log("Players array:", players)
    console.log("Players length:", players.length)
    console.log("Server Points:", serverPoints)
    console.log("Server NPCs:", serverNpcs)

    const [player, setPlayer] = useState<Player>({
        x: 50,
        y: 300,
        width: 30,
        height: 30,
        velocityX: 0,
        velocityY: 0,
        onGround: false,
    })

    const [keys, setKeys] = useState<Set<string>>(new Set())
    const [showModal, setShowModal] = useState(false)
    const [currentNPC, setCurrentNPC] = useState<NPC | null>(null)
    const [nearbyNPC, setNearbyNPC] = useState<NPC | null>(null)

    const npcs: NPC[] = [
        {
            id: 1,
            x: 150,
            y: 520, // Ajustado para ficar no chão (550 - 30)
            width: 30,
            height: 30,
            name: "Friendly Guard",
            dialogue:
                "Welcome to our magical world! I've been guarding this area for years. The platforms above hold many treasures - be careful jumping around!",
            emoji: "🛡️",
        },
        {
            id: 2,
            x: 350,
            y: 520, // Movido para o chão
            width: 30,
            height: 30,
            name: "Wise Merchant",
            dialogue:
                "Ah, a fellow adventurer! I see you're collecting coins and gems. Did you know the purple gems are worth twice as much as the golden coins?",
            emoji: "🧙‍♂️",
        },
        {
            id: 3,
            x: 600,
            y: 520, // Movido para o chão
            width: 30,
            height: 30,
            name: "Sky Watcher",
            dialogue:
                "I used to watch the sky from the high platforms, but now I enjoy the ground level view too! The stars look beautiful from here as well.",
            emoji: "🔭",
        },
    ]

    // Define only the ground platform
    const platforms: Platform[] = [
        { x: 0, y: 550, width: 800, height: 50, color: "bg-green-500" }, // Ground
    ]

    // Game constants
    const GRAVITY = 0.8
    const JUMP_FORCE = -15
    const MOVE_SPEED = 5
    const FRICTION = 0.8

    // Collision detection
    const checkCollision = useCallback((player: Player, platform: Platform) => {
        return (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y
        )
    }, [])

    const checkNPCProximity = useCallback((player: Player, npc: NPC) => {
        const distance = Math.sqrt(
            Math.pow(player.x + player.width / 2 - (npc.x + npc.width / 2), 2) +
            Math.pow(player.y + player.height / 2 - (npc.y + npc.height / 2), 2)
        )
        return distance < 60 // Within 60 pixels
    }, [])

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setKeys((prev) => new Set(prev).add(e.key.toLowerCase()))
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            setKeys((prev) => {
                const newKeys = new Set(prev)
                newKeys.delete(e.key.toLowerCase())
                return newKeys
            })
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    const handleMobileControl = (action: string, pressed: boolean) => {
        if (action === "talk") {
            if (pressed && nearbyNPC) {
                setCurrentNPC(nearbyNPC)
                setShowModal(true)
            }
            return
        }

        setKeys((prev) => {
            const newKeys = new Set(prev)
            if (pressed) {
                newKeys.add(action)
            } else {
                newKeys.delete(action)
            }
            return newKeys
        })
    }

    // Game loop - Versão local funcionando
    useEffect(() => {
        console.log("🎮 Game loop started")
        console.log("Current keys:", Array.from(keys))

        const gameLoop = () => {
            setPlayer((prevPlayer) => {
                const newPlayer = { ...prevPlayer }

                // Handle horizontal movement
                if (keys.has("a") || keys.has("arrowleft")) {
                    newPlayer.velocityX = -MOVE_SPEED
                } else if (keys.has("d") || keys.has("arrowright")) {
                    newPlayer.velocityX = MOVE_SPEED
                } else {
                    newPlayer.velocityX *= FRICTION
                }

                // Handle jumping
                if ((keys.has(" ") || keys.has("w") || keys.has("arrowup")) && newPlayer.onGround) {
                    newPlayer.velocityY = JUMP_FORCE
                    newPlayer.onGround = false
                }

                // Apply gravity
                newPlayer.velocityY += GRAVITY

                // Update position
                newPlayer.x += newPlayer.velocityX
                newPlayer.y += newPlayer.velocityY

                // Keep player within screen bounds
                if (newPlayer.x < 0) newPlayer.x = 0
                if (newPlayer.x + newPlayer.width > 800) newPlayer.x = 800 - newPlayer.width

                // Reset ground status
                newPlayer.onGround = false

                // Check collisions with platforms
                platforms.forEach((platform) => {
                    if (checkCollision(newPlayer, platform)) {
                        // Landing on top of platform
                        if (prevPlayer.y + prevPlayer.height <= platform.y && newPlayer.velocityY > 0) {
                            newPlayer.y = platform.y - newPlayer.height
                            newPlayer.velocityY = 0
                            newPlayer.onGround = true
                        }
                        // Hitting platform from below
                        else if (prevPlayer.y >= platform.y + platform.height && newPlayer.velocityY < 0) {
                            newPlayer.y = platform.y + platform.height
                            newPlayer.velocityY = 0
                        }
                        // Hitting platform from the side
                        else if (prevPlayer.x + prevPlayer.width <= platform.x || prevPlayer.x >= platform.x + platform.width) {
                            newPlayer.x = prevPlayer.x
                            newPlayer.velocityX = 0
                        }
                    }
                })

                let foundNearbyNPC = null
                npcs.forEach((npc) => {
                    if (checkNPCProximity(newPlayer, npc)) {
                        foundNearbyNPC = npc
                    }
                })
                setNearbyNPC(foundNearbyNPC)

                // Prevent falling through the bottom
                if (newPlayer.y > 600) {
                    newPlayer.y = 300
                    newPlayer.x = 50
                    newPlayer.velocityX = 0
                    newPlayer.velocityY = 0
                }

                return newPlayer
            })
        }

        const intervalId = setInterval(gameLoop, 16) // ~60 FPS
        return () => clearInterval(intervalId)
    }, [keys, checkCollision, checkNPCProximity])

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-sky-200 flex flex-col">
            <style jsx>{`
                @media (max-width: 768px) and (orientation: landscape) {
                    .game-container {
                        transform: none;
                        height: 100vh;
                        width: 100vw;
                    }
                }
            `}</style>
            {/* Game Container - Full Screen */}
            <div className="relative flex-1 bg-gradient-to-b from-sky-300 to-sky-100 overflow-hidden game-container">
                {/* In-Game UI Overlay */}
                <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
                    <div className="text-xs opacity-90">WASD/Arrows: Move • Space: Jump</div>

                    {/* Debug Info */}
                    <div className="mt-2 text-xs border-t border-white/20 pt-2">
                        <div>🔍 Debug:</div>
                        <div>Socket: {socket ? '✅ Connected' : '❌ Disconnected'}</div>
                        <div>My ID: {myPlayerId || 'None'}</div>
                        <div>WS Players: {players.length}</div>
                        <div>Local Player: {player.x.toFixed(0)}, {player.y.toFixed(0)}</div>
                    </div>
                </div>

                {/* NPC Interaction Prompt - Removed */}

                {/* Platforms */}
                {platforms.map((platform, index) => (
                    <div
                        key={index}
                        className={`absolute ${platform.color} rounded-sm shadow-lg`}
                        style={{
                            left: `${(platform.x / 800) * 100}%`,
                            top: `${(platform.y / 600) * 100}%`,
                            width: `${(platform.width / 800) * 100}%`,
                            height: `${(platform.height / 600) * 100}%`,
                        }}
                    />
                ))}

                {/* Points removed */}

                {/* Jogador LOCAL (sempre visível para testar) */}
                <div
                    className="absolute bg-yellow-400 border-2 border-yellow-600 rounded-sm shadow-lg transition-all duration-75 ease-linear ring-2 ring-blue-400 ring-opacity-50 scale-110"
                    style={{
                        left: `${(player.x / 800) * 100}%`,
                        top: `${(player.y / 600) * 100}%`,
                        width: `${(player.width / 800) * 100}%`,
                        height: `${(player.height / 600) * 100}%`,
                    }}
                >
                    {/* Player face */}
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-xs">😊</div>
                    </div>
                    {/* Name tag */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Local Player (YOU)
                    </div>
                </div>

                {/* Jogadores via WebSocket (se conectado) */}
                {players.length > 0 && (
                    <>
                        {console.log("🎮 Rendering", players.length, "WebSocket players")}
                        {players.map((wsPlayer: any) => (
                            <div
                                key={`ws-${wsPlayer.id}`}
                                className="absolute bg-red-400 border-2 border-red-600 rounded-sm shadow-lg transition-all duration-75 ease-linear"
                                style={{
                                    left: `${(wsPlayer.x / 800) * 100}%`,
                                    top: `${(wsPlayer.y / 600) * 100}%`,
                                    width: `${(wsPlayer.width / 800) * 100}%`,
                                    height: `${(wsPlayer.height / 600) * 100}%`,
                                }}
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-xs">👤</div>
                                </div>
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    Player {wsPlayer.id} {wsPlayer.id === myPlayerId ? '(YOU)' : ''}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* NPCs - usando NPCs locais */}
                {npcs.map((npc) => (
                    <div
                        key={npc.id}
                        className="absolute bg-orange-400 border-2 border-orange-600 rounded-sm shadow-lg transition-all duration-200"
                        style={{
                            left: `${(npc.x / 800) * 100}%`,
                            top: `${(npc.y / 600) * 100}%`,
                            width: `${(npc.width / 800) * 100}%`,
                            height: `${(npc.height / 600) * 100}%`,
                        }}
                    >
                        <div className="w-full h-full flex items-center justify-center text-lg">{npc.emoji}</div>
                        {/* Name tag */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {npc.name}
                        </div>
                    </div>
                ))}

                {/* Clouds for decoration */}
                <div className="absolute top-[8%] left-[10%] w-[8%] h-[5%] bg-white/60 rounded-full"></div>
                <div className="absolute top-[15%] right-[20%] w-[10%] h-[6%] bg-white/60 rounded-full"></div>
                <div className="absolute top-[5%] right-[50%] w-[6%] h-[4%] bg-white/60 rounded-full"></div>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden">
                {/* Directional buttons */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 sm:gap-4">
                    <button
                        className="bg-blue-500 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full text-xl sm:text-2xl font-bold shadow-lg active:bg-blue-600 border-2 border-white flex items-center justify-center select-none"
                        onTouchStart={() => handleMobileControl("a", true)}
                        onTouchEnd={() => handleMobileControl("a", false)}
                        onMouseDown={() => handleMobileControl("a", true)}
                        onMouseUp={() => handleMobileControl("a", false)}
                        style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
                    >
                        ←
                    </button>
                    
                    <button
                        className="bg-green-500 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full text-xl sm:text-2xl font-bold shadow-lg active:bg-green-600 border-2 border-white flex items-center justify-center select-none"
                        onTouchStart={() => handleMobileControl(" ", true)}
                        onTouchEnd={() => handleMobileControl(" ", false)}
                        onMouseDown={() => handleMobileControl(" ", true)}
                        onMouseUp={() => handleMobileControl(" ", false)}
                        style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
                    >
                        ↑
                    </button>
                    
                    <button
                        className="bg-blue-500 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full text-xl sm:text-2xl font-bold shadow-lg active:bg-blue-600 border-2 border-white flex items-center justify-center select-none"
                        onTouchStart={() => handleMobileControl("d", true)}
                        onTouchEnd={() => handleMobileControl("d", false)}
                        onMouseDown={() => handleMobileControl("d", true)}
                        onMouseUp={() => handleMobileControl("d", false)}
                        style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
                    >
                        →
                    </button>
                </div>

                {/* Talk button */}
                {nearbyNPC && (
                    <div className="absolute bottom-4 right-4">
                        <button
                            className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-full text-sm sm:text-lg font-bold shadow-lg active:bg-purple-600 border-2 border-white select-none"
                            onTouchStart={() => handleMobileControl("talk", true)}
                            onTouchEnd={() => handleMobileControl("talk", false)}
                            style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
                        >
                            FALAR
                        </button>
                    </div>
                )}
            </div>

            {/* NPC Dialog Modal */}
            {showModal && currentNPC && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">{currentNPC.emoji}</div>
                            <h2 className="text-2xl font-bold text-gray-800">{currentNPC.name}</h2>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{currentNPC.dialogue}</p>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all w-full"
                            onClick={() => {
                                setShowModal(false)
                                setCurrentNPC(null)
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}