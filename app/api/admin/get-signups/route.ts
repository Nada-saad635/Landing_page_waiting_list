import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/app/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: "Supabase client not initialized",
        signups: [],
      })
    }

    // Get all signups from Supabase
    const { data: signups, error } = await supabase
      .from("waitlist_signups")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({
        success: false,
        error: "Failed to fetch signups from database",
        signups: [],
      })
    }

    return NextResponse.json({
      success: true,
      signups: signups || [],
    })
  } catch (error: any) {
    console.error("Error fetching signups:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error occurred",
      signups: [],
    })
  }
}
