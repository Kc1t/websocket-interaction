'use client'

import { useEffect } from 'react'

interface DialogModalProps {
  isOpen: boolean
  onClose: () => void
  npcName: string
  npcMessage: string
  playerName?: string
}

export default function DialogModal({ 
  isOpen, 
  onClose, 
  npcName, 
  npcMessage, 
  playerName = "Player" 
}: DialogModalProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'f' || event.key === 'F') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-gray-600 shadow-2xl max-w-md w-full mx-4 animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">?</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{npcName}</h3>
              <p className="text-gray-400 text-sm">NPC Merchant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border-l-4 border-emerald-500">
            <p className="text-gray-200 text-sm leading-relaxed">
              <span className="text-emerald-400 font-medium">{npcName}:</span>
              <br />
              "{npcMessage}"
            </p>
          </div>

          {/* Response options */}
          <div className="space-y-2">
            <button 
              onClick={onClose}
              className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors border-l-2 border-blue-500"
            >
              <span className="text-blue-400 font-medium">{playerName}:</span>
              <br />
              <span className="text-sm">"Obrigado pelas informações!"</span>
            </button>
            
            <button 
              onClick={onClose}
              className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors border-l-2 border-yellow-500"
            >
              <span className="text-yellow-400 font-medium">{playerName}:</span>
              <br />
              <span className="text-sm">"Você tem algo para vender?"</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-b-2xl border-t border-gray-600">
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd>
            <span>ou</span>
            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">F</kbd>
            <span>para fechar</span>
          </div>
          <div className="text-gray-500 text-xs">
            💬 Sistema de Diálogo v1.0
          </div>
        </div>
      </div>
    </div>
  )
}