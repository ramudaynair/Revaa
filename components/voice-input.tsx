
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
  speakText?: (text: string) => void
}

export default function VoiceInput({ onResult, onSpeech, language, disabled, speakText: externalSpeakText }: VoiceInputProps) {
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

      setIsListening(true)
      
      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (permissionError) {
        throw new Error("Microphone permission denied. Please allow microphone access and try again.")
      }

      const result = await sarvamService.speechToText(language)
      onResult(result.text)
      
    } catch (error) {
      console.error("Voice recognition error:", error)
      const errorMessage = error instanceof Error ? error.message : "Voice recognition failed"
      alert(errorMessage)
    } finally {
      setIsListening(false)
    }
  }

  const speakText = async (text: string) => {
    if (externalSpeakText) {
      externalSpeakText(text)
      return
    }
    
    if (disabled || isSpeaking || !text.trim()) return

    try {
      setIsSpeaking(true)
      await sarvamService.textToSpeech({ text, language })
      onSpeech(text)
    } catch (error) {
      console.error("Text-to-speech error:", error)
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


    </div>
  )
}
