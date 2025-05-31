import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/app/lib/supabase"

export async function GET(request: Request) {
  try {
    // Simple authentication check
    const { searchParams } = new URL(request.url)
    const password = searchParams.get("password")

    if (password !== "pasttopass2024") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access",
        },
        { status: 401 },
      )
    }

    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: "Supabase client not initialized",
      })
    }

    // Get all waitlist signups
    const { data: signups, error } = await supabase
      .from("waitlist_signups")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({
        success: false,
        error: "Failed to fetch data from database",
      })
    }

    // Format the data for easy viewing
    const formattedData =
      signups?.map((signup) => ({
        name: signup.name,
        email: signup.email,
        university: signup.university,
        isUAEEmail: signup.is_uae_email,
        emailDomain: signup.email_domain,
        signupDate: new Date(signup.created_at).toLocaleString(),
        ipAddress: signup.ip_address || "N/A",
      })) || []

    return NextResponse.json({
      success: true,
      totalUsers: formattedData.length,
      users: formattedData,
      exportedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Export error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error occurred",
    })
  }
}
