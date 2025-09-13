'use client'

interface NPC {
  id: number
  name: string
  dialogue: string
  emoji: string
}

interface NPCDialogProps {
  npc: NPC | null
  score: number
  isOpen: boolean
  onClose: () => void
}

export default function NPCDialog({ 
  npc, 
  score, 
  isOpen, 
  onClose 
}: NPCDialogProps) {
  if (!isOpen || !npc) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{npc.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800">{npc.name}</h2>
        </div>
        <p className="text-gray-600 mb-4 leading-relaxed">{npc.dialogue}</p>
        <div className="text-sm text-gray-500 mb-4">
          Current Score: <span className="font-bold text-yellow-600">{score}</span>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}
