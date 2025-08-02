"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pill, Stethoscope, MessageCircle, TestTube } from "lucide-react"

export default function DatasetTestPage() {
  const [chatbotResult, setChatbotResult] = useState<any>(null)
  const [drugResult, setDrugResult] = useState<any>(null)
  const [symptomResult, setSymptomResult] = useState<any>(null)
  const [loading, setLoading] = useState({ chatbot: false, drug: false, symptom: false })

  // Test Chatbot with dataset integration
  const testChatbot = async () => {
    setLoading(prev => ({ ...prev, chatbot: true }))
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: "Tell me about Paracetamol and headaches", 
          language: "en" 
        }),
      })
      const data = await response.json()
      setChatbotResult(data)
    } catch (error) {
      setChatbotResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(prev => ({ ...prev, chatbot: false }))
    }
  }

  // Test Drug Info with mock dataset
  const testDrugInfo = async () => {
    setLoading(prev => ({ ...prev, drug: true }))
    try {
      const response = await fetch("/api/drug-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: "Paracetamol", 
          language: "en" 
        }),
      })
      const data = await response.json()
      setDrugResult(data)
    } catch (error) {
      setDrugResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(prev => ({ ...prev, drug: false }))
    }
  }

  // Test Symptom Checker with mock dataset
  const testSymptomChecker = async () => {
    setLoading(prev => ({ ...prev, symptom: true }))
    try {
      const response = await fetch("/api/symptom-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          symptoms: ["headache", "fever", "fatigue"], 
          age: 30, 
          gender: "female",
          language: "en" 
        }),
      })
      const data = await response.json()
      setSymptomResult(data)
    } catch (error) {
      setSymptomResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(prev => ({ ...prev, symptom: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Mock Dataset Integration Test
        </h1>

        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="chatbot" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chatbot
            </TabsTrigger>
            <TabsTrigger value="drug-info" className="flex items-center">
              <Pill className="w-4 h-4 mr-2" />
              Drug Info
            </TabsTrigger>
            <TabsTrigger value="symptom-checker" className="flex items-center">
              <Stethoscope className="w-4 h-4 mr-2" />
              Symptom Checker
            </TabsTrigger>
          </TabsList>

          {/* Chatbot Test */}
          <TabsContent value="chatbot">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
                  Chatbot Dataset Integration Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={testChatbot} 
                    disabled={loading.chatbot}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading.chatbot ? "Testing..." : "Test Chatbot with 'Paracetamol and headaches'"}
                  </Button>
                  <Badge variant="outline" className="text-gray-300">
                    Tests: Medicine dataset + Gemini integration
                  </Badge>
                </div>

                {chatbotResult && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Chatbot Response:</h4>
                    {chatbotResult.error ? (
                      <p className="text-red-400">Error: {chatbotResult.error}</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-green-400">✅ Success: {chatbotResult.success}</p>
                        <div className="text-gray-300 bg-gray-800 p-3 rounded">
                          {chatbotResult.response}
                        </div>
                        <p className="text-sm text-gray-400">Language: {chatbotResult.language}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drug Info Test */}
          <TabsContent value="drug-info">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-green-400" />
                  Drug Information Dataset Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={testDrugInfo} 
                    disabled={loading.drug}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading.drug ? "Testing..." : "Test Drug Search for 'Paracetamol'"}
                  </Button>
                  <Badge variant="outline" className="text-gray-300">
                    Tests: Medicine dataset search functionality
                  </Badge>
                </div>

                {drugResult && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Drug Search Results:</h4>
                    {drugResult.error ? (
                      <p className="text-red-400">Error: {drugResult.error}</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-green-400">✅ Success: {drugResult.success}</p>
                        <p className="text-gray-300">Total Results: {drugResult.totalResults}</p>
                        {drugResult.medicines && drugResult.medicines.length > 0 && (
                          <div className="bg-gray-800 p-3 rounded">
                            <h5 className="text-white font-medium mb-2">{drugResult.medicines[0].name}</h5>
                            <p className="text-gray-300 text-sm mb-2">{drugResult.medicines[0].description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">{drugResult.medicines[0].category}</Badge>
                              <Badge variant="outline">{drugResult.medicines[0].form}</Badge>
                              <Badge variant="outline">{drugResult.medicines[0].strength}</Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Symptom Checker Test */}
          <TabsContent value="symptom-checker">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-purple-400" />
                  Symptom Checker Dataset Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={testSymptomChecker} 
                    disabled={loading.symptom}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {loading.symptom ? "Testing..." : "Test Symptoms: headache, fever, fatigue"}
                  </Button>
                  <Badge variant="outline" className="text-gray-300">
                    Tests: Symptom & disease dataset analysis
                  </Badge>
                </div>

                {symptomResult && (
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Symptom Analysis Results:</h4>
                    {symptomResult.error ? (
                      <p className="text-red-400">Error: {symptomResult.error}</p>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-green-400">✅ Success: {symptomResult.success}</p>
                        {symptomResult.diagnosis && (
                          <div className="bg-gray-800 p-3 rounded space-y-2">
                            <div>
                              <h5 className="text-white font-medium">Urgency Level:</h5>
                              <Badge variant={
                                symptomResult.diagnosis.urgency === "high" || symptomResult.diagnosis.urgency === "emergency" 
                                  ? "destructive" 
                                  : symptomResult.diagnosis.urgency === "medium" 
                                  ? "default" 
                                  : "secondary"
                              }>
                                {symptomResult.diagnosis.urgency}
                              </Badge>
                            </div>

                            {symptomResult.diagnosis.possibleConditions && symptomResult.diagnosis.possibleConditions.length > 0 && (
                              <div>
                                <h5 className="text-white font-medium mb-2">Possible Conditions:</h5>
                                {symptomResult.diagnosis.possibleConditions.slice(0, 3).map((condition: any, index: number) => (
                                  <div key={index} className="bg-gray-900 p-2 rounded mb-2">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-gray-200">{condition.disease.name}</span>
                                      <Badge variant="outline">{Math.round(condition.probability * 100)}% match</Badge>
                                    </div>
                                    <p className="text-gray-400 text-sm">{condition.disease.description}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {symptomResult.diagnosis.recommendedActions && (
                              <div>
                                <h5 className="text-white font-medium mb-2">Recommended Actions:</h5>
                                <ul className="text-gray-300 text-sm space-y-1">
                                  {symptomResult.diagnosis.recommendedActions.map((action: string, index: number) => (
                                    <li key={index} className="flex items-start">
                                      <span className="text-purple-400 mr-2">•</span>
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Test All Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => {
              testChatbot()
              testDrugInfo()
              testSymptomChecker()
            }}
            className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 hover:from-blue-700 hover:via-green-700 hover:to-purple-700"
            size="lg"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Test All Datasets
          </Button>
        </div>
      </div>
    </div>
  )
}
