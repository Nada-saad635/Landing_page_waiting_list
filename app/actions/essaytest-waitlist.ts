"use server"

import { z } from "zod"
import { createRedisClient } from "../lib/redis"

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
    const universityStr = university.toString()
    const isUAEUniversityEmail = emailStr.endsWith(".ac.ae")

    // Try to store in Redis
    let redisSuccess = false
    try {
      const redis = createRedisClient()

      if (redis) {
        // Store email in the waitlist set
        await redis.sadd("essaytest_waitlist_emails", emailStr)

        // Store detailed user information
        await redis.hset(`essaytest_user:${emailStr}`, {
          email: emailStr,
          university: universityStr,
          isUAEEmail: isUAEUniversityEmail ? "true" : "false",
          joinedAt: new Date().toISOString(),
        })

        // Increment total count
        await redis.incr("essaytest_total_signups")

        console.log("✅ Successfully stored in Redis:", {
          email: emailStr,
          university: universityStr,
          timestamp: new Date().toISOString(),
        })

        redisSuccess = true
      } else {
        console.log("⚠️ Redis client not available")
      }
    } catch (redisError) {
      console.error("❌ Redis error:", redisError)
      // Continue execution even if Redis fails
    }

    // Get current count from Redis or use fallback
    let count = 297 // Fallback count
    try {
      const redis = createRedisClient()
      if (redis) {
        const redisCount = await redis.scard("essaytest_waitlist_emails")
        if (redisCount !== null) {
          count = redisCount + 247 // Add base count
        }
      }
    } catch (countError) {
      console.error("Error getting count:", countError)
    }

    return {
      success: true,
      message: isUAEUniversityEmail
        ? "🎉 Welcome! You've been added to our priority list as a UAE university student. We'll notify you first when EssayTest launches!"
        : "✅ You've been added to the waitlist! We'll notify you as soon as EssayTest is ready for UAE students.",
      count,
      stored: redisSuccess,
    }
  } catch (error) {
    console.error("❌ Server error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function getEssayTestWaitlistCount() {
  try {
    const redis = createRedisClient()
    if (redis) {
      const count = await redis.scard("essaytest_waitlist_emails")
      return (count || 0) + 247 // Add base count
    }
  } catch (error) {
    console.error("Error getting count:", error)
  }
  return 297 // Fallback count
}
