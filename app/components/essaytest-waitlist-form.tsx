"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { joinEssayTestWaitlist } from "../actions/essaytest-waitlist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Mail, GraduationCap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EssayTestWaitlistFormProps {
  onSuccess: (count: number) => void
  language: "en" | "ar"
}

const uaeUniversities = [
  "American University of Sharjah (AUS)",
  "United Arab Emirates University (UAEU)",
  "American University of Dubai (AUD)",
  "University of Dubai (UD)",
  "Zayed University (ZU)",
  "Khalifa University (KU)",
  "Abu Dhabi University (ADU)",
  "Ajman University (AU)",
  "University of Sharjah (UOS)",
  "Al Ghurair University (AGU)",
  "Other",
]

export function EssayTestWaitlistForm({ onSuccess, language }: EssayTestWaitlistFormProps) {
  const [state, formAction, isPending] = useActionState(joinEssayTestWaitlist, null)
  const [email, setEmail] = useState("")
  const [university, setUniversity] = useState("")
  const { toast } = useToast()

  const content = {
    en: {
      emailPlaceholder: "Enter your university email",
      universityPlaceholder: "Select your university",
      submitButton: "Get Early Access", // Changed from "Join Waitlist"
      submittingButton: "Joining...",
      emailLabel: "Email Address",
      universityLabel: "University",
      preferredNote: ".ac.ae emails get priority access",
    },
    ar: {
      emailPlaceholder: "أدخل بريدك الجامعي الإلكتروني",
      universityPlaceholder: "اختر جامعتك",
      submitButton: "كن أول من يصل", // Changed from "انضم لقائمة الانتظار"
      submittingButton: "جاري الانضمام...",
      emailLabel: "البريد الإلكتروني",
      universityLabel: "الجامعة",
      preferredNote: "البريد الإلكتروني .ac.ae يحصل على وصول أولوي",
    },
  }

  useEffect(() => {
    if (state?.success) {
      toast({
        title: language === "en" ? "Success!" : "نجح!",
        description: state.message,
        duration: 5000,
      })
      if (state.count) {
        onSuccess(state.count)
      }
      setEmail("")
      setUniversity("")
    } else if (state?.success === false) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: state.message,
        variant: "destructive",
        duration: 5000,
      })
    }
  }, [state, toast, onSuccess, language])

  const handleSubmit = async (formData: FormData) => {
    formData.set("university", university)
    await formAction(formData)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className={`text-sm font-medium text-white flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <Mail className="w-4 h-4" />
              {content[language].emailLabel}
            </label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={content[language].emailPlaceholder}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl h-12"
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            </div>
            <p className={`text-xs text-blue-200 ${language === "ar" ? "text-right" : "text-left"}`}>
              {content[language].preferredNote}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="university"
              className={`text-sm font-medium text-white flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <GraduationCap className="w-4 h-4" />
              {content[language].universityLabel}
            </label>
            <Select value={university} onValueChange={setUniversity} required>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:border-white/40 focus:ring-white/20 rounded-xl h-12">
                <SelectValue placeholder={content[language].universityPlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {uaeUniversities.map((uni) => (
                  <SelectItem key={uni} value={uni} className="text-gray-900">
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || !email || !university}
          className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none h-12"
        >
          {isPending ? (
            <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <Loader2 className="h-5 w-5 animate-spin" />
              {content[language].submittingButton}
            </div>
          ) : (
            content[language].submitButton
          )}
        </Button>
      </form>
    </div>
  )
}
