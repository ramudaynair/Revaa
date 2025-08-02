"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService, type User as UserType } from "@/lib/auth-service"
import { activityService } from "@/lib/activity-service"
import ParticlesBackground from "@/components/particles-background"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [message, setMessage] = useState("")
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
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
      })
    } else {
      router.push("/auth")
    }

    setIsLoading(false)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (message) setMessage("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setMessage("")

    try {
      // Update user in auth service
      const result = await authService.updateProfile(user.id, formData.name.trim(), formData.email.trim())

      if (result.success && result.user) {
        setUser(result.user)
        setMessage("Profile updated successfully!")

        // Add activity
        activityService.addActivity(user.id, "profile", "Profile Updated", "Updated profile information")
      } else {
        setMessage(result.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Profile update error:", error)
      setMessage("An error occurred while updating profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClearData = () => {
    if (!user) return

    if (confirm("Are you sure you want to clear all your activity data? This action cannot be undone.")) {
      activityService.clearUserActivities(user.id)
      setMessage("Activity data cleared successfully!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 backdrop-blur-[1px]"></div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6 text-green-400" />
              <h1 className="text-xl font-bold text-white">Profile Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-2xl">
        {/* Profile Form */}
        <div className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Personal Information</CardTitle>
              <CardDescription className="text-gray-400">
                Update your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <div
                  className={`mb-4 p-3 backdrop-blur-sm rounded-lg border ${
                    message.includes("successfully")
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <p className="text-sm text-center">{message}</p>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-green-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="backdrop-blur-sm bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-green-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Account Created</Label>
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-md px-3 py-2">
                    <p className="text-gray-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full relative group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 overflow-hidden"
                  disabled={isSaving}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-400/20 to-red-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Data Management</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your activity data and account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Clear Activity Data</h3>
                  <p className="text-gray-400 text-sm">Remove all your consultation history and activity logs</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClearData}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent backdrop-blur-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </div>

              <div className="p-4 backdrop-blur-sm bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold text-sm mb-1">Important Notice</h4>
                    <p className="text-yellow-200 text-xs">
                      Clearing your activity data will permanently remove all consultation history, symptom checks, and
                      drug queries. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
