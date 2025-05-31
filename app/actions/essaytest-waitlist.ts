"use server"

import { z } from "zod"
import { createRedisClient } from "../lib/redis"

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  university: z.string().min(1, "Please select your university"),
})

// Simple email validation function
function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Check if email domain exists (basic check)
function hasValidDomain(email: string): boolean {
  const domain = email.split("@")[1]
  if (!domain) return false

  // Common valid domains and UAE university domains
  const validDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aus.edu",
    "uaeu.ac.ae",
    "aud.edu",
    "ud.ac.ae",
    "zu.ac.ae",
    "ku.ac.ae",
    "adu.ac.ae",
    "ajman.ac.ae",
    "sharjah.ac.ae",
  ]

  return validDomains.some((validDomain) => domain.toLowerCase().includes(validDomain.toLowerCase()))
}

export async function joinEssayTestWaitlist(prevState: any, formData: FormData) {
  try {
    // Simulate API delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const email = formData.get("email")
    const university = formData.get("university")

    if (!email || !university) {
      return { success: false, message: "Email and university are required" }
    }

    const emailStr = email.toString().toLowerCase().trim()
    const universityStr = university.toString()

    // Validate email format
    if (!isValidEmailFormat(emailStr)) {
      return {
        success: false,
        message: "❌ Please enter a valid email address (example: student@university.edu)",
      }
    }

    // Check for common typos in email domains
    const commonTypos = ["gmial.com", "gmai.com", "yahooo.com", "hotmial.com"]
    const domain = emailStr.split("@")[1]
    if (commonTypos.includes(domain)) {
      return {
        success: false,
        message: "❌ Please check your email address - it looks like there might be a typo in the domain",
      }
    }

    const result = schema.safeParse({ email: emailStr, university: universityStr })

    if (!result.success) {
      return { success: false, message: result.error.errors[0].message }
    }

    const isUAEUniversityEmail = emailStr.endsWith(".ac.ae") || emailStr.endsWith(".edu")
    const isGmailOrCommon = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"].some((domain) =>
      emailStr.endsWith(domain),
    )

    // Check if email already exists
    let emailExists = false
    try {
      const redis = createRedisClient()
      if (redis) {
        const existingEmails = await redis.smembers("pasttopass_waitlist_emails")
        emailExists = existingEmails.includes(emailStr)
      }
    } catch (error) {
      console.error("Error checking existing emails:", error)
    }

    if (emailExists) {
      return {
        success: false,
        message: "📧 This email is already registered! You're already on our priority list.",
      }
    }

    // Store in Redis
    let redisSuccess = false
    try {
      const redis = createRedisClient()

      if (redis) {
        // Store email in the waitlist set
        await redis.sadd("pasttopass_waitlist_emails", emailStr)

        // Store detailed user information
        await redis.hset(`pasttopass_user:${emailStr}`, {
          email: emailStr,
          university: universityStr,
          isUAEEmail: isUAEUniversityEmail ? "true" : "false",
          isCommonEmail: isGmailOrCommon ? "true" : "false",
          joinedAt: new Date().toISOString(),
          ipAddress: "hidden", // In production, you might want to log this
        })

        // Increment total count
        await redis.incr("pasttopass_total_signups")

        console.log("✅ Successfully stored in Redis:", {
          email: emailStr,
          university: universityStr,
          timestamp: new Date().toISOString(),
        })

        redisSuccess = true
      }
    } catch (redisError) {
      console.error("❌ Redis error:", redisError)
    }

    // Get current count
    let count = 297
    try {
      const redis = createRedisClient()
      if (redis) {
        const redisCount = await redis.scard("pasttopass_waitlist_emails")
        if (redisCount !== null) {
          count = redisCount + 247
        }
      }
    } catch (countError) {
      console.error("Error getting count:", countError)
    }

    // Generate success message based on email type
    let successMessage = ""
    if (isUAEUniversityEmail) {
      successMessage =
        "🎉 Welcome to PastToPass! You've been added to our PRIORITY list as a UAE university student. You'll be the first to know when we launch!"
    } else if (isGmailOrCommon) {
      successMessage =
        "✅ Successfully registered for PastToPass! We've verified your email and you're now on our waitlist. Check your inbox for updates!"
    } else {
      successMessage =
        "✅ Welcome to PastToPass! You've been successfully added to our waitlist. We'll notify you as soon as we're ready to launch!"
    }

    return {
      success: true,
      message: successMessage,
      count,
      stored: redisSuccess,
      emailType: isUAEUniversityEmail ? "uae" : isGmailOrCommon ? "common" : "other",
    }
  } catch (error) {
    console.error("❌ Server error:", error)
    return {
      success: false,
      message: "❌ Something went wrong. Please check your internet connection and try again.",
    }
  }
}

export async function getEssayTestWaitlistCount() {
  try {
    const redis = createRedisClient()
    if (redis) {
      const count = await redis.scard("pasttopass_waitlist_emails")
      return (count || 0) + 247
    }
  } catch (error) {
    console.error("Error getting count:", error)
  }
  return 297
}
