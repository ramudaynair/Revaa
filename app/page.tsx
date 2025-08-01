"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Bot, Stethoscope, Pill, Shield, Zap, Users, ChevronDown } from "lucide-react"
import Link from "next/link"
import EnhancedParticlesBackground from "@/components/enhanced-particles-background"
import FloatingChatbot from "@/components/floating-chatbot"
import { authService } from "@/lib/auth-service"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsAuthenticated(authService.isAuthenticated())
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Enhanced Particles Background */}
      <EnhancedParticlesBackground />

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 backdrop-blur-[1px]"></div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">Revaa</span>
            </div>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="relative group border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered */}
      <section className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Glass morphism hero card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Welcome to
                  <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent block">
                    Revaa
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Experience the future of healthcare with our AI-driven platform. Get instant medical insights, symptom
                  analysis, and drug information powered by advanced machine learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="relative group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <span className="relative flex items-center">
                        Go to Dashboard
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-green-400" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Intelligent Healthcare Tools</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with medical expertise to provide you with reliable healthcare
              assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "AI Medical Chatbot",
                description:
                  "Get instant answers to your medical questions with our BERT-powered conversational AI. Available 24/7 for your healthcare queries.",
              },
              {
                icon: Stethoscope,
                title: "Symptom Checker",
                description:
                  "Advanced ML algorithms analyze your symptoms to provide severity classification and personalized recommendations for your next steps.",
              },
              {
                icon: Pill,
                title: "Drug Information",
                description:
                  "Comprehensive drug database with AI-powered recommendations, dosage information, and interaction warnings using advanced NLP models.",
              },
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    <div className="relative group/icon mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-75 group-hover/icon:opacity-100 transition duration-300"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed flex-grow">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">About Revaa</h2>
              <p className="text-gray-400 text-lg">
                Revolutionizing healthcare accessibility through artificial intelligence
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
                <div className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Sign Up & Access",
                      desc: "Create your secure account and access our AI-powered healthcare tools.",
                    },
                    {
                      step: "2",
                      title: "Input Your Information",
                      desc: "Share your symptoms, questions, or drug queries with our intelligent system.",
                    },
                    {
                      step: "3",
                      title: "Get AI-Powered Insights",
                      desc: "Receive personalized recommendations and insights powered by advanced ML models.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-sm">{item.step}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                        <p className="text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Secure & Private",
                    desc: "Your health data is protected with enterprise-grade security and JWT authentication.",
                  },
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    desc: "Get instant responses powered by optimized machine learning models and modern infrastructure.",
                  },
                  {
                    icon: Users,
                    title: "Expert-Backed",
                    desc: "Our AI models are trained on medical data and validated by healthcare professionals.",
                  },
                ].map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400/10 to-green-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <item.icon className="w-6 h-6 text-green-400" />
                        <h4 className="text-white font-semibold">{item.title}</h4>
                      </div>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative text-center backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-3xl p-12 border border-green-500/20">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Healthcare Experience?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust Revaa for their healthcare needs. Start your journey today.
              </p>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="relative group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-md bg-black/20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>
              &copy; 2024 Revaa. All rights reserved. This platform is for informational purposes only and should not
              replace professional medical advice.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot */}
      {isAuthenticated && <FloatingChatbot />}
    </div>
  )
}
