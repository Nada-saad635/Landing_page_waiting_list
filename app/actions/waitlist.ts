"use server"

import { z } from "zod"
import { Resend } from "resend"
import EmailTemplate from "../components/email-template"
import { safeRedisSet, safeRedisCount } from "../lib/redis"

const schema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function joinWaitlist(prevState: any, formData: FormData) {
  try {
    // Use optional chaining for Resend to prevent errors if API key is missing
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
    const email = formData.get("email")

    if (!email) {
      return { success: false, message: "Email is required" }
    }

    const result = schema.safeParse({ email })

    if (!result.success) {
      return { success: false, message: result.error.errors[0].message }
    }

    // Store email in Redis with error handling
    await safeRedisSet("waitlist_emails", email.toString())

    // Only send email if Resend is configured
    if (resend) {
      try {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: email.toString(),
          subject: "Welcome to Our Waitlist!",
          html: EmailTemplate({ email: email.toString() }),
        })
      } catch (emailError) {
        console.error("Error sending email:", emailError)
        // Continue execution even if email fails
      }
    }

    const count = await getWaitlistCount()

    return {
      success: true,
      message: "You have been added to the waitlist! Check your email for confirmation.",
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

export async function getWaitlistCount() {
  try {
    const count = await safeRedisCount("waitlist_emails")
    return count
  } catch (error) {
    console.error("Error getting count:", error)
    return 0
  }
}
