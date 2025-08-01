// Sarvam API integration for voice recognition and text-to-speech

export interface SarvamConfig {
  apiKey: string
  baseUrl: string
}

export interface VoiceRecognitionResult {
  text: string
  language: string
  confidence: number
}

export interface TextToSpeechOptions {
  text: string
  language: string
  voice?: string
}

export const SUPPORTED_LANGUAGES = {
  en: { name: "English", code: "en-US" },
  hi: { name: "Hindi", code: "hi-IN" },
  bn: { name: "Bengali", code: "bn-IN" },
  ta: { name: "Tamil", code: "ta-IN" },
  te: { name: "Telugu", code: "te-IN" },
  ml: { name: "Malayalam", code: "ml-IN" },
  kn: { name: "Kannada", code: "kn-IN" },
  gu: { name: "Gujarati", code: "gu-IN" },
  mr: { name: "Marathi", code: "mr-IN" },
  pa: { name: "Punjabi", code: "pa-IN" },
}

class SarvamService {
  private config: SarvamConfig = {
    apiKey: process.env.NEXT_PUBLIC_SARVAM_API_KEY || "",
    baseUrl: "https://api.sarvam.ai/v1",
  }

  // Detect language from text
  async detectLanguage(text: string): Promise<string> {
    try {
      // Simple language detection based on script
      const hindiRegex = /[\u0900-\u097F]/
      const bengaliRegex = /[\u0980-\u09FF]/
      const tamilRegex = /[\u0B80-\u0BFF]/
      const teluguRegex = /[\u0C00-\u0C7F]/
      const malayalamRegex = /[\u0D00-\u0D7F]/
      const kannadaRegex = /[\u0C80-\u0CFF]/
      const gujaratiRegex = /[\u0A80-\u0AFF]/
      const marathiRegex = /[\u0900-\u097F]/
      const punjabiRegex = /[\u0A00-\u0A7F]/

      if (hindiRegex.test(text)) return "hi"
      if (bengaliRegex.test(text)) return "bn"
      if (tamilRegex.test(text)) return "ta"
      if (teluguRegex.test(text)) return "te"
      if (malayalamRegex.test(text)) return "ml"
      if (kannadaRegex.test(text)) return "kn"
      if (gujaratiRegex.test(text)) return "gu"
      if (marathiRegex.test(text)) return "mr"
      if (punjabiRegex.test(text)) return "pa"

      return "en" // Default to English
    } catch (error) {
      console.error("Language detection error:", error)
      return "en"
    }
  }

