import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Gemini Test API ===")
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    console.log("API Key present:", !!apiKey)
    console.log("API Key source:", process.env.GEMINI_API_KEY ? "GEMINI_API_KEY" : "NEXT_PUBLIC_GEMINI_API_KEY")
    console.log("API Key value:", apiKey?.substring(0, 10) + "...")

    const { message } = await request.json()
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "No Gemini API key found in environment variables",
        debug: {
          GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
          NEXT_PUBLIC_GEMINI_API_KEY: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY
        }
      })
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    console.log("Sending message to Gemini:", message)

    // Test simple message
    const result = await model.generateContent(message || "Say hello")
    const response = await result.response
    const text = response.text()

    console.log("Gemini response received:", text.substring(0, 100) + "...")

    return NextResponse.json({
      success: true,
      response: text,
      debug: {
        apiKeyConfigured: true,
        model: "gemini-1.5-flash",
        requestMessage: message || "Say hello"
      }
    })

  } catch (error) {
    console.error("Gemini test error:", error)
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      debug: {
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        NEXT_PUBLIC_GEMINI_API_KEY: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        apiKeyValue: apiKey ? apiKey.substring(0, 10) + "..." : "not set"
      }
    })
  }
}
