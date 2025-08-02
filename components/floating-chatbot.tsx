"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import Link from "next/link"

export default function FloatingChatbot() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

        {/* Main button */}
        <Link href="/dashboard/chatbot">
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full w-14 h-14 shadow-2xl backdrop-blur-sm border border-green-400/20"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </Link>

        {/* Close button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-gray-400 hover:text-white backdrop-blur-sm border border-gray-600/20"
          onClick={() => setIsVisible(false)}
        >
          <X className="w-3 h-3" />
        </Button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-gray-700/50">
          Chat with AI Assistant
        </div>
      </div>
    </div>
  )
}
