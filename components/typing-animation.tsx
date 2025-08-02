"use client"

import { useEffect, useState } from "react"

interface TypingAnimationProps {
  isTyping: boolean
}

export default function TypingAnimation({ isTyping }: TypingAnimationProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!isTyping) {
      setDots("")
      return
    }

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isTyping])

  if (!isTyping) return null

  return (
    <div className="flex items-center space-x-2 text-gray-400">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
      <span className="text-sm">AI is typing{dots}</span>
    </div>
  )
}
