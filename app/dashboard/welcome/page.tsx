"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Stethoscope, Pill, ArrowRight, Sparkles, Heart, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService, type User as UserType } from "@/lib/auth-service"
import EnhancedParticlesBackground from "@/components/enhanced-particles-background"

export default function WelcomePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
    } else {
      router.push("/auth")
    }

    setIsLoading(false)
  }, [router])

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
      {/* Enhanced Particles Background */}
      <EnhancedParticlesBackground />

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 backdrop-blur-[1px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 py-8">
          {/* Welcome Hero Section */}
          <div className="text-center mb-16">
            <div className="relative group inline-block mb-8">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent block">
                Your Health Journey
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Hello <span className="text-green-400 font-semibold">{user.name}</span>! We're excited to help you take
              control of your health with our AI-powered tools. Choose from our comprehensive suite of healthcare
              features below.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                href: "/dashboard/chatbot",
                icon: Bot,
                title: "AI Medical Chatbot",
                description:
                  "Get instant answers to your medical questions with our advanced AI assistant. Available 24/7 in multiple languages.",
                features: ["24/7 Availability", "Multi-language Support", "Voice Recognition", "Instant Responses"],
                color: "from-blue-400 to-blue-600",
              },
              {
                href: "/dashboard/symptom-checker",
                icon: Stethoscope,
                title: "Smart Symptom Checker",
                description:
                  "Analyze your symptoms with AI-powered assessment and get personalized health recommendations.",
                features: ["AI-Powered Analysis", "Severity Assessment", "Personalized Recommendations", "Voice Input"],
                color: "from-green-400 to-green-600",
              },
              {
                href: "/dashboard/drug-info",
                icon: Pill,
                title: "Drug Information Hub",
                description: "Access comprehensive medication information, interactions, and safety guidelines.",
                features: ["Comprehensive Database", "Interaction Warnings", "Dosage Information", "Safety Guidelines"],
                color: "from-purple-400 to-purple-600",
              },
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.color} opacity-20 rounded-2xl blur group-hover:opacity-40 transition duration-500`}
                ></div>
                <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="relative group/icon mb-6">
                      <div
                        className={`absolute -inset-3 bg-gradient-to-r ${feature.color} rounded-full blur opacity-75 group-hover/icon:opacity-100 transition duration-300`}
                      ></div>
                      <div
                        className={`relative w-20 h-20 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-white mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400 leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Feature List */}
                    <div className="space-y-2">
                      {feature.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full`}></div>
                          <span className="text-gray-300 text-sm">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Link href={feature.href}>
                      <Button
                        className={`w-full relative group/btn bg-gradient-to-r ${feature.color} hover:scale-105 transition-all duration-300 overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative flex items-center justify-center">
                          Get Started
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your health data is protected with enterprise-grade security",
              },
              {
                icon: Heart,
                title: "Expert-Backed",
                description: "AI models trained and validated by healthcare professionals",
              },
              {
                icon: Sparkles,
                title: "Always Improving",
                description: "Continuously updated with latest medical knowledge",
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400/10 to-green-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 p-6 text-center">
                  <item.icon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* Quick Access Dashboard Button */}
          <div className="text-center">
            <div className="relative group inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 to-green-600/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 text-lg rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Or access your full dashboard to view your health history and statistics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
