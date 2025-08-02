"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, ArrowLeft, AlertTriangle, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService, type User as UserType } from "@/lib/auth-service"
import VoiceInput from "@/components/voice-input"
import LanguageSelector from "@/components/language-selector"
import { activityService } from "@/lib/activity-service"
import EnhancedParticlesBackground from "@/components/enhanced-particles-background"
import PermissionCheck from "@/components/permission-check"

interface SymptomResult {
  condition: string
  severity: "Low" | "Medium" | "High"
  confidence: number
  recommendations: string[]
  description: string
}

// Mock ML model for symptom analysis
const analyzeSymptoms = (symptoms: string, age: number, gender: string): SymptomResult => {
  const lowerSymptoms = symptoms.toLowerCase()

  // Simple keyword-based analysis (simulating ML model)
  if (lowerSymptoms.includes("fever") && lowerSymptoms.includes("cough") && lowerSymptoms.includes("fatigue")) {
    return {
      condition: "Viral Upper Respiratory Infection",
      severity: "Medium",
      confidence: 85,
      description:
        "A common viral infection affecting the upper respiratory tract, typically including the nose, throat, and sinuses.",
      recommendations: [
        "Get plenty of rest and stay hydrated",
        "Use over-the-counter pain relievers for comfort",
        "Consider throat lozenges or warm salt water gargles",
        "Monitor symptoms and consult a doctor if they worsen or persist beyond 7-10 days",
      ],
    }
  }

  if (lowerSymptoms.includes("headache") && lowerSymptoms.includes("nausea")) {
    return {
      condition: "Tension Headache or Migraine",
      severity: "Medium",
      confidence: 78,
      description: "A type of headache that can be caused by stress, dehydration, lack of sleep, or other triggers.",
      recommendations: [
        "Rest in a quiet, dark room",
        "Apply cold or warm compress to head or neck",
        "Stay hydrated and maintain regular meals",
        "Consider over-the-counter pain relievers like ibuprofen or acetaminophen",
        "Consult a healthcare provider if headaches are frequent or severe",
      ],
    }
  }

  if (lowerSymptoms.includes("stomach") && lowerSymptoms.includes("pain") && lowerSymptoms.includes("nausea")) {
    return {
      condition: "Gastroenteritis (Stomach Flu)",
      severity: "Medium",
      confidence: 82,
      description: "Inflammation of the stomach and intestines, commonly caused by viral or bacterial infections.",
      recommendations: [
        "Stay hydrated with clear fluids",
        "Follow the BRAT diet (bananas, rice, applesauce, toast)",
        "Avoid dairy, caffeine, and fatty foods",
        "Rest and avoid solid foods until nausea subsides",
        "Seek medical attention if symptoms persist or worsen",
      ],
    }
  }

  if (
    lowerSymptoms.includes("chest pain") ||
    lowerSymptoms.includes("difficulty breathing") ||
    lowerSymptoms.includes("shortness of breath")
  ) {
    return {
      condition: "Respiratory or Cardiac Concern",
      severity: "High",
      confidence: 90,
      description:
        "Chest pain and breathing difficulties can indicate serious conditions requiring immediate medical evaluation.",
      recommendations: [
        "Seek immediate medical attention or call emergency services",
        "Do not drive yourself to the hospital",
        "Avoid physical exertion",
        "If experiencing severe chest pain, call 911 immediately",
      ],
    }
  }

  if (
    lowerSymptoms.includes("runny nose") &&
    lowerSymptoms.includes("sneezing") &&
    lowerSymptoms.includes("congestion")
  ) {
    return {
      condition: "Common Cold or Allergic Rhinitis",
      severity: "Low",
      confidence: 88,
      description:
        "A mild viral infection or allergic reaction affecting the nasal passages and upper respiratory tract.",
      recommendations: [
        "Use saline nasal rinses to clear congestion",
        "Stay hydrated and get adequate rest",
        "Consider over-the-counter decongestants or antihistamines",
        "Use a humidifier to add moisture to the air",
        "Symptoms should improve within 7-10 days",
      ],
    }
  }

  // Default case for unrecognized symptoms
  return {
    condition: "General Health Concern",
    severity: "Medium",
    confidence: 65,
    description: "Based on the symptoms provided, a general health evaluation is recommended.",
    recommendations: [
      "Monitor your symptoms closely",
      "Stay hydrated and get adequate rest",
      "Consider over-the-counter remedies for comfort",
      "Consult with a healthcare provider for proper diagnosis",
      "Seek immediate medical attention if symptoms worsen significantly",
    ],
  }
}

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SymptomResult | null>(null)
  const [user, setUser] = useState<UserType | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
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
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    setIsLoading(true)
    setResult(null)

    // Add activity
    if (user) {
      activityService.addActivity(
        user.id,
        "symptom-checker",
        "Symptom Analysis",
        `Analyzed symptoms: "${symptoms.substring(0, 50)}${symptoms.length > 50 ? "..." : ""}"`,
      )
    }

    try {
      // Call the symptom-checker API with the mock dataset
      const token = authService.getToken()
      const symptomsArray = symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0)
      
      const response = await fetch("/api/symptom-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ 
          symptoms: symptomsArray, 
          age: Number.parseInt(age) || 25, 
          gender: gender,
          language: selectedLanguage 
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.diagnosis) {
        // Convert the API response to our expected format
        const analysisResult: SymptomResult = {
          condition: data.diagnosis.possibleConditions.length > 0 
            ? data.diagnosis.possibleConditions[0].disease.name 
            : "General Health Assessment",
          severity: data.diagnosis.urgency === "emergency" ? "High" :
                   data.diagnosis.urgency === "high" ? "High" :
                   data.diagnosis.urgency === "medium" ? "Medium" : "Low",
          confidence: data.diagnosis.possibleConditions.length > 0 
            ? Math.round(data.diagnosis.possibleConditions[0].probability * 100) 
            : 50,
          description: data.diagnosis.possibleConditions.length > 0 
            ? data.diagnosis.possibleConditions[0].disease.description 
            : "Based on the symptoms provided, here's a general health assessment.",
          recommendations: data.diagnosis.recommendedActions || data.diagnosis.recommendations || []
        }
        setResult(analysisResult)
      } else {
        throw new Error("Failed to analyze symptoms")
      }
    } catch (error) {
      console.error("Symptom analysis error:", error)
      // Fallback to local analysis if API fails
      const analysisResult = analyzeSymptoms(symptoms, Number.parseInt(age) || 25, gender)
      setResult(analysisResult)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceResult = (text: string) => {
    setSymptoms(text)
  }

  const handleSpeech = (text: string) => {
    // Handle speech feedback if needed
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "Medium":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case "High":
        return <AlertTriangle className="w-5 h-5 text-red-400" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Enhanced Particles Background */}
      <EnhancedParticlesBackground />
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-6 h-6 text-green-400" />
                <h1 className="text-xl font-bold text-white">Symptom Checker</h1>
              </div>
              <LanguageSelector value={selectedLanguage} onValueChange={setSelectedLanguage} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Describe Your Symptoms</CardTitle>
              <CardDescription className="text-gray-400">
                Provide detailed information about what you're experiencing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionCheck />
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="symptoms" className="text-white">
                      Symptoms
                    </Label>
                    <VoiceInput
                      onResult={handleVoiceResult}
                      onSpeech={handleSpeech}
                      language={selectedLanguage}
                      disabled={isLoading}
                    />
                  </div>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms in detail (e.g., headache, fever, nausea, fatigue...)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white">
                      Gender
                    </Label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={isLoading || !symptoms.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    "Analyze Symptoms"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Analysis Results</CardTitle>
              <CardDescription className="text-gray-400">
                AI-powered symptom analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result && !isLoading && (
                <div className="text-center py-12">
                  <Stethoscope className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Enter your symptoms to get an AI analysis</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-400">Analyzing your symptoms...</p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Condition */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Possible Condition</h3>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-xl font-bold text-white mb-2">{result.condition}</h4>
                      <p className="text-gray-300 text-sm">{result.description}</p>
                    </div>
                  </div>

                  {/* Severity */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Severity Assessment</h3>
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(result.severity)}
                      <Badge className={getSeverityColor(result.severity)}>{result.severity} Severity</Badge>
                      <span className="text-sm text-gray-400">{result.confidence}% confidence</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                    <div className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-gray-700/30 rounded-lg p-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-300 text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-yellow-400 font-semibold text-sm mb-1">Important Disclaimer</h4>
                        <p className="text-yellow-200 text-xs">
                          This analysis is for informational purposes only and should not replace professional medical
                          advice. Always consult with a healthcare provider for proper diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
