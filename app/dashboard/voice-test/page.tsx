"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VoiceInput from "@/components/voice-input"
import { Mic, Volume2, CheckCircle, XCircle } from "lucide-react"

export default function VoiceTestPage() {
  const [voiceResult, setVoiceResult] = useState("")
  const [speechResult, setSpeechResult] = useState("")
  const [browserSupport, setBrowserSupport] = useState<{
    speechRecognition: boolean
    speechSynthesis: boolean
    mediaDevices: boolean
  } | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<string>("")

  // Check browser support
  const checkBrowserSupport = () => {
    setBrowserSupport({
      speechRecognition: "webkitSpeechRecognition" in window || "SpeechRecognition" in window,
      speechSynthesis: "speechSynthesis" in window,
      mediaDevices: "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices,
    })
  }

  // Test microphone permission
  const testMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermissionStatus("✅ Microphone permission granted")
      stream.getTracks().forEach(track => track.stop()) // Stop the stream
    } catch (error) {
      console.error("Microphone permission error:", error)
      setPermissionStatus(`❌ Microphone permission denied: ${error}`)
    }
  }

  const handleVoiceResult = (text: string) => {
    setVoiceResult(text)
  }

  const handleSpeech = (text: string) => {
    setSpeechResult(`Speech played: ${text}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Voice Recognition Test
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Browser Support Check */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Browser Support Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={checkBrowserSupport} className="w-full mb-4">
                Check Browser Support
              </Button>
              
              {browserSupport && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    {browserSupport.speechRecognition ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="text-gray-300">Speech Recognition API</span>
                  </div>
                  
                  <div className="flex items-center">
                    {browserSupport.speechSynthesis ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="text-gray-300">Speech Synthesis API</span>
                  </div>
                  
                  <div className="flex items-center">
                    {browserSupport.mediaDevices ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="text-gray-300">Media Devices API</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Microphone Permission Test */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mic className="w-5 h-5 mr-2 text-blue-400" />
                Microphone Permission Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testMicrophonePermission} className="w-full mb-4">
                Test Microphone Permission
              </Button>
              
              {permissionStatus && (
                <div className="p-3 bg-gray-700 rounded text-sm text-gray-300">
                  {permissionStatus}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Input Test */}
          <Card className="bg-gray-800 border-gray-700 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Volume2 className="w-5 h-5 mr-2 text-purple-400" />
                Voice Input Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-6">
                <VoiceInput
                  onResult={handleVoiceResult}
                  onSpeech={handleSpeech}
                  language="en"
                />
                <span className="ml-4 text-gray-300">
                  Click the microphone and speak
                </span>
              </div>

              {voiceResult && (
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                  <h3 className="text-green-400 font-semibold mb-2">Voice Recognition Result:</h3>
                  <p className="text-white">{voiceResult}</p>
                </div>
              )}

              {speechResult && (
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                  <h3 className="text-blue-400 font-semibold mb-2">Speech Synthesis Result:</h3>
                  <p className="text-white">{speechResult}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Troubleshooting Guide */}
          <Card className="bg-gray-800 border-gray-700 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Troubleshooting Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-300 space-y-2 text-sm">
                <h4 className="text-white font-semibold">If voice recognition isn't working:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Make sure you're using Chrome, Edge, or Safari browser</li>
                  <li>Check that your microphone is connected and working</li>
                  <li>Allow microphone permission when prompted</li>
                  <li>If on mobile, ensure you're using HTTPS (not HTTP)</li>
                  <li>Check your browser's site settings for microphone permissions</li>
                  <li>Try refreshing the page if permissions were recently changed</li>
                  <li>Make sure no other applications are using your microphone</li>
                </ul>
                
                <h4 className="text-white font-semibold mt-4">Browser Compatibility:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>✅ Chrome: Full support</li>
                  <li>✅ Edge: Full support</li>
                  <li>✅ Safari: Full support</li>
                  <li>❌ Firefox: Limited support</li>
                  <li>❌ Opera: Limited support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
