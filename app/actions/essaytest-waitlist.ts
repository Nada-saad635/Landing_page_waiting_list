"use server"

import { z } from "zod"
import { createServerSupabaseClient } from "../lib/supabase"
import { headers } from "next/headers"
import { createRedisClient } from "../lib/redis"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  university: z.string().min(1, "Please select your university"),
})

// Simple email validation function
function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Extract domain from email
function getEmailDomain(email: string): string {
  return email.split("@")[1] || ""
}

// Check if email is from UAE university
function isUAEUniversityEmail(domain: string): boolean {
  const uaeEducationalDomains = [
    ".ac.ae",
    ".edu.ae",
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

  return uaeEducationalDomains.some((uaeDomain) => domain.toLowerCase().includes(uaeDomain.toLowerCase()))
}

export async function joinEssayTestWaitlist(prevState: any, formData: FormData) {
  try {
    // Simulate API delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const name = formData.get("name")
    const email = formData.get("email")
    const university = formData.get("university")

    if (!name || !email || !university) {
      return {
        success: false,
        message: "Name, email and university are required",
      }
    }

    const nameStr = name.toString().trim()
    const emailStr = email.toString().toLowerCase().trim()
    const universityStr = university.toString()

    // Validate email format
    if (!isValidEmailFormat(emailStr)) {
      return {
        success: false,
        message: "❌ Please enter a valid email address (example: student@university.edu)",
      }
    }

    // Validate form data
    const result = schema.safeParse({
      name: nameStr,
      email: emailStr,
      university: universityStr,
    })

    if (!result.success) {
      return {
        success: false,
        message: result.error.errors[0].message,
      }
    }

    // Get email domain and check if it's a UAE university email
    const emailDomain = getEmailDomain(emailStr)
    const isUAEEmail = isUAEUniversityEmail(emailDomain)

    // Get user IP and user agent for analytics
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || "Unknown"
    const forwardedFor = headersList.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : "Unknown"
    const referer = headersList.get("referer") || "Direct"

    // Initialize Supabase client
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return {
        success: false,
        message: "❌ Server configuration error. Please try again later.",
      }
    }

    // Check if email already exists in Supabase
    const { data: existingUser } = await supabase
      .from("waitlist_signups")
      .select("id, email")
      .eq("email", emailStr)
      .single()

    if (existingUser) {
      return {
        success: false,
        message: "📧 This email is already registered! You're already on our priority list.",
      }
    }

    // Insert new signup into Supabase
    const { error } = await supabase.from("waitlist_signups").insert({
      name: nameStr,
      email: emailStr,
      university: universityStr,
      is_uae_email: isUAEEmail,
      email_domain: emailDomain,
      ip_address: ipAddress,
      user_agent: userAgent,
      referrer: referer,
    })

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        message: "❌ Something went wrong. Please try again later.",
      }
    }

    // Get current count from Supabase
    const { count } = await supabase.from("waitlist_signups").select("*", { count: "exact", head: true })

    // Also try to store in Redis as a backup (if available)
    try {
      const redis = createRedisClient()
      if (redis) {
        await redis.sadd("pasttopass_waitlist_emails", emailStr)
        await redis.hset(`pasttopass_user:${emailStr}`, {
          name: nameStr,
          email: emailStr,
          university: universityStr,
          isUAEEmail: isUAEEmail ? "true" : "false",
          joinedAt: new Date().toISOString(),
        })
      }
    } catch (redisError) {
      console.error("Redis backup error:", redisError)
      // Continue execution even if Redis fails
    }

    // Generate success message based on email type
    let successMessage = ""
    if (isUAEEmail) {
      successMessage =
        "🎉 Welcome to PastToPass! You've been added to our PRIORITY list as a UAE university student. You'll be the first to know when we launch!"
    } else {
      successMessage =
        "✅ Welcome to PastToPass! You've been successfully added to our waitlist. We'll notify you as soon as we're ready to launch!"
    }

    return {
      success: true,
      message: successMessage,
      count: count || 0,
      emailType: isUAEEmail ? "uae" : "other",
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
    const supabase = createServerSupabaseClient()
    if (supabase) {
      const { count } = await supabase.from("waitlist_signups").select("*", { count: "exact", head: true })

      return count || 0
    }

    // Fallback to Redis if Supabase fails
    const redis = createRedisClient()
    if (redis) {
      const count = await redis.scard("pasttopass_waitlist_emails")
      return count || 0
    }
  } catch (error) {
    console.error("Error getting count:", error)
  }
  return 0
}
