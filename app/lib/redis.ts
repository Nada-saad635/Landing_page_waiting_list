import { Redis } from "@upstash/redis"

// Make Redis connection more resilient with error handling
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || "",
})

// Add fallback functions to prevent errors when Redis is not available
export async function safeRedisSet(key: string, value: any) {
  try {
    return await redis.sadd(key, value)
  } catch (error) {
    console.error("Redis error:", error)
    return null
  }
}

export async function safeRedisCount(key: string) {
  try {
    return await redis.scard(key)
  } catch (error) {
    console.error("Redis error:", error)
    return 0
  }
}
