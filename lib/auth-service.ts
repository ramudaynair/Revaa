// Client-side authentication service using localStorage

export interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface UserWithPassword extends User {
  password: string
}

const USERS_KEY = "revaa_users"
const CURRENT_USER_KEY = "revaa_current_user"
const TOKEN_KEY = "revaa_token"

class AuthService {
  // Get all users from localStorage
  private getUsers(): UserWithPassword[] {
    if (typeof window === "undefined") return []

    try {
      const users = localStorage.getItem(USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error("Error reading users from localStorage:", error)
      return []
    }
  }

  // Save users to localStorage
  private saveUsers(users: UserWithPassword[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    } catch (error) {
      console.error("Error saving users to localStorage:", error)
    }
  }

  // Generate a JWT token
  private generateToken(user: User): string {
    // For client-side, we'll use a simple token format that can be verified server-side
    const tokenData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }
    
    // Simple JWT-like token that can be verified server-side
    const header = { alg: "HS256", typ: "JWT" }
    const payload = tokenData
    
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '')
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '')
    
    // Create a simple signature (this is for demo purposes)
    const signature = btoa(`${encodedHeader}.${encodedPayload}.demo-signature`).replace(/=/g, '')
    
    return `${encodedHeader}.${encodedPayload}.${signature}`
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Sign up a new user
  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string; user?: User; token?: string }> {
    try {
      // Validate inputs
      if (!name.trim() || !email.trim() || !password) {
        return { success: false, message: "Name, email, and password are required" }
      }

      if (!this.isValidEmail(email)) {
        return { success: false, message: "Please enter a valid email address" }
      }

      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters long" }
      }

      const users = this.getUsers()
      const normalizedEmail = email.toLowerCase().trim()

      // Check if user already exists
      if (users.some((user) => user.email === normalizedEmail)) {
        return { success: false, message: "An account with this email already exists" }
      }

      // Create new user
      const newUser: UserWithPassword = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        name: name.trim(),
        email: normalizedEmail,
        password, // In production, this would be hashed
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      users.push(newUser)
      this.saveUsers(users)

      // Generate token and save session
      const token = this.generateToken(newUser)
      const userWithoutPassword: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      }

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
      
      // Also set cookie for middleware
      document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`

      return {
        success: true,
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, message: "An error occurred during signup. Please try again." }
    }
  }

  // Login user
  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string; user?: User; token?: string }> {
    try {
      // Validate inputs
      if (!email.trim() || !password) {
        return { success: false, message: "Email and password are required" }
      }

      const users = this.getUsers()
      const normalizedEmail = email.toLowerCase().trim()

      // Find user
      const user = users.find((u) => u.email === normalizedEmail && u.password === password)

      if (!user) {
        return { success: false, message: "Invalid email or password" }
      }

      // Generate token and save session
      const token = this.generateToken(user)
      const userWithoutPassword: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
      
      // Also set cookie for middleware
      document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`

      return {
        success: true,
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "An error occurred during login. Please try again." }
    }
  }

  // Update user profile
  async updateProfile(
    userId: number,
    name: string,
    email: string,
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      // Validate inputs
      if (!name.trim() || !email.trim()) {
        return { success: false, message: "Name and email are required" }
      }

      if (!this.isValidEmail(email)) {
        return { success: false, message: "Please enter a valid email address" }
      }

      const users = this.getUsers()
      const normalizedEmail = email.toLowerCase().trim()

      // Check if email is taken by another user
      const existingUser = users.find((u) => u.email === normalizedEmail && u.id !== userId)
      if (existingUser) {
        return { success: false, message: "This email is already taken by another account" }
      }

      // Find and update user
      const userIndex = users.findIndex((u) => u.id === userId)
      if (userIndex === -1) {
        return { success: false, message: "User not found" }
      }

      users[userIndex] = {
        ...users[userIndex],
        name: name.trim(),
        email: normalizedEmail,
      }

      // Save updated users
      this.saveUsers(users)

      // Update current user session
      const updatedUser: User = {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        createdAt: users[userIndex].createdAt,
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))

      return {
        success: true,
        user: updatedUser,
      }
    } catch (error) {
      console.error("Profile update error:", error)
      return { success: false, message: "An error occurred while updating profile. Please try again." }
    }
  }

  // Logout user
  logout(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
    
    // Also remove cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userStr = localStorage.getItem(CURRENT_USER_KEY)
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false

    const token = localStorage.getItem(TOKEN_KEY)
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return !!(token && user)
  }

  // Get token
  getToken(): string | null {
    if (typeof window === "undefined") return null

    return localStorage.getItem(TOKEN_KEY)
  }
}

export const authService = new AuthService()
