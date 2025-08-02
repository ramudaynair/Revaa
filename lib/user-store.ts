// Simple in-memory user store for demo purposes
// In production, this would be replaced with a proper database

export interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: string
}

// In-memory user storage
const users: User[] = [
  // Optional: Keep some demo users for testing
  {
    id: 1,
    name: "Demo User",
    email: "demo@healthai.com",
    password: "demo123",
    createdAt: new Date().toISOString(),
  },
]

export const userStore = {
  // Find user by email
  findByEmail: (email: string): User | undefined => {
    try {
      return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    } catch (error) {
      console.error("Error finding user by email:", error)
      return undefined
    }
  },

  // Create new user
  create: (userData: Omit<User, "id" | "createdAt">): User => {
    try {
      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        ...userData,
        email: userData.email.toLowerCase().trim(),
        name: userData.name.trim(),
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      console.log("User created in store:", { id: newUser.id, email: newUser.email })
      return newUser
    } catch (error) {
      console.error("Error creating user:", error)
      throw new Error("Failed to create user")
    }
  },

  // Check if email exists
  emailExists: (email: string): boolean => {
    try {
      return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
    } catch (error) {
      console.error("Error checking email existence:", error)
      return false
    }
  },

  // Get all users (for debugging)
  getAll: (): User[] => {
    return users
  },
}
