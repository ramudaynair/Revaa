"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, AlertTriangle, CheckCircle } from "lucide-react"

interface PermissionCheckProps {
  onPermissionGranted?: () => void
}

export default function PermissionCheck({ onPermissionGranted }: PermissionCheckProps) {
  const [permissionStatus, setPermissionStatus] = useState<"unknown" | "granted" | "denied" | "checking">("unknown")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    checkInitialPermission()
  }, [])

  const checkInitialPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionStatus("denied")
        return
      }

      // Check if permission was previously granted
      const permission = await navigator.permissions.query({ name: "microphone" as PermissionName })

      if (permission.state === "granted") {
        setPermissionStatus("granted")
        onPermissionGranted?.()
      } else if (permission.state === "denied") {
        setPermissionStatus("denied")
        setIsVisible(true)
      } else {
        setPermissionStatus("unknown")
      }
    } catch (error) {
      console.warn("Permission check failed:", error)
      setPermissionStatus("unknown")
    }
  }

  const requestPermission = async () => {
    setPermissionStatus("checking")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Permission granted, stop the stream
      stream.getTracks().forEach((track) => track.stop())

      setPermissionStatus("granted")
      setIsVisible(false)
      onPermissionGranted?.()
    } catch (error) {
      console.error("Permission request failed:", error)
      setPermissionStatus("denied")
      setIsVisible(true)
    }
  }

  if (!isVisible && permissionStatus !== "denied") {
    return null
  }

  return (
    <Card className="bg-yellow-500/10 border-yellow-500/30 mb-4">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center space-x-2">
          {permissionStatus === "granted" ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span>Microphone Permission</span>
        </CardTitle>
        <CardDescription className="text-yellow-200">
          {permissionStatus === "granted"
            ? "Microphone access granted. You can now use voice features."
            : "Voice input requires microphone access to work properly."}
        </CardDescription>
      </CardHeader>
      {permissionStatus !== "granted" && (
        <CardContent>
          <Button
            onClick={requestPermission}
            disabled={permissionStatus === "checking"}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Mic className="w-4 h-4 mr-2" />
            {permissionStatus === "checking" ? "Requesting Permission..." : "Allow Microphone Access"}
          </Button>

          {permissionStatus === "denied" && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm">
                <strong>Permission Denied:</strong> To use voice features, please:
              </p>
              <ul className="text-red-200 text-sm mt-2 ml-4 list-disc">
                <li>Click the microphone icon in your browser's address bar</li>
                <li>Select "Always allow" for microphone access</li>
                <li>Refresh the page and try again</li>
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
