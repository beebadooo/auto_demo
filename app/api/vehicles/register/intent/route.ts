// POST /api/vehicles/register/intent - create a registration intent and return a server-generated salt
import { type NextRequest, NextResponse } from "next/server"
import { createRegistrationIntent } from "@/lib/registration"
import { ethers } from "ethers"
import { getUserByWallet } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vin, make, model, year, signature, signerAddress } = body

    if (!vin || !make || !model || !year || !signature || !signerAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify signature of minimal payload
    const message = JSON.stringify({ vin, make, model, year })
    try {
      // ethers v6: verifyMessage is a top-level function
      const recovered = ethers.verifyMessage(message, signature)
      if (recovered.toLowerCase() !== signerAddress.toLowerCase()) {
        return NextResponse.json({ error: "Signature mismatch" }, { status: 401 })
      }
    } catch (err) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Ensure signerAddress corresponds to a manufacturer user
    const user = await getUserByWallet(signerAddress)
    if (!user || user.role !== "manufacturer") {
      return NextResponse.json({ error: "Only manufacturers can create registration intents" }, { status: 403 })
    }

    const intent = createRegistrationIntent({ vin, make, model, year: Number(year), signerAddress })

    return NextResponse.json({ registrationId: intent.id, salt: intent.salt }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
