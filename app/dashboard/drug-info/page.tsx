"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Pill, ArrowLeft, Search, AlertTriangle, Info, Clock, Loader2, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService, type User as UserType } from "@/lib/auth-service"
import VoiceInput from "@/components/voice-input"
import LanguageSelector from "@/components/language-selector"
import { activityService } from "@/lib/activity-service"
import EnhancedParticlesBackground from "@/components/enhanced-particles-background"
import PermissionCheck from "@/components/permission-check"

interface DrugInfo {
  id: string
  name: string
  genericName: string
  category: string
  description: string
  uses: string[]
  dosage: {
    adult: string
    child: string
    elderly: string
  }
  sideEffects: string[]
  contraindications: string[]
  interactions: string[]
  precautions: string[]
  form: string
  strength: string
  manufacturer: string
  price: {
    min: number
    max: number
    currency: string
  }
  prescription: boolean
  schedule: string
}

export default function DrugInfoPage() {
  const [drugName, setDrugName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<DrugInfo[]>([])
  const [selectedDrug, setSelectedDrug] = useState<DrugInfo | null>(null)
  const [user, setUser] = useState<UserType | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("en")

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

  const searchDrugs = async (query: string) => {
    if (!user) return

    try {
      const token = authService.getToken()

      console.log("Making API request with query:", query)

      const response = await fetch("/api/drug-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ query: query, language: selectedLanguage }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.error("Non-JSON response:", responseText)
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()
      console.log("API Response data:", data)

      return data
    } catch (error) {
      console.error("Drug search error:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!drugName.trim()) return

    setIsLoading(true)
    setResults([])
    setSelectedDrug(null)
    setError("")

    // Add activity
    if (user) {
      activityService.addActivity(user.id, "drug-info", "Drug Information Search", `Searched for: "${drugName}"`)
    }

    try {
      const data = await searchDrugs(drugName.trim())

      if (data.success && data.medicines && data.medicines.length > 0) {
        setResults(data.medicines)
        setSelectedDrug(data.medicines[0]) // Auto-select best match
      } else if (data.medicines && data.medicines.length === 0) {
        setError("No matching drugs found. Please check the spelling or try a different name.")
      } else {
        setError("No matching drugs found. Please try a different search term.")
      }
    } catch (error) {
      console.error("Search error:", error)
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setError("Network error. Please check your connection and try again.")
        } else if (error.message.includes("JSON")) {
          setError("Server error. Please try again later.")
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceResult = (text: string) => {
    setDrugName(text)
  }

  const handleSpeech = (text: string) => {
    // Handle speech feedback if needed
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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Pill className="w-6 h-6 text-green-400" />
                <h1 className="text-xl font-bold text-white">Drug Information</h1>
              </div>
              <LanguageSelector value={selectedLanguage} onValueChange={setSelectedLanguage} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Search Section */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Search Drug Information</CardTitle>
            <CardDescription className="text-gray-400">
              Enter a drug name to get detailed information, dosage, and interactions from our comprehensive database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PermissionCheck />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <VoiceInput
                  onResult={handleVoiceResult}
                  onSpeech={handleSpeech}
                  language={selectedLanguage}
                  disabled={isLoading}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="drugName" className="text-white sr-only">
                    Drug Name
                  </Label>
                  <Input
                    id="drugName"
                    placeholder="Enter drug name (e.g., Ibuprofen, Aspirin, Metformin...)"
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={isLoading || !drugName.trim()}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-400 font-semibold text-sm mb-1">Search Error</h4>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="text-center py-12">
              <Loader2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-white mb-2">Searching Drug Database</h3>
              <p className="text-gray-400">Finding the best matches for your query...</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Search Results Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Search Results</CardTitle>
                  <CardDescription className="text-gray-400">
                    Found {results.length} match{results.length !== 1 ? "es" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {results.map((drug) => (
                    <div
                      key={drug.id}
                      onClick={() => setSelectedDrug(drug)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedDrug?.id === drug.id
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-gray-700/30 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium text-sm">{drug.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-gray-400">{drug.form}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs">{drug.genericName}</p>
                      <Badge className="mt-1 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {drug.category}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Selected Drug Details */}
            <div className="lg:col-span-3">
              {selectedDrug && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{selectedDrug.name}</CardTitle>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {selectedDrug.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-400">Generic: {selectedDrug.genericName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Form and Strength */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Form & Strength</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {selectedDrug.form} - {selectedDrug.strength}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {selectedDrug.prescription ? 'Prescription Required' : 'Over-the-Counter'}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                          <Info className="w-5 h-5 mr-2 text-green-400" />
                          Description
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{selectedDrug.description}</p>
                      </div>

                      {/* Uses */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Used For</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedDrug.uses.map((use, index) => (
                            <Badge key={index} className="bg-green-500/20 text-green-400 border-green-500/30">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Dosage */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-green-400" />
                          Dosage Information
                        </h3>
                        <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                          <div><span className="text-white font-medium">Adult:</span> <span className="text-gray-300">{selectedDrug.dosage.adult}</span></div>
                          <div><span className="text-white font-medium">Child:</span> <span className="text-gray-300">{selectedDrug.dosage.child}</span></div>
                          <div><span className="text-white font-medium">Elderly:</span> <span className="text-gray-300">{selectedDrug.dosage.elderly}</span></div>
                        </div>
                      </div>

                      {/* Manufacturer & Price */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Product Details</h3>
                        <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                          <div><span className="text-white font-medium">Manufacturer:</span> <span className="text-gray-300">{selectedDrug.manufacturer}</span></div>
                          <div><span className="text-white font-medium">Price Range:</span> <span className="text-gray-300">{selectedDrug.price.currency} {selectedDrug.price.min} - {selectedDrug.price.max}</span></div>
                          <div><span className="text-white font-medium">Schedule:</span> <span className="text-gray-300">{selectedDrug.schedule}</span></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Safety Information */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Safety Information</CardTitle>
                      <CardDescription className="text-gray-400">
                        Important safety considerations and interactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Side Effects */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Common Side Effects</h3>
                        <div className="space-y-2">
                          {selectedDrug.sideEffects.map((effect, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-gray-700/30 rounded-lg p-3">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-2"></div>
                              <p className="text-gray-300 text-sm">{effect}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Drug Interactions */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Drug Interactions</h3>
                        <div className="space-y-2">
                          {selectedDrug.interactions.map((interaction, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                            >
                              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                              <p className="text-red-200 text-sm">{interaction}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Precautions */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Important Precautions</h3>
                        <div className="space-y-2">
                          {selectedDrug.precautions.map((precaution, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3"
                            >
                              <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                              <p className="text-orange-200 text-sm">{precaution}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contraindications */}
                      {selectedDrug.contraindications.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Contraindications</h3>
                          <div className="space-y-2">
                            {selectedDrug.contraindications.map((contraindication, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                              >
                                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-200 text-sm">{contraindication}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && results.length === 0 && !error && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="text-center py-12">
              <Pill className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Search for Drug Information</h3>
              <p className="text-gray-400">
                Enter a drug name above to get detailed information and recommendations from our comprehensive database
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <p>Try searching for: Ibuprofen, Aspirin, Metformin, Lisinopril, Amoxicillin</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        {selectedDrug && (
          <Card className="bg-yellow-500/10 border-yellow-500/30 mt-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-2">Medical Disclaimer</h3>
                  <p className="text-yellow-200 text-sm leading-relaxed">
                    This information is for educational purposes only and should not replace professional medical
                    advice. Always consult with your healthcare provider or pharmacist before starting, stopping, or
                    changing any medication. Drug interactions and side effects can vary based on individual health
                    conditions and other medications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
