'use client'

interface MobileControlsProps {
  onMobileControl: (action: string, pressed: boolean) => void
  className?: string
}

export default function MobileControls({ 
  onMobileControl, 
  className = "md:hidden bg-black/20 backdrop-blur-sm p-4" 
}: MobileControlsProps) {
  return (
    <div className={className}>
      <div className="flex justify-center gap-4">
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all"
            onTouchStart={() => onMobileControl("a", true)}
            onTouchEnd={() => onMobileControl("a", false)}
            onMouseDown={() => onMobileControl("a", true)}
            onMouseUp={() => onMobileControl("a", false)}
          >
            ←
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all"
            onTouchStart={() => onMobileControl("d", true)}
            onTouchEnd={() => onMobileControl("d", false)}
            onMouseDown={() => onMobileControl("d", true)}
            onMouseUp={() => onMobileControl("d", false)}
          >
            →
          </button>
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all"
          onTouchStart={() => onMobileControl(" ", true)}
          onTouchEnd={() => onMobileControl(" ", false)}
          onMouseDown={() => onMobileControl(" ", true)}
          onMouseUp={() => onMobileControl(" ", false)}
        >
          JUMP
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-all"
          onTouchStart={() => onMobileControl("talk", true)}
          onTouchEnd={() => onMobileControl("talk", false)}
          onMouseDown={() => onMobileControl("talk", true)}
          onMouseUp={() => onMobileControl("talk", false)}
        >
          TALK
        </button>
      </div>
    </div>
  )
}
