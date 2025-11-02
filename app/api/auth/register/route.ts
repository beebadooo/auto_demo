import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { createUser, getUserByWallet, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, role, email } = await request.json()

    if (!walletAddress || !role) {
      return NextResponse.json({ error: "Missing required fields: walletAddress, role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByWallet(walletAddress)
    if (existingUser) {
      return NextResponse.json({ error: "User already registered with this wallet" }, { status: 409 })
    }

    // Create new user
    const user = await createUser(walletAddress, role, email)

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
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
