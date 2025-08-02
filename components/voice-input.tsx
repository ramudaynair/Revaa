"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { sarvamService } from "@/lib/sarvam-api"

interface VoiceInputProps {
  onResult: (text: string) => void
  onSpeech: (text: string) => void
  language: string
  disabled?: boolean
}

export default function VoiceInput({ onResult, onSpeech, language, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const startListening = async () => {
    if (disabled || isListening) return

    try {
      // Check if speech recognition is supported
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        alert("Voice recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.")
        return
      }

      // Check if running on HTTPS (required for microphone access)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        alert("Voice recognition requires HTTPS connection. Please access the site via HTTPS.")
        return
      }

      setIsListening(true)
      
      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        console.log("Microphone permission granted")
      } catch (permissionError) {
        console.error("Microphone permission error:", permissionError)
        throw new Error("Microphone permission denied. Please allow microphone access in your browser settings and try again.")
      }

      // Start speech recognition with retry logic
      let retryCount = 0
      const maxRetries = 3
      
      while (retryCount < maxRetries) {
        try {
          const result = await sarvamService.speechToText(language)
          console.log("Speech recognition result:", result)
          onResult(result.text)
          return // Success, exit the function
        } catch (speechError) {
          retryCount++
          console.error(`Speech recognition attempt ${retryCount} failed:`, speechError)
          
          if (retryCount >= maxRetries) {
            throw speechError // Final attempt failed
          }
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      
    } catch (error) {
      console.error("Voice recognition error:", error)

      // Show user-friendly error messages
      const errorMessage = error instanceof Error ? error.message : "Voice recognition failed"

      if (errorMessage.includes("not-allowed") || errorMessage.includes("permission")) {
        alert(
          "Microphone access is required for voice input. Please:\n1. Click the microphone icon in your browser's address bar\n2. Allow microphone access\n3. Try again"
        )
      } else if (errorMessage.includes("not supported")) {
        alert("Voice recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.")
      } else if (errorMessage.includes("no-speech")) {
        alert("No speech was detected. Please speak clearly into your microphone and try again.")
      } else if (errorMessage.includes("audio-capture")) {
        alert("No microphone found. Please check your microphone connection and try again.")
      } else if (errorMessage.includes("network")) {
        alert("Network error occurred. This might be due to:\n• Poor internet connection\n• Browser speech service unavailable\n• Please check your connection and try again")
      } else if (errorMessage.includes("timeout")) {
        alert("Speech recognition timed out. Please try speaking more clearly or check your microphone.")
      } else {
        alert(`Voice recognition error: ${errorMessage}\n\nTip: Try refreshing the page if the problem persists.`)
      }
    } finally {
      setIsListening(false)
    }
  }

  const speakText = async (text: string) => {
    if (disabled || isSpeaking || !text.trim()) return

    try {
      // Check if speech synthesis is supported
      if (!("speechSynthesis" in window)) {
        throw new Error("Text-to-speech not supported in this browser")
      }

      setIsSpeaking(true)
      await sarvamService.textToSpeech({ text, language })
      onSpeech(text)
    } catch (error) {
      console.error("Text-to-speech error:", error)
      const errorMessage = error instanceof Error ? error.message : "Text-to-speech failed"

      if (errorMessage.includes("not supported")) {
        alert("Text-to-speech is not supported in your browser.")
      } else {
        console.warn("Text-to-speech error:", errorMessage)
      }
    } finally {
      setIsSpeaking(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={startListening}
        disabled={disabled || isListening}
        className={`relative group border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent backdrop-blur-sm ${
          isListening ? "animate-pulse bg-green-500/20 border-green-400" : ""
        }`}
        title={isListening ? "Listening... Speak now" : "Click to start voice input"}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></div>
        <span className="relative flex items-center">
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-1" />
              <span className="text-xs">Listening...</span>
            </>
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => speakText("Hello! How can I help you today?")}
        disabled={disabled || isSpeaking}
        className={`relative group border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent backdrop-blur-sm ${
          isSpeaking ? "animate-pulse" : ""
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></div>
        <span className="relative flex items-center">
          <Volume2 className="w-4 h-4" />
        </span>
      </Button>
    </div>
  )
}
