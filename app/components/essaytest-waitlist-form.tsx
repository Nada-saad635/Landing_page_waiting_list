"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { joinEssayTestWaitlist } from "../actions/essaytest-waitlist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Mail, GraduationCap, CheckCircle, AlertCircle, User } from "lucide-react"
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
  const [name, setName] = useState("")
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()

  const content = {
    en: {
      emailPlaceholder: "Enter your university email",
      universityPlaceholder: "Select your university",
      namePlaceholder: "Enter your full name",
      submitButton: "Be First - Get Early Access",
      submittingButton: "Verifying & Adding...",
      emailLabel: "Email Address",
      universityLabel: "University",
      nameLabel: "Full Name",
      preferredNote: ".ac.ae emails get priority access",
      emailValidating: "Checking email...",
      emailValid: "Email looks good!",
      emailInvalid: "Please enter a valid email",
    },
    ar: {
      emailPlaceholder: "أدخل بريدك الجامعي الإلكتروني",
      universityPlaceholder: "اختر جامعتك",
      namePlaceholder: "أدخل اسمك الكامل",
      submitButton: "كن الأول - احصل على وصول مبكر",
      submittingButton: "جاري التحقق والإضافة...",
      emailLabel: "البريد الإلكتروني",
      universityLabel: "الجامعة",
      nameLabel: "الاسم الكامل",
      preferredNote: "البريد الإلكتروني .ac.ae يحصل على وصول أولوي",
      emailValidating: "جاري فحص البريد الإلكتروني...",
      emailValid: "البريد الإلكتروني صحيح!",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح",
    },
  }

  // Real-time email validation
  useEffect(() => {
    if (email.length === 0) {
      setEmailValid(null)
      return
    }

    const timeoutId = setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isValid = emailRegex.test(email.toLowerCase().trim())
      setEmailValid(isValid)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [email])

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true)
      toast({
        title: language === "en" ? "🎉 Success!" : "🎉 نجح!",
        description: state.message,
        duration: 8000,
      })
      if (state.count) {
        onSuccess(state.count)
      }

      // Add celebration effect
      setTimeout(() => {
        setEmail("")
        setUniversity("")
        setName("")
        setEmailValid(null)
      }, 2000)
    } else if (state?.success === false) {
      toast({
        title: language === "en" ? "❌ Error" : "❌ خطأ",
        description: state.message,
        variant: "destructive",
        duration: 6000,
      })
    }
  }, [state, toast, onSuccess, language])

  const handleSubmit = async (formData: FormData) => {
    formData.set("university", university)
    formData.set("name", name)
    await formAction(formData)
  }

  const getEmailIcon = () => {
    if (emailValid === null) return <Mail className="w-4 h-4" />
    if (emailValid) return <CheckCircle className="w-4 h-4 text-green-500" />
    return <AlertCircle className="w-4 h-4 text-red-500" />
  }

  const getEmailBorderColor = () => {
    if (emailValid === null) return "border-white/20"
    if (emailValid) return "border-green-500/50"
    return "border-red-500/50"
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-center animate-pulse">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-100 font-semibold">
            {language === "en" ? "Welcome to PastToPass!" : "مرحباً بك في باست تو باس!"}
          </p>
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className={`text-sm font-medium text-white flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <User className="w-4 h-4" />
              {content[language].nameLabel}
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={content[language].namePlaceholder}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl h-12"
              dir={language === "ar" ? "rtl" : "ltr"}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className={`text-sm font-medium text-white flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              {getEmailIcon()}
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
                className={`w-full bg-white/10 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl h-12 transition-all duration-300 ${getEmailBorderColor()}`}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              {email.length > 0 && emailValid !== null && (
                <div className={`absolute right-3 top-3 ${language === "ar" ? "left-3 right-auto" : ""}`}>
                  {emailValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-xs text-blue-200 ${language === "ar" ? "text-right" : "text-left"}`}>
                {content[language].preferredNote}
              </p>
              {email.length > 0 && (
                <p className={`text-xs ${emailValid ? "text-green-400" : "text-red-400"}`}>
                  {emailValid ? content[language].emailValid : content[language].emailInvalid}
                </p>
              )}
            </div>
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
          disabled={isPending || !email || !university || !name || emailValid === false}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none disabled:opacity-50 h-12 shadow-lg"
        >
          {isPending ? (
            <div className={`flex items-center gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}>
              <Loader2 className="h-5 w-5 animate-spin" />
              {content[language].submittingButton}
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center">
              <Mail className="w-4 h-4" />
              {content[language].submitButton}
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
