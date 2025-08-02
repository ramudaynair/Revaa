import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { geminiService } from "@/lib/gemini-api"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"

export async function POST(request: NextRequest) {
  try {
    // Read request body as text first
    const bodyText = await request.text()
    console.log("Raw request body:", bodyText)

    if (!bodyText) {
      return NextResponse.json(
        {
          success: false,
          response: "No message provided",
          error: "Empty request body",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Parse JSON
    let body
    try {
      body = JSON.parse(bodyText)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json(
        {
          success: false,
          response: "Invalid request format",
          error: "Invalid JSON",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Skip authentication for demo purposes - using mock data
    console.log("Processing request without authentication (demo mode)")
    
    const { message, language = "en" } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          success: false,
          response: "Please provide a valid message",
          error: "Message is required",
        },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("Processing message:", message, "Language:", language)

    // Get response from Gemini
    const geminiResponse = await geminiService.getMedicalResponse(message.trim(), language)

    if (geminiResponse.success) {
      return NextResponse.json(
        {
          success: true,
          response: geminiResponse.response,
          language: language,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    } else {
      // Return fallback response
      return NextResponse.json(
        {
          success: true,
          response: geminiResponse.response,
          language: language,
          fallback: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    }
  } catch (error) {
    console.error("Chatbot API error:", error)

    // Always return valid JSON
    return NextResponse.json(
      {
        success: false,
        response:
          "I'm experiencing technical difficulties. Please try again or consult a healthcare professional for medical advice.",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : "Internal server error",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      response: "Method not allowed",
      error: "Use POST method",
    },
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    },
  )
}
