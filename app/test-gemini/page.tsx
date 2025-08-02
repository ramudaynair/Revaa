"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestGemini() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testGemini = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Hello! Can you help me with a health question?"
        })
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gemini API Test</h1>
      <Button onClick={testGemini} disabled={loading}>
        {loading ? "Testing..." : "Test Gemini API"}
      </Button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {result}
        </pre>
      )}
    </div>
  )
}
