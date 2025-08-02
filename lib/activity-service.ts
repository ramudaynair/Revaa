// Activity tracking service for user interactions

export interface Activity {
  id: string
  userId: number
  type: "chatbot" | "symptom-checker" | "drug-info"
  title: string
  description: string
  timestamp: Date
  data?: any
}

export interface UserStats {
  totalConsultations: number
  symptomsChecked: number
  drugQueries: number
}

const ACTIVITIES_KEY = "revaa_activities"

class ActivityService {
  // Get activities for a specific user
  getUserActivities(userId: number): Activity[] {
    if (typeof window === "undefined") return []

    try {
      const activities = localStorage.getItem(ACTIVITIES_KEY)
      const allActivities: Activity[] = activities ? JSON.parse(activities) : []
      return allActivities
        .filter((activity) => activity.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10) // Get last 10 activities
    } catch (error) {
      console.error("Error reading activities:", error)
      return []
    }
  }

  // Add new activity
  addActivity(userId: number, type: Activity["type"], title: string, description: string, data?: any): void {
    if (typeof window === "undefined") return

    try {
      const activities = localStorage.getItem(ACTIVITIES_KEY)
      const allActivities: Activity[] = activities ? JSON.parse(activities) : []

      const newActivity: Activity = {
        id: Date.now().toString(),
        userId,
        type,
        title,
        description,
        timestamp: new Date(),
        data,
      }

      allActivities.push(newActivity)
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(allActivities))
    } catch (error) {
      console.error("Error saving activity:", error)
    }
  }

  // Get user statistics
  getUserStats(userId: number): UserStats {
    const activities = this.getUserActivities(userId)

    return {
      totalConsultations: activities.filter((a) => a.type === "chatbot").length,
      symptomsChecked: activities.filter((a) => a.type === "symptom-checker").length,
      drugQueries: activities.filter((a) => a.type === "drug-info").length,
    }
  }

  // Clear all activities for a user
  clearUserActivities(userId: number): void {
    if (typeof window === "undefined") return

    try {
      const activities = localStorage.getItem(ACTIVITIES_KEY)
      const allActivities: Activity[] = activities ? JSON.parse(activities) : []
      const filteredActivities = allActivities.filter((activity) => activity.userId !== userId)
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filteredActivities))
    } catch (error) {
      console.error("Error clearing activities:", error)
    }
  }
}

export const activityService = new ActivityService()
