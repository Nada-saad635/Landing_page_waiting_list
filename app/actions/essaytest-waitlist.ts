"use server"

import { z } from "zod"

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

    // Log the submission (in production this would store in database)
    console.log("Waitlist submission:", {
      email: emailStr,
      university: university.toString(),
      timestamp: new Date().toISOString(),
    })

    // Simulate getting count
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
  // Return a static count for now
  return 297
}
