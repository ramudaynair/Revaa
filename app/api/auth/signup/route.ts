import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { userStore } from "@/lib/user-store"

const JWT_SECRET = "your-secret-key-here"

export async function POST(request: NextRequest) {
  try {
    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json({ message: "Invalid request format" }, { status: 400 })
    }

    const { name, email, password } = body

    console.log("Signup attempt:", { name, email, passwordLength: password?.length })

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    if (userStore.emailExists(email)) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = userStore.create({
      name,
      email,
      password, // In production, this would be hashed with bcrypt
    })

    console.log("User created successfully:", { id: newUser.id, email: newUser.email })

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        message: "An error occurred during signup. Please try again.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
