"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Stethoscope, Pill, LogOut, User, Activity, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService, type User as UserType } from "@/lib/auth-service"
import { activityService, type Activity as ActivityType } from "@/lib/activity-service"
import EnhancedParticlesBackground from "@/components/enhanced-particles-background"
import FloatingChatbot from "@/components/floating-chatbot"
import LiveStats from "@/components/live-stats"

export default function Dashboard() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [stats, setStats] = useState({ totalConsultations: 0, symptomsChecked: 0, drugQueries: 0 })
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
      // Load initial data
      const userActivities = activityService.getUserActivities(currentUser.id)
      const userStats = activityService.getUserStats(currentUser.id)
      setActivities(userActivities)
      setStats(userStats)
    } else {
      router.push("/auth")
    }

    setIsLoading(false)
  }, [router])

  // Add live updates for activities
  useEffect(() => {
    if (!user) return

    const updateActivities = () => {
      const userActivities = activityService.getUserActivities(user.id)
      setActivities(userActivities)
    }

    const interval = setInterval(updateActivities, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [user])

  const handleLogout = () => {
    authService.logout()
    router.push("/")
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "chatbot":
        return <Bot className="w-5 h-5 text-green-400" />
      case "symptom-checker":
        return <Stethoscope className="w-5 h-5 text-green-400" />
      case "drug-info":
        return <Pill className="w-5 h-5 text-green-400" />
      default:
        return <Activity className="w-5 h-5 text-green-400" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    return "Just now"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }
  user && <LiveStats userId={user.id} onStatsUpdate={setStats} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Enhanced Particles Background */}
      <EnhancedParticlesBackground />

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 backdrop-blur-[1px]"></div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">Revaa</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              <Link href="/dashboard/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent backdrop-blur-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-gray-600/50 text-gray-300 hover:bg-gray-700/20 bg-transparent backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
              <p className="text-gray-400">
                Access your AI-powered healthcare tools and get personalized medical insights.
              </p>
            </div>
            <Link href="/dashboard/welcome">
              <Button
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent backdrop-blur-sm"
              >
                Welcome Tour
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Total Consultations", value: stats.totalConsultations, icon: Activity },
            { title: "Symptoms Checked", value: stats.symptomsChecked, icon: Stethoscope },
            { title: "Drug Queries", value: stats.drugQueries, icon: Pill },
          ].map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Main Tools */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              href: "/dashboard/chatbot",
              icon: Bot,
              title: "AI Medical Chatbot",
              description: "Chat with our AI assistant for medical questions and health advice",
            },
            {
              href: "/dashboard/symptom-checker",
              icon: Stethoscope,
              title: "Symptom Checker",
              description: "Analyze your symptoms and get AI-powered health assessments",
            },
            {
              href: "/dashboard/drug-info",
              icon: Pill,
              title: "Drug Information",
              description: "Get detailed information about medications and drug interactions",
            },
          ].map((tool, index) => (
            <Link key={index} href={tool.href}>
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all duration-300 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="relative group/icon mb-4">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-75 group-hover/icon:opacity-100 transition duration-300"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <tool.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white">{tool.title}</CardTitle>
                    <CardDescription className="text-gray-400">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button className="w-full relative group/btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                      <span className="relative">
                        {tool.title === "AI Medical Chatbot"
                          ? "Start Conversation"
                          : tool.title === "Symptom Checker"
                            ? "Check Symptoms"
                            : "Search Drugs"}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400/10 to-green-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity. Start using our tools to see your activity here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <p className="text-white font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-400">{activity.description}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Chatbot */}
      <FloatingChatbot />
    </div>
  )
}
