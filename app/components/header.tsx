"use client"

import { LanguageToggle } from "./language-toggle"

interface HeaderProps {
  language: "en" | "ar"
  onLanguageChange: (language: "en" | "ar") => void
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  const content = {
    en: {
      logo: "EssayTest",
      tagline: "Smart Learning for UAE Students",
    },
    ar: {
      logo: "إيساي تست",
      tagline: "التعلم الذكي لطلاب الإمارات",
    },
  }

  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className={`flex items-center space-x-3 ${language === "ar" ? "flex-row-reverse space-x-reverse" : ""}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{content[language].logo}</h1>
            <p className="text-sm text-blue-200">{content[language].tagline}</p>
          </div>
        </div>
        <LanguageToggle currentLanguage={language} onLanguageChange={onLanguageChange} />
      </div>
    </header>
  )
}
