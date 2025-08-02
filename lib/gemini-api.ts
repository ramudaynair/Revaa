import { GoogleGenerativeAI } from "@google/generative-ai"
import { searchMedicines, medicinesDataset } from "./medicines-dataset"
import { searchSymptoms, searchDiseases, checkSymptoms } from "./symptoms-diseases-dataset"

// Debug logging
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
console.log("Gemini API Key present:", !!apiKey)
console.log("Gemini API Key source:", process.env.GEMINI_API_KEY ? "GEMINI_API_KEY" : "NEXT_PUBLIC_GEMINI_API_KEY")
console.log("Gemini API Key value:", apiKey.substring(0, 10) + "...")

const genAI = new GoogleGenerativeAI(apiKey)

export interface GeminiResponse {
  success: boolean
  response: string
  error?: string
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  async getMedicalResponse(message: string, language = "en"): Promise<GeminiResponse> {
    try {
      console.log("=== Gemini API Call Debug ===")
      const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
      console.log("API Key available:", !!apiKey)
      console.log("Message:", message)
      console.log("Language:", language)
      
      if (!apiKey) {
        console.error("No Gemini API key found in environment variables")
        throw new Error("Gemini API key not configured")
      }

      const languageMap: { [key: string]: string } = {
        en: "English",
        hi: "Hindi",
        bn: "Bengali",
        ta: "Tamil",
        te: "Telugu",
        ml: "Malayalam",
        kn: "Kannada",
        gu: "Gujarati",
        mr: "Marathi",
        pa: "Punjabi",
      }

      const responseLanguage = languageMap[language] || "English"

      // Check if the message is asking about medicines
      const medicineMatches = searchMedicines(message)
      const symptomMatches = searchSymptoms(message)
      const diseaseMatches = searchDiseases(message)
      
      let contextInfo = ""
      if (medicineMatches.length > 0) {
        const topMedicine = medicineMatches[0]
        contextInfo = `\n\nRelevant medicine information:\n- ${topMedicine.name} (${topMedicine.genericName}): ${topMedicine.description}\n- Uses: ${topMedicine.uses.join(", ")}\n- Category: ${topMedicine.category}`
      } else if (symptomMatches.length > 0) {
        const topSymptom = symptomMatches[0]
        contextInfo = `\n\nRelevant symptom information:\n- ${topSymptom.name}: ${topSymptom.description}\n- Common causes: ${topSymptom.commonCauses.join(", ")}\n- When to seek help: ${topSymptom.whenToSeekHelp.join(", ")}`
      } else if (diseaseMatches.length > 0) {
        const topDisease = diseaseMatches[0]
        contextInfo = `\n\nRelevant condition information:\n- ${topDisease.name}: ${topDisease.description}\n- Common symptoms: ${topDisease.commonSymptoms.join(", ")}\n- Category: ${topDisease.category}`
      }

      const prompt = `You are Dr. Revaa, a friendly and knowledgeable medical assistant. You provide helpful, accurate medical information while always emphasizing the importance of consulting healthcare professionals for proper diagnosis and treatment.

User's message: "${message}"${contextInfo}

Please respond in ${responseLanguage} language. Provide helpful medical information, but always remind users to consult healthcare professionals for proper medical advice. Keep your response concise, friendly, and informative.

Important guidelines:
- Always prioritize user safety
- Recommend professional medical consultation for serious symptoms
- Provide general health information, not specific diagnoses
- Be empathetic and supportive
- If asked about medications, provide general information but emphasize consulting a doctor or pharmacist
- Use the context information provided to give more accurate responses`

      console.log("Sending prompt to Gemini...")
      const result = await this.model.generateContent(prompt)
      console.log("Received result from Gemini")
      
      const response = await result.response
      console.log("Got response object")
      
      const text = response.text()
      console.log("Response text length:", text?.length || 0)

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini")
      }

      return {
        success: true,
        response: text.trim(),
      }
    } catch (error) {
      console.error("Gemini API error:", error)

      // Fallback responses in different languages
      const fallbackResponses: { [key: string]: string } = {
        en: "I'm here to help with your health questions. However, I'm currently experiencing technical difficulties. Please consult with a healthcare professional for medical advice. Is there anything specific you'd like to know about general health and wellness?",
        hi: "मैं आपके स्वास्थ्य संबंधी प्रश्नों में मदद करने के लिए यहाँ हूँ। हालांकि, मुझे वर्तमान में तकनीकी कठिनाइयों का सामना कर रहा हूँ। कृपया चिकित्सा सलाह के लिए किसी स्वास्थ्य पेशेवर से सलाह लें।",
        bn: "আমি আপনার স্বাস্থ্য সংক্রান্ত প্রশ্নে সাহায্য করতে এখানে আছি। তবে, আমি বর্তমানে প্রযুক্তিগত সমস্যার সম্মুখীন হচ্ছি। চিকিৎসা পরামর্শের জন্য একজন স্বাস্থ্যসেবা পেশাদারের সাথে পরামর্শ করুন।",
        ta: "உங்கள் சுகாதார கேள்விகளுக்கு உதவ நான் இங்கே இருக்கிறேன். இருப்பினும், நான் தற்போது தொழில்நுட்ப சிக்கல்களை எதிர்கொண்டு வருகிறேன். மருத்துவ ஆலோசனைக்கு ஒரு சுகாதார நிபுணரை அணுகவும்।",
        te: "మీ ఆరోగ్య ప్రశ్నలతో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. అయితే, నేను ప్రస్తుతం సాంకేతిక ఇబ్బందులను ఎదుర్కొంటున్నాను. వైద్య సలహా కోసం ఆరోగ్య నిపుణుడిని సంప్రదించండి।",
        ml: "നിങ്ങളുടെ ആരോഗ്യ ചോദ്യങ്ങളിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. എന്നിരുന്നാലും, ഞാൻ നിലവിൽ സാങ്കേതിക ബുദ്ധിമുട്ടുകൾ നേരിടുന്നു. വൈദ്യ ഉപദേശത്തിനായി ഒരു ആരോഗ്യ പ്രൊഫഷണലിനെ സമീപിക്കുക।",
        kn: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ಆದಾಗ್ಯೂ, ನಾನು ಪ್ರಸ್ತುತ ತಾಂತ್ರಿಕ ತೊಂದರೆಗಳನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೇನೆ. ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ।",
        gu: "તમારા સ્વાસ્થ્ય પ્રશ્નોમાં મદદ કરવા માટે હું અહીં છું. જો કે, હું હાલમાં તકનીકી મુશ્કેલીઓનો સામનો કરી રહ્યો છું. તબીબી સલાહ માટે આરોગ્ય વ્યાવસાયિકનો સંપર્ક કરો।",
        mr: "तुमच्या आरोग्य प्रश्नांमध्ये मदत करण्यासाठी मी येथे आहे. तथापि, मला सध्या तांत्रिक अडचणींचा सामना करावा लागत आहे. वैद्यकीय सल्ल्यासाठी आरोग्य व्यावसायिकांशी संपर्क साधा।",
        pa: "ਮੈਂ ਤੁਹਾਡੇ ਸਿਹਤ ਸਬੰਧੀ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਹਾਲਾਂਕਿ, ਮੈਂ ਵਰਤਮਾਨ ਵਿੱਚ ਤਕਨੀਕੀ ਮੁਸ਼ਕਿਲਾਂ ਦਾ ਸਾਮ੍ਹਣਾ ਕਰ ਰਿਹਾ ਹਾਂ। ਡਾਕਟਰੀ ਸਲਾਹ ਲਈ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।",
      }

      return {
        success: false,
        response: fallbackResponses[language] || fallbackResponses.en,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const languageMap: { [key: string]: string } = {
        en: "English",
        hi: "Hindi",
        bn: "Bengali",
        ta: "Tamil",
        te: "Telugu",
        ml: "Malayalam",
        kn: "Kannada",
        gu: "Gujarati",
        mr: "Marathi",
        pa: "Punjabi",
      }

      const targetLang = languageMap[targetLanguage] || "English"

      const prompt = `Translate the following text to ${targetLang}. Maintain the medical context and tone:

"${text}"

Provide only the translation, no additional text.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      console.error("Translation error:", error)
      return text // Return original text if translation fails
    }
  }
}

export const geminiService = new GeminiService()