  // Speech to text using browser's Web Speech API (fallback for Sarvam)
  async speechToText(language = "en"): Promise<VoiceRecognitionResult> {
    return new Promise((resolve, reject) => {
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        reject(new Error("Speech recognition not supported in this browser"))
        return
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]?.code || "en-US"
      recognition.maxAlternatives = 1

      let hasResult = false
      let timeoutId: NodeJS.Timeout

      // Set a timeout to prevent hanging
      timeoutId = setTimeout(() => {
        recognition.stop()
        if (!hasResult) {
          reject(new Error("Speech recognition timeout. Please try again."))
        }
      }, 30000) // 30 seconds

      recognition.onstart = () => {
        console.log("Speech recognition started for language:", recognition.lang)
        console.log("Listening... Please speak now.")
        // Show visual feedback
        if (typeof window !== 'undefined') {
          document.title = "🎤 Listening... Speak now!"
        }
      }

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            hasResult = true
            clearTimeout(timeoutId)
            recognition.stop()
            
            console.log("Speech recognition result:", result[0].transcript, "Confidence:", result[0].confidence)
            
            resolve({
              text: result[0].transcript,
              language: language,
              confidence: result[0].confidence || 0.9,
            })
            return
          }
        }
      }

      recognition.onerror = (event: any) => {
        clearTimeout(timeoutId)
        console.error("Speech recognition error:", event.error)

        let errorMessage = "Speech recognition failed"

        switch (event.error) {
          case "not-allowed":
            errorMessage = "Microphone permission denied. Please allow microphone access and try again."
            break
          case "no-speech":
            errorMessage = "No speech detected. Please speak clearly and try again."
            break
          case "audio-capture":
            errorMessage = "No microphone found. Please check your microphone connection."
            break
          case "network":
            errorMessage = "Network error occurred. This might happen when:\n• Internet connection is poor\n• Browser speech service is unavailable\n• Try again in a few seconds"
            break
          case "service-not-allowed":
            errorMessage = "Speech recognition service not allowed. Please try again."
            break
          case "bad-grammar":
            errorMessage = "Speech recognition grammar error."
            break
          case "language-not-supported":
            errorMessage = "Selected language not supported for speech recognition."
            break
          case "aborted":
            errorMessage = "Speech recognition was aborted."
            break
          default:
            errorMessage = `Speech recognition error: ${event.error}`
        }

        reject(new Error(errorMessage))
      }

      recognition.onend = () => {
        clearTimeout(timeoutId)
        console.log("Speech recognition ended")
        if (typeof window !== 'undefined') {
          document.title = "Revaa - AI Medical Assistant"
        }
        if (!hasResult) {
          reject(new Error("No speech detected. Please speak louder and closer to microphone."))
        }
      }

      try {
        recognition.start()
      } catch (error) {
        clearTimeout(timeoutId)
        reject(new Error("Failed to start speech recognition"))
      }
    })
  }

  // Text to speech using Sarvam AI API
  async textToSpeech(options: TextToSpeechOptions): Promise<void> {
    console.log('TTS called with:', options)
    // Use fallback for now since Sarvam API might have issues
    return this.fallbackTextToSpeech(options)
  }

  private async fallbackTextToSpeech(options: TextToSpeechOptions): Promise<void> {
    return new Promise((resolve) => {
      console.log('Fallback TTS called')
      if (!("speechSynthesis" in window)) {
        console.log('Speech synthesis not supported')
        resolve()
        return
      }

      speechSynthesis.cancel()
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(options.text)
        const langCode = SUPPORTED_LANGUAGES[options.language as keyof typeof SUPPORTED_LANGUAGES]?.code || "en-US"
        utterance.lang = langCode
        utterance.rate = 0.8
        utterance.volume = 1
        
        utterance.onstart = () => console.log('TTS started')
        utterance.onend = () => {
          console.log('TTS ended')
          resolve()
        }
        utterance.onerror = (e) => {
          console.log('TTS error:', e)
          resolve()
        }
        
        console.log('Speaking:', options.text, 'in', langCode)
        speechSynthesis.speak(utterance)
      }, 200)
    })
  }

  // Translate text (mock implementation - in production, use Sarvam API)
  async translateText(text: string, fromLang: string, toLang: string): Promise<string> {
    try {
      // Mock translation responses for demo
      const translations: Record<string, Record<string, string>> = {
        en: {
          hi: "आपका स्वास्थ्य हमारी प्राथमिकता है",
          ta: "உங்கள் ஆரோக்கியம் எங்கள் முன்னுரிமை",
          te: "మీ ఆరోగ్యం మా ప్రాధాన్యత",
          bn: "আপনার স্বাস্থ্য আমাদের অগ্রাধিকার",
        },
      }

      if (fromLang === toLang) return text

      // Return mock translation or original text
      return translations[fromLang]?.[toLang] || text
    } catch (error) {
      console.error("Translation error:", error)
      return text
    }
  }

  // Get medical response in specified language
  async getMedicalResponse(message: string, language: string): Promise<string> {
    const detectedLang = await this.detectLanguage(message)

    // Get response in English first
    const englishResponse = this.getEnglishMedicalResponse(message)

    // If requested language is English or same as detected, return as is
    if (language === "en" || language === detectedLang) {
      return englishResponse
    }

    // Translate to requested language (mock implementation)
    return await this.translateText(englishResponse, "en", language)
  }

  private getEnglishMedicalResponse(message: string): string {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("headache") || lowerMessage.includes("head pain")) {
      return "Headaches can have various causes including stress, dehydration, lack of sleep, or tension. For mild headaches, try resting in a quiet, dark room, staying hydrated, and applying a cold or warm compress. If headaches are severe, frequent, or accompanied by other symptoms like fever, vision changes, or neck stiffness, please consult a healthcare provider."
    }

    if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) {
      return "A fever is your body's natural response to infection. For adults, a fever is generally considered 100.4°F (38°C) or higher. Stay hydrated, rest, and you can use over-the-counter fever reducers like acetaminophen or ibuprofen. Seek medical attention if fever exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms."
    }

    if (lowerMessage.includes("cough") || lowerMessage.includes("coughing")) {
      return "Coughs can be caused by various factors including viral infections, allergies, or irritants. Stay hydrated, use honey (for adults), and consider a humidifier. A persistent cough lasting more than 2-3 weeks, coughing up blood, or accompanied by high fever should be evaluated by a healthcare provider."
    }

    // Default response
    return "I understand you have a health concern. While I can provide general health information, it's important to remember that I cannot replace professional medical advice. For specific symptoms or health issues, I recommend consulting with a qualified healthcare provider who can properly assess your condition and provide personalized treatment recommendations."
  }
}

export const sarvamService = new SarvamService()
