"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ArrowLeft, Send, Bot, User, Loader2, Volume2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService, type User as UserType } from "@/lib/auth-service"
import VoiceInput from "@/components/voice-input"
import LanguageSelector from "@/components/language-selector"
import { activityService } from "@/lib/activity-service"
import SubtleParticlesBackground from "@/components/subtle-particles-background"
import PermissionCheck from "@/components/permission-check"
import { sarvamService } from "@/lib/sarvam-api"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  language?: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/auth")
      return
    }

    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      // Add welcome message
      setMessages([
        {
          id: "welcome",
          content:
            "Hello! I'm Dr. Revaa, your AI medical assistant. I'm here to help answer your health questions and provide general medical information. How can I assist you today?",
          sender: "bot",
          timestamp: new Date(),
          language: selectedLanguage,
        },
      ])
    } else {
      router.push("/auth")
    }
  }, [router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getMedicalResponse = async (message: string): Promise<string> => {
    try {
      const token = authService.getToken()

      console.log("Sending request to chatbot API:", { message, language: selectedLanguage })

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: message.trim(),
          language: selectedLanguage,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.error("Non-JSON response:", responseText)
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()
      console.log("API Response data:", data)

      if (data.success && data.response) {
        return data.response
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Error getting medical response:", error)

      // Fallback responses in different languages
      const fallbackResponses: { [key: string]: string } = {
        en: "I'm sorry, I'm experiencing technical difficulties right now. For immediate medical concerns, please consult with a healthcare professional. Is there anything else I can help you with?",
        hi: "मुझे खुशी है कि आपने मुझसे संपर्क किया। वर्तमान में मुझे तकनीकी समस्या हो रही है। तत्काल चिकित्सा सहायता के लिए कृपया डॉक्टर से संपर्क करें।",
        bn: "আমি দুঃখিত, আমি এখন প্রযুক্তিগত সমস্যা হচ্ছি। তাৎক্ষণিক চিকিৎসা সহায়তার জন্য একজন স্বাস্থ্যসেবা পেশাদারের সাথে পরামর্শ করুন।",
        ta: "மன்னிக்கவும், நான் தற்போது தொழில்நுட்ப சிக்கல்களை எதிர்கொண்டு வருகிறேன். உடனடி மருத்துவ உதவிக்கு ஒரு சுகாதார நிபுணரை அணுகவும்।",
        te: "క్షమించండి, నేను ప్రస్తుతం సాంకేతిక సమస్యలను ఎదుర్కొంటున్నాను। తక్షణ వైద్య సహాయం కోసం ఆరోగ్య నిపుణుడిని సంపర్కించండి।",
        ml: "ക്ഷമിക്കണം, ഞാൻ ഇപ്പോൾ സാങ്കേതിക പ്രശ്നങ്ങൾ നേരിടുന്നു. അടിയന്തിര വൈദ്യസഹായത്തിനായി ഒരു ആരോഗ്യ പ്രൊഫഷണലിനെ സമീപിക്കുക।",
        kn: "ಕ್ಷಮಿಸಿ, ನಾನು ಈಗ ತಾಂತ್ರಿಕ ತೊಂದರೆಗಳನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೇನೆ. ತಕ್ಷಣದ ವೈದ್ಯకೀಯ ಸహాయక్కಾಗಿ ಆరೋಗ್ಯ ವೃತ್ತಿರರನ್ನು ಸಂಪರ್ಕಿಸಿ।",
        gu: "માફ કરશો, હું હાલમાં તકનીકી સમસ્યાઓનો સામનો કરી રહ્યો છું. તાત્કાલિક વૈડીયસહાય માટે આરોગ્ય વ્યાવસાયિકનો સંપર્ક કરો।",
        mr: "माफ करा, मला सध्या तांत्रिक अडचणींचा सामना करावा लागत आहे. तातडीच्या वैद्यकीय मदतीसाठी आरोग्य व्यावसायिकांशी संपर्क साधा।",
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਹੁਣ ਤਕਨੀਕੀ ਮੁਸ਼ਕਿਲਾਂ ਦਾ ਸਾਮ੍ਹਣਾ ਕਰ ਰਿਹਾ ਹਾਂ। ਤੁਰੰਤ ਡਾਕਟਰੀ ਮਦਤ ਲਈ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      }

      return fallbackResponses[selectedLanguage] || fallbackResponses.en
    }
  }

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText.trim(),
      sender: "user",
      timestamp: new Date(),
      language: selectedLanguage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setError("")

    // Add activity
    activityService.addActivity(user.id, "chatbot", "Medical Consultation", `Asked: "${messageText.trim()}"`)

    try {
      const response = await getMedicalResponse(messageText.trim())

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
        language: selectedLanguage,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error in handleSendMessage:", error)
      setError("Failed to get response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSendMessage(inputMessage)
  }

  const handleVoiceResult = (text: string) => {
    setInputMessage(text)
  }

  const handleSpeech = (text: string) => {
    // Handle speech feedback if needed
  }

  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const speakBotResponse = (text: string) => {
    if (isSpeaking) return
    setIsSpeaking(true)
    
    window.speechSynthesis.cancel()
    
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Use Google voices which are better for Indian languages
      const voices = window.speechSynthesis.getVoices()
      const googleVoice = voices.find(v => 
        v.name.includes('Google') && 
        (v.lang.includes('ml') || v.lang.includes('hi') || v.lang.includes('en'))
      )
      
      if (googleVoice) {
        utterance.voice = googleVoice
      } else {
        utterance.lang = selectedLanguage === 'ml' ? 'hi-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-US'
      }
      
      utterance.rate = 0.7
      utterance.pitch = 1
      utterance.volume = 1
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
    
    setTimeout(speak, 200)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Subtle Particles Background */}
      <SubtleParticlesBackground />

      {/* Header */}
      <div className="border-b border-gray-800 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-6 h-6 text-green-400" />
                <h1 className="text-xl font-bold text-white">AI Medical Assistant</h1>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Dr. Revaa</Badge>
              </div>
              <LanguageSelector value={selectedLanguage} onValueChange={setSelectedLanguage} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl relative z-10">
        {/* Permission Check */}
        <div className="mb-6">
          <PermissionCheck />
        </div>

        {/* Chat Container */}
        <Card className="bg-gray-800/50 border-gray-700 h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Bot className="w-5 h-5 text-green-400" />
              <span>Medical Consultation</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Chat with Dr. Revaa for medical information and health guidance. Always consult healthcare professionals
              for serious concerns.
            </CardDescription>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto space-y-4 p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-green-400" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500/20 text-blue-100 border border-blue-500/30"
                      : "bg-gray-700/50 text-gray-100 border border-gray-600/30"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</span>
                    <div className="flex items-center space-x-2">
                      {message.sender === "bot" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakBotResponse(message.content)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
                          title="Listen to response"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                      {message.language && message.language !== "en" && (
                        <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {message.language.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Message */}
            {isLoading && (
              <div className="flex items-start space-x-3 justify-start">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-green-400" />
                </div>
                <div className="bg-gray-700/50 text-gray-100 border border-gray-600/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                    <span className="text-sm">Dr. Revaa is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <VoiceInput
                  onResult={handleVoiceResult}
                  onSpeech={handleSpeech}
                  language={selectedLanguage}
                  disabled={isLoading}
                  speakText={speakBotResponse}
                />
                <span className="text-xs text-gray-400">
                  Speak in any language, get responses in {selectedLanguage.toUpperCase()}
                </span>
              </div>

              <div className="flex space-x-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about symptoms, medications, health concerns..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={isLoading || !inputMessage.trim()}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                onClick={() => handleSendMessage("I have a headache")}
                disabled={isLoading}
              >
                I have a headache
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                onClick={() => handleSendMessage("What are the symptoms of flu?")}
                disabled={isLoading}
              >
                Flu symptoms
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                onClick={() => handleSendMessage("How to maintain good health?")}
                disabled={isLoading}
              >
                Health tips
              </Button>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-yellow-500/10 border-yellow-500/30 mt-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5">⚠️</div>
              <div>
                <h3 className="text-yellow-400 font-semibold text-sm mb-1">Medical Disclaimer</h3>
                <p className="text-yellow-200 text-xs leading-relaxed">
                  This AI assistant provides general health information for educational purposes only. It is not a
                  substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of
                  qualified healthcare providers with questions about medical conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
