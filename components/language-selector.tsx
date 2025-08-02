"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SUPPORTED_LANGUAGES } from "@/lib/sarvam-api"
import { Languages } from "lucide-react"

interface LanguageSelectorProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export default function LanguageSelector({ value, onValueChange, className }: LanguageSelectorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Languages className="w-4 h-4 text-green-400" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-40 backdrop-blur-sm bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="backdrop-blur-xl bg-gray-900/90 border-gray-700">
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
            <SelectItem key={code} value={code} className="text-white hover:bg-green-500/20">
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
