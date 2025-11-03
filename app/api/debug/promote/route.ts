import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  // Only allow in development/localhost
  try {
    const host = request.headers.get("host") || ""
    if (!host.includes("localhost") && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 })
    }

    const body = await request.json()
    const { walletAddress, role } = body
    if (!walletAddress || !role) {
      return NextResponse.json({ error: "Missing walletAddress or role" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase not configured on server" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update user role
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("wallet_address", walletAddress.toLowerCase())
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data }, { status: 200 })
  } catch (err) {
    console.error("Promotion error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
