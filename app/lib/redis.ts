import { Redis } from "@upstash/redis"

// Create Redis client using your exact environment variable names
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Helper function to safely create Redis client
export function createRedisClient() {
  try {
    const url = process.env.KV_REST_API_URL
    const token = process.env.KV_REST_API_TOKEN

    if (!url || !token) {
      console.error("Redis environment variables not found")
      return null
    }

    return new Redis({
      url,
      token,
    })
  } catch (error) {
    console.error("Failed to create Redis client:", error)
    return null
  }
}

// Add the missing safeRedisSet function
export async function safeRedisSet(key: string, value: any) {
  try {
    const redisClient = createRedisClient()
    if (!redisClient) {
      console.error("Redis client not available")
      return null
    }
    return await redisClient.sadd(key, value)
  } catch (error) {
    console.error("Redis safeRedisSet error:", error)
    return null
  }
}

// Add the missing safeRedisCount function
export async function safeRedisCount(key: string) {
  try {
    const redisClient = createRedisClient()
    if (!redisClient) {
      console.error("Redis client not available")
      return 0
    }
    return await redisClient.scard(key)
  } catch (error) {
    console.error("Redis safeRedisCount error:", error)
    return 0
  }
}

// Additional helper functions for better Redis operations
export async function safeRedisGet(key: string) {
  try {
    const redisClient = createRedisClient()
    if (!redisClient) {
      console.error("Redis client not available")
      return null
    }
    return await redisClient.get(key)
  } catch (error) {
    console.error("Redis safeRedisGet error:", error)
    return null
  }
}

export async function safeRedisHSet(key: string, field: string, value: any) {
  try {
    const redisClient = createRedisClient()
    if (!redisClient) {
      console.error("Redis client not available")
      return null
    }
    return await redisClient.hset(key, { [field]: value })
  } catch (error) {
    console.error("Redis safeRedisHSet error:", error)
    return null
  }
}

export async function safeRedisHGetAll(key: string) {
  try {
    const redisClient = createRedisClient()
    if (!redisClient) {
      console.error("Redis client not available")
      return {}
    }
    return await redisClient.hgetall(key)
  } catch (error) {
    console.error("Redis safeRedisHGetAll error:", error)
    return {}
  }
}
