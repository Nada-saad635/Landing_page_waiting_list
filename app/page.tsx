"use client"

import { useState } from "react"
import { Header } from "./components/header"
import { HeroSection } from "./components/hero-section"
import { EssayTestWaitlistForm } from "./components/essaytest-waitlist-form"
import { ValuePropositions } from "./components/value-propositions"
import { Footer } from "./components/footer"
import { Toaster } from "@/components/ui/toaster"

const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
  }

  .font-arabic {
    font-family: 'Noto Sans Arabic', 'Arial', sans-serif;
  }
`

export default function Home() {
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [waitlistCount, setWaitlistCount] = useState(297)
  const [hasJoined, setHasJoined] = useState(false)

  const handleSuccess = (count: number) => {
    setWaitlistCount(count + 247)
    setHasJoined(true)
  }

  const handleLanguageChange = (newLanguage: "en" | "ar") => {
    setLanguage(newLanguage)
  }

  return (
    <main
      className={`min-h-screen ${language === "ar" ? "rtl" : "ltr"}`}
      style={{
        background: "radial-gradient(ellipse at top, #1e40af 0%, #3730a3 50%, #000000 100%)",
      }}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      <div className="content">
        <Header language={language} onLanguageChange={handleLanguageChange} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection language={language} />

          {/* Waitlist Form Section */}
          <section className="py-16 text-center">
            <div className="max-w-2xl mx-auto mb-12">
              <EssayTestWaitlistForm onSuccess={handleSuccess} language={language} />

              {/* Waitlist Counter - only show if user hasn't joined */}
              {!hasJoined && (
                <div className="mt-8 flex items-center justify-center space-x-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 border-2 border-white flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">S</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">A</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-white flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">M</span>
                    </div>
                  </div>
                  <p className={`text-white font-semibold ${language === "ar" ? "font-arabic" : ""}`}>
                    {waitlistCount}+ {language === "en" ? "UAE students already joined" : "طالب إماراتي انضم بالفعل"}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <ValuePropositions language={language} />
        <Footer language={language} />
      </div>

      <Toaster
        toastOptions={{
          style: {
            background: "rgb(23 23 23)",
            color: "white",
            border: "1px solid rgb(63 63 70)",
          },
          className: "rounded-xl",
          duration: 5000,
        }}
      />
    </main>
  )
}
