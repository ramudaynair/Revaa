"use client"

import { useState, useEffect } from "react"
import { activityService } from "@/lib/activity-service"

interface LiveStatsProps {
  userId: number
  onStatsUpdate?: (stats: any) => void
}

export default function LiveStats({ userId, onStatsUpdate }: LiveStatsProps) {
  const [stats, setStats] = useState({ totalConsultations: 0, symptomsChecked: 0, drugQueries: 0 })

  useEffect(() => {
    const updateStats = () => {
      const newStats = activityService.getUserStats(userId)
      setStats(newStats)
      onStatsUpdate?.(newStats)
    }
    updateStats()

    const interval = setInterval(updateStats, 1000) 

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "revaa_activities") {
        updateStats()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [userId, onStatsUpdate])

  return null // This is a utility component that doesn't render anything
}
