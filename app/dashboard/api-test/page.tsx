"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function APITestPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<any>({})

  const testAPI = async (endpoint: string, body: any) => {
    setLoading(prev => ({ ...prev, [endpoint]: true }))
    try {
      console.log(`Testing ${endpoint} with body:`, body)
      
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No authorization header - testing without auth
        },
        body: JSON.stringify(body),
      })

      console.log(`${endpoint} response status:`, response.status)
      console.log(`${endpoint} response headers:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`${endpoint} error response:`, errorText)
        throw new Error(`${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log(`${endpoint} response data:`, data)
      
      setResults(prev => ({ ...prev, [endpoint]: { success: true, data } }))
    } catch (error) {
      console.error(`${endpoint} error:`, error)
      setResults(prev => ({ 
        ...prev, 
        [endpoint]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }))
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          API Test (No Authentication)
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Chatbot Test */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Chatbot API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => testAPI('chatbot', { 
                  message: "Tell me about Paracetamol", 
                  language: "en" 
                })}
                disabled={loading.chatbot}
                className="w-full"
              >
                {loading.chatbot ? "Testing..." : "Test Chatbot"}
              </Button>
              
              {results.chatbot && (
                <div className="p-3 bg-gray-700 rounded text-sm">
                  {results.chatbot.success ? (
                    <div>
                      <p className="text-green-400 mb-2">✅ Success</p>
                      <p className="text-gray-300">{results.chatbot.data.response?.substring(0, 100)}...</p>
                    </div>
                  ) : (
                    <p className="text-red-400">❌ {results.chatbot.error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drug Info Test */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Drug Info API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => testAPI('drug-info', { 
                  query: "Paracetamol", 
                  language: "en" 
                })}
                disabled={loading['drug-info']}
                className="w-full"
              >
                {loading['drug-info'] ? "Testing..." : "Test Drug Info"}
              </Button>
              
              {results['drug-info'] && (
                <div className="p-3 bg-gray-700 rounded text-sm">
                  {results['drug-info'].success ? (
                    <div>
                      <p className="text-green-400 mb-2">✅ Success</p>
                      <p className="text-gray-300">Found {results['drug-info'].data.totalResults} medicines</p>
                    </div>
                  ) : (
                    <p className="text-red-400">❌ {results['drug-info'].error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Symptom Checker Test */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Symptom Checker API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => testAPI('symptom-checker', { 
                  symptoms: ["headache", "fever"], 
                  age: 30, 
                  gender: "female",
                  language: "en" 
                })}
                disabled={loading['symptom-checker']}
                className="w-full"
              >
                {loading['symptom-checker'] ? "Testing..." : "Test Symptom Checker"}
              </Button>
              
              {results['symptom-checker'] && (
                <div className="p-3 bg-gray-700 rounded text-sm">
                  {results['symptom-checker'].success ? (
                    <div>
                      <p className="text-green-400 mb-2">✅ Success</p>
                      <p className="text-gray-300">Urgency: {results['symptom-checker'].data.diagnosis?.urgency}</p>
                    </div>
                  ) : (
                    <p className="text-red-400">❌ {results['symptom-checker'].error}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => {
              testAPI('chatbot', { message: "Tell me about Paracetamol", language: "en" })
              testAPI('drug-info', { query: "Paracetamol", language: "en" })
              testAPI('symptom-checker', { symptoms: ["headache", "fever"], age: 30, gender: "female", language: "en" })
            }}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Test All APIs (No Auth)
          </Button>
        </div>

        {/* Raw Results */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Raw Results (Check Console)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-gray-300 overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
