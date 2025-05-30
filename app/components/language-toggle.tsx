"use client"
import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  currentLanguage: "en" | "ar"
  onLanguageChange: (language: "en" | "ar") => void
}

export function LanguageToggle({ currentLanguage, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
      <Button
        variant={currentLanguage === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("en")}
        className={`text-xs px-3 py-1 ${
          currentLanguage === "en" ? "bg-white text-blue-600 hover:bg-white/90" : "text-white hover:bg-white/20"
        }`}
      >
        EN
      </Button>
      <Button
        variant={currentLanguage === "ar" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("ar")}
        className={`text-xs px-3 py-1 ${
          currentLanguage === "ar" ? "bg-white text-blue-600 hover:bg-white/90" : "text-white hover:bg-white/20"
        }`}
      >
        عربي
      </Button>
    </div>
  )
}
