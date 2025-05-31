import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

export async function GET() {
  try {
    // Get Redis URL and token from environment variables (using your exact variable names)
    const url = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN

    if (!url || !token) {
      return NextResponse.json({
        success: false,
        error: "Redis URL or token not found in environment variables",
      })
    }

    // Create Redis client
    const redis = new Redis({
      url,
      token,
    })

    try {
      // Get all emails from the waitlist set
      const emails = await redis.smembers("essaytest_waitlist_emails")

      // Get detailed info for each email
      const emailDetails = []
      for (const email of emails || []) {
        try {
          const userInfo = await redis.hgetall(`essaytest_user:${email}`)
          emailDetails.push({
            email,
            ...userInfo,
          })
        } catch (userError) {
          // If we can't get user details, just include the email
          emailDetails.push({ email })
        }
      }

      return NextResponse.json({
        success: true,
        emails: emails || [],
        emailDetails,
        count: emails?.length || 0,
      })
    } catch (redisError: any) {
      console.error("Redis operation error:", redisError)
      return NextResponse.json({
        success: false,
        error: `Redis operation failed: ${redisError.message}`,
        emails: [],
      })
    }
  } catch (error: any) {
    console.error("General error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error occurred",
      emails: [],
    })
  }
}
