import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/app/lib/supabase"
import { createRedisClient } from "@/app/lib/redis"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const redis = createRedisClient()

    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: "Supabase client not initialized",
      })
    }

    if (!redis) {
      return NextResponse.json({
        success: false,
        error: "Redis client not initialized",
      })
    }

    // Get all emails from Redis
    const emails = (await redis.smembers("pasttopass_waitlist_emails")) || []

    if (!emails.length) {
      return NextResponse.json({
        success: true,
        message: "No emails found in Redis to migrate",
        migrated: 0,
      })
    }

    let migratedCount = 0
    let errorCount = 0

    // Process each email
    for (const email of emails) {
      try {
        // Get user details from Redis
        const userInfo = (await redis.hgetall(`pasttopass_user:${email}`)) || {}

        if (!userInfo || Object.keys(userInfo).length === 0) {
          console.log(`No details found for ${email}, skipping`)
          continue
        }

        // Check if email already exists in Supabase
        const { data: existingUser } = await supabase
          .from("waitlist_signups")
          .select("id, email")
          .eq("email", email)
          .single()

        if (existingUser) {
          console.log(`Email ${email} already exists in Supabase, skipping`)
          continue
        }

        // Insert into Supabase
        const { error } = await supabase.from("waitlist_signups").insert({
          name: userInfo.name || "Unknown",
          email: email,
          university: userInfo.university || "Unknown",
          is_uae_email: userInfo.isUAEEmail === "true",
          email_domain: email.split("@")[1] || "",
          created_at: userInfo.joinedAt || new Date().toISOString(),
        })

        if (error) {
          console.error(`Error migrating ${email}:`, error)
          errorCount++
        } else {
          migratedCount++
        }
      } catch (userError) {
        console.error(`Error processing ${email}:`, userError)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed. Migrated ${migratedCount} records with ${errorCount} errors.`,
      migrated: migratedCount,
      errors: errorCount,
      total: emails.length,
    })
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error occurred",
    })
  }
}
