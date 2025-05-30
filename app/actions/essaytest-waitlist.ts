"use server"

import { z } from "zod"

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

const schema = z.object({
  email: z.string().email("Invalid email address"),
  university: z.string().min(1, "Please select your university"),
})

export async function joinEssayTestWaitlist(prevState: any, formData: FormData) {
  try {
    // Simulate API delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const email = formData.get("email")
    const university = formData.get("university")

    if (!email || !university) {
      return { success: false, message: "Email and university are required" }
    }

    const result = schema.safeParse({ email, university })

    if (!result.success) {
      return { success: false, message: result.error.errors[0].message }
    }

    const emailStr = email.toString()
    const isUAEUniversityEmail = emailStr.endsWith(".ac.ae")

    // Simulate storing data (in production this would use Redis)
    console.log("Storing waitlist data:", { email: emailStr, university: university.toString() })

    // Simulate email sending (in production this would use Resend)
    console.log("Sending welcome email to:", emailStr)

    // Simulate getting count (in production this would be from Redis)
    const count = Math.floor(Math.random() * 50) + 250

    return {
      success: true,
      message: isUAEUniversityEmail
        ? "Welcome! You've been added to our priority list as a UAE university student."
        : "You've been added to the waitlist! Check your email for confirmation.",
      count,
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function getEssayTestWaitlistCount() {
  // Simulate getting count from database
  return Math.floor(Math.random() * 50) + 250
}

export { uaeUniversities }
