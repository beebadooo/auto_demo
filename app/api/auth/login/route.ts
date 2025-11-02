import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { getUserByWallet, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing required field: walletAddress" }, { status: 400 })
    }

    // Find user by wallet
    const user = await getUserByWallet(walletAddress)
    if (!user) {
      return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 })
    }

    // Generate token in route handler (server-side)
    const token = randomBytes(32).toString("hex")

    // Create session
    const { token: sessionToken, expiresAt } = await createSession(user.id, token)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          role: user.role,
          email: user.email,
        },
        token: sessionToken,
        expiresAt,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
