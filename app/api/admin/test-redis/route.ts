import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

export async function GET() {
  try {
    // Get Redis URL and token from environment variables (using your exact variable names)
    const url = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN

    console.log("Environment check:", {
      hasUrl: !!url,
      hasToken: !!token,
      urlPreview: url ? url.substring(0, 30) + "..." : "not found",
    })

    if (!url || !token) {
      return NextResponse.json({
        success: false,
        error: "Redis URL or token not found in environment variables",
        debug: {
          hasUrl: !!url,
          hasToken: !!token,
        },
      })
    }

    // Create Redis client
    const redis = new Redis({
      url,
      token,
    })

    // Test connection by setting and getting a value
    const testKey = `test_connection_${Date.now()}`
    await redis.set(testKey, "success", { ex: 60 }) // Expire in 60 seconds
    const testResult = await redis.get(testKey)

    if (testResult === "success") {
      // Clean up test key
      await redis.del(testKey)

      return NextResponse.json({
        success: true,
        message: "Redis connection successful",
        url: "splendid-lark-29573.upstash.io", // Safe to show domain
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Redis connection test failed - could not retrieve test value",
      })
    }
  } catch (error: any) {
    console.error("Redis connection error:", error)
    return NextResponse.json({
      success: false,
      error: `Connection failed: ${error.message}`,
    })
  }
}
